# Golf Physics API - Validation Guide for Physics Review

## Overview

The Golf Physics Professional API calculates how environmental conditions affect golf ball flight. It uses a numerical physics simulation calibrated against industry benchmark data (TrackMan, Titleist R&D, USGA).

This document explains the physics models, assumptions, and calibrations used, along with guidance on what aspects can be validated.

---

## 1. Core Physics Model

### 1.1 Trajectory Calculation Method

The API uses **Euler method numerical integration** to simulate ball flight:

- **Time step**: 0.01 seconds (100 Hz)
- **Termination**: When ball returns to ground (y ≤ 0) or timeout (15 seconds)
- **Coordinate system**: x = downrange, y = vertical (up), z = lateral

### 1.2 Ball Constants (USGA Specifications)

| Constant | Value | Notes |
|----------|-------|-------|
| Ball mass | 0.04593 kg | 1.62 oz maximum |
| Ball diameter | 0.04267 m | 1.68 inches minimum |
| Ball cross-sectional area | 1.432 × 10⁻³ m² | πr² |

### 1.3 Forces Modeled

The simulation accounts for three forces acting on the ball:

**1. Gravity**
```
F_gravity = m × g
g = 9.81 m/s²
```

**2. Drag Force**
```
F_drag = ½ × ρ × A × C_d × v²

Where:
  ρ = air density (kg/m³)
  A = ball cross-sectional area (m²)
  C_d = drag coefficient (dimensionless)
  v = velocity relative to air (m/s)
```

**3. Lift Force (Magnus Effect)**
```
F_lift = ½ × ρ × A × C_l × v²

Where:
  C_l = lift coefficient (dimensionless)

Lift direction determined by spin axis:
  - Backspin (axis = 0°): Vertical lift
  - Sidespin (axis = ±90°): Lateral force
```

---

## 2. Coefficient Models

### 2.1 Drag Coefficient (C_d)

The drag coefficient varies with the spin parameter (ratio of ball surface speed to ball speed):

```
spin_parameter = (ω × r × 2π) / v

Where:
  ω = spin rate (rev/s)
  r = ball radius (m)
  v = ball speed (m/s)

C_d = 0.25 + 0.1 × spin_parameter
C_d capped at 0.50
```

**Typical values**: 0.25 - 0.35 for golf balls

### 2.2 Lift Coefficient (C_l)

```
C_l = 0.15 + 0.2 × spin_parameter
C_l capped at 0.40
```

**Physics basis**: Higher spin creates stronger Magnus effect, generating more lift.

---

## 3. Air Density Calculation

Air density is calculated using the ideal gas law with humidity correction:

```
ρ = (p_d / (R_d × T)) + (e / (R_v × T))

Where:
  p_d = partial pressure of dry air (Pa)
  e = partial pressure of water vapor (Pa)
  R_d = 287.05 J/(kg·K) - gas constant for dry air
  R_v = 461.495 J/(kg·K) - gas constant for water vapor
  T = temperature (Kelvin)
```

### 3.1 Vapor Pressure (Magnus Formula)
```
e_s = 6.1078 × 10^((7.5 × T_c) / (T_c + 237.3)) × 100 Pa
e = (humidity% / 100) × e_s
```

### 3.2 Standard Reference Conditions
- Temperature: 70°F (21.1°C)
- Pressure: 29.92 inHg (1013.25 hPa)
- Humidity: 50%
- Altitude: Sea level
- Air density: 1.225 kg/m³

---

## 4. Environmental Effects

### 4.1 Temperature Effect

**Physics**: Higher temperature → lower air density → less drag → more distance

**Mechanism**: Calculated through air density changes in the drag/lift equations.

**Expected magnitude**: ~1 yard per 10°F deviation from 70°F (for a 150-yard shot)

### 4.2 Humidity Effect

**Physics**: Higher humidity → lower air density (water vapor is lighter than N₂/O₂)

**Counterintuitive result**: Humid air is LESS dense than dry air, so humid conditions slightly increase distance.

**Expected magnitude**: Very small (~0.5-1 yard per 40% humidity change)

### 4.3 Altitude Effect

**Physics**: Higher altitude → lower pressure → lower air density → less drag

**Empirical calibration used**: The pure physics model over-predicts altitude effects. Industry data shows:

| Altitude | Actual Density Reduction | Distance Gain |
|----------|-------------------------|---------------|
| 5,280 ft (Denver) | ~20% | ~6% |
| 1,000 ft | ~4% | ~1.2% |

**Formula applied**:
```
distance_multiplier = 1.0 + (altitude_ft / 1000) × 0.012
```

This empirical factor (1.2% per 1,000 ft) matches TrackMan, Titleist, and USGA published benchmarks.

### 4.4 Wind Effect

**Physics simulation**: Wind modifies the relative velocity between ball and air:
```
v_relative_x = v_ball_x + v_headwind
v_relative_z = v_ball_z - v_crosswind
```

The drag force scales with v² (relative), so wind has a quadratic effect on drag.

**Empirical calibration**: The physics simulation under-predicts wind effects because it doesn't fully capture:
- Turbulence and boundary layer interactions
- Ball deformation under wind load
- Full flight envelope effects

**Scaling factors applied** (calibrated to TrackMan data):
- Headwind: 1.5× physics result
- Tailwind: 1.8× physics result

**TrackMan benchmark data**:
| Wind Condition | Distance Effect |
|----------------|-----------------|
| 10 mph headwind | -10% (~1.0% per mph) |
| 20 mph headwind | -22% (~1.1% per mph, accelerating) |
| 10 mph tailwind | +7% (~0.7% per mph) |
| 20 mph tailwind | +12% (~0.6% per mph, decelerating) |

