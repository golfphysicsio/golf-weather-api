"""
Golf Physics Admin Dashboard - Backend API Routes
Add this router to your FastAPI application.
"""

import os
import secrets
import hashlib
from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Header, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
import asyncpg
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import io
import csv

# ============================================
# CONFIGURATION
# ============================================

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "golfphysicsio@gmail.com")
DATABASE_URL = os.environ.get("DATABASE_URL", "")

# Rate limits per tier (requests per minute)
RATE_LIMITS = {
    "free": 60,
    "standard": 1000,
    "enterprise": 20000
}

# ============================================
# DATABASE CONNECTION
# ============================================

_db_pool = None

async def get_db_pool():
    """Get or create database connection pool."""
    global _db_pool
    if _db_pool is None:
        # Convert SQLAlchemy URL to asyncpg format
        db_url = DATABASE_URL
        if db_url.startswith("postgresql+asyncpg://"):
            db_url = db_url.replace("postgresql+asyncpg://", "postgresql://")
        _db_pool = await asyncpg.create_pool(db_url, min_size=2, max_size=10)
    return _db_pool

async def get_db():
    """Get database connection from pool."""
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        yield conn

# ============================================
# AUTHENTICATION
# ============================================

async def verify_admin_token(authorization: str = Header(...)) -> str:
    """Verify Google OAuth token and check admin email."""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.replace("Bearer ", "")

    try:
        # Verify Google token
        idinfo = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            GOOGLE_CLIENT_ID
        )

        email = idinfo.get("email", "")

        # Check if email matches admin
        if email.lower() != ADMIN_EMAIL.lower():
            raise HTTPException(
                status_code=403,
                detail=f"Access denied. Only {ADMIN_EMAIL} can access admin dashboard."
            )

        return email

    except ValueError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

# ============================================
# PYDANTIC MODELS
# ============================================

class CreateApiKeyRequest(BaseModel):
    client_name: str = Field(..., min_length=1, max_length=255)
    tier: str = Field(default="free", pattern="^(free|standard|enterprise)$")
    notes: Optional[str] = None

class CreateApiKeyResponse(BaseModel):
    id: int
    client_name: str
    api_key: str  # Full key shown only once
    key_prefix: str
    tier: str
    rate_limit_per_minute: int
    message: str

class ApiKeyInfo(BaseModel):
    id: int
    client_name: str
    key_prefix: str
    tier: str
    status: str
    created_at: datetime
    last_used_at: Optional[datetime]
    requests_today: int
    total_requests: int
    rate_limit_per_minute: int
    notes: Optional[str]

class UpdateStatusRequest(BaseModel):
    status: str = Field(..., pattern="^(active|disabled|revoked)$")

class UpdateTierRequest(BaseModel):
    tier: str = Field(..., pattern="^(free|standard|enterprise)$")

class DailyUsage(BaseModel):
    client_name: str
    date: str
    total_requests: int
    successful_requests: int
    error_requests: int
    avg_latency_ms: float
    error_rate_percent: float

class UsageSummary(BaseModel):
    total_requests_24h: int
    total_errors_24h: int
    avg_latency_24h: float
    active_clients: int
    requests_by_tier: dict

class RequestLog(BaseModel):
    id: int
    client_name: Optional[str]
    endpoint: str
    method: str
    status_code: int
    latency_ms: float
    error_message: Optional[str]
    request_ip: Optional[str]
    created_at: datetime

# ============================================
# ADMIN ROUTER
# ============================================

admin_router = APIRouter(prefix="/admin", tags=["Admin"])

# ============================================
# HEALTH CHECK
# ============================================

@admin_router.get("/health")
async def admin_health(admin_email: str = Depends(verify_admin_token)):
    """Health check for admin dashboard (requires authentication)."""
    return {
        "status": "healthy",
        "admin": admin_email,
        "timestamp": datetime.utcnow().isoformat()
    }

# ============================================
# API KEY MANAGEMENT
# ============================================

@admin_router.post("/api-keys", response_model=CreateApiKeyResponse)
async def create_api_key(
    request: CreateApiKeyRequest,
    admin_email: str = Depends(verify_admin_token)
):
    """Create a new API key for a client."""
    pool = await get_db_pool()

    # Generate secure API key
    random_part = secrets.token_hex(24)  # 48 hex chars
    api_key = f"golf_{random_part}"
    key_prefix = f"golf_{random_part[:8]}"

    # Hash the key for storage
    key_hash = hashlib.sha256(api_key.encode()).hexdigest()

    async with pool.acquire() as conn:
        # Check if client name already exists
        existing = await conn.fetchrow(
            "SELECT id FROM admin_api_keys WHERE client_name = $1 AND status != 'revoked'",
            request.client_name
        )
        if existing:
            raise HTTPException(
                status_code=400,
                detail=f"An active API key already exists for '{request.client_name}'"
            )

        # Insert new key
        row = await conn.fetchrow(
            """
            INSERT INTO admin_api_keys (client_name, key_hash, key_prefix, tier, notes)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, client_name, key_prefix, tier, created_at
            """,
            request.client_name, key_hash, key_prefix, request.tier, request.notes
        )

    return CreateApiKeyResponse(
        id=row["id"],
        client_name=row["client_name"],
        api_key=api_key,
        key_prefix=row["key_prefix"],
        tier=row["tier"],
        rate_limit_per_minute=RATE_LIMITS[row["tier"]],
        message="Save this API key now - it will not be shown again!"
    )

