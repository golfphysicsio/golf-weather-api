# Environment Variables Guide

This document describes all environment variables required for the Golf Physics API ecosystem.

---

## Backend API (FastAPI)

### Core Settings

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ENVIRONMENT` | No | `development` | Environment name: `development`, `staging`, `production` |
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `REDIS_URL` | No | - | Redis connection string (for caching/rate limiting) |

### URL Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `BACKEND_URL` | No | `http://localhost:8000` | This API's public URL (used in emails) |
| `FRONTEND_URL` | No | `http://localhost:5173` | Marketing website URL (used in emails) |
| `ADMIN_URL` | No | `http://localhost:8000` | Admin dashboard URL |
| `CORS_ORIGINS` | No | localhost URLs | Comma-separated list of allowed CORS origins |

### Email (SendGrid)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SENDGRID_API_KEY` | No | - | SendGrid API key for sending emails |
| `FROM_EMAIL` | No | `noreply@golfphysics.io` | Sender email address |
| `REPLY_TO_EMAIL` | No | `golfphysicsio@gmail.com` | Reply-to email address |
| `ADMIN_EMAIL` | No | `golfphysicsio@gmail.com` | Admin notification email |

### API Keys

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `APIKEY_<NAME>` | No | - | API key hashes (format: `APIKEY_CLIENTNAME=sha256hash`) |
| `ADMIN_KEY_HASH` | No | - | Admin API key hash |

### External Services

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `WEATHER_API_KEY` | No | - | WeatherAPI.com API key |
| `SENTRY_DSN` | No | - | Sentry error tracking DSN |
| `GOOGLE_CLIENT_ID` | No | - | Google OAuth client ID (for admin dashboard) |
| `RECAPTCHA_SECRET_KEY` | No | - | reCAPTCHA secret key |

---

## Environment-Specific Configuration

### Development (.env)

```env
ENVIRONMENT=development
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/golfweather_dev
REDIS_URL=redis://localhost:6379

# URLs - localhost defaults
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:8000

# SendGrid (optional for development)
# SENDGRID_API_KEY=

# Logging
LOG_LEVEL=DEBUG
```

### Staging (Railway Variables)

```env
ENVIRONMENT=staging
DATABASE_URL=[Railway PostgreSQL URL]
REDIS_URL=[Railway Redis URL]

# URLs - Railway staging URLs
BACKEND_URL=https://golf-weather-api-staging.up.railway.app
FRONTEND_URL=https://golf-weather-api-staging.up.railway.app
CORS_ORIGINS=https://golf-weather-api-staging.up.railway.app

# SendGrid
SENDGRID_API_KEY=[your-sendgrid-key]
FROM_EMAIL=noreply@golfphysics.io
REPLY_TO_EMAIL=golfphysicsio@gmail.com
ADMIN_EMAIL=golfphysicsio@gmail.com

# Google OAuth
GOOGLE_CLIENT_ID=[your-google-client-id]

# Logging
LOG_LEVEL=INFO
```

### Production (Railway Variables)

```env
ENVIRONMENT=production
DATABASE_URL=[Railway PostgreSQL Production URL]
REDIS_URL=[Railway Redis Production URL]

# URLs - Production URLs
BACKEND_URL=https://api.golfphysics.io
FRONTEND_URL=https://golfphysics.io
CORS_ORIGINS=https://golfphysics.io,https://www.golfphysics.io,https://api.golfphysics.io

# SendGrid
SENDGRID_API_KEY=[your-sendgrid-key]
FROM_EMAIL=noreply@golfphysics.io
REPLY_TO_EMAIL=golfphysicsio@gmail.com
ADMIN_EMAIL=golfphysicsio@gmail.com

# Google OAuth
GOOGLE_CLIENT_ID=[your-google-client-id]

# Error Tracking
SENTRY_DSN=[your-sentry-dsn]

# Logging
LOG_LEVEL=INFO
```

---

## Admin Dashboard (React/Vite)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_GOOGLE_CLIENT_ID` | Yes | - | Google OAuth client ID |
| `VITE_API_BASE_URL` | No | `window.location.origin` | API base URL (leave unset for same-origin) |

### Recommended Setup

The admin dashboard is served from the same origin as the API, so `VITE_API_BASE_URL` should be left unset. This allows it to work automatically on any domain.

```env
# .env for admin dashboard
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
# VITE_API_BASE_URL= (leave unset)
```

---

## Marketing Website (React/Vite)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_RECAPTCHA_SITE_KEY` | Yes | - | reCAPTCHA v3 site key |
| `VITE_API_BASE_URL` | No | `window.location.origin` | API base URL |
| `VITE_ENVIRONMENT` | No | `production` | Environment name |

### Development

```env
VITE_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI  # Test key
VITE_API_BASE_URL=http://localhost:8000
VITE_ENVIRONMENT=development
```

### Staging

```env
VITE_RECAPTCHA_SITE_KEY=[your-staging-key]
VITE_API_BASE_URL=https://golf-weather-api-staging.up.railway.app
VITE_ENVIRONMENT=staging
```

### Production

```env
VITE_RECAPTCHA_SITE_KEY=[your-production-key]
# VITE_API_BASE_URL= (leave unset for same-origin)
VITE_ENVIRONMENT=production
```

---

## Railway Setup

### Staging Service Variables

Set these in Railway > Staging Service > Variables:

1. `ENVIRONMENT=staging`
2. `BACKEND_URL=https://golf-weather-api-staging.up.railway.app`
3. `FRONTEND_URL=https://golf-weather-api-staging.up.railway.app`
4. `CORS_ORIGINS=https://golf-weather-api-staging.up.railway.app`
5. All other required variables (DATABASE_URL, REDIS_URL, etc.)

### Production Service Variables

Set these in Railway > Production Service > Variables:

1. `ENVIRONMENT=production`
2. `BACKEND_URL=https://api.golfphysics.io`
3. `FRONTEND_URL=https://golfphysics.io`
4. `CORS_ORIGINS=https://golfphysics.io,https://www.golfphysics.io,https://api.golfphysics.io`
5. All other required variables

---

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create or select your OAuth 2.0 Client ID
3. Add Authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `https://golf-weather-api-staging.up.railway.app` (staging)
   - `https://api.golfphysics.io` (production)
4. Copy the Client ID to:
   - Backend: `GOOGLE_CLIENT_ID`
   - Admin Dashboard: `VITE_GOOGLE_CLIENT_ID`

---

## Verification

After setting up environment variables, verify with:

```bash
# Backend
python -c "from app.config import settings; print(f'Environment: {settings.ENVIRONMENT}')"

# Check CORS
curl -v -X OPTIONS https://your-api-url/admin-api/health \
  -H "Origin: https://your-frontend-url" \
  -H "Access-Control-Request-Method: GET"
```
