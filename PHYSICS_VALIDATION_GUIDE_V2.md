# Golf Physics API - Validation Guide V2

## Version History
| Version | Date | Changes |
|---------|------|---------|
| V2.0 | 2026-01-20 | Fixed baseline density (1.194), clarified pressure semantics, added density-only tests, added crosswind validation, added scenario types |
| V1.0 | 2026-01-19 | Initial release |

---

## 1. Overview

The Golf Physics Professional API calculates how environmental conditions affect golf ball flight using numerical physics simulation calibrated against industry benchmark data (TrackMan, Titleist R&D, USGA).

**Key Design Principles:**
- Physics-based trajectory simulation using aerodynamic equations
- Empirically calibrated to match real-world golf ball behavior
- Validated against TrackMan professional tour data

---

## 2. Reference Conditions (Baseline)

All calculations compare against these standard reference conditions:

| Parameter | Value | Notes |
|-----------|-------|-------|
| Temperature | 70°F (21.1°C) | Typical comfortable playing weather |
| Relative Humidity | 50% | Moderate humidity |
| Barometric Pressure | 29.92 inHg | Standard sea-level pressure |
| Altitude | 0 ft (sea level) | Reference elevation |
| Wind | 0 mph | Calm conditions |
| **Air Density** | **1.194 kg/m³** | Calculated at reference conditions |

**Important:** The baseline air density of 1.194 kg/m³ is computed using the ideal gas law at 70°F/50%RH/29.92 inHg. This differs from the ISA standard atmosphere (1.225 kg/m³ at 59°F/15°C) because we use 70°F as our reference temperature for golfer familiarity.

---

## 3. Pressure Semantics (CRITICAL)

### 3.1 Sea-Level Adjusted Pressure

**All pressure values in test data and API inputs use SEA-LEVEL ADJUSTED pressure** (also called "altimeter setting" or "barometric pressure" in weather reports).

This means:
- A weather report showing 29.92 inHg in Denver (5,280 ft) is sea-level adjusted
- The actual station pressure at Denver is ~24.6 inHg
- Users input what they see on weather apps/reports (sea-level adjusted)
- The API internally handles altitude effects via the empirical multiplier

### 3.2 Why Sea-Level Adjusted?
1. **User familiarity**: Weather apps/reports show sea-level adjusted pressure
2. **Simplicity**: Users don't need to know their exact station pressure
3. **Consistency**: Pressure values are comparable across locations
4. **Separation of concerns**: Altitude effect is handled by dedicated multiplier

### 3.3 Altitude Effect Handling

The altitude distance effect is applied as an **empirical multiplier**, NOT through pressure/density physics:

```
distance_multiplier = 1.0 + (altitude_ft / 1000) × 0.012
```

This approach:
- Matches TrackMan/Titleist/USGA published data: **+1.2% per 1,000 ft**
- Avoids double-counting (pressure density + empirical multiplier)
- Produces accurate results across all tested altitude ranges

---

## 4. Core Physics Model

### 4.1 Trajectory Calculation

**Method:** Euler numerical integration
- Time step: 0.01 seconds (100 Hz)
- Simulation ends when ball returns to ground or 15 seconds elapsed

**Coordinate System:**
- x = downrange (toward target)
- y = vertical (up)
- z = lateral (positive = right of target)

### 4.2 Ball Constants (USGA Specifications)

| Constant | Value | Notes |
|----------|-------|-------|
| Ball mass | 0.04593 kg | 1.62 oz maximum |
| Ball diameter | 0.04267 m | 1.68 inches minimum |
| Cross-sectional area | 1.432 × 10⁻³ m² | πr² |

### 4.3 Forces Modeled

**1. Gravity**
```
F_gravity = m × g
where g = 9.81 m/s²
```

**2. Drag Force (air resistance)**
```
F_drag = ½ × ρ × A × C_d × v_rel²

where:
  ρ = air density (kg/m³)
  A = ball cross-sectional area (m²)
  C_d = drag coefficient
  v_rel = velocity relative to air (m/s)
```

**3. Lift Force (Magnus Effect)**
```
F_lift = ½ × ρ × A × C_l × v_rel²

where:
  C_l = lift coefficient

Lift direction:
  - Backspin (axis = 0°): creates vertical lift
  - Sidespin (axis = ±90°): creates lateral force
```

### 4.4 Coefficient Models

**Drag Coefficient (C_d):**
```
spin_parameter = (ω × r × 2π) / v
C_d = 0.25 + 0.1 × spin_parameter
C_d capped at 0.50
```

**Lift Coefficient (C_l):**
```
C_l = 0.15 + 0.2 × spin_parameter
C_l capped at 0.40
```

---

## 5. Air Density Calculation

Air density is calculated using the ideal gas law with humidity correction:

