# Golf Physics V2 Test Suite Review (Comprehensive)

**Generated:** 2026-01-20  
**Inputs reviewed:**
- `PHYSICS_VALIDATION_GUIDE_V2.md`
- `physics_validation_test_data_v2.csv` (100 scenarios)

**Outputs produced:**
- `physics_validation_test_data_v2_annotated.csv` (adds computed density, wind components, drift checks, etc.)
- This report (Claude-friendly Markdown)

---

## 0) Executive summary (what’s solid vs what still needs work)

### ✅ Strong / “Ready to validate with”
- **Baseline conditions are consistent** across all 13 baseline rows; expected carry matches baseline exactly.
- **Baseline air density = 1.194 kg/m³ at 70°F / 50% RH / 29.92 inHg** is internally consistent with the guide’s density formula.
- **All density isolation tests are truly isolated** (wind=0, altitude=0) for temperature / humidity / pressure.
- **Altitude-only scenarios match the empirical multiplier** of **+1.2% per 1,000 ft** (minor rounding detail in one row).
- **Crosswind and quartering-wind lateral drift validation is excellent**:
  - Drift matches the stated formula exactly (see Section 5).
  - The “Shot 65 wind direction error” from V1 is fixed (315° is used for quartering headwind from right).
- **Quartering wind decomposition is coherent**: headwind/crosswind components and drift signs are consistent with the guide’s convention.

### ⚠️ Needs correction / clarification
1. **Pressure-only expected carries show *zero* effect** despite density changing by ±1.6–1.7% versus baseline.  
   - This prevents validating “pressure effect through density changes.”  
   - Either the **expected values** need updating, or the **guide** should state “pressure is not modeled / treated as negligible.”

2. **Your wind benchmark table in the guide does not match the dataset at higher speeds** (20–25 mph):
   - Driver **20 mph headwind**: dataset ≈ **-23.44%** vs guide **-22%**
   - Driver **25 mph headwind**: dataset ≈ **-31.50%** vs guide **-28%**
   - Driver **20 mph tailwind**: dataset ≈ **+10.26%** vs guide **+12%**
   - If the benchmark table is meant as a truth anchor, update either the **table** or the **expected outputs** so they agree.

3. **Humidity-only tests are directionally fine, but rounding makes “humid helps” invisible** in multiple rows (0-yard change).  
   - This weakens validation for humidity sign mistakes.

4. **Scenario distribution differs slightly from the summary you posted**:
   - `density_humid` is **5** rows (not 4).

---

## 1) Dataset hygiene & structure checks

### 1.1 Scenario distribution (100 total)
| scenario_type | count |
| --- | --- |
| baseline | 13 |
| combined | 10 |
| wind_head | 9 |
| real_world | 9 |
| density_temp | 8 |
| altitude_only | 7 |
| wind_tail | 7 |
| wind_cross | 6 |
| wind_quarter | 6 |
| density_humid | 5 |
| extreme | 5 |
| density_pressure | 4 |
| asymmetry | 4 |
| club_wind | 4 |
| handicap_comp | 3 |

### 1.2 Value ranges (sanity)
- Relative humidity: **0–100%** ✅
- Wind direction: **0–359°** ✅
- Sea-level adjusted pressure range: **28.95–30.40 inHg** ✅
- Computed air density range (using guide’s formula): **1.060–1.296 kg/m³**  
  (plausible across very hot/low-pressure to cold/high-pressure cases)

---

## 2) Air density validation (formula + baseline)

### 2.1 Formula correctness
The guide’s density model (dry air + water vapor partial density) is a standard “humid air” approach and is consistent with common psychrometric treatments.

### 2.2 Baseline density is now consistent (V2 fix confirmed)
At **70°F / 50% RH / 29.92 inHg**, the guide states baseline density **1.194 kg/m³**.  
Recomputing density with the stated equation gives **1.1939 kg/m³**, matching within rounding.

**Conclusion:** baseline density issue from V1 is resolved.

---

## 3) Density isolation scenarios (temperature / humidity / pressure)

All density-isolation rows correctly set **wind=0** and **altitude=0**, so they’re suitable for unit/sign validation.

### 3.1 Temperature-only tests
Mean effects by temperature:

