# Claude Code Prompt: Production-Ready Golf Weather API

## Project Overview

We have a working Golf Weather Physics API that needs to be made enterprise-ready for a commercial contract with Inrange Golf (79 facilities, ~461M API calls/year).

**Current state:** Working MVP on Vercel, physics validated (80 tests passing)
**Target state:** Production-ready API on Railway with auth, rate limiting, monitoring, and staging environment

---

## Technical Decisions (Already Made)

| Decision | Choice | Reason |
|----------|--------|--------|
| Hosting | Railway | Easy deployment, auto-scaling, good for FastAPI |
| Database | PostgreSQL | Scalable, Railway has managed Postgres |
| Caching/Rate Limiting | Redis | Railway has managed Redis |
| Staging | Yes | Separate environment for testing |
| API Framework | FastAPI | Already using, keep it |

## Railway Cost Estimates

Railway uses pure usage-based pricing. No separate fees for Postgres/Redis - they just consume resources.

**Resource Rates:**
- Memory: $0.00000386 per GB/second
- CPU: $0.00000772 per vCPU/second  
- Storage: $0.00000006 per GB/second
- Egress: $0.05 per GB

**Plan Credits:** Pro plan is $20/month which INCLUDES $20 of usage credits. You only pay extra if you exceed $20.

| Phase | Services | Monthly Usage | You Pay |
|-------|----------|---------------|---------|
| **Pre-launch (idle)** | API + Postgres + Redis (minimal) | ~$10 | **$20** (Pro minimum) |
| **With Staging** | Prod (Pro) + Staging (Hobby) | ~$15 | **$25** |
| **Post-Inrange (461M req/yr)** | Scaled API + Postgres + Redis | ~$90 | **$90-120** |

Bottom line: ~$25/month while selling, ~$100/month after landing the deal.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRODUCTION                               │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │   Railway   │    │  PostgreSQL │    │    Redis    │          │
│  │   FastAPI   │───▶│   (usage)   │    │ (rate limit)│          │
│  │    App      │    └─────────────┘    └─────────────┘          │
│  └─────────────┘                                                 │
│        │                                                         │
│        ▼                                                         │
│  api.golfweather.io (or your domain)                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          STAGING                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │   Railway   │    │  PostgreSQL │    │    Redis    │          │
│  │   FastAPI   │───▶│  (separate) │    │ (separate)  │          │
│  │    App      │    └─────────────┘    └─────────────┘          │
│  └─────────────┘                                                 │
│        │                                                         │
│        ▼                                                         │
│  staging-api.golfweather.io                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Task 1: Project Structure

Create this file structure:

```
golf-weather-api/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app entry point
│   ├── config.py               # Environment configuration
│   ├── database.py             # PostgreSQL connection
│   ├── redis_client.py         # Redis connection
│   │
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── trajectory.py       # POST /api/v1/trajectory
│   │   ├── health.py           # GET /api/v1/health
│   │   └── admin.py            # GET /api/v1/admin/usage
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── physics.py          # Trajectory calculations (existing code)
│   │   ├── weather.py          # Weather API integration
│   │   └── usage.py            # Usage tracking service
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── requests.py         # Pydantic request models
│   │   ├── responses.py        # Pydantic response models
│   │   └── database.py         # SQLAlchemy models
│   │
│   ├── middleware/
│   │   ├── __init__.py
│   │   ├── authentication.py   # API key auth
│   │   ├── rate_limiting.py    # Rate limiter
│   │   ├── logging.py          # Request logging
│   │   └── errors.py           # Error handling
│   │
│   └── utils/
│       ├── __init__.py
│       └── helpers.py          # Utility functions
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py             # Pytest fixtures
│   ├── test_trajectory.py      # Physics tests
│   ├── test_auth.py            # Authentication tests
│   ├── test_rate_limit.py      # Rate limiting tests
│   └── test_validation.py      # Input validation tests
│
├── alembic/                    # Database migrations
│   ├── versions/
│   ├── env.py
│   └── alembic.ini
│
├── scripts/
│   ├── generate_api_key.py     # Generate new API keys
│   └── seed_data.py            # Seed initial data
│
├── .env.example                # Environment template
├── .env.staging                # Staging config (git-ignored)
├── .env.production             # Production config (git-ignored)
├── requirements.txt            # Python dependencies
├── Procfile                    # Railway process file
├── railway.json                # Railway configuration
├── Dockerfile                  # Container definition
└── README.md                   # Documentation
```

