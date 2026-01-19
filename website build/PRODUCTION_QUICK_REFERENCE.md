# Production Quick Reference

**Last Updated:** January 18, 2026

## URLs

| Environment | URL |
|-------------|-----|
| Production API | https://golf-weather-api-production.up.railway.app |
| Staging API | https://golf-weather-api-staging.up.railway.app |
| Docs | https://golf-weather-api-staging.up.railway.app/docs |
| Railway Dashboard | https://railway.app |

## Key Endpoints

### Professional API
```
POST /api/v1/calculate
Header: X-API-Key: <key>
```
- Wind capped at 40mph
- Temp range: 32-105°F
- Altitude cap: 8,000 ft

### Gaming API
```
POST /api/v1/gaming/trajectory
Header: X-API-Key: <key>
```
- Wind up to 150mph
- Temp range: -40 to 130°F
- Altitude up to 15,000 ft

### Health Check
```
GET /api/v1/health
```
No auth required.

## Validation Ranges

| Parameter | Professional | Gaming |
|-----------|-------------|--------|
| Wind | 0-40 mph | 0-150 mph |
| Temperature | 32-105°F | -40 to 130°F |
| Altitude | 0-8,000 ft | -100 to 15,000 ft |

## Game Modes (10 Total)

| Preset | Wind | Temp | Alt | Expected |
|--------|------|------|-----|----------|
| calm_day | 3mph | 72°F | 0 | ~255 yd |
| hurricane_hero | 65mph | 85°F | 500ft | ~332 yd |
| arctic_assault | 30mph HW | -15°F | 0 | Short |
| desert_inferno | 3mph | 115°F | 3500ft | ~272 yd |
| sweet_spot_tailwind | 35mph TW | 75°F | 0 | ~290 yd |
| monsoon_madness | 45mph | 80°F | 0 | ~303 yd |
| mountain_challenge | 5mph | 65°F | 8500ft | ~303 yd |
| polar_vortex | 40mph HW | -25°F | 0 | ~60 yd |
| dust_bowl | 10mph | 95°F | 2000ft | ~286 yd |
| wind_surfer | 150mph TW | 85°F | 1000ft | ~482 yd |

## API Keys

| Key | Purpose |
|-----|---------|
| APIKEY_INRANGE_PROD | Production client |
| APIKEY_INRANGE_TEST | Test client |
| APIKEY_ADMIN | Admin operations |

## Monitoring Commands

```bash
# Health check
curl https://golf-weather-api-production.up.railway.app/api/v1/health

# Check version
curl https://golf-weather-api-production.up.railway.app/

# Test 50mph rejection (should return 422)
curl -X POST https://golf-weather-api-production.up.railway.app/api/v1/calculate \
  -H "X-API-Key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"ball_speed":167,"launch_angle":11.2,"spin_rate":2600,"conditions_override":{"wind_speed":50,"wind_direction":0,"temperature":70,"altitude":0,"humidity":50,"air_pressure":29.92}}'
```

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 401 | Missing/Invalid API key |
| 422 | Validation error (caps exceeded) |
| 429 | Rate limit exceeded |
| 500 | Server error |

## Support

1. Check `/api/v1/health` first
2. Review `PRODUCTION_DEPLOYMENT_FINAL.md`
3. Consult `docs/PHYSICS_VALIDATION.md` for accuracy questions
4. Check Railway dashboard for logs

## Current Version

- **API Version:** 1.0.6
- **Physics Engine:** Lift Paradox corrected
- **Gaming Presets:** 10 modes
- **Validation:** Professional caps enforced
