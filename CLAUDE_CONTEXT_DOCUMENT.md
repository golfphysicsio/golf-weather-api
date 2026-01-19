# Golf Physics API - Complete Project Overview

**Last Updated:** January 18, 2026
**Purpose:** Comprehensive context document for new Claude sessions

---

## 1. Project Summary

Golf Physics API is a B2B REST API that calculates how weather conditions affect golf ball flight. It serves two markets:

1. **Professional API** - Tour-accurate physics for launch monitors, coaching apps, club fitters (realistic conditions: 0-40mph wind, 32-105°F, 0-8000ft altitude)
2. **Gaming API** - Extreme weather modes for entertainment venues like Topgolf (extreme conditions: 0-150mph wind, -40 to 130°F, up to 15,000ft altitude)

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         DOMAINS                                  │
├─────────────────────────────────────────────────────────────────┤
│  golfphysics.io        → forwards to www.golfphysics.io         │
│  www.golfphysics.io    → Railway (website + API)                │
│  api.golfphysics.io    → Railway (API only)                     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RAILWAY DEPLOYMENT                            │
├─────────────────────────────────────────────────────────────────┤
│  Production: golf-weather-api-production.up.railway.app         │
│  Staging:    golf-weather-api-staging.up.railway.app            │
│                                                                  │
│  Services:                                                       │
│  ├── FastAPI Application (Python 3.11)                          │
│  ├── PostgreSQL Database                                         │
│  └── Redis (rate limiting, caching)                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Directory Structure

```
GolfWeatherAPI/
├── app/                          # Main FastAPI application
│   ├── main.py                   # App entry point, middleware, routes
│   ├── config.py                 # Settings from environment variables
│   ├── database.py               # SQLAlchemy async setup
│   ├── redis_client.py           # Redis connection
│   ├── routers/
│   │   ├── trajectory.py         # POST /api/v1/calculate
│   │   ├── conditions.py         # GET /api/v1/conditions
│   │   ├── gaming.py             # POST /api/v1/gaming/trajectory
│   │   ├── health.py             # GET /api/v1/health
│   │   ├── admin.py              # Admin API endpoints
│   │   ├── admin_dashboard.py    # Admin dashboard API
│   │   ├── api_key_requests.py   # POST /api/request-api-key
│   │   └── contact.py            # POST /api/contact
│   ├── services/
│   │   ├── physics.py            # Core physics engine
│   │   ├── weather.py            # Weather data fetching
│   │   ├── gaming_physics.py     # Gaming mode calculations
│   │   └── email.py              # SendGrid email service
│   ├── models/
│   │   └── database.py           # SQLAlchemy models
│   ├── middleware/
│   │   ├── authentication.py     # API key validation
│   │   ├── rate_limiting.py      # Redis-based rate limits
│   │   ├── security.py           # Security headers
│   │   ├── errors.py             # Error handlers
│   │   └── logging_config.py     # Structured logging
│   └── utils/
│       └── recaptcha.py          # reCAPTCHA v3 verification
├── golfphysics-website/          # React marketing website (source)
│   ├── src/
│   │   ├── pages/                # Home, Contact, Pricing, etc.
│   │   ├── components/           # Navigation, Footer, modals
│   │   └── index.css             # Tailwind CSS styles
│   └── dist/                     # Built website
├── website-dist/                 # Deployed website (copied from above)
├── admin-dashboard-dist/         # React admin dashboard (built)
├── tests/                        # Test suites
└── docs/                         # Documentation
```

---

## 4. API Endpoints

### Professional API

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/calculate` | POST | API Key | Calculate trajectory with weather effects |
| `/api/v1/conditions` | GET | API Key | Get current weather for location |
| `/api/v1/health` | GET | None | Health check |

**Calculate Request:**
```json
{
  "ball_speed": 167,        // mph
  "launch_angle": 11.2,     // degrees
  "spin_rate": 2600,        // rpm
  "spin_axis": 0,           // degrees (optional)
  "location": {
    "lat": 33.749,
    "lng": -84.388
  },
  "conditions_override": {   // optional - override weather
    "temperature": 70,       // °F
    "wind_speed": 10,        // mph
    "wind_direction": 180,   // degrees
    "humidity": 50,          // %
    "altitude": 1000,        // feet
    "air_pressure": 29.92    // inHg
  }
}
```

**Validation Caps (Professional):**
- Wind: 0-40 mph
- Temperature: 32-105°F
- Altitude: 0-8,000 ft

### Gaming API

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/gaming/trajectory` | POST | API Key | Calculate with extreme conditions |
| `/api/v1/gaming/presets` | GET | None | List available game modes |
| `/api/v1/gaming/clubs` | GET | None | List valid clubs |