---

## Task 2: Core Application Setup

### app/main.py

```python
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import time
import uuid

from app.config import settings
from app.database import engine, Base
from app.redis_client import redis_client
from app.routers import trajectory, health, admin
from app.middleware.authentication import AuthMiddleware
from app.middleware.rate_limiting import RateLimitMiddleware
from app.middleware.errors import setup_exception_handlers
from app.middleware.logging import setup_logging, logger

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup
    logger.info(f"Starting Golf Weather API v{settings.VERSION}")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    
    # Create database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Verify Redis connection
    await redis_client.ping()
    logger.info("Redis connection verified")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Golf Weather API")
    await redis_client.close()

app = FastAPI(
    title="Golf Weather Physics API",
    description="Weather-adjusted trajectory calculations for golf shots",
    version=settings.VERSION,
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom middleware
app.add_middleware(AuthMiddleware)
app.add_middleware(RateLimitMiddleware)

# Request ID and logging middleware
@app.middleware("http")
async def add_request_context(request: Request, call_next):
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    start_time = time.time()
    
    response = await call_next(request)
    
    # Add headers
    response.headers["X-Request-ID"] = request_id
    response.headers["X-API-Version"] = settings.VERSION
    
    # Log request
    latency_ms = (time.time() - start_time) * 1000
    logger.info(
        "Request completed",
        extra={
            "request_id": request_id,
            "method": request.method,
            "path": request.url.path,
            "status": response.status_code,
            "latency_ms": round(latency_ms, 2),
            "client": getattr(request.state, "client_id", "anonymous"),
        }
    )
    
    return response

# Setup error handlers
setup_exception_handlers(app)

# Include routers
app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(trajectory.router, prefix="/api/v1", tags=["Trajectory"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])

# Root redirect
@app.get("/", include_in_schema=False)
async def root():
    return {"message": "Golf Weather API", "docs": "/docs", "health": "/api/v1/health"}
```

---

### app/config.py

```python
from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # App
    VERSION: str = "1.0.6"
    ENVIRONMENT: str = "development"  # development, staging, production
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://user:pass@localhost/golfweather"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # API Keys (hashed)
    API_KEYS: dict = {}  # Loaded from environment
    ADMIN_KEY_HASH: str = ""
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 1000
    RATE_LIMIT_BURST: int = 100
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "https://app.inrangegolf.com",
        "https://admin.inrangegolf.com",
        "http://localhost:3000",
    ]
    
    # Weather API
    WEATHER_API_KEY: str = ""
    WEATHER_API_BASE_URL: str = "https://api.weatherapi.com/v1"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    def load_api_keys(self):
        """Load API keys from environment variables."""
        # Format: APIKEY_CLIENTNAME=hash
        for key, value in os.environ.items():
            if key.startswith("APIKEY_"):
                client_name = key.replace("APIKEY_", "").lower()
                self.API_KEYS[client_name] = value

settings = Settings()
settings.load_api_keys()
```

---

### app/database.py

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.config import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_size=20,
    max_overflow=10,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
```

---

### app/redis_client.py

```python
import redis.asyncio as redis
from app.config import settings

redis_client = redis.from_url(
    settings.REDIS_URL,
    encoding="utf-8",
    decode_responses=True,
)
```

---

## Task 3: Authentication Middleware

### app/middleware/authentication.py

```python
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
import hashlib
from app.config import settings