| temperature_f | rho_ratio_vs_base | mean_carry_% | n |
| --- | --- | --- | --- |
| 40 | 1.063 | -1.873 | 3 |
| 55 | 1.031 | -1.099 | 1 |
| 85 | 0.970 | 0.733 | 1 |
| 100 | 0.939 | 1.598 | 3 |

**Notes**
- Directions are correct: colder → higher density → shorter carry.
- Magnitudes are in the right ballpark for a driving-range simulation.
- The guide’s “40°F = +8% density” table entry appears a bit high vs the formula result (**~+6.33%** vs baseline at 70°F).  
  That’s not necessarily “wrong” (tables can be rounded/empirical), but keep the docs and tests aligned.

### 3.2 Humidity-only tests
Mean effects by humidity:

| humidity_pct | rho_ratio_vs_base | mean_carry_% | n |
| --- | --- | --- | --- |
| 20 | 1.003 | -0.183 | 2 |
| 80 | 0.997 | 0.000 | 1 |
| 95 | 0.996 | 0.000 | 2 |

**Issue:** for 80–95% RH, expected carry often rounds to **0 yards change**.  
If the goal is validation (catch sign bugs), consider:
- storing `expected_carry_yards` as a **float** (e.g., 1 decimal), or
- using a larger baseline carry / scenario where 0.3–0.5% becomes ≥1 yard consistently.

### 3.3 Pressure-only tests (KEY PROBLEM)
Mean effects by pressure:

| air_pressure_inhg | rho_ratio_vs_base | mean_carry_% | n |
| --- | --- | --- | --- |
| 29.400 | 0.983 | 0.000 | 2 |
| 30.400 | 1.016 | 0.000 | 2 |

**Problem:** expected carry is unchanged (0.0%) even though density changes materially:
- 29.40 inHg → density ≈ **-1.75%**
- 30.40 inHg → density ≈ **+1.61%**

If pressure is modeled through density (as the guide indicates), you’d expect a small but visible carry change (often ~1–2 yards for drivers).  
Right now, these 4 rows cannot validate pressure handling.

**Recommended fix options**
- **Option A (preferred):** update `expected_carry_yards` in the 4 pressure-only rows to reflect the guide’s “~±0.7% carry” table.
- **Option B:** if you intentionally ignore pressure, update the guide to state pressure is not used (or is treated as negligible) and remove/repurpose these tests.

---

## 4) Altitude scaling factor (1.2% per 1,000 ft)

Altitude-only scenarios match the formula:

| club | altitude_ft | baseline_carry_yards | expected_carry_yards | formula_expected | expected_minus_formula |
| --- | --- | --- | --- | --- | --- |
| driver | 1000 | 273 | 276 | 276 | 0 |
| driver | 3000 | 273 | 282 | 283 | -1 |
| driver | 5000 | 273 | 289 | 289 | 0 |
| driver | 7000 | 273 | 296 | 296 | 0 |
| 5-iron | 3000 | 217 | 225 | 225 | 0 |
| 5-iron | 5000 | 217 | 230 | 230 | 0 |
| 7-iron | 5000 | 190 | 201 | 201 | 0 |

**Result:** Pass (one row appears to use floor vs round, off by 1 yard).

**Note:** The guide explicitly separates altitude effects from pressure/density physics (since pressure values are sea-level adjusted). Your test data is consistent with that separation.

---

## 5) Wind: magnitudes, asymmetry, direction, and drift

### 5.1 Wind direction convention
Your convention is consistent throughout V2:
- 0° headwind
- 180° tailwind
- 90° crosswind L→R (drift right)
- 270° crosswind R→L (drift left)

The quartering-wind tests now correctly include **315°** for “quartering headwind from right.”

### 5.2 Crosswind drift validation (excellent)
The dataset’s `expected_lateral_drift_yards` matches the guide formula exactly **when using `baseline_carry_yards`**:

> `drift_yards = crosswind_mph × 1.3 × (baseline_carry_yards / 100)`

**Result:** 18/18 non-zero drift rows match exactly.

**Important detail to document:** drift uses **baseline carry**, not the weather-adjusted carry.

### 5.3 Quartering winds (carry + drift)
Quartering tests are internally coherent:
- Drift = crosswind component × drift formula (baseline carry)
- Carry penalty/boost tracks the headwind component magnitude
- Drift sign is correct for 45/315/135/225°

