# Golf Physics Professional API - External Validation Request V3

**Date:** 2026-01-20
**Test File:** `professional_api_test_v3.csv` (50 scenarios)
**Reference Guide:** `PHYSICS_VALIDATION_GUIDE_V2.md`

---

## Purpose

We are requesting independent validation of our golf ball flight physics engine against established industry benchmarks. Your expertise in golf physics will help ensure our API produces results consistent with real-world ball behavior as documented by TrackMan, Titleist R&D, and USGA research.

---

## Test Data Overview

The test file contains **50 shot scenarios** across:

| Category | Scenarios | Description |
|----------|-----------|-------------|
| **Baseline** | 5 | Reference shots at standard conditions (70°F, 50% RH, sea level, no wind) |
| **Desert** | 8 | Phoenix/Scottsdale: hot, dry, moderate altitude |
| **Coastal** | 7 | Pebble Beach/Torrey Pines: cool, humid, windy |
| **Mountain** | 7 | Colorado/Utah: high altitude (5,000-7,000 ft) |
| **Southeast** | 6 | Florida/Georgia: hot, very humid, sea level |
| **Midwest** | 5 | Variable conditions, moderate climate |
| **Links** | 5 | British Isles style: cool, very windy |
| **Extreme** | 7 | Boundary conditions for stress testing |

**Handicap Distribution:**
- Low (0-8): 20 scenarios
- Mid (9-18): 16 scenarios
- High (19+): 14 scenarios

---

## Validation Tasks

### Task 1: Wind Effect Benchmarking (HIGH PRIORITY)

Compare our wind effects against **TrackMan published benchmarks**:

**Driver Headwind (wind_direction = 0°):**
| Wind Speed | Expected Effect | Tolerance |
|------------|-----------------|-----------|
| 5 mph | -5% | ±1 ppt |
| 10 mph | -10% | ±1 ppt |
| 15 mph | -16% | ±1 ppt |
| 20 mph | -22% | ±1 ppt |
| 25 mph | -28% | ±2 ppt |

**Driver Tailwind (wind_direction = 180°):**
| Wind Speed | Expected Effect | Tolerance |
|------------|-----------------|-----------|
| 5 mph | +3.5% | ±1 ppt |
| 10 mph | +7% | ±1 ppt |
| 15 mph | +10% | ±1.5 ppt |
| 20 mph | +12% | ±2 ppt |

**Critical Asymmetry Check:** Headwind hurts approximately 1.5× more than tailwind helps at equivalent speeds. This is well-documented in TrackMan data.

**Crosswind Drift Formula:**
```
lateral_drift_yards = wind_speed_mph × 1.3 × (baseline_carry_yards / 100)
```

### Task 2: Altitude Effect Verification

Verify the altitude multiplier matches **TrackMan/Titleist/USGA consensus**:

```
distance_multiplier = 1.0 + (altitude_ft / 1000) × 0.012
```

| Altitude | Expected Effect |
|----------|-----------------|
| 1,000 ft | +1.2% |
| 3,000 ft | +3.6% |
| 5,280 ft (Denver) | +6.3% |
| 7,000 ft | +8.4% |

**Note:** This is an empirical multiplier applied after trajectory simulation. It is intentionally separate from air density physics because:
1. Pressure values in test data are **sea-level adjusted** (what weather apps show)
2. The +1.2%/1000ft formula is the consensus from multiple independent studies
3. This prevents double-counting altitude effects

### Task 3: Density Effect Validation

Verify temperature/humidity/pressure effects through air density:

**Temperature (cold = shorter, hot = longer):**
- 40°F: approximately -2.5% vs 70°F baseline
- 100°F: approximately +2% vs 70°F baseline

**Humidity (humid = slightly longer - counterintuitive but correct):**
- Water vapor is lighter than N₂/O₂
- Effect is small: ~0.3-0.5% at extreme humidity

**Pressure (low pressure = longer):**
- Effect through density only, ~0.3-0.5% per 0.5 inHg deviation

### Task 4: Combined Effects Verification

For scenarios with multiple weather factors, verify:
1. Effects compound **multiplicatively** (not additively)
2. Combined results are physically reasonable
3. No individual factor is double-counted

---

## Validation Methodology

For each scenario, please compute:

1. **Baseline carry at reference conditions** (verify matches `baseline_carry_yards`)
2. **Weather adjustment percentage** from baseline to expected
3. **Comparison against benchmarks** (TrackMan tables)
4. **Lateral drift** (if crosswind present)

### Suggested Annotated CSV Columns

| Column | Description |
|--------|-------------|
| `computed_density_kg_m3` | Air density at given conditions |
| `density_pct_vs_baseline` | % change from 1.194 kg/m³ |
| `wind_head_component_mph` | wind × cos(direction) |
| `wind_cross_component_mph` | wind × sin(direction) |
| `altitude_multiplier` | 1 + (altitude/1000) × 0.012 |
| `expected_carry_pct_change` | (expected - baseline) / baseline × 100 |
| `benchmark_comparison` | PASS/FAIL vs TrackMan |
| `drift_calculated_yards` | crosswind × 1.3 × (baseline/100) |
| `drift_error_yards` | calculated - expected |

---

## Physics Integrity Guidelines

Please apply these principles when evaluating:

### DO validate:
- Wind effects match TrackMan within stated tolerances
- Altitude effect follows +1.2%/1000ft consensus
- Density effects are directionally correct (cold=shorter, humid=longer)
- Asymmetry exists (headwind hurts more than tailwind helps)
- Crosswind drift uses the documented formula
- Combined effects are multiplicative

### DO NOT:
- Penalize for using sea-level adjusted pressure
- Expect altitude to affect density (handled by empirical multiplier)
- Require exact match to any single study (research varies ±5%)
- Flag humidity effects as "too small" (they ARE small)

### Tolerances:
- Use the `tolerance_yards` column for pass/fail determination
- Stricter benchmark checks (±1 ppt) are for wind calibration rows
- Combined scenarios have larger tolerances due to compounding

---

## Deliverables Requested

1. **Annotated CSV** with computed values and PASS/FAIL flags
2. **Summary Report** covering:
   - Wind benchmark alignment (TrackMan)
   - Altitude effect validation
   - Density effect direction/magnitude
   - Any anomalies or concerns
3. **Recommendations** for any physics calibration adjustments

---

## Reference Sources

For benchmark comparisons, we calibrate against:

| Source | Data Used |
|--------|-----------|
| **TrackMan** | Wind effects (head/tail/cross), tour player baselines |
| **Titleist R&D** | Altitude effects, ball aerodynamics |
| **USGA** | Ball specifications, altitude research |
| **Thermodynamics** | Air density calculation (ideal gas law) |

---

## Questions?

Contact: golfphysicsio@gmail.com

Thank you for your expertise in validating our physics engine!