# Paths that don't require authentication
PUBLIC_PATHS = [
    "/",
    "/docs",
    "/redoc",
    "/openapi.json",
    "/api/v1/health",
]

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Skip auth for public paths
        if any(request.url.path.startswith(path) for path in PUBLIC_PATHS):
            return await call_next(request)
        
        # Get API key from header
        api_key = request.headers.get("X-API-Key")
        
        if not api_key:
            raise HTTPException(
                status_code=401,
                detail={
                    "error": {
                        "code": "MISSING_API_KEY",
                        "message": "API key is required. Include X-API-Key header.",
                    }
                }
            )
        
        # Hash the provided key
        key_hash = hashlib.sha256(api_key.encode()).hexdigest()
        
        # Check against valid keys
        client_id = None
        for client, stored_hash in settings.API_KEYS.items():
            if key_hash == stored_hash:
                client_id = client
                break
        
        if not client_id:
            raise HTTPException(
                status_code=401,
                detail={
                    "error": {
                        "code": "INVALID_API_KEY",
                        "message": "The API key provided is invalid or expired.",
                    }
                }
            )
        
        # Store client ID in request state for logging and rate limiting
        request.state.client_id = client_id
        
        return await call_next(request)
```

---

## Task 4: Rate Limiting Middleware

### app/middleware/rate_limiting.py

```python
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
import time
from app.config import settings
from app.redis_client import redis_client

# Paths excluded from rate limiting
EXCLUDED_PATHS = ["/", "/docs", "/redoc", "/openapi.json"]