```
ρ = (p_d / (R_d × T)) + (e / (R_v × T))

where:
  p_d = partial pressure of dry air (Pa)
  e = partial pressure of water vapor (Pa)
  R_d = 287.05 J/(kg·K) - gas constant for dry air
  R_v = 461.495 J/(kg·K) - gas constant for water vapor
  T = temperature (Kelvin)
```

**Vapor Pressure (Magnus Formula):**
```
e_s = 6.1078 × 10^((7.5 × T_c) / (T_c + 237.3)) × 100 Pa
e = (humidity% / 100) × e_s
```

---

## 6. Environmental Effects Summary

### 6.1 Temperature Effect

| Condition | Density Change | Distance Effect |
|-----------|----------------|-----------------|
| 40°F (cold) | +8% density | -2.5% carry |
| 55°F (cool) | +3% density | -1% carry |
| 70°F (baseline) | 0% | 0% |
| 85°F (warm) | -3% density | +1% carry |
| 100°F (hot) | -6% density | +2% carry |

**Physics:** Cold air is denser → more drag → shorter distance

### 6.2 Humidity Effect

| Condition | Density Change | Distance Effect |
|-----------|----------------|-----------------|
| 20% RH (dry) | +0.3% density | -0.3% carry |
| 50% RH (baseline) | 0% | 0% |
| 80% RH (humid) | -0.3% density | +0.3% carry |
| 95% RH (very humid) | -0.5% density | +0.5% carry |

**Physics:** Water vapor (H₂O, MW=18) is lighter than N₂ (MW=28) and O₂ (MW=32), so humid air is LESS dense → slightly more distance. This is counterintuitive but physically correct.

### 6.3 Pressure Effect (at sea level)

| Condition | Density Change | Distance Effect |
|-----------|----------------|-----------------|
| 29.40 inHg (low) | -1.7% density | +0.7% carry |
| 29.92 inHg (baseline) | 0% | 0% |
| 30.40 inHg (high) | +1.6% density | -0.7% carry |

**Note:** These are sea-level pressure variations (storm systems, etc.), NOT altitude effects.

### 6.4 Altitude Effect

| Altitude | Distance Effect | Example |
|----------|-----------------|---------|
| 0 ft (sea level) | 0% | Baseline |
| 1,000 ft | +1.2% | +3-4 yards on driver |
| 3,000 ft | +3.6% | +10 yards on driver |
| 5,280 ft (Denver) | +6.3% | +18 yards on driver |
| 7,000 ft | +8.4% | +24 yards on driver |

**Source:** TrackMan, Titleist R&D, USGA research - consistent +1.2% per 1,000 ft

### 6.5 Wind Effects (TrackMan Benchmarks)

**Headwind (wind direction = 0°):**
| Speed | Effect | Notes |
|-------|--------|-------|
| 5 mph | -5% | Linear region |
| 10 mph | -10% | ~1% per mph |
| 15 mph | -16% | Accelerating effect |
| 20 mph | -22% | ~1.2% per mph above 10 |
| 25 mph | -28% | Severe penalty |

**Tailwind (wind direction = 180°):**
| Speed | Effect | Notes |
|-------|--------|-------|
| 5 mph | +3.5% | Linear region |
| 10 mph | +7% | ~0.7% per mph |
| 15 mph | +10% | Diminishing returns |
| 20 mph | +12% | ~0.5% per mph above 10 |
| 25 mph | +12.5% | Capped at diminishing returns |

**Critical Insight:** Headwind hurts ~1.5× more than tailwind helps (asymmetric effect)

**Crosswind (90° = L→R, 270° = R→L):**
```
lateral_drift_yards = wind_mph × 1.3 × (carry_yards / 100)
```

Example: 10 mph crosswind on 282-yard drive → 36.7 yards lateral drift

### 6.6 Quartering Wind Decomposition

