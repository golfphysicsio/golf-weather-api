"""
Golf Physics Admin Dashboard - Middleware for API Key Validation and Request Logging
Add this middleware to your FastAPI application.
"""

import os
import time
import hashlib
import asyncio
from typing import Optional, Tuple
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
import asyncpg

# ============================================
# CONFIGURATION
# ============================================

DATABASE_URL = os.environ.get("DATABASE_URL", "")

# Rate limits per tier (requests per minute)
RATE_LIMITS = {
    "free": 60,
    "standard": 1000,
    "enterprise": 20000
}

# Paths that don't require API key authentication
PUBLIC_PATHS = [
    "/",
    "/docs",
    "/redoc",
    "/openapi.json",
    "/api/v1/health",
    "/admin",  # Admin routes use Google OAuth instead
    "/admin-ui",  # Admin dashboard static files
]

# ============================================
# DATABASE CONNECTION
# ============================================

_db_pool = None

async def get_db_pool():
    """Get or create database connection pool."""
    global _db_pool
    if _db_pool is None:
        db_url = DATABASE_URL
        if db_url.startswith("postgresql+asyncpg://"):
            db_url = db_url.replace("postgresql+asyncpg://", "postgresql://")
        _db_pool = await asyncpg.create_pool(db_url, min_size=2, max_size=10)
    return _db_pool

# ============================================
# API KEY VALIDATION
# ============================================

async def validate_api_key(api_key: str) -> Tuple[Optional[int], Optional[str], Optional[str]]:
    """
    Validate API key and return (key_id, client_name, tier) or (None, None, None) if invalid.
    """
    if not api_key:
        return None, None, None

    # Hash the provided key
    key_hash = hashlib.sha256(api_key.encode()).hexdigest()

    pool = await get_db_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT id, client_name, tier, status
            FROM admin_api_keys
            WHERE key_hash = $1
            """,
            key_hash
        )

        if not row:
            return None, None, None

        if row["status"] != "active":
            return None, None, None

        # Update last_used timestamp (fire and forget)
        asyncio.create_task(
            update_key_usage(conn, row["id"])
        )

        return row["id"], row["client_name"], row["tier"]

async def update_key_usage(conn, key_id: int):
    """Update last_used timestamp and increment counters."""
    try:
        await conn.execute(
            """
            UPDATE admin_api_keys
            SET last_used_at = NOW(),
                requests_today = requests_today + 1,
                total_requests = total_requests + 1
            WHERE id = $1
            """,
            key_id
        )
    except Exception:
        pass  # Don't fail request if counter update fails

# ============================================
# REQUEST LOGGING
# ============================================

async def log_request(
    api_key_id: Optional[int],
    client_name: Optional[str],
    endpoint: str,
    method: str,
    status_code: int,
    latency_ms: float,
    error_message: Optional[str] = None,
    request_ip: Optional[str] = None,
    user_agent: Optional[str] = None
):
    """Log request to database for analytics."""
    try:
        pool = await get_db_pool()
        async with pool.acquire() as conn:
            await conn.execute(
                """
                INSERT INTO admin_request_logs
                (api_key_id, client_name, endpoint, method, status_code, latency_ms, error_message, request_ip, user_agent)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                """,
                api_key_id, client_name, endpoint, method, status_code, latency_ms, error_message, request_ip, user_agent
            )
    except Exception as e:
        # Don't fail request if logging fails
        print(f"Failed to log request: {e}")

# ============================================
# MIDDLEWARE
# ============================================

class AdminApiKeyMiddleware(BaseHTTPMiddleware):
    """
    Middleware that validates API keys and logs requests for the admin dashboard.

    This middleware:
    1. Validates X-API-Key header against admin_api_keys table
    2. Stores key info in request.state for rate limiting
    3. Logs all requests to admin_request_logs table
    """

    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        path = request.url.path

        # Skip auth for public paths
        if self._is_public_path(path):
            response = await call_next(request)
            return response

        # Get API key from header
        api_key = request.headers.get("X-API-Key")

        # Validate key
        key_id, client_name, tier = await validate_api_key(api_key)

        if not key_id:
            # Invalid or missing key
            latency_ms = (time.time() - start_time) * 1000

            # Log failed attempt
            asyncio.create_task(
                log_request(
                    api_key_id=None,
                    client_name=None,
                    endpoint=path,
                    method=request.method,
                    status_code=401,
                    latency_ms=latency_ms,
                    error_message="Invalid or missing API key",
                    request_ip=self._get_client_ip(request),
                    user_agent=request.headers.get("User-Agent")
                )
            )

            raise HTTPException(
                status_code=401,
                detail={
                    "error": {
                        "code": "INVALID_API_KEY",
                        "message": "Invalid or missing API key. Include X-API-Key header."
                    }
                }
            )

        # Store key info in request state
        request.state.api_key_id = key_id
        request.state.client_name = client_name
        request.state.tier = tier
        request.state.rate_limit = RATE_LIMITS.get(tier, 60)

        # Process request
        response = await call_next(request)

        # Calculate latency
        latency_ms = (time.time() - start_time) * 1000

        # Log successful request (async, don't block response)
        error_message = None
        if response.status_code >= 400:
            error_message = f"HTTP {response.status_code}"

        asyncio.create_task(
            log_request(
                api_key_id=key_id,
                client_name=client_name,
                endpoint=path,
                method=request.method,
                status_code=response.status_code,
                latency_ms=latency_ms,
                error_message=error_message,
                request_ip=self._get_client_ip(request),
                user_agent=request.headers.get("User-Agent")
            )
        )

        return response

    def _is_public_path(self, path: str) -> bool:
        """Check if path is public (no auth required)."""
        for public_path in PUBLIC_PATHS:
            if path == public_path or path.startswith(public_path + "/"):
                return True
        return False

    def _get_client_ip(self, request: Request) -> str:
        """Get client IP from request, handling proxies."""
        # Check for forwarded header (Railway/Cloudflare)
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()

        # Check for real IP header
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip

        # Fall back to direct client
        if request.client:
            return request.client.host

        return "unknown"

# ============================================
# INTEGRATION EXAMPLE
# ============================================

"""
Add this middleware to your FastAPI app:

from fastapi import FastAPI
from middleware_example import AdminApiKeyMiddleware

app = FastAPI()

# Add admin API key middleware
app.add_middleware(AdminApiKeyMiddleware)

# Your existing routes...
"""
