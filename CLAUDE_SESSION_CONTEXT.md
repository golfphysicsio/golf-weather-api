# Golf Physics - Claude Session Context

> **IMPORTANT:** Paste this document at the start of any new Claude Code session to restore full project context.
>
> **Last Updated:** January 21, 2026

---

## Quick Reference

| Item | Value |
|------|-------|
| **Project Owner** | golfphysicsio (golfphysicsio@gmail.com) |
| **GitHub Repo** | https://github.com/golfphysicsio/golf-weather-api |
| **Production API** | https://api.golfphysics.io |
| **Production Website** | https://golfphysics.io |
| **Staging API** | https://golf-weather-api-staging.up.railway.app |
| **Hosting Platform** | Railway.app (project: soothing-happiness) |
| **Domain Registrar** | GoDaddy (golfphysics.io) |

---

## Project Overview

Golf Physics is a B2B SaaS API that provides real-time golf ball trajectory calculations accounting for weather conditions. The physics engine is validated against TrackMan data to within ±2% accuracy.

**Two API Products:**
1. **Professional API** - For launch monitors, coaching apps, club fitters (accurate physics)
2. **Gaming API** - For entertainment venues like Topgolf (extreme weather presets for fun)

**Pricing:** Unified $299/month per facility with volume discounts

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
├─────────────────────────────────────────────────────────────┤
│  golfphysics.io (React/Vite)     │  admin.golfphysics.io   │
│  - Marketing website              │  - Admin dashboard       │
│  - Pricing, docs, contact         │  - Usage analytics       │
│  Source: /golfphysics-website     │  Source: /golf-admin     │
│  Built: /website-dist             │  Built: /admin-dashboard-dist │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND (FastAPI)                       │
├─────────────────────────────────────────────────────────────┤
│  api.golfphysics.io                                         │
│  Source: /app                                               │
│                                                             │
│  Key Endpoints:                                             │
│  - POST /api/v1/calculate - Professional trajectory calc    │
│  - POST /api/v1/gaming/trajectory - Gaming with presets     │
│  - GET  /api/v1/health - Health check                       │
│  - POST /api/request-api-key - API key signup               │
│  - POST /api/contact - Contact form                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       SERVICES                              │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL (Railway)  │  Redis (Railway)  │  WeatherAPI    │
│  - API keys            │  - Rate limiting  │  - Live weather│
│  - Leads/contacts      │  - Caching        │                │
│  - Usage logs          │                   │                │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Directories

```
C:\Users\Vtorr\OneDrive\GolfWeatherAPI\
├── app/                      # FastAPI backend
│   ├── main.py              # App entry point
│   ├── config.py            # Environment settings
│   ├── routers/             # API endpoints
│   ├── services/            # Business logic (weather.py, email.py)
│   └── physics/             # Golf physics engine
├── golfphysics-website/     # React frontend source
│   └── src/pages/           # Page components
├── website-dist/            # Built website (deployed)
├── golf-admin/              # Admin dashboard source
├── admin-dashboard-dist/    # Built admin dashboard (deployed)
├── external_systems/        # External dependencies tracking
├── legal/                   # Legal document templates
├── tests/                   # Test suites
└── docs/                    # Documentation
```

---

## External Services & Credentials

All credentials are stored in **Railway environment variables** (not in code).

| Service | Purpose | Env Variable | Account Email |
|---------|---------|--------------|---------------|
| **Railway** | Hosting | N/A (dashboard login) | golfphysicsio@gmail.com |
| **GitHub** | Code repo | N/A (git credentials) | golfphysicsio@gmail.com |
| **WeatherAPI.com** | Weather data | `WEATHER_API_KEY` | Unknown - check email |
| **SendGrid** | Email delivery | `SENDGRID_API_KEY` | golfphysicsio@gmail.com |
| **Google reCAPTCHA** | Spam protection | `RECAPTCHA_SECRET_KEY` | golfphysicsio@gmail.com |
| **Google OAuth** | Admin login | `GOOGLE_CLIENT_ID` | golfphysicsio@gmail.com |
| **Sentry** | Error tracking | `SENTRY_DSN` | golfphysicsio@gmail.com |
| **GoDaddy** | Domain | N/A (dashboard login) | golfphysicsio@gmail.com |

**Full details:** See `/external_systems/EXTERNAL_DEPENDENCIES.md`

---

## Git Configuration

```
Repository: https://github.com/golfphysicsio/golf-weather-api.git
Branch: main
User: golfphysicsio
Email: golfphysicsio@gmail.com
Remote URL: https://golfphysicsio@github.com/golfphysicsio/golf-weather-api.git
```