@admin_router.get("/api-keys", response_model=List[ApiKeyInfo])
async def list_api_keys(admin_email: str = Depends(verify_admin_token)):
    """List all API keys."""
    pool = await get_db_pool()

    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT
                id, client_name, key_prefix, tier, status,
                created_at, last_used_at, requests_today, total_requests, notes
            FROM admin_api_keys
            ORDER BY created_at DESC
            """
        )

    return [
        ApiKeyInfo(
            id=row["id"],
            client_name=row["client_name"],
            key_prefix=row["key_prefix"],
            tier=row["tier"],
            status=row["status"],
            created_at=row["created_at"],
            last_used_at=row["last_used_at"],
            requests_today=row["requests_today"],
            total_requests=row["total_requests"],
            rate_limit_per_minute=RATE_LIMITS[row["tier"]],
            notes=row["notes"]
        )
        for row in rows
    ]

@admin_router.patch("/api-keys/{key_id}/status")
async def update_api_key_status(
    key_id: int,
    request: UpdateStatusRequest,
    admin_email: str = Depends(verify_admin_token)
):
    """Update API key status (active/disabled/revoked)."""
    pool = await get_db_pool()

    async with pool.acquire() as conn:
        result = await conn.execute(
            "UPDATE admin_api_keys SET status = $1 WHERE id = $2",
            request.status, key_id
        )

        if result == "UPDATE 0":
            raise HTTPException(status_code=404, detail="API key not found")

    return {"message": f"API key status updated to {request.status}"}

@admin_router.patch("/api-keys/{key_id}/tier")
async def update_api_key_tier(
    key_id: int,
    request: UpdateTierRequest,
    admin_email: str = Depends(verify_admin_token)
):
    """Update API key tier (free/standard/enterprise)."""
    pool = await get_db_pool()

    async with pool.acquire() as conn:
        result = await conn.execute(
            "UPDATE admin_api_keys SET tier = $1 WHERE id = $2",
            request.tier, key_id
        )

        if result == "UPDATE 0":
            raise HTTPException(status_code=404, detail="API key not found")

    return {
        "message": f"API key tier updated to {request.tier}",
        "new_rate_limit": RATE_LIMITS[request.tier]
    }

@admin_router.delete("/api-keys/{key_id}")
async def revoke_api_key(
    key_id: int,
    admin_email: str = Depends(verify_admin_token)
):
    """Revoke an API key (permanent)."""
    pool = await get_db_pool()

    async with pool.acquire() as conn:
        result = await conn.execute(
            "UPDATE admin_api_keys SET status = 'revoked' WHERE id = $1",
            key_id
        )

        if result == "UPDATE 0":
            raise HTTPException(status_code=404, detail="API key not found")

    return {"message": "API key revoked successfully"}

# ============================================
# USAGE ANALYTICS
# ============================================

@admin_router.get("/usage/daily", response_model=List[DailyUsage])
async def get_daily_usage(
    days: int = Query(default=30, ge=1, le=90),
    client_name: Optional[str] = None,
    admin_email: str = Depends(verify_admin_token)
):
    """Get daily usage statistics."""
    pool = await get_db_pool()

    async with pool.acquire() as conn:
        if client_name:
            rows = await conn.fetch(
                """
                SELECT
                    client_name,
                    DATE(created_at) as date,
                    COUNT(*) as total_requests,
                    COUNT(*) FILTER (WHERE status_code >= 200 AND status_code < 400) as successful_requests,
                    COUNT(*) FILTER (WHERE status_code >= 400) as error_requests,
                    COALESCE(AVG(latency_ms), 0) as avg_latency_ms
                FROM admin_request_logs
                WHERE created_at > NOW() - INTERVAL '1 day' * $1
                AND client_name = $2
                GROUP BY client_name, DATE(created_at)
                ORDER BY date DESC
                """,
                days, client_name
            )
        else:
            rows = await conn.fetch(
                """
                SELECT
                    client_name,
                    DATE(created_at) as date,
                    COUNT(*) as total_requests,
                    COUNT(*) FILTER (WHERE status_code >= 200 AND status_code < 400) as successful_requests,
                    COUNT(*) FILTER (WHERE status_code >= 400) as error_requests,
                    COALESCE(AVG(latency_ms), 0) as avg_latency_ms
                FROM admin_request_logs
                WHERE created_at > NOW() - INTERVAL '1 day' * $1
                GROUP BY client_name, DATE(created_at)
                ORDER BY date DESC
                """,
                days
            )

    return [
        DailyUsage(
            client_name=row["client_name"] or "Unknown",
            date=row["date"].isoformat(),
            total_requests=row["total_requests"],
            successful_requests=row["successful_requests"],
            error_requests=row["error_requests"],
            avg_latency_ms=round(row["avg_latency_ms"], 2),
            error_rate_percent=round(
                (row["error_requests"] / row["total_requests"] * 100)
                if row["total_requests"] > 0 else 0,
                2
            )
        )
        for row in rows
    ]

@admin_router.get("/usage/summary", response_model=UsageSummary)
async def get_usage_summary(admin_email: str = Depends(verify_admin_token)):
    """Get 24-hour usage summary."""
    pool = await get_db_pool()

    async with pool.acquire() as conn:
        # Overall stats
        stats = await conn.fetchrow(
            """
            SELECT
                COUNT(*) as total_requests,
                COUNT(*) FILTER (WHERE status_code >= 400) as total_errors,
                COALESCE(AVG(latency_ms), 0) as avg_latency,
                COUNT(DISTINCT client_name) as active_clients
            FROM admin_request_logs
            WHERE created_at > NOW() - INTERVAL '24 hours'
            """
        )

        # Requests by tier
        tier_stats = await conn.fetch(
            """
            SELECT
                ak.tier,
                COUNT(rl.id) as request_count
            FROM admin_request_logs rl
            JOIN admin_api_keys ak ON rl.api_key_id = ak.id
            WHERE rl.created_at > NOW() - INTERVAL '24 hours'
            GROUP BY ak.tier
            """
        )

    requests_by_tier = {row["tier"]: row["request_count"] for row in tier_stats}

    return UsageSummary(
        total_requests_24h=stats["total_requests"],
        total_errors_24h=stats["total_errors"],
        avg_latency_24h=round(stats["avg_latency"], 2),
        active_clients=stats["active_clients"],
        requests_by_tier=requests_by_tier
    )

@admin_router.get("/usage/export")
async def export_usage_csv(
    start_date: str = Query(..., description="Start date (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date (YYYY-MM-DD)"),
    admin_email: str = Depends(verify_admin_token)
):
    """Export usage data as CSV for billing."""
    pool = await get_db_pool()

    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT
                client_name,
                DATE(created_at) as date,
                COUNT(*) as total_requests,
                COUNT(*) FILTER (WHERE status_code >= 200 AND status_code < 400) as successful_requests,
                COUNT(*) FILTER (WHERE status_code >= 400) as error_requests,
                ROUND(AVG(latency_ms)::numeric, 2) as avg_latency_ms
            FROM admin_request_logs
            WHERE DATE(created_at) BETWEEN $1::date AND $2::date
            GROUP BY client_name, DATE(created_at)
            ORDER BY client_name, date
            """,
            start_date, end_date
        )

    # Create CSV
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Client", "Date", "Total Requests", "Successful", "Errors", "Avg Latency (ms)"])

    for row in rows:
        writer.writerow([
            row["client_name"] or "Unknown",
            row["date"].isoformat(),
            row["total_requests"],
            row["successful_requests"],
            row["error_requests"],
            row["avg_latency_ms"]
        ])

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=usage_{start_date}_to_{end_date}.csv"
        }
    )

