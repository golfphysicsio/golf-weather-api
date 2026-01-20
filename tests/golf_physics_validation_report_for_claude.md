# Golf Physics Validation — Test Data Review (for Claude)
Generated: 2026-01-20

## Files reviewed
- `PHYSICS_VALIDATION_GUIDE.md` (model description + validation guidance)
- `physics_validation_test_data.csv` (100 scenarios)
- `physics_validation_test_data_annotated.csv` (derived metrics generated during review)

## Executive summary (what to fix first)
1. **Your CSV is strong for wind + altitude regression checks, but weak for air-density validation.** There are **0 density-only rows** (wind=0, altitude=0, env≠baseline), so you cannot isolate temperature/humidity/pressure effects from wind/altitude.
2. **The guide’s stated ‘standard density’ is inconsistent with the guide’s stated standard conditions.** Using the guide’s own formula at 70°F / 50% RH / 29.92 inHg produces **~1.194 kg/m³**, not 1.225 kg/m³. This will cause confusion and/or silent calibration drift if used as an expected reference.
3. **Pressure-at-altitude looks like sea-level-adjusted pressure, not station pressure.** Many rows at 3,000–7,000 ft still show ~29 inHg, which is far too high if interpreted as station pressure. That makes it impossible to validate ‘density vs psychrometric charts at altitude’ unless pressure semantics are clarified.
4. **At least one wind direction is internally inconsistent (Shot 65).** Notes claim quartering *headwind* using cos(45), but wind_direction_deg=225° implies a quartering *tailwind* under the guide convention (0=headwind, 180=tailwind, 90=L→R).
5. **Crosswind drift is not validated at all.** Only 2 crosswind-direction rows exist and the file does not include an expected lateral drift column, even though the guide provides a drift formula.

## Dataset coverage snapshot
- Total scenarios: **100**
- Baseline rows (70°F, 50% RH, 29.92 inHg, sea level, no wind): **19**
- Wind-only rows at baseline env (alt=0, wind_dir in {0,180}): **12**
- Altitude-only rows at baseline temp/humidity (wind=0, altitude>0): **1**
- Density-only candidates (wind=0, alt=0, env differs from baseline): **0**
- Crosswind-direction rows (90° or 270°): **2**
- Quartering-wind rows (directions other than 0/90/180/270): **9**

## 1) Air density validation (psychrometrics)
### 1.1 Equation form is appropriate
The guide uses a standard humid-air density formulation: ρ = p_d/(R_d·T) + e/(R_v·T), with vapor pressure from a Magnus-type saturation equation. This is the correct general approach for moist air density under typical atmospheric conditions.
### 1.2 Baseline density mismatch (critical documentation issue)
The guide’s **standard reference conditions** are 70°F, 29.92 inHg, 50% RH, sea level — but it states **air density = 1.225 kg/m³**.
Using the guide’s own formula, the computed density at those conditions is:
- **ρ(70°F, 50% RH, 29.92 inHg) = 1.1939 kg/m³**
Recommendation:
- Update the guide to either (A) use a baseline density consistent with 70°F, or (B) change the reference temperature to match a 1.225 kg/m³ baseline.
### 1.3 Pressure semantics must be clarified (station vs sea-level adjusted)
There are **16** rows at ≥3,000 ft with pressure ≥28.5 inHg. If this is meant as **station pressure**, densities will be too high and altitude density reduction will be understated.
Recommendation:
- Decide and document what `air_pressure_inhg` means:
  - **Station pressure** (true local barometric pressure at elevation), or
  - **Sea-level pressure** (altimeter setting / meteorological sea-level adjustment).
