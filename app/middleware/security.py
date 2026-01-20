"""
Security Middleware

Adds security headers and implements security best practices.
"""

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

from app.config import settings


def build_csp_connect_src() -> str:
    """Build CSP connect-src from CORS origins."""
    # Always include 'self' and Google OAuth
    sources = ["'self'", "https://accounts.google.com"]

    # Add all CORS origins
    for origin in settings.cors_origins_list:
        if origin and origin not in sources:
            sources.append(origin)

    return " ".join(sources)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses."""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # Prevent MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # Prevent clickjacking
        response.headers["X-Frame-Options"] = "DENY"

        # XSS Protection (legacy, but still useful)
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Referrer Policy
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Content Security Policy - uses CORS origins from environment
        csp_connect_src = build_csp_connect_src()
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' https://accounts.google.com https://cdn.tailwindcss.com https://cdn.jsdelivr.net; "
            "style-src 'self' 'unsafe-inline' https://accounts.google.com https://cdn.jsdelivr.net https://fonts.googleapis.com; "
            "img-src 'self' data: https:; "
            "font-src 'self' https://fonts.gstatic.com; "
            f"connect-src {csp_connect_src}; "
            "frame-src https://accounts.google.com; "
            "frame-ancestors 'none';"
        )

        # HSTS (only in production)
        # Note: Railway handles HTTPS, but we add this for extra security
        if request.url.scheme == "https":
            response.headers["Strict-Transport-Security"] = (
                "max-age=31536000; includeSubDomains; preload"
            )

        # Permissions Policy (restrict browser features)
        response.headers["Permissions-Policy"] = (
            "geolocation=(), microphone=(), camera=(), payment=()"
        )

        return response