**Result:** Pass.

### 5.4 Headwind/tailwind benchmark magnitudes (DOC ↔ DATA mismatch at high speed)
For *driver* wind-only rows, the dataset percent effects compared to the guide table:

**Headwind (driver):**
| wind_mph | dataset_pct | guide_pct | delta_pct_pts |
| --- | --- | --- | --- |
| 5 | -4.762 | -5 | 0.238 |
| 10 | -10.256 | -10 | -0.256 |
| 15 | -16.484 | -16 | -0.484 |
| 20 | -23.443 | -22 | -1.443 |
| 25 | -31.502 | -28 | -3.502 |

**Tailwind (driver):**
| wind_mph | dataset_pct | guide_pct | delta_pct_pts |
| --- | --- | --- | --- |
| 5 | 4.029 | 3.500 | 0.529 |
| 10 | 7.326 | 7.000 | 0.326 |
| 15 | 9.158 | 10.000 | -0.842 |
| 20 | 10.256 | 12.000 | -1.744 |

**Interpretation**
- Agreement is good at **5–10 mph**.
- Differences grow at **15–25 mph**, especially:
  - headwind becoming more punitive than guide,
  - tailwind giving less benefit than guide at 20 mph.

**Action:** decide whether the guide table is a strict benchmark. If yes, adjust expected outputs. If not, reword the guide table as “approximate typical values” and consider updating the asymmetry text to reflect stronger high-wind divergence.

### 5.5 Asymmetry
Using driver wind-only rows, the magnitude ratio |headwind%| / |tailwind%| increases with speed:
- 5 mph: ~1.18×
- 10 mph: ~1.40×
- 15 mph: ~1.80×
- 20 mph: ~2.29×

This is consistent with “headwind accelerates, tailwind diminishes,” but it is **not** a constant ~1.5×.

---

## 6) Combined multi-factor scenarios (compounding behavior)

V2 combined scenarios generally behave **multiplicatively** (good). Example spot-checks:

- **Shot 66 (cold + headwind)** looks consistent with:  
  (temperature factor from density isolation) × (headwind factor from wind-only) applied to that shot’s baseline.
- **Shot 67 (hot + altitude)** aligns with altitude multiplier + density benefit.

**Recommendation:** keep these, but consider adding one or two combined rows that explicitly include **non-zero crosswind drift** in addition to head/tail effects (to validate simultaneous carry + drift behavior under compound conditions).

---

## 7) Recommendations (prioritized)

### High priority (affects validation coverage)
1. **Fix pressure-only expected outputs OR change the documentation** (pick one).
2. **Reconcile guide wind benchmark table vs expected_carry_yards at 20–25 mph**.
3. **Clarify in the guide that drift uses baseline carry** (since the test data implements it that way).

### Medium priority (improves bug-catching power)
4. Represent tiny effects (humidity/pressure) with **decimal expected carries** or store **expected_adjustment_yards as float**.
5. Review scenario labeling: one “Pure 20mph headwind” row lives under `combined` (consider retagging for cleanliness).

### Nice-to-have (future realism)
6. Consider adding a couple tests where crosswind has a *small carry effect* (some models do) — even if your API intentionally ignores it, explicitly documenting that choice prevents future regressions.

---

## Appendix A — What the annotated CSV adds

The annotated CSV includes (examples):
- `rho_kg_m3`, `rho_ratio_vs_baseline`, `density_pct_change`
- `wind_head_mph`, `wind_cross_mph`
- `altitude_multiplier`
- `carry_delta_yards`, `carry_pct_change`
- `lateral_drift_calc_yards`, `lateral_drift_error_yards`, `lateral_drift_matches_formula`

Use it to quickly:
- verify density computations,
- verify wind component decomposition,
- automatically assert drift correctness row-by-row.

---

## References (external)
(These are informational; your guide + dataset are the source of truth for your app’s expected behavior.)

- inHg → Pa conversion constant (1 inHg = 3386.389 Pa)  
- Standard dry-air density reference (1.225 kg/m³ at 15°C, sea level)  
- Humid air density via ideal gas + partial pressures (common psychrometric treatment)  
- Magnus/Tetens-style saturation vapor pressure approximations
