"""
Golf Weather Physics API

A B2B REST API that calculates how weather conditions affect golf ball flight.
Production-ready with authentication, rate limiting, and usage tracking.
"""

from contextlib import asynccontextmanager
from datetime import datetime
import time
import uuid

from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import sentry_sdk

from app.config import settings
from app.database import init_db, close_db
from app.redis_client import init_redis, close_redis
from app.routers import trajectory, conditions, health, admin, admin_dashboard, api_key_requests, contact, gaming
from app.middleware.authentication import AuthMiddleware
from app.middleware.rate_limiting import RateLimitMiddleware
from app.middleware.security import SecurityHeadersMiddleware
from app.middleware.errors import setup_exception_handlers
from app.middleware.logging_config import setup_logging, logger


# Initialize Sentry if configured
if settings.SENTRY_DSN:
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        environment=settings.ENVIRONMENT,
        traces_sample_rate=0.1 if settings.ENVIRONMENT == "production" else 1.0,
        profiles_sample_rate=0.1 if settings.ENVIRONMENT == "production" else 1.0,
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Setup logging
    setup_logging()

    # Startup
    logger.info(
        "Starting Golf Weather API",
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
    )

    # Initialize database
    try:
        await init_db()
        logger.info("Database initialized")
    except Exception as e:
        logger.warning(f"Database not available: {str(e)}")

    # Initialize Redis
    try:
        await init_redis()
        logger.info("Redis connection verified")
    except Exception as e:
        logger.warning(f"Redis not available: {str(e)}")

    yield

    # Shutdown
    logger.info("Shutting down Golf Weather API")
    await close_redis()
    await close_db()


# Always show docs - linked in website navigation
show_docs = True

# OpenAPI servers configuration - use production URL for customer-facing docs
openapi_servers = [
    {"url": "https://api.golfphysics.io", "description": "Production API"},
]
if settings.ENVIRONMENT != "production":
    # Add staging server for non-production environments
    openapi_servers.append(
        {"url": "https://staging.golfphysics.io", "description": "Staging API (internal)"}
    )

