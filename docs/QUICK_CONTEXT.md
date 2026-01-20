# Golf Physics API - Quick Context

Quick reference for developers working on this project.

## Environments & URLs

### Production
- **API:** https://api.golfphysics.io
- **Website:** https://www.golfphysics.io
- **Status:** Live, serving customers

### Staging
- **API:** https://staging.golfphysics.io (internal testing)
- **Railway:** golf-weather-api-staging.up.railway.app
- **Status:** Testing environment

**Both auto-deploy from `main` branch** - same code, different environment variables

## Key Files

### API (FastAPI)
- `app/main.py` - Application entry point
- `app/services/physics.py` - Core physics engine
- `app/middleware/authentication.py` - API key validation
- `app/routers/` - API endpoints

### Website (React)
- `golfphysics-website/src/pages/` - Page components
- `golfphysics-website/src/pages/Docs.jsx` - API documentation
- `golfphysics-website/src/pages/Enterprise.jsx` - Enterprise info

### Documentation
- `docs/PHYSICS_VALIDATION.md` - Physics validation guide
- `docs/DNS_SETUP_GUIDE.md` - DNS configuration
- `docs/ENVIRONMENT_CHECKLIST.md` - Deployment checklist
- `VALIDATION_LOG.md` - External validation history

## URL Guidelines

**Customer-facing code (Docs.jsx, Enterprise.jsx, README):**
- Use only `api.golfphysics.io` (production)
- Never expose Railway staging URLs

**Internal testing (Phase 8, test scripts):**
- Can use staging URLs
- Mark clearly as "INTERNAL TESTING ONLY"

## Physics Engine

- TrackMan-calibrated wind effects
- +1.2% per 1000ft altitude
- Air density via ideal gas law
- Crosswind drift: `wind_mph × 1.3 × (carry/100)`

## Contact

- Email: golfphysicsio@gmail.com
- GitHub: https://github.com/golfphysicsio/golf-weather-api