**Gaming Request:**
```json
{
  "shot": {
    "player_handicap": 15,   // 0-36
    "club": "driver"         // driver, 3wood, 5iron, etc.
  },
  "preset": "hurricane_hero" // or custom conditions
}
```

**Gaming Presets (10 total):**
| Preset | Wind | Temp | Altitude | Expected |
|--------|------|------|----------|----------|
| calm_day | 3mph | 72°F | 0 | ~255 yd |
| hurricane_hero | 65mph TW | 85°F | 500ft | ~332 yd |
| arctic_assault | 30mph HW | -15°F | 0 | Short |
| desert_inferno | 3mph | 115°F | 3500ft | ~272 yd |
| sweet_spot_tailwind | 35mph TW | 75°F | 0 | ~290 yd |
| monsoon_madness | 45mph | 80°F | 0 | ~303 yd |
| mountain_challenge | 5mph | 65°F | 8500ft | ~303 yd |
| polar_vortex | 40mph HW | -25°F | 0 | ~60 yd |
| dust_bowl | 10mph | 95°F | 2000ft | ~286 yd |
| wind_surfer | 150mph TW | 85°F | 1000ft | ~482 yd |

**Validation Caps (Gaming):**
- Wind: 0-150 mph
- Temperature: -40 to 130°F
- Altitude: -100 to 15,000 ft

### Public Endpoints (No Auth)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/request-api-key` | POST | Request new API key |
| `/api/contact` | POST | Contact form submission |
| `/api/v1/health` | GET | Health check |

---

## 5. Physics Engine

### Core Algorithm (`app/services/physics.py`)

The physics engine uses a 6-DOF (six degrees of freedom) trajectory simulation:

**Key Physics Factors:**

1. **Air Density** - Calculated from temperature, pressure, humidity, altitude
   ```
   ρ = (P × M) / (R × T) × (1 - 0.378 × e/P)
   where e = vapor pressure from humidity
   ```

2. **Drag Force** - Uses relative airspeed (ball speed through air, not ground)
   ```
   F_drag = ½ρ × v²_rel × C_D × A
   ```

3. **Lift Force** - Magnus effect from spin (also uses relative airspeed)
   ```
   F_lift = ½ρ × v²_rel × C_L × A
   ```

4. **Wind Effects** - Vector decomposition into headwind/tailwind/crosswind
   - Headwind: Increases relative airspeed → more drag, more lift
   - Tailwind: Decreases relative airspeed → less drag, BUT ALSO less lift (the "lift paradox")

5. **Temperature Effects**
   - Air density changes (~1% per 10°F)
   - Ball compression in cold (<50°F reduces COR)

6. **Altitude Effects**
   - ~1.2% distance increase per 1,000ft (empirically validated)
   - Reduced air density = less drag

**Validation:**
- Benchmarked against TrackMan data
- Within ±2% accuracy for normal conditions
- PGA Tour average (167mph ball speed, 11.2° launch, 2600rpm): ~271 yards

### Gaming Physics (`app/services/gaming_physics.py`)

Uses the same core physics but:
- Accepts handicap-based input (generates realistic ball flight from handicap + club)
- Allows extreme conditions beyond tournament limits
- Applies smart capping to prevent unrealistic results

---

## 6. Database Schema

### PostgreSQL Tables

