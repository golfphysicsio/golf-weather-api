# Production Changes Summary - v2.0.0

**Deployment Date:** January 18, 2026

---

## API Changes

### Professional API

**Physics Engine:**
- Now uses pure physics (no empirical override)
- Both drag AND lift use relative airspeed (v_rel)
- Shows realistic lift loss at extreme tailwinds
- At 65mph tailwind: Physics shows -20 yards (lift loss dominates)

**Validation Caps:**
- Wind: 0-40 mph (was: 0-60 mph)
- Temperature: 32-105°F (was: -20 to 120°F)
- Altitude: 0-8,000 ft (was: 0-12,000 ft)
- Rejects unrealistic inputs with 422 error

**Best For:**
- Launch monitor integration
- Club fitting applications
- Coaching and training tools
- Serious golf simulation

### Gaming API

**Physics Handling:**
- 0-40 mph: Pure physics (same as Professional)
- 40-100 mph: Smart capping (+30% maximum boost)
- 100+ mph: "Surfing physics" regime

**Presets (9 modes, was 10):**

| Preset | Conditions | Expected Result |
|--------|-----------|-----------------|
| `calm_day` | 3mph, 72°F | Baseline |
| `hurricane_hero` | 65mph tailwind | ~350 yards |
| `arctic_assault` | -15°F, 30mph headwind | Short + cold |
| `desert_inferno` | 115°F, 3500ft | Hot + high |
| `sweet_spot_tailwind` | 35mph tailwind | ~290 yards (optimal) |
| `monsoon_madness` | 45mph variable | Challenging |
| `mountain_challenge` | 8500ft elevation | Thin air boost |
| `polar_vortex` | -25°F, 40mph headwind | Extreme cold |
| `dust_bowl` | 95°F, dry | Hot plains |
| `wind_surfer` | 150mph tailwind | ~450 yards (surfing) |

**Removed Presets:**
- `tornado_alley` (85mph) - Physics unrealistic
- `typhoon_terror` (95mph) - Same reason

**Added Presets:**
- `sweet_spot_tailwind` - 35mph optimal physics
- `wind_surfer` - 150mph surfing physics

---

## Website Changes

### New Pages
- **Professional API** - Dedicated page with validation caps explanation
- **Gaming API** - Dedicated page with 9 game modes showcase
- **Science** - Lift Paradox explanation with physics formulas
- **About** - Company/product information

### Updated Pages
- **Homepage** - Dual-market positioning (Professional + Gaming)
- **Pricing** - Dual tiers with clear differentiation
- **Documentation** - Extended with Gaming API docs
- **Contact** - Interest selector (Professional vs Gaming)

### Key Website Changes
- Changed "500-yard drives" to "450-yard drives" (realistic with physics)
- Changed "10 game modes" to "9 game modes"
- Added Lift Paradox explanation on Science page
- Added validation caps information on Professional page

---

## Documentation Changes

### New Files
- `docs/PHYSICS_VALIDATION.md` - Reviewer-approved validation table v2
- `CHANGELOG.md` - Full version history with migration guide

### Updated Files
- `golf-weather-api-spec.md` - Added Model Limitations section

### Key Documentation Improvements
- **Model simplifications** clearly stated
- **Distance definitions** (carry vs total)
- **"What We Can Claim"** guidelines
- **Precision statements** (±3-5 yards variance)
- **Domain justification** for 40mph cap

---

## Breaking Changes

### Professional API Breaking Changes

**1. Wind Speed Cap Reduced:**
```python
# OLD: Accepted up to 60mph
POST /api/v1/calculate
{"conditions_override": {"wind_speed": 65}}
# Result: Calculated with empirical override (~383 yards)

# NEW: Rejects winds >40mph
POST /api/v1/calculate
{"conditions_override": {"wind_speed": 65}}
# Result: 422 Validation Error
```

**2. Temperature Range Tightened:**
- Old: -20°F to 120°F
- New: 32°F to 105°F (playable conditions only)

**3. Altitude Cap Reduced:**
- Old: 0-12,000 ft
- New: 0-8,000 ft (realistic golf courses only)

