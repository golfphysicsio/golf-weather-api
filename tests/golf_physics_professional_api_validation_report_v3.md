# Golf Physics Professional API Validation — V3 Dataset Review

**Date:** 2026-01-20  
**Input file:** `professional_api_test_v3.csv` (50 scenarios)  
**Reference docs:** `REVIEWER_VALIDATION_PROMPT_V3.md`, `PHYSICS_VALIDATION_GUIDE_V2.md`

This report validates the **expected outputs in `professional_api_test_v3.csv`** against the benchmark rules and formulas specified in the provided reference docs (wind, altitude, density, drift).  
It produces:
1) an **annotated CSV** with computed columns + PASS/FAIL flags, and  
2) this summary report with benchmark alignment details and recommendations.

---

## Deliverables

- Annotated CSV: `professional_api_test_v3_annotated.csv`
- This report: `golf_physics_professional_api_validation_report_v3.md`
- Plain text version: `golf_physics_professional_api_validation_report_v3.txt`

---

## Executive Summary

### Overall pass rate (against the benchmark formulas in the provided docs)

- **Total scenarios:** 50
- **Overall PASS:** 50/50 (**100.0%**)
- **Carry PASS vs tolerance_yards:** 50/50
- **Crosswind drift PASS:** 50/50  
  - Drift checks applicable in **24** scenarios (any non-zero crosswind component)
- **Wind benchmark PASS (strict calibration rows only):** 8/8

### What this tells me

- The dataset is **internally consistent** with the documented:
  - **TrackMan wind benchmark curve** (as provided)
  - **Crosswind drift formula**
  - **Altitude multiplier** (+1.2% per 1,000 ft)
  - **Density-direction effects** (cold shorter, humid slightly longer, low pressure longer)
- The expected values appear to be generated from a **multiplicative compounding model** (not additive), consistent with the guidance.

---

## Methodology

All comparisons are performed using the formulas/rules described in the provided docs:

### 1) Air density (physics-based)
Air density is computed using the humid-air ideal gas law with Magnus saturation vapor pressure. Baseline density is computed at **70°F / 50% RH / 29.92 inHg** and equals **~1.194 kg/m³**, matching the guide.  

### 2) Wind (TrackMan benchmark curve)
We compute wind head/cross components from direction convention:
- `wind_head_component_mph = wind_speed * cos(direction)`
- `wind_cross_component_mph = wind_speed * sin(direction)`

Then we compute a **benchmark carry %** from the TrackMan benchmark curve (piecewise linear interpolation between table points).

### 3) Crosswind drift
We compute:
`drift_yards = wind_cross_component_mph × 1.3 × (baseline_carry_yards / 100)`

### 4) Altitude (empirical multiplier)
Per the guide: altitude is handled by a separate multiplier:
`altitude_multiplier = 1 + (altitude_ft / 1000) × 0.012`

### 5) Combined effects
We validate combined scenarios by checking that the expected carries are consistent (within `tolerance_yards`) with:
`baseline × altitude_multiplier × temp_mult × humidity_mult × pressure_mult × wind_mult`

---

## Validation Results

### A) Wind benchmarks (TrackMan)

Strict benchmark checks are applied only when:
- club = **driver**
- wind direction is **0° (headwind)** or **180° (tailwind)**
- wind speed is one of the benchmark speeds
- crosswind component is effectively 0

**Strict wind benchmark rows in this dataset:** 8  
**Pass:** 8/8

|   shot_id | scenario_type   | wind_type   |   wind_speed_mph |   baseline_carry_yards |   expected_carry_yards |   implied_wind_pct |   wind_benchmark_target_pct |   wind_benchmark_error_ppt |   wind_benchmark_tolerance_ppt | wind_benchmark_pass   |
|----------:|:----------------|:------------|-----------------:|-----------------------:|-----------------------:|-------------------:|----------------------------:|---------------------------:|-------------------------------:|:----------------------|
|        21 | mountain        | Headwind    |                5 |                    276 |                    279 |             -4.92  |                        -5   |                      0.08  |                              1 | True                  |
|        11 | desert          | Headwind    |               15 |                    220 |                    190 |            -16.346 |                       -16   |                     -0.346 |                              1 | True                  |
|        33 | southeast       | Headwind    |               15 |                    223 |                    188 |            -16.43  |                       -16   |                     -0.43  |                              1 | True                  |
|        15 | coastal         | Headwind    |               20 |                    254 |                    196 |            -22.318 |                       -22   |                     -0.318 |                              1 | True                  |
|        39 | links           | Headwind    |               25 |                    275 |                    196 |            -28.219 |                       -28   |                     -0.219 |                              2 | True                  |
|         7 | desert          | Tailwind    |                5 |                    255 |                    274 |              3.465 |                         3.5 |                     -0.035 |                              1 | True                  |
|        22 | mountain        | Tailwind    |               10 |                    259 |                    299 |              7.312 |                         7   |                      0.312 |                              1 | True                  |
|        47 | extreme         | Tailwind    |               25 |                    275 |                    338 |             14.441 |                        12.5 |                      1.941 |                              2 | True                  |

**Notes:**
- The dataset includes the following *pure driver headwind* benchmark speeds: [5, 12, 15, 20, 22, 25, 30] mph  
  Missing from the standard TrackMan headwind table: [10]
