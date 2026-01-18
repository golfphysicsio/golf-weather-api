# Changelog

All notable changes to the Golf Weather Physics API will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-01-18

### Changed
- **Physics Engine Split:** Professional vs Gaming APIs now handle physics differently
  - Professional API: Pure physics simulation, no empirical overrides
  - Gaming API: Smart capping for extreme conditions (entertainment-focused)
- **Professional API Validation Caps:**
  - Wind: 0-40 mph (was: 0-60 mph)
  - Temperature: 32-105°F (was: -20 to 120°F)
  - Altitude: 0-8,000 ft (was: 0-12,000 ft)
- **Gaming API Wind Handling:**
  - 0-40 mph: Pure physics (same as Professional)
  - 40-100 mph: Smart capping (+30% maximum boost)
  - 100+ mph: "Surfing physics" regime (wind exceeds ball speed)

### Added
- **New Gaming Presets:**
  - `sweet_spot_tailwind` - 35mph optimal physics (peak drag reduction with minimal lift loss)
  - `wind_surfer` - 150mph hurricane tailwind (surfing physics regime)
- **Physics Documentation:**
  - `docs/PHYSICS_VALIDATION.md` - Reviewer-approved validation table
  - Model simplifications section
  - "What We Can Claim" guidelines
  - Distance definitions (carry vs total)
- **Website Pages:**
  - Professional API dedicated page with validation caps explanation
  - Gaming API dedicated page with 9 game modes
  - Science page with "Lift Paradox" explanation
  - Dual-market positioning (Professional + Gaming)

### Removed
- **Gaming Presets:**
  - `tornado_alley` (85mph) - Physics unrealistic at this wind speed
  - `typhoon_terror` (95mph) - Same reason

### Fixed
- **Critical Physics Bug:** Empirical wind formula was overriding correct physics simulation
  - At 65mph tailwind: Old API returned +115 yards (empirical override)
  - At 65mph tailwind: Physics shows -20 yards (lift loss dominates)
  - Professional API now correctly shows lift loss at extreme tailwinds
- **Lift Force Calculation:** Both drag AND lift now correctly use relative airspeed
  - `v_rel = ball_speed - wind_speed` (in wind direction)
  - At high tailwinds, lift drops because dynamic pressure drops

### Technical Details

#### The Lift Paradox
Both aerodynamic forces use relative airspeed:
```
F_drag = ½ρv²_rel × C_D × A
F_lift = ½ρv²_rel × C_L × A
```

At 65mph tailwind with 167mph ball speed:
- Relative airspeed: 102mph (61% of ball speed)
- Dynamic pressure: ~37% of calm conditions
- Lift drops faster than drag, ball drops sooner

#### API Type Parameter
The `calculate_impact_breakdown()` function now accepts `api_type`:
- `api_type="professional"` - Pure physics, realistic caps
- `api_type="gaming"` - Smart capping for entertainment

### Migration Guide

**If you were using Professional API with winds >40mph:**
```python
# Old: Would calculate with empirical override
POST /api/v1/calculate
{"conditions_override": {"wind_speed": 65}}
# Result: ~383 yards (incorrect)

# New: Returns 422 validation error
# Response: {"detail": "wind_speed must be <= 40"}

# Migration: Use Gaming API for extreme conditions
POST /api/v1/gaming/trajectory
{"preset": "hurricane_hero"}  # 65mph tailwind
# Result: ~352 yards (capped at +30% boost)
```

### Breaking Changes

- Professional API now rejects wind speeds >40mph with 422 error
- Professional API now rejects temperatures outside 32-105°F
- Professional API now rejects altitudes >8,000ft
- Gaming presets reduced from 10 to 9 (removed 2, added 2)

---

## [1.5.0] - 2026-01-15

### Added
- Gaming API endpoints (`/api/v1/gaming/*`)
- Handicap-based gameplay (no launch monitor required)
- Weather presets for entertainment venues
- Dual-unit responses (yards + meters)

### Changed
- Improved wind effect calculations
- Updated altitude physics formula

---

## [1.0.0] - 2025-12-01

### Added
- Initial release
- Professional trajectory calculation
- Weather condition fetching
- Location-based calculations
- Course database (50+ courses)
