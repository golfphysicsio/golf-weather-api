# Professional API Physics Validation Table

**Purpose:** Validate that our physics calculations correctly handle both DRAG and LIFT forces using relative airspeed.

**API Type:** Professional (pure physics simulation, no empirical overrides)

---

## Test Scenarios - Professional API

### Baseline Shot Parameters
- Ball Speed: 167 mph (tour pro driver)
- Launch Angle: 11.2°
- Spin Rate: 2600 rpm (backspin)
- Standard Conditions: 75°F, 50% humidity, sea level, 29.92 inHg

---

## Scenario Group 1: Calm Baseline

| Test ID | Conditions | Expected Carry | Physics Check |
|---------|-----------|----------------|---------------|
| P1 | Calm (0mph wind) | 268-272 yards | Baseline - both drag and lift at 100% |

**Physics Validation:**
- Air density (ρ): Standard
- Relative airspeed: 167 mph (100%)
- Drag force: 100% of maximum
- Lift force: 100% of maximum (Magnus effect from 2600 rpm backspin)
- Expected flight time: ~6.5-7 seconds
- Expected apex: 32-36 yards

---

## Scenario Group 2: Moderate Tailwinds (Should INCREASE carry)

| Test ID | Wind | Expected Carry | Change from Calm | Physics Check |
|---------|------|----------------|------------------|---------------|
| P2 | 10mph tail | 280-284 yards | +12 to +16 yards | Slight drag reduction, minimal lift loss |
| P3 | 20mph tail | 290-296 yards | +22 to +28 yards | Moderate drag reduction, manageable lift loss |
| P4 | 30mph tail | 295-302 yards | +27 to +34 yards | Good drag reduction, lift still effective |
| P5 | 35mph tail | 298-306 yards | +30 to +38 yards | **OPTIMAL - maximum realistic carry** |

**Physics Validation for P5 (35mph tailwind):**
- Relative airspeed: 132 mph (79% of ball speed)
- Drag force: 62% of calm (0.79² = 0.62)
- Lift force: 62% of calm (0.79² = 0.62)
- Net effect: Drag reduction > Lift loss → Distance INCREASES
- This is the **sweet spot** where drag benefit outweighs lift penalty

---

## Scenario Group 3: High Tailwinds (Should DECREASE carry due to lift loss)

| Test ID | Wind | Expected Carry | Change from Calm | Physics Check |
|---------|------|----------------|------------------|---------------|
| P6 | 40mph tail | 295-305 yards | +27 to +37 yards | At validation cap - marginal benefit |
| P7 | 50mph tail* | REJECTED | N/A | **Exceeds 40mph professional cap** |
| P8 | 65mph tail* | REJECTED | N/A | **Exceeds 40mph professional cap** |

*Note: Professional API validates wind at 0-40mph maximum. These would be rejected with 422 error.

**Physics Explanation for why we cap at 40mph:**