**Key insight**: Headwind hurts ~1.5× more than tailwind helps (asymmetric effect).

### 4.5 Crosswind Effect

```
lateral_drift = crosswind_mph × 1.3 × (carry_yards / 100)
```

Example: 10 mph crosswind on 200-yard shot → ~26 yards lateral drift

---

## 5. Roll Calculation

Roll distance is estimated from landing angle:
```
roll_factor = max(0.05, 0.15 - (landing_angle - 40) × 0.003)
roll_yards = carry_yards × roll_factor
```

- Steeper landing (wedges) → less roll (~5%)
- Shallower landing (driver) → more roll (~15%)

---

## 6. Professional API vs Gaming API

The test data is generated for the **Professional API**, which uses:

- **Pure physics simulation** for all conditions
- **Industry-calibrated empirical corrections** for altitude and wind
- **No artificial caps** on effects (realistic physics, not gameplay-balanced)

The Gaming API uses additional caps for extreme weather (100+ mph winds, etc.) to maintain playable game mechanics.

---

## 7. What Can Be Validated

### 7.1 Directly Verifiable Physics

| Aspect | Validation Method |
|--------|-------------------|
| Air density calculation | Compare against published psychrometric charts |
| Drag equation | F = ½ρAC_d v² is standard aerodynamics |
| Lift equation | F = ½ρAC_l v² is standard aerodynamics |
| Magnus effect direction | Backspin creates lift, sidespin creates curve |
| Numerical integration | Euler method convergence can be verified |
| Gravity effect | Standard g = 9.81 m/s² |

### 7.2 Calibration Points to Verify

| Calibration | Expected Value | Source |
|-------------|----------------|--------|
| Altitude effect | 1.2% per 1,000 ft | TrackMan, USGA, Titleist |
| Temperature effect | ~1 yd per 10°F per 150 yd | Industry consensus |
| Headwind effect | ~1% per mph | TrackMan data |
| Tailwind effect | ~0.7% per mph | TrackMan data |
| Headwind/tailwind asymmetry | ~1.5:1 ratio | Aerodynamic theory + data |
| Humidity effect | Small, positive | Thermodynamics (water vapor lighter) |

### 7.3 Ball Flight Characteristics to Check

| Characteristic | Expected Behavior |
|----------------|-------------------|
| Higher spin → higher apex | Magnus lift increases |
| Higher spin → shorter carry (for drivers) | Increased drag from spin |
| Lower launch + lower spin → lower apex | Less lift, flatter trajectory |
| High altitude → longer carry | Reduced air density |
| Cold temperature → shorter carry | Increased air density |
| Strong headwind → much shorter carry | Quadratic drag penalty |
| Strong tailwind → moderately longer carry | Reduced relative velocity |

### 7.4 Specific Test Scenarios

**Baseline Tests (shots 1, 9, 12, 15, 17, 19, 25, etc.)**
- Zero wind, 70°F, sea level, 50% humidity
- These should match pure physics simulation
- Validates the trajectory equations in isolation

**Temperature-Only Tests (compare shots with different temps, same wind)**
- Example: Shot 3 (55°F) vs Shot 4 (95°F)
- Isolates temperature effect through density change

**Altitude-Only Tests (e.g., Shot 86)**
- Same conditions except altitude = 3,000 ft
- Should show ~3.6% distance gain (3 × 1.2%)

**Wind Scaling Tests (e.g., Shots 83, 87)**
- Strong headwind (25 mph): Should show ~25-30% distance loss
- Strong tailwind (25 mph): Should show ~15-18% distance gain
- Asymmetry should be approximately 1.5:1

**Combined Effects Tests**
- Multiple factors compound (not simply add)
- High altitude + warm + tailwind = maximum distance
- Low altitude + cold + headwind = minimum distance

---

## 8. Known Limitations

1. **Roll estimation is simplified** - actual roll depends on turf conditions, landing surface firmness, ball construction

2. **Wind profile is uniform** - real wind varies with altitude (wind shear not modeled)

3. **Ball construction not modeled** - assumes standard tour-quality ball aerodynamics

4. **No weather changes during flight** - conditions assumed constant for the ~5-7 second flight

5. **Spin decay not modeled** - spin rate assumed constant (in reality, spin decays ~10-20% during flight)

---

## 9. Test Data File Structure

The `physics_validation_test_data.csv` file contains 100 shots with:

| Column | Description |
|--------|-------------|
| shot_id | Unique identifier (1-100) |
| handicap_category | low (0-9), mid (10-18), high (19+) |
| handicap | Specific handicap value |
| club | driver, 3-wood, 5-iron, 7-iron, 9-iron, PW |
| ball_speed_mph | Initial ball speed |
| launch_angle_deg | Launch angle above horizontal |
| spin_rate_rpm | Backspin rate |
| spin_axis_deg | Spin axis tilt (0 = pure backspin) |
| baseline_carry_yards | Carry at standard conditions (70°F, sea level, no wind) |
| temperature_f | Temperature in Fahrenheit |
| humidity_pct | Relative humidity percentage |
| wind_speed_mph | Wind speed |
| wind_direction_deg | 0° = headwind, 180° = tailwind, 90° = L→R |
| altitude_ft | Elevation above sea level |
| air_pressure_inhg | Barometric pressure |
| weather_adjusted_carry_yards | Final carry with all effects applied |
| adjustment_yards | Net change from baseline |
| notes | Explanation of key factors |

---

## 10. Contact

For questions about the physics implementation or test data:
- API Documentation: https://www.golfphysics.io/docs
- Technical Support: golfphysicsio@gmail.com