```sql
-- API Keys (from automated signup)
CREATE TABLE api_keys (
    id SERIAL PRIMARY KEY,
    client_id VARCHAR(50) UNIQUE NOT NULL,
    key_hash VARCHAR(64) NOT NULL,        -- SHA256 hash
    tier VARCHAR(20) DEFAULT 'developer', -- free, developer, professional, enterprise
    is_active BOOLEAN DEFAULT TRUE,
    name VARCHAR(255),
    email VARCHAR(255),
    company VARCHAR(255),
    use_case VARCHAR(255),
    expected_volume VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',  -- active, replaced, revoked
    created_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE
);

-- Leads (from signup and contact forms)
CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    source VARCHAR(50) NOT NULL,          -- 'api_key_request', 'contact_form'
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    use_case VARCHAR(255),
    subject VARCHAR(500),
    message TEXT,
    is_high_value BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(50) DEFAULT 'new',     -- new, contacted, qualified, converted
    api_key_id INTEGER REFERENCES api_keys(id),
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE
);

-- Admin API Keys (manually created, separate from user keys)
CREATE TABLE admin_api_keys (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(100) UNIQUE NOT NULL,
    key_hash VARCHAR(64) NOT NULL,
    tier VARCHAR(20) DEFAULT 'standard',
    rate_limit_per_minute INTEGER DEFAULT 60,
    rate_limit_per_day INTEGER DEFAULT 10000,
    status VARCHAR(20) DEFAULT 'active',
    requests_today INTEGER DEFAULT 0,
    total_requests INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE
);

-- Request Logs (for analytics)
CREATE TABLE admin_request_logs (
    id SERIAL PRIMARY KEY,
    api_key_id INTEGER,
    client_name VARCHAR(100),
    endpoint VARCHAR(100),
    method VARCHAR(10),
    status_code INTEGER,
    latency_ms FLOAT,
    request_ip VARCHAR(50),
    user_agent VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 7. Authentication System

### API Key Flow

1. **Generation**: `golf_{secrets.token_urlsafe(32)}`
2. **Storage**: SHA256 hash stored in database
3. **Validation**:
   - Check `X-API-Key` header
   - Hash provided key
   - Compare against `admin_api_keys` table (manual keys) and `api_keys` table (automated signup)

### Public Paths (no auth required)
```python
PUBLIC_PATHS = [
    "/", "/docs", "/redoc", "/openapi.json",
    "/api/v1/health", "/admin", "/assets", "/vite.svg",
    "/api/request-api-key", "/api/contact",
    "/api/v1/gaming/presets", "/api/v1/gaming/clubs"
]
# Also: any path not starting with /api/ or /v1/
```

### Duplicate Key Handling
When someone requests an API key with an email that already has one:
1. Old key is deactivated (`is_active=False`, `status='replaced'`)
2. New key is generated
3. "Reissue" email sent with original creation date and warning

---

## 8. Email System

### SendGrid Integration (`app/services/email.py`)

**Email Types:**
1. `send_api_key_email()` - Welcome email with new API key
2. `send_api_key_reissue_email()` - Reissued key (replaces old one)
3. `send_contact_confirmation()` - Contact form confirmation
4. `send_admin_notification()` - Admin alert for new leads

**High-Value Lead Detection:**
- Company name provided
- Use case: launch_monitor, tournament, golf_course
- Volume: 10k_100k or over_100k
- Email domain: trackman, topgolf, garmin, etc.
- Contact keywords: enterprise, partnership, 100k, million

---

## 9. Rate Limiting

Redis-based rate limiting per API key:

| Tier | Per Minute | Per Day |
|------|------------|---------|
| Free/Developer | 60 | 1,000 |
| Standard | 60 | 10,000 |
| Professional | 120 | 25,000 |
| Enterprise | Custom | Custom |

---

## 10. Environment Variables

### Required for Production

```bash
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/db

# Redis
REDIS_URL=redis://default:pass@host:6379

# API Keys (legacy, now in database)
APIKEY_INRANGE=sha256_hash
APIKEY_ADMIN=sha256_hash

# Email (SendGrid)
SENDGRID_API_KEY=SG.xxxxx
FROM_EMAIL=noreply@golfphysics.io
REPLY_TO_EMAIL=golfphysicsio@gmail.com
ADMIN_EMAIL=golfphysicsio@gmail.com

# URLs
BACKEND_URL=https://api.golfphysics.io
FRONTEND_URL=https://www.golfphysics.io

# reCAPTCHA
RECAPTCHA_SITE_KEY=6Led2k4sAAAAAJCGLAJKqUl6MGLi0xbFhIXnBN4L
RECAPTCHA_SECRET_KEY=6Led2k4sAAAAAIn-FoxKaRXpMBtCnkaWNdePk_yq