**Note:** Remote URL includes explicit username to avoid credential caching issues.

---

## Deployment Process

### Website Changes:
```bash
cd golfphysics-website
npm run build
cp -r dist/* ../website-dist/
cd ../website-dist
git add -A && git commit -m "Description" && git push
# Railway auto-deploys from main branch
```

### Backend Changes:
```bash
# Just commit and push - Railway auto-deploys
git add -A && git commit -m "Description" && git push
```

---

## Environment Variables (Production)

**Backend (.env on Railway):**
```
ENVIRONMENT=production
DATABASE_URL=postgresql+asyncpg://... (auto-provided by Railway)
REDIS_URL=redis://... (auto-provided by Railway)
WEATHER_API_KEY=<from WeatherAPI.com>
SENDGRID_API_KEY=<from SendGrid>
RECAPTCHA_SECRET_KEY=<from Google>
GOOGLE_CLIENT_ID=<from Google Cloud Console>
SENTRY_DSN=<from Sentry>
FROM_EMAIL=noreply@golfphysics.io
REPLY_TO_EMAIL=golfphysicsio@gmail.com
ADMIN_EMAIL=golfphysicsio@gmail.com
BACKEND_URL=https://api.golfphysics.io
FRONTEND_URL=https://golfphysics.io
CORS_ORIGINS=https://golfphysics.io,https://www.golfphysics.io
```

**Frontend (.env):**
```
VITE_RECAPTCHA_SITE_KEY=<from Google>
```

---

## Recent Changes (Session Log)

### January 21, 2026:
1. **Terms of Service** - Added comprehensive 14-section legal protection
   - AS-IS disclaimer, limitation of liability, arbitration clause
   - File: `/golfphysics-website/src/pages/Terms.jsx`

2. **Contact emails** - Changed all to `golfphysicsio@gmail.com`
   - Updated Privacy.jsx, Terms.jsx

3. **Contact page anchor** - Added `#message` hash support
   - `/contact#message` now opens "Send a Message" tab
   - File: `/golfphysics-website/src/pages/Contact.jsx`

4. **External dependencies doc** - Created tracking document
   - File: `/external_systems/EXTERNAL_DEPENDENCIES.md`

5. **Git/GitHub cleanup**
   - Fixed git config: now uses golfphysicsio identity
   - Removed roastedzen-png collaborator access
   - Fixed credential caching issue

---

## Key Contacts

| Role | Email |
|------|-------|
| Admin/Owner | golfphysicsio@gmail.com |
| Support | golfphysicsio@gmail.com |
| Legal | golfphysicsio@gmail.com |

---

## Testing Commands

```bash
# Health check
curl https://api.golfphysics.io/api/v1/health

# Test trajectory calculation
curl -X POST https://api.golfphysics.io/api/v1/calculate \
  -H "Content-Type: application/json" \
  -d '{"ball_speed":167,"launch_angle":11.2,"spin_rate":2600,"conditions_override":{"wind_speed":10,"wind_direction":0,"temperature":75}}'

# Git push test
cd "C:/Users/Vtorr/OneDrive/GolfWeatherAPI" && git push origin main
```

---

## Common Tasks

### Add a new page to website:
1. Create component in `/golfphysics-website/src/pages/`
2. Add route in `/golfphysics-website/src/App.jsx`
3. Add link in Footer.jsx if needed
4. Build and deploy (see Deployment Process)

### Update environment variables:
1. Go to Railway dashboard
2. Select the service
3. Click Variables tab
4. Add/edit variable
5. Railway auto-redeploys

### Check logs:
```bash
# Via Railway CLI (if installed)
railway logs --environment production
```
Or use Railway dashboard → Deployments → View Logs

---

## Important Files to Read First

When starting a new session, these files provide the most context:

1. `/CLAUDE_SESSION_CONTEXT.md` (this file)
2. `/external_systems/EXTERNAL_DEPENDENCIES.md`
3. `/CLAUDE_CONTEXT_DOCUMENT.md` (detailed technical context)
4. `/golfphysics-website/src/App.jsx` (website routes)
5. `/app/main.py` (API entry point)

---

## Notes for Claude

- All commits should include `Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>`
- Update `/external_systems/EXTERNAL_DEPENDENCIES.md` when adding new services
- User prefers no emojis unless requested
- Always test changes before confirming completion
- Use `golfphysicsio@gmail.com` for all contact emails

---

**End of Context Document**