- If you want true psychrometric/physics validation at altitude, you need station pressure (or compute station pressure from sea-level pressure + altitude).
### 1.4 Density range present in the CSV (based on provided temp/RH/pressure)
Across the file, computed densities range from **1.060 to 1.296 kg/m³** (ratio **0.888–1.085** vs the file’s baseline conditions).
Lowest-density examples:
| shot_id | rho_kg_m3 | rho_ratio_vs_70F_50pct_29.92 | temperature_f | humidity_pct | air_pressure_inhg | altitude_ft |
|---|---|---|---|---|---|---|
| 84 | 1.060 | 0.888 | 105 | 90 | 28.950 | 7000 |
| 44 | 1.077 | 0.902 | 100 | 90 | 29.050 | 6500 |
| 11 | 1.081 | 0.906 | 100 | 85 | 29.120 | 6000 |
| 35 | 1.085 | 0.909 | 100 | 85 | 29.220 | 5500 |
| 88 | 1.085 | 0.909 | 102 | 92 | 29.420 | 4800 |
Highest-density examples:
| shot_id | rho_kg_m3 | rho_ratio_vs_70F_50pct_29.92 | temperature_f | humidity_pct | air_pressure_inhg | altitude_ft |
|---|---|---|---|---|---|---|
| 85 | 1.296 | 1.085 | 35 | 25 | 30.200 | 0 |
| 36 | 1.282 | 1.073 | 40 | 25 | 30.180 | 0 |
| 61 | 1.280 | 1.072 | 40 | 25 | 30.150 | 0 |
| 7 | 1.280 | 1.072 | 40 | 30 | 30.150 | 0 |
| 76 | 1.274 | 1.067 | 42 | 28 | 30.120 | 0 |
**Important limitation:** despite having a wide density range, the CSV does **not** contain density-only isolation cases (wind=0, altitude=0, env≠baseline), so you cannot validate whether the algorithm converts density changes into distance changes correctly.

## 2) Drag & lift equations (correctness vs the guide)
- The guide’s drag equation form **F_drag = ½ ρ A C_d v²** is standard.
- The guide’s lift equation form **F_lift = ½ ρ A C_l v²** is also standard for coefficient-based lift modeling.
- The coefficient models (linear in spin parameter with caps) are *reasonable simplifications* for an app, but they are fundamentally **calibration choices**, not strict physics constants.

## 3) Altitude scaling factor (1.2% per 1,000 ft)
### 3.1 The CSV supports the stated altitude multiplier
The file contains multiple rows where `weather_adjusted_carry_yards` is extremely close to:
`baseline_carry_yards * (1 + altitude_ft/1000 * 0.012)`
Example (Shot 86): 3,000 ft → expected +3.6%; observed is ~+3.46% due to rounding.
### 3.2 Avoid double counting altitude
If you later change `air_pressure_inhg` to be station pressure, and your density model uses that pressure, then applying the **separate altitude distance multiplier** may double-count altitude effects.
Recommendation:
- Either treat altitude effect purely empirically (multiplier) and keep pressure as sea-level adjusted, **or** treat altitude via physics (station pressure + density) and reduce/disable the empirical multiplier (or recalibrate it).

## 4) Wind effect magnitudes, direction convention, and asymmetry
### 4.1 Magnitudes match the guide’s benchmark rows
Wind-only baseline-environment rows consistently match the guide’s benchmark percentages (e.g., 10 mph tailwind ≈ +7%, 20 mph headwind ≈ -22%, 25 mph headwind ≈ -28%).
### 4.2 Direction convention issue (Shot 65)
The guide defines wind directions as: 0° headwind, 180° tailwind, 90° L→R. Under this convention:
- Shot 65 has wind_speed=6 mph, wind_direction=225°
- That decomposes to wind_head=-4.24 mph (negative = tailwind), wind_cross=-4.24 mph
But the notes describe it as a **quartering headwind** using cos(45). This is inconsistent and should be corrected to prevent sign bugs.
### 4.3 Crosswind drift is not validated by this dataset
The guide provides a crosswind lateral drift approximation, but the CSV does not include any expected lateral output. Only 2 crosswind-direction rows exist and they only validate 'minimal carry effect'.
Recommendation:
- Add `expected_lateral_drift_yards` (and/or `expected_lateral_at_land_yards`) so crosswind behavior can be regression-tested.