# Weather API
WEATHER_API_KEY=openweathermap_key

# Environment
ENVIRONMENT=production  # or staging, development
```

---

## 11. Website Structure

### Pages (React + Tailwind CSS)
- `/` - Home (dual market positioning)
- `/professional` - Professional API features
- `/gaming` - Gaming API features + 10 game modes
- `/pricing` - Pricing for both APIs
- `/docs` - API documentation
- `/science` - Physics explanation
- `/contact` - Contact form + API key request
- `/about` - Company info

### Key Components
- `Navigation.jsx` - Header with links
- `Footer.jsx` - Footer
- `ApiKeyRequestModal.jsx` - API key signup modal

### Styling
- Tailwind CSS v4
- Custom colors: golf-green, pro-blue, gaming-orange
- Button classes: btn-primary, btn-pro, btn-gaming, etc.

---

## 12. Deployment

### Railway Setup
- **Project**: soothing-happiness
- **Environments**: production, staging
- **Services**: golf-weather-api, PostgreSQL, Redis
- **Auto-deploy**: On push to main branch

### DNS (GoDaddy)
- `api.golfphysics.io` → CNAME → golf-weather-api-production.up.railway.app
- `www.golfphysics.io` → CNAME → oacn52qe.up.railway.app
- `golfphysics.io` → Forward → https://www.golfphysics.io (301)

### Deployment Commands
```bash
# Check status
railway status

# View logs
railway logs

# Link to project
railway link
```

---

## 13. Testing

### Test Files
- `form_endpoint_tests.py` - Tests API key signup and contact forms
- `production_benchmark_test.py` - Tests physics accuracy and validation caps
- `tests/correctness_test_suite.py` - Comprehensive physics tests

### Key Benchmarks
- PGA Tour average (calm): ~271 yards
- Denver altitude (+5280ft): ~287 yards (+6%)
- 35mph tailwind sweet spot: ~290-300 yards
- 150mph wind surfer: ~450-480 yards

---

## 14. Current Status (January 18, 2026)

### Working
- All API endpoints (Professional + Gaming)
- Website at www.golfphysics.io
- API key signup with email delivery
- Contact form with email delivery
- Duplicate key detection with reissue flow
- reCAPTCHA protection
- Rate limiting
- Admin dashboard at /admin

### Known Items
- Version: 1.0.6
- 18/19 benchmark tests passing (1 timeout, not code issue)
- Physics validated within ±2% of TrackMan

---

## 15. Key Code Locations

| Feature | File |
|---------|------|
| Physics engine | `app/services/physics.py` |
| Gaming physics | `app/services/gaming_physics.py` |
| API key signup | `app/routers/api_key_requests.py` |
| Contact form | `app/routers/contact.py` |
| Email templates | `app/services/email.py` |
| Authentication | `app/middleware/authentication.py` |
| Rate limiting | `app/middleware/rate_limiting.py` |
| Trajectory calc | `app/routers/trajectory.py` |
| Gaming endpoint | `app/routers/gaming.py` |
| Database models | `app/models/database.py` |
| Website pages | `golfphysics-website/src/pages/` |

---

## 16. Common Tasks

### Add a new API key manually
```sql
INSERT INTO admin_api_keys (client_name, key_hash, tier, rate_limit_per_minute, rate_limit_per_day, status)
VALUES ('new_client', 'sha256_hash_here', 'professional', 120, 25000, 'active');
```

### Check API health
```bash
curl https://api.golfphysics.io/api/v1/health
```

### Test trajectory calculation
```bash
curl -X POST https://api.golfphysics.io/api/v1/calculate \
  -H "X-API-Key: your_key" \
  -H "Content-Type: application/json" \
  -d '{"ball_speed":167,"launch_angle":11.2,"spin_rate":2600,"location":{"lat":33.749,"lng":-84.388}}'
```

### Rebuild and deploy website
```bash
cd golfphysics-website && npm run build
rm -rf ../website-dist && cp -r dist ../website-dist
git add ../website-dist && git commit -m "Update website" && git push
```

---

## 17. Contact

- **Admin Email**: golfphysicsio@gmail.com
- **Domain**: golfphysics.io
- **GitHub**: github.com/golfphysicsio/golf-weather-api