# Rate limits per client tier (requests per minute)
RATE_LIMITS = {
    "free": 60,
    "standard": 1000,
    "professional": 5000,
    "enterprise": 20000,
    "inrange_prod": 20000,
    "inrange_test": 1000,
    "default": 1000,
}

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for excluded paths
        if any(request.url.path.startswith(path) for path in EXCLUDED_PATHS):
            return await call_next(request)
        
        # Get client ID (set by auth middleware)
        client_id = getattr(request.state, "client_id", "anonymous")
        
        # Get rate limit for this client
        rate_limit = RATE_LIMITS.get(client_id, RATE_LIMITS["default"])
        
        # Redis key for this client's rate limit window
        redis_key = f"ratelimit:{client_id}:{int(time.time() // 60)}"
        
        # Increment counter
        current_count = await redis_client.incr(redis_key)
        
        # Set expiry on first request in window
        if current_count == 1:
            await redis_client.expire(redis_key, 60)
        
        # Check if over limit
        if current_count > rate_limit:
            # Get TTL for reset time
            ttl = await redis_client.ttl(redis_key)
            
            raise HTTPException(
                status_code=429,
                detail={
                    "error": {
                        "code": "RATE_LIMIT_EXCEEDED",
                        "message": f"Rate limit exceeded. Limit: {rate_limit}/minute.",
                        "retry_after": ttl,
                    }
                },
                headers={
                    "X-RateLimit-Limit": str(rate_limit),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(int(time.time()) + ttl),
                    "Retry-After": str(ttl),
                }
            )
        
        # Process request
        response = await call_next(request)
        
        # Add rate limit headers
        response.headers["X-RateLimit-Limit"] = str(rate_limit)
        response.headers["X-RateLimit-Remaining"] = str(max(0, rate_limit - current_count))
        response.headers["X-RateLimit-Reset"] = str(int(time.time() // 60) * 60 + 60)
        
        return response
```

---

## Task 5: Database Models for Usage Tracking

### app/models/database.py

```python
from sqlalchemy import Column, Integer, String, DateTime, Date, Float, Index
from sqlalchemy.sql import func
from app.database import Base

class APIUsage(Base):
    __tablename__ = "api_usage"
    
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(String(50), nullable=False, index=True)
    endpoint = Column(String(100), nullable=False)
    date = Column(Date, nullable=False, index=True)
    request_count = Column(Integer, default=0)
    error_count = Column(Integer, default=0)
    total_latency_ms = Column(Float, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    __table_args__ = (
        Index("ix_usage_client_date", "client_id", "date"),
        {"schema": None}
    )

class APIKey(Base):
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(String(50), unique=True, nullable=False, index=True)
    key_hash = Column(String(64), nullable=False)  # SHA256 hash
    tier = Column(String(20), default="standard")  # free, standard, professional, enterprise
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_used_at = Column(DateTime(timezone=True))
    
class RequestLog(Base):
    __tablename__ = "request_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(String(36), unique=True, nullable=False, index=True)
    client_id = Column(String(50), nullable=False, index=True)
    endpoint = Column(String(100), nullable=False)
    method = Column(String(10), nullable=False)
    status_code = Column(Integer, nullable=False)
    latency_ms = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    __table_args__ = (
        Index("ix_logs_client_created", "client_id", "created_at"),
    )
```

---

## Task 6: Usage Tracking Service

### app/services/usage.py

```python
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.dialects.postgresql import insert
from datetime import date, datetime
from app.models.database import APIUsage, RequestLog

class UsageService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def track_request(
        self,
        client_id: str,
        endpoint: str,
        status_code: int,
        latency_ms: float,
        request_id: str,
    ):
        """Track a single API request."""
        today = date.today()
        is_error = status_code >= 400
        
        # Upsert daily usage stats
        stmt = insert(APIUsage).values(
            client_id=client_id,
            endpoint=endpoint,
            date=today,
            request_count=1,
            error_count=1 if is_error else 0,
            total_latency_ms=latency_ms,
        ).on_conflict_do_update(
            index_elements=["client_id", "endpoint", "date"],
            set_={
                "request_count": APIUsage.request_count + 1,
                "error_count": APIUsage.error_count + (1 if is_error else 0),
                "total_latency_ms": APIUsage.total_latency_ms + latency_ms,
                "updated_at": datetime.utcnow(),
            }
        )
        await self.db.execute(stmt)
        
        # Log individual request (for detailed debugging)
        log = RequestLog(
            request_id=request_id,
            client_id=client_id,
            endpoint=endpoint,
            method="POST",
            status_code=status_code,
            latency_ms=latency_ms,
        )
        self.db.add(log)
        
        await self.db.commit()
    
    async def get_client_usage(
        self,
        client_id: str,
        start_date: date = None,
        end_date: date = None,
    ):
        """Get usage stats for a client."""
        query = select(APIUsage).where(APIUsage.client_id == client_id)
        
        if start_date:
            query = query.where(APIUsage.date >= start_date)
        if end_date:
            query = query.where(APIUsage.date <= end_date)
        
        query = query.order_by(APIUsage.date.desc())
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def get_usage_summary(self, client_id: str):
        """Get summary stats for a client."""
        # Get all-time stats
        query = select(
            func.sum(APIUsage.request_count).label("total_requests"),
            func.sum(APIUsage.error_count).label("total_errors"),
            func.avg(APIUsage.total_latency_ms / APIUsage.request_count).label("avg_latency"),
            func.min(APIUsage.date).label("first_request"),
            func.max(APIUsage.date).label("last_request"),
        ).where(APIUsage.client_id == client_id)
        
        result = await self.db.execute(query)
        return result.first()
```

---

## Task 7: API Routers

### app/routers/health.py

```python
from fastapi import APIRouter, Depends
from datetime import datetime
from app.config import settings
from app.redis_client import redis_client
from app.database import get_db

router = APIRouter()

@router.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring services.
    
    Returns:
        Health status of the API and its dependencies.
    """
    checks = {
        "api": "healthy",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }
    
    # Check Redis
    try:
        await redis_client.ping()
        checks["redis"] = "healthy"
    except Exception as e:
        checks["redis"] = "unhealthy"
        checks["redis_error"] = str(e)
    
    # Overall status
    all_healthy = all(
        v == "healthy" 
        for k, v in checks.items() 
        if k in ["api", "redis"]
    )
    
    return {
        "status": "healthy" if all_healthy else "degraded",
        "checks": checks,
    }

@router.get("/health/ready")
async def readiness_check(db=Depends(get_db)):
    """
    Readiness check - verifies all dependencies are ready.
    Used by Railway/Kubernetes to know when to route traffic.
    """
    try:
        # Check database
        await db.execute("SELECT 1")
        
        # Check Redis
        await redis_client.ping()
        
        return {"status": "ready"}
    except Exception as e:
        return {"status": "not_ready", "error": str(e)}
```

---

### app/routers/trajectory.py

```python
from fastapi import APIRouter, Depends, Request, BackgroundTasks
from app.models.requests import TrajectoryRequest
from app.models.responses import TrajectoryResponse
from app.services.physics import calculate_trajectory
from app.services.usage import UsageService
from app.database import get_db
import time

router = APIRouter()

@router.post("/trajectory", response_model=TrajectoryResponse)
async def calculate_shot_trajectory(
    request: Request,
    payload: TrajectoryRequest,
    background_tasks: BackgroundTasks,
    db=Depends(get_db),
):
    """
    Calculate weather-adjusted trajectory for a golf shot.
    
    Takes ball speed, launch angle, spin rate, and weather conditions.
    Returns baseline and adjusted distances with impact breakdown.
    """
    start_time = time.time()
    
    # Calculate trajectory
    result = await calculate_trajectory(
        ball_speed=payload.ball_speed,
        launch_angle=payload.launch_angle,
        spin_rate=payload.spin_rate,
        shot_direction=payload.shot_direction,
        conditions=payload.conditions.dict(),
    )
    
    latency_ms = (time.time() - start_time) * 1000
    
    # Track usage in background (don't slow down response)
    client_id = getattr(request.state, "client_id", "anonymous")
    background_tasks.add_task(
        UsageService(db).track_request,
        client_id=client_id,
        endpoint="/api/v1/trajectory",
        status_code=200,
        latency_ms=latency_ms,
        request_id=request.state.request_id,
    )
    
    return result
```

---

### app/routers/admin.py

```python
from fastapi import APIRouter, Depends, HTTPException, Header
from datetime import date, timedelta
import hashlib
from app.config import settings
from app.services.usage import UsageService
from app.database import get_db

router = APIRouter()

async def verify_admin_key(x_admin_key: str = Header(...)):
    """Verify admin API key."""
    key_hash = hashlib.sha256(x_admin_key.encode()).hexdigest()
    if key_hash != settings.ADMIN_KEY_HASH:
        raise HTTPException(status_code=403, detail="Invalid admin key")
    return True

@router.get("/usage/{client_id}")
async def get_client_usage(
    client_id: str,
    days: int = 30,
    db=Depends(get_db),
    admin=Depends(verify_admin_key),
):
    """
    Get usage statistics for a specific client.
    
    Requires admin API key.
    """
    service = UsageService(db)
    
    end_date = date.today()
    start_date = end_date - timedelta(days=days)
    
    usage = await service.get_client_usage(client_id, start_date, end_date)
    summary = await service.get_usage_summary(client_id)
    
    return {
        "client_id": client_id,
        "period": {
            "start": start_date.isoformat(),
            "end": end_date.isoformat(),
        },
        "summary": {
            "total_requests": summary.total_requests or 0,
            "total_errors": summary.total_errors or 0,
            "avg_latency_ms": round(summary.avg_latency or 0, 2),
            "first_request": summary.first_request.isoformat() if summary.first_request else None,
            "last_request": summary.last_request.isoformat() if summary.last_request else None,
        },
        "daily": [
            {
                "date": u.date.isoformat(),
                "requests": u.request_count,
                "errors": u.error_count,
                "avg_latency_ms": round(u.total_latency_ms / u.request_count, 2) if u.request_count else 0,
            }
            for u in usage
        ],
    }

@router.get("/usage")
async def get_all_usage(
    days: int = 7,
    db=Depends(get_db),
    admin=Depends(verify_admin_key),
):
    """
    Get usage statistics for all clients.
    
    Requires admin API key.
    """
    # Implementation: aggregate all client usage
    pass
```

---

## Task 8: Request/Response Models

### app/models/requests.py

```python
from pydantic import BaseModel, Field
from typing import Optional

class WeatherConditions(BaseModel):
    temperature: float = Field(
        ..., 
        ge=-20, 
        le=130,
        description="Temperature in Fahrenheit"
    )
    wind_speed: float = Field(
        ..., 
        ge=0, 
        le=60,
        description="Wind speed in mph"
    )
    wind_direction: float = Field(
        ..., 
        ge=0, 
        le=360,
        description="Wind direction in degrees (0=headwind, 180=tailwind)"
    )
    altitude: float = Field(
        ..., 
        ge=0, 
        le=15000,
        description="Altitude in feet above sea level"
    )
    humidity: float = Field(
        ..., 
        ge=0, 
        le=100,
        description="Relative humidity percentage"
    )

class TrajectoryRequest(BaseModel):
    ball_speed: float = Field(
        ..., 
        ge=50, 
        le=200,
        description="Ball speed in mph"
    )
    launch_angle: float = Field(
        ..., 
        ge=0, 
        le=60,
        description="Launch angle in degrees"
    )
    spin_rate: float = Field(
        ..., 
        ge=1000, 
        le=12000,
        description="Spin rate in RPM"
    )
    shot_direction: float = Field(
        default=0,
        ge=0,
        le=360,
        description="Shot direction in degrees"
    )
    conditions: WeatherConditions
    
    class Config:
        json_schema_extra = {
            "example": {
                "ball_speed": 110,
                "launch_angle": 19,
                "spin_rate": 6000,
                "shot_direction": 0,
                "conditions": {
                    "temperature": 70,
                    "wind_speed": 15,
                    "wind_direction": 0,
                    "altitude": 500,
                    "humidity": 50
                }
            }
        }
```

### app/models/responses.py

```python
from pydantic import BaseModel
from typing import Optional

class BaselineResult(BaseModel):
    carry: float
    total: float
    apex: float
    flight_time: float
    land_angle: float

class AdjustedResult(BaseModel):
    carry: float
    total: float
    apex: float
    lateral_drift: float
    flight_time: float
    land_angle: float

class ImpactBreakdown(BaseModel):
    wind: float
    temperature: float
    altitude: float
    humidity: float

class TrajectoryResponse(BaseModel):
    baseline: BaselineResult
    adjusted: AdjustedResult
    impact: ImpactBreakdown
    recommendation: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "baseline": {
                    "carry": 172.4,
                    "total": 182.0,
                    "apex": 32.5,
                    "flight_time": 6.2,
                    "land_angle": 48.0
                },
                "adjusted": {
                    "carry": 147.8,
                    "total": 155.2,
                    "apex": 35.2,
                    "lateral_drift": 2.1,
                    "flight_time": 6.8,
                    "land_angle": 52.0
                },
                "impact": {
                    "wind": -18.5,
                    "temperature": -3.2,
                    "altitude": 0.6,
                    "humidity": -0.1
                },
                "recommendation": "Take one extra club in these conditions"
            }
        }
```

---

## Task 9: Configuration Files

### requirements.txt

```
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
pydantic>=2.5.0
pydantic-settings>=2.1.0
sqlalchemy>=2.0.0
asyncpg>=0.29.0
alembic>=1.13.0
redis>=5.0.0
python-dotenv>=1.0.0
httpx>=0.26.0
structlog>=24.1.0
sentry-sdk[fastapi]>=1.39.0
```

### .env.example

```bash
# Environment
ENVIRONMENT=development

# Database (Railway provides this)
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/dbname

# Redis (Railway provides this)
REDIS_URL=redis://default:password@host:6379

# API Keys (SHA256 hashes of actual keys)
APIKEY_INRANGE_PROD=your_sha256_hash_here
APIKEY_INRANGE_TEST=your_sha256_hash_here
ADMIN_KEY_HASH=your_admin_key_hash_here

# Weather API
WEATHER_API_KEY=your_weatherapi_key

# Rate Limiting
RATE_LIMIT_PER_MINUTE=1000

# Logging
LOG_LEVEL=INFO

# CORS (comma-separated)
CORS_ORIGINS=https://app.inrangegolf.com,https://admin.inrangegolf.com
```

### railway.json

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/api/v1/health",
    "healthcheckTimeout": 30,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Run database migrations on startup
RUN chmod +x scripts/start.sh

# Expose port
EXPOSE 8000

# Start command
CMD ["./scripts/start.sh"]
```

### scripts/start.sh

```bash
#!/bin/bash
set -e

# Run database migrations
alembic upgrade head

# Start the application
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
```

---

## Task 10: Generate API Key Script

### scripts/generate_api_key.py

```python
#!/usr/bin/env python3
"""Generate a new API key for a client."""

import secrets
import hashlib
import sys

def generate_api_key(client_name: str):
    # Generate a secure random key
    raw_key = f"gw_{client_name}_{secrets.token_hex(24)}"
    
    # Hash it for storage
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    
    print(f"\n{'='*60}")
    print(f"API Key for: {client_name}")
    print(f"{'='*60}")
    print(f"\nGive this to the client (SECRET - only show once):")
    print(f"  {raw_key}")
    print(f"\nStore this in your environment variables:")
    print(f"  APIKEY_{client_name.upper()}={key_hash}")
    print(f"\n{'='*60}\n")
    
    return raw_key, key_hash

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_api_key.py <client_name>")
        print("Example: python generate_api_key.py inrange_prod")
        sys.exit(1)
    
    client_name = sys.argv[1]
    generate_api_key(client_name)
```

---

## Task 11: Railway Setup Instructions

### Setting Up Railway

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   ```
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   ```

3. **Add PostgreSQL**
   ```
   - Click "+ New" in the project
   - Select "Database" → "PostgreSQL"
   - Railway auto-provisions and sets DATABASE_URL
   ```

4. **Add Redis**
   ```
   - Click "+ New" in the project
   - Select "Database" → "Redis"
   - Railway auto-provisions and sets REDIS_URL
   ```

5. **Set Environment Variables**
   ```
   - Click on your service
   - Go to "Variables" tab
   - Add all variables from .env.example
   ```

6. **Configure Domains**
   ```
   - Go to "Settings" → "Domains"
   - Add custom domain: api.yourdomain.com
   ```

### Setting Up Staging Environment

1. **Create Staging Environment in Railway**
   ```
   - In your project, click "Environments"
   - Click "+ New Environment"
   - Name it "staging"
   ```

2. **Staging will have separate:**
   - PostgreSQL instance
   - Redis instance
   - Environment variables
   - Domain (staging-api.yourdomain.com)

---

## Task 12: Testing

### Run Locally

```bash
# Install dependencies
pip install -r requirements.txt

# Set up local database
docker run -d --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 postgres
docker run -d --name redis -p 6379:6379 redis

# Set environment variables
export DATABASE_URL="postgresql+asyncpg://postgres:password@localhost:5432/postgres"
export REDIS_URL="redis://localhost:6379"
export ENVIRONMENT="development"

# Generate test API key
python scripts/generate_api_key.py test_client

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload
```

### Test Commands

```bash
# Health check (no auth)
curl http://localhost:8000/api/v1/health

# Trajectory (requires auth)
curl -X POST http://localhost:8000/api/v1/trajectory \
  -H "Content-Type: application/json" \
  -H "X-API-Key: gw_test_client_xxxxx" \
  -d '{
    "ball_speed": 110,
    "launch_angle": 19,
    "spin_rate": 6000,
    "shot_direction": 0,
    "conditions": {
      "temperature": 70,
      "wind_speed": 15,
      "wind_direction": 0,
      "altitude": 500,
      "humidity": 50
    }
  }'

# Test rate limiting (run many times)
for i in {1..100}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -H "X-API-Key: gw_test_client_xxxxx" \
    http://localhost:8000/api/v1/health
done
```

---

## Deliverables Checklist

When complete, confirm:

- [ ] Project structure created
- [ ] FastAPI app with all middleware
- [ ] PostgreSQL models and migrations
- [ ] Redis rate limiting working
- [ ] API key authentication working
- [ ] Health check endpoint
- [ ] Trajectory endpoint
- [ ] Admin usage endpoint
- [ ] Request logging
- [ ] Error handling standardized
- [ ] Railway configuration files
- [ ] Staging environment set up
- [ ] API key generation script
- [ ] All tests passing
- [ ] Documentation generated (/docs)

---

## Questions for Me

1. Should I use the existing physics code or refactor it?
2. Do you want me to set up Sentry for error tracking too?
3. Any specific CORS origins beyond Inrange?
4. Do you want email alerts for errors/downtime?
