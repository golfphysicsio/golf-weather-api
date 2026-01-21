# External Systems & Dependencies

> **Last Updated:** January 21, 2026
>
> This document tracks all third-party services, APIs, and external dependencies used by Golf Physics. Update this file whenever a new external system is introduced.

---

## External Services (Require API Keys/Accounts)

### WeatherAPI.com
- **Purpose:** Real-time weather data (temperature, wind, humidity, pressure)
- **Website:** https://www.weatherapi.com/
- **API Base URL:** `https://api.weatherapi.com/v1`
- **Endpoint Used:** `/current.json`
- **Environment Variable:** `WEATHER_API_KEY`
- **Used In:** `app/services/weather.py`
- **Critical:** Yes - core functionality depends on this
- **Fallback:** None currently

### SendGrid
- **Purpose:** Transactional email delivery
- **Website:** https://sendgrid.com/
- **Environment Variables:**
  - `SENDGRID_API_KEY` - API authentication
  - `FROM_EMAIL` - Sender address (default: noreply@golfphysics.io)
  - `REPLY_TO_EMAIL` - Reply-to address (default: golfphysicsio@gmail.com)
  - `ADMIN_EMAIL` - Admin notification recipient (default: golfphysicsio@gmail.com)
- **Used In:** `app/services/email.py`
- **Email Types:**
  - API key welcome emails
  - API key reissue notifications
  - Contact form confirmations
  - Admin lead notifications
- **Critical:** Yes - user communication depends on this

### Google reCAPTCHA v3
- **Purpose:** Spam protection on forms
- **Website:** https://www.google.com/recaptcha/
- **Verification URL:** `https://www.google.com/recaptcha/api/siteverify`
- **Environment Variables:**
  - `RECAPTCHA_SECRET_KEY` (backend)
  - `VITE_RECAPTCHA_SITE_KEY` (frontend)
- **Used In:**
  - `app/utils/recaptcha.py` (backend verification)
  - `golfphysics-website/src/main.jsx` (frontend provider)
  - `golfphysics-website/src/pages/Contact.jsx` (form protection)
- **Score Thresholds:**
  - API key requests: 0.5
  - Contact forms: 0.4
  - Newsletter: 0.3
  - Login: 0.3
- **Critical:** Moderate - forms work without it but vulnerable to spam

### Google OAuth 2.0
- **Purpose:** Admin dashboard authentication
- **Website:** https://console.cloud.google.com/
- **Environment Variables:**
  - `GOOGLE_CLIENT_ID` (backend & admin frontend)
  - `ADMIN_EMAIL` (authorized admin email)
- **Used In:**
  - `app/routers/admin_dashboard.py` (token verification)
  - `golf-admin/admin-dashboard/src/App.jsx` (login component)
- **Libraries:** google-auth (Python), @react-oauth/google (JS)
- **Critical:** Admin-only - main app works without it

### Sentry
- **Purpose:** Error tracking and performance monitoring
- **Website:** https://sentry.io/
- **Environment Variable:** `SENTRY_DSN` (optional)
- **Used In:**
  - `app/main.py` (initialization)
  - `app/middleware/errors.py` (exception capture)
- **Configuration:**
  - Production: 10% sampling rate
  - Development: 100% sampling rate
- **Critical:** No - optional monitoring

---

## Infrastructure Services (Managed by Railway)

### Railway.app
- **Purpose:** Hosting platform for all services
- **Website:** https://railway.app/
- **Configuration File:** `railway.json`
- **Services Provided:**
  - Docker container deployment
  - PostgreSQL database (auto-provisions `DATABASE_URL`)
  - Redis cache (auto-provisions `REDIS_URL`)
  - SSL/HTTPS certificates
  - Environment variable management
- **Health Check:** `/api/v1/health`
- **Critical:** Yes - entire backend depends on this

### PostgreSQL (via Railway)
- **Purpose:** Primary database
- **Environment Variable:** `DATABASE_URL`
- **Connection Format:** `postgresql+asyncpg://user:password@host:port/dbname`
- **Driver:** AsyncPG (async)
- **ORM:** SQLAlchemy 2.0+
- **Migration Tool:** Alembic
- **Pool Config:** Size 20, Max overflow 10
- **Used In:** `app/database.py`
- **Critical:** Yes

### Redis (via Railway)
- **Purpose:** Rate limiting and caching
- **Environment Variable:** `REDIS_URL`
- **Connection Format:** `redis://default:password@host:port`
- **Used In:** `app/redis_client.py`
- **Graceful Degradation:** App works without Redis (rate limiting disabled)
- **Critical:** Moderate - improves performance and security

---

## CDN & External Resources

### Google Fonts
- **Purpose:** Typography (Inter font family)
- **URL:** `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap`
- **Used In:** `frontend/index.html`
- **Critical:** No - fallback to system fonts

---

## Backend Python Dependencies