### Gaming API Changes (Non-Breaking)
- Presets reduced from 10 to 9
- New presets added for physics-accurate gameplay
- Same endpoint structure, different preset names

---

## Migration Guide

### For Professional API Users

**If using winds >40mph:**
```python
# Migration Option 1: Use Gaming API
# Change endpoint from Professional to Gaming
POST /api/v1/gaming/trajectory
{"preset": "hurricane_hero"}  # 65mph tailwind

# Migration Option 2: Stay within caps
# Reduce wind speed to valid range
POST /api/v1/calculate
{"conditions_override": {"wind_speed": 40}}
```

**If using temperatures outside 32-105°F:**
```python
# Use Gaming API for extreme temperatures
POST /api/v1/gaming/trajectory
{"preset": "polar_vortex"}  # -25°F
```

### For Gaming API Users

**If using removed presets:**
```python
# OLD: tornado_alley (85mph)
# NEW: Use hurricane_hero (65mph) or wind_surfer (150mph)

# OLD: typhoon_terror (95mph)
# NEW: Use hurricane_hero (65mph) or wind_surfer (150mph)
```

---

## Physics Changes Explained

### The Lift Paradox

**Why extreme tailwinds can reduce distance:**

Both aerodynamic forces use relative airspeed:
```
F_drag = ½ρv²_rel × C_D × A
F_lift = ½ρv²_rel × C_L × A

Where: v_rel = ball_speed - wind_component
```

At 65mph tailwind with 167mph ball speed:
- Relative airspeed: 102mph (61% of ball speed)
- Dynamic pressure: ~37% of calm conditions
- Lift drops significantly → Ball falls sooner
- **Net effect:** Distance DECREASES

**Professional API behavior:**
- Shows realistic physics (lift loss at high tailwinds)
- Caps at 40mph to stay in valid model domain

**Gaming API behavior:**
- Caps benefit at +30% for winds 40-100mph
- Allows "surfing physics" at 100+ mph (entertainment mode)

---

## API Response Differences

### Same Conditions, Different APIs

**35mph Tailwind (Below 40mph cap):**
```
Professional: +18.8 yards (pure physics)
Gaming:       +18.8 yards (same - within normal range)
```

**65mph Tailwind (Above Professional cap):**
```
Professional: 422 VALIDATION ERROR
Gaming:       +80.4 yards (capped at +30%)
```

**150mph Tailwind (Surfing regime):**
```
Professional: 422 VALIDATION ERROR
Gaming:       +174.4 yards (surfing physics)
```

---

## Version Comparison

| Feature | v1.5.0 | v2.0.0 |
|---------|--------|--------|
| Physics Engine | Empirical override | Pure physics (Pro) / Smart capping (Gaming) |
| Wind Cap (Pro) | 60mph | 40mph |
| Temp Range (Pro) | -20 to 120°F | 32 to 105°F |
| Altitude Cap (Pro) | 12,000ft | 8,000ft |
| Gaming Presets | 10 | 9 |
| Lift Paradox | Not shown | Correctly modeled |
| Documentation | Basic | Comprehensive with limitations |

---

## Testing Checklist

### Professional API Tests
- [ ] Calm baseline: ~268-272 yards
- [ ] 35mph tailwind: ~289-310 yards
- [ ] 40mph accepted (no error)
- [ ] 50mph rejected (422 error)
- [ ] 110°F rejected (422 error)
- [ ] 9000ft rejected (422 error)

### Gaming API Tests
- [ ] Hurricane Hero (65mph): ~350 yards
- [ ] Wind Surfer (150mph): ~450 yards
- [ ] Sweet Spot Tailwind (35mph): ~290 yards
- [ ] All 9 presets accessible

### Website Tests
- [ ] Homepage loads with dual-market hero
- [ ] Professional API page shows validation caps
- [ ] Gaming API page shows 9 modes
- [ ] Science page has Lift Paradox section
- [ ] Pricing shows dual tiers
- [ ] No broken links

---

**END OF PRODUCTION CHANGES SUMMARY**