Wind direction convention (golfer's perspective, ball traveling toward 0°):
- 0° = pure headwind
- 90° = crosswind from left (blows ball right)
- 180° = pure tailwind
- 270° = crosswind from right (blows ball left)

For quartering winds:
```
headwind_component = wind_speed × cos(wind_direction)
crosswind_component = wind_speed × sin(wind_direction)
```

Example: 10 mph wind at 45° (quartering headwind from left)
- Headwind component: 10 × cos(45°) = 7.1 mph → -7% carry
- Crosswind component: 10 × sin(45°) = 7.1 mph → 26 yards drift right

---

## 7. Test Data Structure (V2)

### 7.1 File: `physics_validation_test_data_v2.csv`

| Column | Type | Description |
|--------|------|-------------|
| shot_id | int | Unique identifier (1-100) |
| scenario_type | string | Test category (see below) |
| handicap_category | string | low/mid/high |
| handicap | int | Specific handicap value |
| club | string | driver, 3-wood, 5-iron, 7-iron, 9-iron, PW |
| ball_speed_mph | float | Initial ball speed |
| launch_angle_deg | float | Launch angle above horizontal |
| spin_rate_rpm | int | Backspin rate |
| spin_axis_deg | float | Spin axis tilt (0 = pure backspin) |
| baseline_carry_yards | int | Carry at reference conditions |
| temperature_f | int | Temperature in Fahrenheit |
| humidity_pct | int | Relative humidity percentage |
| wind_speed_mph | int | Wind speed |
| wind_direction_deg | int | Wind direction (0=headwind, 180=tailwind) |
| altitude_ft | int | Elevation above sea level |
| air_pressure_inhg | float | Sea-level adjusted pressure |
| expected_carry_yards | int | Expected carry with all effects |
| expected_lateral_drift_yards | int | Expected lateral drift (+ = right) |
| tolerance_yards | int | Acceptable deviation for pass/fail |
| notes | string | Explanation of test scenario |

### 7.2 Scenario Types

| Type | Description | Count |
|------|-------------|-------|
| baseline | Reference conditions (70°F, 50% RH, 29.92", sea level, no wind) | 13 |
| density_temp | Temperature-only isolation (wind=0, alt=0) | 8 |
| density_humid | Humidity-only isolation | 4 |
| density_pressure | Pressure-only isolation (at sea level) | 4 |
| altitude_only | Altitude-only (wind=0, baseline temp/RH) | 7 |
| wind_head | Pure headwind tests | 9 |
| wind_tail | Pure tailwind tests | 7 |
| wind_cross | Pure crosswind tests (with lateral drift) | 6 |
| wind_quarter | Quartering wind tests | 6 |
| combined | Multi-factor scenarios | 10 |
| extreme | Edge cases and boundaries | 5 |
| asymmetry | Headwind/tailwind asymmetry validation | 4 |
| club_wind | Club-specific wind sensitivity | 4 |
| handicap_comp | Same conditions across handicap levels | 3 |
| real_world | Typical course scenarios | 9 |

---

## 8. Validation Checklist

### 8.1 Density Physics (Section 2-5 in test data)

- [ ] Temperature-only tests show ~0.5-1% per 10°F
- [ ] Humidity-only tests show minimal effect (~0.1-0.3%)
- [ ] Pressure-only tests show ~0.3-0.5% per 0.5 inHg
- [ ] Effects are in correct direction (cold = shorter, humid = longer)

### 8.2 Altitude Effect (Section 5)

- [ ] Altitude-only tests show +1.2% per 1,000 ft
- [ ] Effect is consistent across clubs and handicaps
- [ ] No double-counting with pressure effects

### 8.3 Wind Effects (Section 6-9)

- [ ] Headwind matches TrackMan: -10% at 10 mph, -22% at 20 mph
- [ ] Tailwind matches TrackMan: +7% at 10 mph, +12% at 20 mph
- [ ] Asymmetry verified: headwind hurts ~1.5× more than tailwind helps
- [ ] Crosswind drift formula: wind × 1.3 × (carry/100)
- [ ] Quartering winds decompose correctly (cos/sin components)
- [ ] Wind direction convention is consistent (0=head, 180=tail, 90=L→R)

### 8.4 Combined Scenarios (Section 10)

- [ ] Effects compound multiplicatively
- [ ] Combined predictions match sum of individual effects (within tolerance)

### 8.5 Edge Cases (Section 11)

- [ ] Extreme conditions produce reasonable results
- [ ] No numerical instabilities or overflow

---

## 9. Known Limitations

1. **Simplified roll model** - Roll is estimated from landing angle, not turf conditions
2. **Uniform wind profile** - Wind assumed constant at all altitudes (no wind shear)
3. **Standard ball aerodynamics** - Assumes tour-quality ball, no construction variations
4. **Constant conditions** - Weather assumed constant during 5-7 second flight
5. **No spin decay** - Spin rate assumed constant (actual decay ~10-20%)

---

## 10. Data Sources and Calibration

| Parameter | Source | Confidence |
|-----------|--------|------------|
| Altitude effect (1.2%/1000ft) | TrackMan, Titleist R&D, USGA | High |
| Wind effects (headwind/tailwind) | TrackMan tour data | High |
| Crosswind drift formula | TrackMan | Medium |
| Temperature density effect | Thermodynamics + empirical | Medium |
| Humidity density effect | Thermodynamics | High (small effect) |
| Drag/lift coefficients | Golf ball aerodynamic studies | Medium |

---

## 11. Contact

For questions about the physics implementation or test data:
- API Documentation: https://www.golfphysics.io/docs
- Technical Support: golfphysicsio@gmail.com