### Core Framework
| Package | Version | Purpose |
|---------|---------|---------|
| fastapi | >=0.109.0 | Web framework |
| uvicorn | >=0.27.0 | ASGI server |
| pydantic | >=2.5.0 | Data validation |
| pydantic-settings | >=2.1.0 | Environment config |

### Database
| Package | Version | Purpose |
|---------|---------|---------|
| sqlalchemy | >=2.0.0 | ORM |
| asyncpg | >=0.29.0 | Async PostgreSQL driver |
| alembic | >=1.13.0 | Database migrations |

### External Service Clients
| Package | Version | Purpose |
|---------|---------|---------|
| httpx | >=0.26.0 | Async HTTP client (weather API, reCAPTCHA) |
| sendgrid | >=6.11.0 | Email delivery |
| google-auth | >=2.27.0 | Google OAuth verification |
| sentry-sdk | >=1.39.0 | Error tracking |
| redis | >=5.0.0 | Cache client |

### Utilities
| Package | Version | Purpose |
|---------|---------|---------|
| python-dotenv | >=1.0.0 | Environment variables |
| structlog | >=24.1.0 | Structured logging |
| email-validator | >=2.1.0 | Email validation |

### Testing
| Package | Version | Purpose |
|---------|---------|---------|
| pytest | >=8.0.0 | Testing framework |
| pytest-asyncio | >=0.23.0 | Async test support |

---

## Frontend Dependencies (Main Website)

### Core
| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.2.0 | UI library |
| react-dom | ^19.2.0 | React rendering |
| react-router-dom | ^7.12.0 | Client-side routing |

### Styling & UI
| Package | Version | Purpose |
|---------|---------|---------|
| tailwindcss | ^4.1.18 | CSS framework |
| lucide-react | ^0.562.0 | Icons |
| prismjs | ^1.30.0 | Code syntax highlighting |

### External Integrations
| Package | Version | Purpose |
|---------|---------|---------|
| react-google-recaptcha-v3 | ^1.11.0 | Spam protection |

### Build Tools
| Package | Version | Purpose |
|---------|---------|---------|
| vite | ^7.2.4 | Build tool |
| @vitejs/plugin-react | ^5.1.1 | React plugin |
| postcss | ^8.5.6 | CSS processing |
| autoprefixer | ^10.4.23 | CSS prefixing |
| eslint | ^9.39.1 | Linting |

---

## Admin Dashboard Dependencies

### Core
| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.2.0 | UI library |
| react-dom | ^18.2.0 | React rendering |

### Authentication
| Package | Version | Purpose |
|---------|---------|---------|
| @react-oauth/google | ^0.12.1 | Google OAuth login |
| jwt-decode | ^4.0.0 | JWT token decoding |

### Data Visualization
| Package | Version | Purpose |
|---------|---------|---------|
| recharts | ^2.10.3 | Charts and graphs |

### Internationalization
| Package | Version | Purpose |
|---------|---------|---------|
| i18next | ^23.7.0 | i18n framework |
| react-i18next | ^14.0.0 | React bindings |
| i18next-browser-languagedetector | ^7.2.0 | Language detection |

---

## Environment Variables Summary

### Backend (.env)
```
# Core
ENVIRONMENT=development|staging|production
DATABASE_URL=postgresql+asyncpg://...
REDIS_URL=redis://...

# External APIs
WEATHER_API_KEY=your_key
SENDGRID_API_KEY=your_key
RECAPTCHA_SECRET_KEY=your_key
SENTRY_DSN=your_dsn (optional)
GOOGLE_CLIENT_ID=your_client_id

# Email Configuration
FROM_EMAIL=noreply@golfphysics.io
REPLY_TO_EMAIL=golfphysicsio@gmail.com
ADMIN_EMAIL=golfphysicsio@gmail.com

# URLs
BACKEND_URL=https://api.golfphysics.io
FRONTEND_URL=https://golfphysics.io
ADMIN_URL=https://admin.golfphysics.io

# Security
CORS_ORIGINS=https://golfphysics.io,https://admin.golfphysics.io
ADMIN_KEY_HASH=your_hash
LOG_LEVEL=INFO
```

### Frontend (.env)
```
VITE_RECAPTCHA_SITE_KEY=your_site_key
VITE_API_BASE_URL=https://api.golfphysics.io (optional)
```

### Admin Dashboard (.env)
```
VITE_GOOGLE_CLIENT_ID=your_client_id
VITE_API_BASE_URL=https://api.golfphysics.io (optional)
```

---

## Risk Assessment

### Single Points of Failure
1. **WeatherAPI.com** - No fallback weather provider
2. **SendGrid** - No backup email service
3. **Railway** - Entire infrastructure on one platform

### Recommendations
- Consider adding a backup weather API (e.g., OpenWeatherMap)
- Set up email failover (e.g., AWS SES as backup)
- Document Railway migration path to AWS/GCP if needed

---

## Change Log

| Date | Change | Added By |
|------|--------|----------|
| 2026-01-21 | Initial documentation created | Claude |