- The dataset includes the following *pure driver tailwind* benchmark speeds: [5, 6, 10, 18, 25] mph  
  Missing from the standard TrackMan tailwind table: [15, 20]

**Asymmetry check (model-level):**
- Using the provided benchmark curves, headwind penalty / tailwind boost is ~1.4× at 5–10 mph and grows at higher winds as tailwind gains diminish.

---

### B) Crosswind drift formula

- Drift checks applicable: **24 scenarios**
- **Max absolute drift error:** 0 yards (after integer rounding)

Result: **All crosswind and quartering-wind scenarios match the drift formula exactly** (the expected drift values are consistent with the documented formula and sign convention).

---

### C) Altitude effect (+1.2% per 1,000 ft)

- Scenarios with altitude > 0 ft: **25**
- Highest altitudes present:
  - 5,280 ft (Denver): multiplier **1.06336** (+6.336%)
  - 7,000 ft: multiplier **1.08400** (+8.400%)

Result: **Altitude scaling matches the documented formula**. No signs of double-counting altitude via pressure (consistent with “pressure is sea-level adjusted” guidance).

---

### D) Density effects (temperature / humidity / pressure)

**Air density range in this dataset:**
- Minimum density: **1.100 kg/m³** (shot_id 44)  
- Maximum density: **1.292 kg/m³** (shot_id 45)

Directionality checks:
- **Cold** conditions increase density and reduce carry (after removing wind/altitude).
- **Humid** conditions slightly reduce density and slightly increase carry (tiny effect).
- **Low pressure** increases carry; **high pressure** decreases carry.

Magnitude checks:
- Effects are on the order of **sub-1%** for realistic humidity/pressure changes, and **~2–3%** for extreme temperature changes, consistent with the guide’s tables.

---

### E) Combined multi-factor scenarios (multiplicative compounding)

Using the benchmark multipliers, the dataset’s expected carries are consistent with **multiplicative compounding** (not additive).

Carry reconstruction error stats (benchmark model vs expected):
- **Max absolute error:** 6 yards
- **Mean error:** -0.08 yards
- **Std dev:** 1.16 yards

Worst-case row(s) by carry reconstruction error:
|   shot_id | scenario_type   | club   |   baseline_carry_yards |   expected_carry_yards |   predicted_carry_yards_bench_round |   carry_error_yards |   tolerance_yards |   wind_speed_mph |   wind_direction_deg |   altitude_ft |   temperature_f |   humidity_pct |   air_pressure_inhg | notes                                            |
|----------:|:----------------|:-------|-----------------------:|-----------------------:|------------------------------------:|--------------------:|------------------:|-----------------:|---------------------:|--------------:|----------------:|---------------:|--------------------:|:-------------------------------------------------|
|        47 | extreme         | driver |                    275 |                    338 |                                 332 |                   6 |                 8 |               25 |                  180 |          5280 |              85 |             50 |               29.92 | Denver + strong tailwind - altitude + wind combo |

Interpretation:
- The largest discrepancy occurs in a **25 mph tailwind** scenario. This wind speed is **beyond the tailwind benchmarks explicitly listed in the request (up to 20 mph)**, so this is best treated as an “edge calibration” row rather than a strict TrackMan check.

---

## Recommendations / Calibration Notes

### 1) Add a direct 20 mph tailwind driver benchmark row
Your request calls out **+12% at 20 mph tailwind** as a key benchmark, but this dataset does not contain a pure-driver 20 mph tailwind scenario. Adding one makes external review easier.

### 2) Decide what you want to do at 25+ mph tailwind
One scenario uses **25 mph tailwind**. TrackMan benchmarks in the request only go up to **20 mph**, and many models assume diminishing returns/capping beyond 20.  
If you want a defined behavior:
- Option A: cap tailwind at ~12–12.5% above ~20–25 mph (diminishing returns)
- Option B: continue increasing slowly (but document the curve explicitly)

### 3) Keep drift computed from baseline carry (as you’re doing)
Your expected drift values match the formula exactly; this is a big win for consistency across clubs and handicap levels.

### 4) Humidity rounding
Humidity effects are legitimately small. If you want reviewers/users to *see* the effect:
- consider keeping internal computations in floats and rounding only at the end
- or expose an “adjustment_pct” field for debugging rather than expecting yard changes to show up at integer resolution

---

## How to use the annotated CSV in Claude Code

Key columns added:

- `computed_density_kg_m3`, `density_pct_vs_baseline`
- `wind_head_component_mph`, `wind_cross_component_mph`
- `wind_benchmark_target_pct`, `implied_wind_pct`, `wind_benchmark_error_ppt`
- `drift_calc_yards`, `drift_calc_yards_round`, `drift_error_yards`, `drift_pass`
- `predicted_carry_yards_bench_round`, `carry_error_yards`, `carry_pass`
- `overall_pass` (logical AND of carry + drift + benchmark checks where applicable)

---

## Bottom line

Based on the benchmark tables and formulas in the provided docs, **`professional_api_test_v3.csv` is consistent and passes all checks**, with the only noteworthy nuance being how you want to define behavior for **25 mph tailwind** (outside the strict tailwind benchmark range in the request).