# ============================================
# REQUEST LOGS
# ============================================

@admin_router.get("/logs", response_model=List[RequestLog])
async def get_request_logs(
    limit: int = Query(default=100, ge=1, le=1000),
    client_name: Optional[str] = None,
    status_code: Optional[int] = None,
    endpoint: Optional[str] = None,
    admin_email: str = Depends(verify_admin_token)
):
    """Get recent request logs (last 48 hours)."""
    pool = await get_db_pool()

    query = """
        SELECT id, client_name, endpoint, method, status_code,
               latency_ms, error_message, request_ip, created_at
        FROM admin_request_logs
        WHERE created_at > NOW() - INTERVAL '48 hours'
    """
    params = []
    param_count = 0

    if client_name:
        param_count += 1
        query += f" AND client_name = ${param_count}"
        params.append(client_name)

    if status_code:
        param_count += 1
        query += f" AND status_code = ${param_count}"
        params.append(status_code)

    if endpoint:
        param_count += 1
        query += f" AND endpoint LIKE ${param_count}"
        params.append(f"%{endpoint}%")

    param_count += 1
    query += f" ORDER BY created_at DESC LIMIT ${param_count}"
    params.append(limit)

    async with pool.acquire() as conn:
        rows = await conn.fetch(query, *params)

    return [
        RequestLog(
            id=row["id"],
            client_name=row["client_name"],
            endpoint=row["endpoint"],
            method=row["method"],
            status_code=row["status_code"],
            latency_ms=round(row["latency_ms"], 2),
            error_message=row["error_message"],
            request_ip=row["request_ip"],
            created_at=row["created_at"]
        )
        for row in rows
    ]

# ============================================
# CLEANUP ENDPOINT
# ============================================

@admin_router.post("/cleanup")
async def cleanup_old_logs(admin_email: str = Depends(verify_admin_token)):
    """Manually trigger cleanup of old request logs."""
    pool = await get_db_pool()

    async with pool.acquire() as conn:
        result = await conn.fetchval("SELECT cleanup_old_request_logs()")

    return {"message": f"Cleaned up {result} old log entries"}