At 65mph tailwind (if we didn't cap):
- Relative airspeed: 102 mph (61% of ball speed)
- Drag force: 37% of calm (0.61² = 0.37)
- Lift force: 37% of calm (0.61² = 0.37) ← **CRITICAL**
- Ball apex would drop from 34 yards to ~14 yards
- Flight time would drop from 6.7s to ~3.5s
- Ball would drop like a rock
- Net effect: **SHORTER carry than 35mph** due to lift loss

---

## Scenario Group 4: Headwinds (Should DECREASE carry)

| Test ID | Wind | Expected Carry | Change from Calm | Physics Check |
|---------|------|----------------|------------------|---------------|
| P9 | 10mph head | 258-262 yards | -10 to -6 yards | More drag + more lift (but still loses distance) |
| P10 | 20mph head | 246-252 yards | -22 to -16 yards | Significant drag increase |
| P11 | 30mph head | 232-238 yards | -36 to -30 yards | Major drag penalty |

**Physics Validation for P11 (30mph headwind):**
- Relative airspeed: 197 mph (118% of ball speed)
- Drag force: 139% of calm (1.18² = 1.39)
- Lift force: 139% of calm (helps time aloft, but drag dominates)
- Net effect: High drag overwhelms any lift benefit → Distance DECREASES

---

## Scenario Group 5: Crosswinds (Should cause lateral drift)

| Test ID | Wind | Expected Carry | Lateral Drift | Physics Check |
|---------|------|----------------|---------------|---------------|
| P12 | 15mph cross (90°) | 264-270 yards | 12-18 yards | Slight carry reduction + sideways drift |
| P13 | 25mph cross (90°) | 258-266 yards | 22-32 yards | More carry loss + significant drift |

**Physics Validation:**
- Crosswind component affects both drag (increases total relative airspeed) and direction
- Ball curves with wind
- Some carry distance lost due to increased drag from crosswind component

---

## Scenario Group 6: Temperature Effects

| Test ID | Temp | Expected Carry | Change from 75°F | Physics Check |
|---------|------|----------------|------------------|---------------|
| P14 | 40°F (cold) | 258-264 yards | -10 to -4 yards | Higher air density + reduced ball compression |
| P15 | 95°F (hot) | 274-280 yards | +6 to +12 yards | Lower air density + better ball compression |

**Physics Validation for P14 (cold):**
- Air density increases (ρ = P/RT, lower T = higher ρ)
- Drag increases proportionally to density
- Lift also increases with density, but drag effect dominates
- Ball compression reduces in cold (less energy transfer)
- Combined effect: **Shorter distance**

---

## Scenario Group 7: Altitude Effects

| Test ID | Altitude | Expected Carry | Change from Sea Level | Physics Check |
|---------|----------|----------------|----------------------|---------------|
| P16 | 2,500 ft | 280-286 yards | +12 to +18 yards | Reduced air density |
| P17 | 5,280 ft (Denver) | 290-298 yards | +22 to +30 yards | ~17% less air density |
| P18 | 8,000 ft | 298-308 yards | +30 to +40 yards | Maximum realistic altitude |

**Physics Validation for P17 (Denver):**
- Air pressure: ~24.5 inHg (vs 29.92 at sea level)
- Air density: ~83% of sea level
- Drag force: 83% of sea level
- Lift force: 83% of sea level (both scale with density)
- Ball stays aloft slightly less time BUT travels farther during flight
- Net effect: ~8% more carry distance

---

## Scenario Group 8: Combined Extreme Conditions

| Test ID | Conditions | Expected Carry | Physics Check |
|---------|-----------|----------------|---------------|
| P19 | 35mph tail + Denver + 95°F | 320-335 yards | Optimal tailwind + altitude + heat |
| P20 | 30mph head + Sea level + 40°F | 218-226 yards | Headwind + cold + dense air |

**Physics Validation for P19 (best case realistic):**
- Tailwind: +30 yards (from optimal sweet spot)
- Altitude: +25 yards (Denver effect)
- Heat: +8 yards (reduced density + compression)
- Combined: ~+63 yards over standard calm baseline
- This represents the **maximum realistic carry** with professional API caps

---

## Critical Physics Assertions to Verify

### Assertion 1: Both Drag AND Lift Use Relative Airspeed
```
F_drag = ½ρv_rel²C_D A
F_lift = ½ρv_rel²C_L A

Where: v_rel = ball_speed - wind_speed (for tailwind)
```

**Test:** At 80mph tailwind (if we allowed it):
- v_rel = 167 - 80 = 87 mph (52% of ball speed)
- Both forces scale by 0.52² = 0.27 (27% of calm)
- Result: Ball should DROP FAST and carry LESS than optimal

**Expected API behavior:** Professional API rejects 80mph (exceeds 40mph cap)

---

### Assertion 2: Optimal Tailwind is ~30-40mph
```
Below 30mph: Drag benefit > Lift loss → Distance increases
At 30-40mph: OPTIMAL sweet spot
Above 40mph: Lift loss > Drag benefit → Distance decreases
```

**Test:** Compare carries:
- 20mph tail: ~293 yards
- 35mph tail: ~302 yards (MAXIMUM)
- 50mph tail: If allowed, would be ~298 yards (LESS than 35mph!)

**Expected API behavior:** Professional API caps at 40mph to stay in validated regime

---

### Assertion 3: Temperature Affects Both Density and Ball Compression
```
Cold air effect:
- Higher density → More drag/lift
- Reduced ball compression → Less energy transfer
- Combined: ~10-15 yards shorter

Hot air effect:
- Lower density → Less drag/lift
- Better ball compression → More energy transfer
- Combined: ~6-12 yards longer
```

**Test:** 40°F vs 95°F should show ~16-21 yard difference

---

### Assertion 4: Altitude Effect is ~1% per 1000ft
```
Air pressure drops ~1 inHg per 1000 ft elevation
Air density proportional to pressure
Drag/lift both scale with density

Denver (5,280 ft):
- Pressure: 24.5 inHg (vs 29.92)
- Density: 82% of sea level
- Distance: ~108% of sea level (+8%)
```

**Test:** Denver should show 20-30 yard increase over sea level

---

## Success Criteria

Our Professional API implementation is **CORRECT** if:

1. ✅ Calm baseline produces 268-272 yards
2. ✅ 35mph tailwind produces 298-306 yards (maximum realistic)
3. ✅ 65mph+ tailwinds are **REJECTED** (exceeds validation cap)
4. ✅ 30mph headwind produces 232-238 yards (significant reduction)
5. ✅ Denver altitude produces 290-298 yards (~8% increase)
6. ✅ Cold (40°F) produces 258-264 yards (~10 yards less)
7. ✅ Hot (95°F) produces 274-280 yards (~6 yards more)
8. ✅ Combined best case produces 320-335 yards (35mph tail + Denver + heat)

---

## Key Differences from Gaming API

**Gaming API would handle scenarios differently:**

| Scenario | Professional API | Gaming API |
|----------|------------------|------------|
| 65mph tailwind | REJECTED (>40mph) | +80 yards (capped at +30%) |
| 150mph tailwind | REJECTED (>40mph) | +174 yards (surfing physics) |
| 35mph tailwind | +30 yards (pure physics) | +30 yards (same - under 40mph) |

The Gaming API extends ranges for entertainment while Professional API maintains realistic tournament conditions.

---

## Validation Instructions for External Review

**To validate our physics:**

1. **Check relative airspeed calculations:**
   - v_rel must be used for BOTH drag and lift
   - Not just drag alone

2. **Verify lift coefficient implementation:**
   - Must scale with v_rel² (not constant)
   - Magnus effect should be present (spin creates lift)

3. **Confirm optimal tailwind is 30-40mph:**
   - Below: Distance increases with wind
   - Above: Lift loss dominates (distance decreases)

4. **Validate temperature/altitude effects:**
   - Both affect air density
   - Density affects both drag AND lift equally

5. **Test cap enforcement:**
   - Winds >40mph should return 422 validation error
   - Temps outside 32-105°F should be rejected
   - Altitudes >8000ft should be rejected

---

## Expected Output Format

For each test scenario, the API should return:

```json
{
  "carry_distance": 302.5,
  "total_distance": 318.2,
  "apex_height": 29.3,
  "flight_time": 6.1,
  "effects": {
    "wind": 34.4,
    "temperature": 8.2,
    "altitude": 0.0,
    "humidity": -0.8
  },
  "conditions": {
    "wind_speed": 35,
    "wind_direction": 180,
    "temperature": 95,
    "altitude": 0
  },
  "api_type": "professional"
}
```

---

**END OF VALIDATION TABLE**

This table can be used to verify that the Professional API correctly implements aerodynamic physics including both drag and lift forces using relative airspeed.
