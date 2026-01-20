# Golf Physics API

Physics-based golf ball flight simulation API calibrated against TrackMan benchmarks.

## URLs

**Production:**
- Website: https://www.golfphysics.io
- API: https://api.golfphysics.io
- API Docs: https://api.golfphysics.io/docs

**Staging (Internal):**
- API: https://staging.golfphysics.io
- API Docs: https://staging.golfphysics.io/docs

## Features

- **Professional API:** Tour-accurate physics simulation for launch monitors and golf apps
- **Gaming API:** Extreme weather presets with handicap-adjusted difficulty
- **Real-time weather:** Location-based conditions using live weather data

## Quick Start

```bash
curl -X POST "https://api.golfphysics.io/api/v1/calculate" \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "shot": {
      "ball_speed_mph": 150,
      "launch_angle_deg": 12,
      "spin_rate_rpm": 2500
    },
    "conditions": {
      "temperature_f": 72,
      "wind_speed_mph": 10,
      "wind_direction_deg": 0
    }
  }'
```

## Documentation

- [API Documentation](https://api.golfphysics.io/docs)
- [Physics Validation Guide](docs/PHYSICS_VALIDATION.md)
- [DNS Setup Guide](docs/DNS_SETUP_GUIDE.md)
- [Environment Checklist](docs/ENVIRONMENT_CHECKLIST.md)

## Contact

- Website: https://www.golfphysics.io
- Email: golfphysicsio@gmail.com