app = FastAPI(
    title="Golf Weather Physics API",
    description=(
        "Calculate how weather conditions affect golf ball flight. "
        "Send shot data and weather conditions, receive adjusted trajectory "
        "and impact breakdown."
    ),
    version=settings.VERSION,
    docs_url="/docs" if show_docs else None,
    redoc_url="/redoc" if show_docs else None,
    lifespan=lifespan,
    servers=openapi_servers,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom middleware (order matters: security headers, then auth, then rate limiting)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(AuthMiddleware)
app.add_middleware(SecurityHeadersMiddleware)

# Setup error handlers
setup_exception_handlers(app)


# Request ID and logging middleware
@app.middleware("http")
async def add_request_context(request: Request, call_next):
    """Add request ID and log all requests."""
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    start_time = time.time()

    response = await call_next(request)

    # Add headers
    response.headers["X-Request-ID"] = request_id
    response.headers["X-API-Version"] = settings.VERSION

    # Log request
    latency_ms = (time.time() - start_time) * 1000
    client_id = getattr(request.state, "client_id", "anonymous")
    api_key_id = getattr(request.state, "api_key_id", None)

    logger.info(
        "Request completed",
        request_id=request_id,
        method=request.method,
        path=request.url.path,
        status=response.status_code,
        latency_ms=round(latency_ms, 2),
        client=client_id,
    )

    # Log to database for API requests (skip admin, health, static files)
    path = request.url.path
    if (api_key_id or client_id != "anonymous") and not path.startswith(("/admin", "/docs", "/redoc", "/openapi")):
        try:
            from app.routers.admin_dashboard import get_admin_db_pool
            pool = await get_admin_db_pool()
            if pool:
                # Get client IP
                client_ip = request.client.host if request.client else None
                forwarded = request.headers.get("x-forwarded-for")
                if forwarded:
                    client_ip = forwarded.split(",")[0].strip()

                async with pool.acquire() as conn:
                    await conn.execute(
                        """
                        INSERT INTO admin_request_logs
                        (api_key_id, client_name, endpoint, method, status_code, latency_ms, request_ip, user_agent)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                        """,
                        api_key_id,
                        client_id if client_id != "anonymous" else None,
                        path,
                        request.method,
                        response.status_code,
                        round(latency_ms, 2),
                        client_ip,
                        request.headers.get("user-agent", "")[:500]
                    )
        except Exception as e:
            logger.warning(f"Failed to log request to database: {str(e)}")

    return response


# Include routers
app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(trajectory.router, prefix="/api/v1", tags=["Trajectory"])
app.include_router(conditions.router, prefix="/api/v1", tags=["Conditions"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(admin_dashboard.router, tags=["Admin Dashboard"])
app.include_router(api_key_requests.router, tags=["API Key Requests"])
app.include_router(contact.router, tags=["Contact"])
app.include_router(gaming.router, prefix="/api/v1/gaming", tags=["Gaming"])

# Legacy routes (for backwards compatibility)
app.include_router(trajectory.router, prefix="/v1", tags=["Trajectory (Legacy)"])
app.include_router(conditions.router, prefix="/v1", tags=["Conditions (Legacy)"])


# ==================== MAIN WEBSITE ====================
# Serve the React marketing website at root

WEBSITE_PATH = Path(__file__).parent.parent / "website-dist"

if WEBSITE_PATH.exists():
    # Serve static assets (JS, CSS, images)
    app.mount(
        "/assets",
        StaticFiles(directory=WEBSITE_PATH / "assets"),
        name="website-assets"
    )

    @app.get("/", include_in_schema=False)
    async def serve_website_root():
        """Serve the marketing website at root."""
        index_file = WEBSITE_PATH / "index.html"
        if index_file.exists():
            return FileResponse(index_file, media_type="text/html")
        return {"error": "Website not found"}

    # Serve vite.svg and other static files at root
    @app.get("/vite.svg", include_in_schema=False)
    async def serve_vite_svg():
        """Serve vite.svg."""
        svg_file = WEBSITE_PATH / "vite.svg"
        if svg_file.exists():
            return FileResponse(svg_file, media_type="image/svg+xml")
        return {"error": "File not found"}

else:
    # Fallback if website not deployed - show API info
    @app.get("/", include_in_schema=False)
    async def root():
        """Root endpoint with API information."""
        return {
            "message": "Golf Weather Physics API",
            "version": settings.VERSION,
            "environment": settings.ENVIRONMENT,
            "docs": "/docs" if show_docs else "disabled",
            "health": "/api/v1/health",
            "admin_dashboard": "/admin",
        }


# Legacy health endpoint for backwards compatibility
@app.get("/v1/health", include_in_schema=False)
async def legacy_health():
    """Legacy health check endpoint."""
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }


# ==================== ADMIN DASHBOARD ====================
# Serve the React admin dashboard at /admin

ADMIN_DASHBOARD_PATH = Path(__file__).parent.parent / "admin-dashboard-dist"

if ADMIN_DASHBOARD_PATH.exists():
    # Serve static assets (JS, CSS, images)
    app.mount(
        "/admin/assets",
        StaticFiles(directory=ADMIN_DASHBOARD_PATH / "assets"),
        name="admin-assets"
    )

    @app.get("/admin/{full_path:path}", include_in_schema=False)
    async def serve_admin_dashboard(full_path: str):
        """Serve the React admin dashboard (handles client-side routing)."""
        index_file = ADMIN_DASHBOARD_PATH / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
        return {"error": "Admin dashboard not found"}

    @app.get("/admin", include_in_schema=False)
    async def serve_admin_root():
        """Serve admin dashboard at /admin."""
        index_file = ADMIN_DASHBOARD_PATH / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
        return {"error": "Admin dashboard not found"}


# ==================== CLIENT DOCUMENTATION ====================
# Serve the client API documentation at /docs/client

CLIENT_DOCS_PATH = Path(__file__).parent.parent / "static" / "docs"

if CLIENT_DOCS_PATH.exists():
    @app.get("/docs/client", include_in_schema=False)
    async def serve_client_docs():
        """Serve client-facing API documentation."""
        docs_file = CLIENT_DOCS_PATH / "client.html"
        if docs_file.exists():
            return FileResponse(docs_file, media_type="text/html")
        return {"error": "Documentation not found"}


# ==================== WEBSITE CATCH-ALL ====================
# Handle client-side routing for React (must be last!)

if WEBSITE_PATH.exists():
    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_website_pages(full_path: str):
        """
        Catch-all route for React client-side routing.
        Serves index.html for any non-API, non-admin routes.
        """
        # Don't catch API routes or admin routes - let FastAPI handle them
        # Note: docs/redoc/openapi are handled by FastAPI's built-in routes
        if full_path.startswith(("api/", "v1/", "admin/")):
            return {"error": "Not found"}

        # Check if it's a static file request
        static_file = WEBSITE_PATH / full_path
        if static_file.exists() and static_file.is_file():
            return FileResponse(static_file)

        # Otherwise serve index.html for client-side routing
        index_file = WEBSITE_PATH / "index.html"
        if index_file.exists():
            return FileResponse(index_file, media_type="text/html")
        return {"error": "Website not found"}