## 5) Temperature effect through density changes
### 5.1 The CSV does not contain temperature-only isolation cases
There are **0** rows with (wind=0, altitude=0) where only temperature changes from baseline. This makes it impossible to validate temperature→density→distance behavior cleanly.
### 5.2 The guide references shots 3 vs 4 as a temperature-only comparison, but the CSV does not isolate temperature
In the CSV:
- Shot 3 includes wind=15 mph headwind (not temp-only)
- Shot 4 includes altitude=5000 ft and also changes humidity/pressure (not temp-only)
Recommendation:
- Add new explicit temperature-only rows (same pressure, same RH, no wind, sea level) and update the guide to reference those rows.
### 5.3 Evidence of inconsistent additive temperature heuristics
For wind=0 rows, when you remove the pure altitude multiplier, the remaining residual shows temperature-like add-ons in some 'hot' cases:
| temp_note_label | count | mean | std | min | max |
|---|---|---|---|---|---|
| none | 21 | 0.007 | 0.138 | -0.360 | 0.500 |
| warm/hot | 9 | 4.172 | 2.292 | 0.248 | 8.220 |
Top examples where adjusted carry exceeds the altitude-only prediction:
| shot_id | club | altitude_ft | temperature_f | weather_adjusted_carry_yards | pred_alt_only | residual_vs_alt_only_yards |
|---|---|---|---|---|---|---|
| 84 | driver | 7000 | 105 | 328 | 319.78 | 8.220 |
| 95 | 9-iron | 3800 | 94 | 144 | 138.02 | 5.981 |
| 88 | 7-iron | 4800 | 102 | 166 | 160.76 | 5.245 |
| 58 | 7-iron | 3500 | 95 | 135 | 130.25 | 4.750 |
| 22 | driver | 4000 | 95 | 254 | 249.42 | 4.576 |
| 50 | 3-wood | 4500 | 95 | 198 | 194.99 | 3.010 |
| 44 | driver | 6500 | 100 | 213 | 210.21 | 2.790 |
| 79 | 3-wood | 5800 | 98 | 222 | 219.27 | 2.732 |
Interpretation:
- Some rows appear to add extra yards beyond the altitude multiplier when notes mention hot/warm conditions, but other hot rows do not. If the actual algorithm is meant to apply temperature only through density, the test data should not mix in inconsistent additive temperature yard adjustments.

## 6) Combined multi-factor scenarios
The guide recommends compounding effects (e.g., altitude multiplier × wind multiplier) rather than simple addition. The CSV mixes narrative notes that look additive (e.g., 'Warm (+3)') with multiplicative behavior (altitude %).
Recommendation:
- Decide whether temperature/humidity/pressure impacts are purely physics-driven (via density) or partly heuristic (explicit yard add-ons). Then ensure every combined scenario is generated consistently from that model.

## 7) Concrete improvements to the CSV (so it can validate the physics, not just the heuristics)
### High priority
1. **Add a Density Validation block** (wind=0, altitude=0) with temperature-only, humidity-only, pressure-only sweeps for at least 3 clubs (driver, mid-iron, wedge).
2. **Fix wind direction inconsistencies** (at minimum Shot 65) and consider adding explicit `wind_head_mph` / `wind_cross_mph` columns to remove ambiguity.
3. **Clarify `air_pressure_inhg`** (station vs sea-level adjusted) and align altitude handling accordingly.
### Medium priority
4. Add crosswind drift expected outputs and more crosswind speeds/directions.
5. Add acceptance tolerances per scenario (e.g., ±2 yards carry normal conditions; larger in extreme winds).
### Low priority
6. Add `scenario_type` tags (baseline, wind_only, altitude_only, density_only, combined).
7. Store expected carry with decimals or provide rounding rules to avoid false failures from integer rounding.

## 8) Suggested ‘V2’ test suite outline (minimal, high-value)
1. **Density-only (wind=0, alt=0):**
   - Temps: 40°F, 70°F, 100°F at fixed RH=50%, pressure=29.92
   - RH: 20%, 50%, 90% at fixed temp=70°F, pressure=29.92
   - Pressure: 29.40, 29.92, 30.30 inHg at fixed temp=70°F, RH=50%
2. **Wind vector sanity:**
   - Head/tail/cross + quartering at the same wind speed (e.g., 15 mph) to validate decomposition and sign convention
3. **Crosswind drift:**
   - Add expected lateral drift outputs and validate against the guide’s drift approximation
4. **Interactions:**
   - A small set of 8–12 multi-factor cases (cold+headwind+low pressure, hot+tailwind+altitude, etc.) generated consistently from the implemented model

## Appendix: Where to look in the annotated CSV
The annotated CSV includes computed: `rho_kg_m3`, `rho_ratio_vs_70F_50pct_29.92`, `wind_head_mph`, and `wind_cross_mph`. Use these columns to quickly spot sign issues and density/pressure inconsistencies.
