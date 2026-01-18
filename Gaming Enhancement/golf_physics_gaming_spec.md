# Golf Physics API - Gaming Enhancement Specification

**Project:** Golf Physics API  
**Version:** 1.0  
**Date:** January 18, 2026  
**Author:** Vinnie (Golf Physics API Founder)  
**Environment:** Railway (PostgreSQL + FastAPI)  

---

## Executive Summary

This specification outlines three critical enhancements to the Golf Physics API that will enable both professional accuracy and entertainment gaming applications:

1. **Conditions Override** - Accept custom weather conditions for gaming scenarios
2. **Weather Presets** - Predefined extreme weather scenarios for entertainment venues  
3. **Handicap-Based Distances** - Accept player handicap and return appropriate club distances

These features transform our API from a professional-only tool into a dual-market platform serving both serious golf technology (inRange, TrackMan) and entertainment venues (Topgolf, Drive Shack, Five Iron).

---

## Critical Environment Information

**DEPLOYMENT PLATFORM:** Railway (NOT Vercel)  
**DATABASE:** PostgreSQL on Railway  
**BACKEND:** FastAPI (Python)  
**ENVIRONMENTS:**
- **Staging:** Fully functional, use for all development and testing
- **Production:** NOT YET DEPLOYED - do not touch production

**WORKFLOW:**
1. All code changes in STAGING first
2. Comprehensive testing in STAGING
3. Generate test report
4. Only after approval, consider production deployment

---

## Feature 1: Conditions Override

### Current Behavior

The `/api/v1/calculate` endpoint currently requires a `location` parameter and fetches real-time weather data from external APIs.

```python
POST /api/v1/calculate
{
  "ball_speed": 165,
  "launch_angle": 12.5,
  "spin_rate": 2800,
  "location": {"lat": 33.45, "lng": -112.07}
}

# Returns trajectory based on REAL weather at that location
```

### New Behavior

Add an optional `conditions_override` parameter that bypasses weather lookup and uses custom conditions instead.

```python
POST /api/v1/calculate
{
  "ball_speed": 165,
  "launch_angle": 12.5,
  "spin_rate": 2800,
  
  # Option A: Use real weather (existing behavior)
  "location": {"lat": 33.45, "lng": -112.07},
  
  # Option B: Use custom conditions (NEW)
  "conditions_override": {
    "wind_speed": 65,           # mph (valid range: 0-150)
    "wind_direction": 225,       # degrees (valid range: 0-360)
    "temperature": 28,           # Fahrenheit (valid range: -40 to 130)
    "humidity": 90,              # percent (valid range: 0-100)
    "altitude": 5000,            # feet (valid range: -100 to 15000)
    "air_pressure": 29.2         # inHg (valid range: 25-32)
  }
}
```

### Implementation Requirements

**Logic Flow:**
1. Check if `conditions_override` is present in request
2. If YES → validate all values are within acceptable ranges → use custom conditions
3. If NO → check if `location` is present
4. If location present → fetch real weather (existing behavior)
5. If neither present → return error

**Validation Rules:**
- `wind_speed`: 0-150 mph (allow extreme for gaming)
- `wind_direction`: 0-360 degrees
- `temperature`: -40 to 130°F
- `humidity`: 0-100%
- `altitude`: -100 to 15,000 feet
- `air_pressure`: 25-32 inHg

**Error Handling:**
- If values outside valid ranges → return 400 Bad Request with specific error message
- If both `location` AND `conditions_override` present → use `conditions_override` (override takes precedence)
- If neither present → return 400 Bad Request "Either location or conditions_override required"

**Response Format:**
Response should remain identical to current format, but include metadata indicating whether real or custom conditions were used:

```python
{
  "carry_distance": 245.3,
  "total_distance": 258.7,
  "trajectory": [...],
  "conditions": {
    "source": "override",  # or "real" if location was used
    "wind_speed": 65,
    "wind_direction": 225,
    "temperature": 28,
    # ... all conditions used
  }
}
```

---

## Feature 2: Weather Presets Endpoint

### Overview

Create a new GET endpoint that returns predefined extreme weather scenarios for entertainment venues to use in their gaming experiences.

### Endpoint Specification

```python
GET /api/v1/presets

# No parameters required
# Returns all available presets with metadata
```

### Preset Definitions

Each preset should include:
- **Preset ID** (key): Lowercase with underscores (e.g., "hurricane_hero")
- **Name**: Display name for UI
- **Description**: Brief explanation of conditions
- **Conditions**: Full conditions object (matching conditions_override format)
- **Difficulty**: Rating (easy/medium/hard/extreme)
- **Tags**: Categories for filtering

### Required Presets

```python
WEATHER_PRESETS = {
    "calm_day": {
        "name": "Calm Day",
        "description": "Perfect conditions - baseline for comparison",
        "conditions": {
            "wind_speed": 3,
            "wind_direction": 90,
            "temperature": 72,
            "humidity": 50,
            "altitude": 100,
            "air_pressure": 30.0
        },
        "difficulty": "easy",
        "tags": ["baseline", "calm", "perfect"]
    },
    
    "hurricane_hero": {
        "name": "Hurricane Hero",
        "description": "Category 3 hurricane conditions with extreme winds and rain",
        "conditions": {
            "wind_speed": 65,
            "wind_direction": 180,
            "temperature": 78,
            "humidity": 95,
            "altitude": 0,
            "air_pressure": 28.5
        },
        "difficulty": "extreme",
        "tags": ["wind", "rain", "coastal", "extreme"]
    },
    
    "arctic_assault": {
        "name": "Arctic Assault",
        "description": "Polar conditions with freezing temperatures and biting winds",
        "conditions": {
            "wind_speed": 30,
            "wind_direction": 0,
            "temperature": -15,
            "humidity": 70,
            "altitude": 100,
            "air_pressure": 30.5
        },
        "difficulty": "hard",
        "tags": ["cold", "wind", "winter"]
    },
    
    "desert_inferno": {
        "name": "Desert Inferno",
        "description": "Scorching heat with high altitude and thin air",
        "conditions": {
            "wind_speed": 20,
            "wind_direction": 90,
            "temperature": 115,
            "humidity": 8,
            "altitude": 3500,
            "air_pressure": 29.0
        },
        "difficulty": "hard",
        "tags": ["heat", "altitude", "dry"]
    },
    
    "tornado_alley": {
        "name": "Tornado Alley",
        "description": "Severe storm with chaotic, extreme winds",
        "conditions": {
            "wind_speed": 85,
            "wind_direction": 270,
            "temperature": 68,
            "humidity": 85,
            "altitude": 1200,
            "air_pressure": 29.5
        },
        "difficulty": "extreme",
        "tags": ["wind", "storm", "extreme"]
    },
    
    "monsoon_madness": {
        "name": "Monsoon Madness",
        "description": "Heavy tropical rain with high humidity and gusting winds",
        "conditions": {
            "wind_speed": 45,
            "wind_direction": 135,
            "temperature": 85,
            "humidity": 98,
            "altitude": 50,
            "air_pressure": 29.8
        },
        "difficulty": "hard",
        "tags": ["rain", "tropical", "wind"]
    },
    
    "mountain_challenge": {
        "name": "Mountain Challenge",
        "description": "High altitude with thin air and cool temperatures",
        "conditions": {
            "wind_speed": 15,
            "wind_direction": 180,
            "temperature": 58,
            "humidity": 40,
            "altitude": 8500,
            "air_pressure": 26.8
        },
        "difficulty": "medium",
        "tags": ["altitude", "thin-air", "mountain"]
    },
    
    "polar_vortex": {
        "name": "Polar Vortex",
        "description": "Extreme Arctic cold with dangerous wind chill",
        "conditions": {
            "wind_speed": 40,
            "wind_direction": 360,
            "temperature": -25,
            "humidity": 65,
            "altitude": 200,
            "air_pressure": 30.8
        },
        "difficulty": "extreme",
        "tags": ["extreme-cold", "wind", "arctic"]
    },
    
    "dust_bowl": {
        "name": "Dust Bowl",
        "description": "Hot, dry plains with moderate winds",
        "conditions": {
            "wind_speed": 25,
            "wind_direction": 225,
            "temperature": 95,
            "humidity": 12,
            "altitude": 2200,
            "air_pressure": 29.4
        },
        "difficulty": "medium",
        "tags": ["heat", "dry", "wind"]
    },
    
    "typhoon_terror": {
        "name": "Typhoon Terror",
        "description": "Category 4 Pacific storm with devastating winds",
        "conditions": {
            "wind_speed": 95,
            "wind_direction": 315,
            "temperature": 82,
            "humidity": 97,
            "altitude": 0,
            "air_pressure": 27.9
        },
        "difficulty": "extreme",
        "tags": ["extreme", "wind", "tropical", "rain"]
    }
}
```

### Response Format

```json
{
  "presets": {
    "calm_day": { /* preset object */ },
    "hurricane_hero": { /* preset object */ },
    // ... all presets
  },
  "count": 10
}
```

### Implementation Notes

- Store presets as a constant dictionary in the codebase (no database needed)
- Presets are read-only (no POST/PUT/DELETE endpoints)
- Future enhancement: Allow custom presets per client (stored in database)

---

## Feature 3: Handicap-Based Club Distances

### Problem Statement

Different skill levels hit golf clubs vastly different distances. A scratch golfer hits a driver 280 yards, while a high-handicapper hits it 200 yards. 

Launch monitors at driving ranges know the player's handicap but don't know the expected stock distances. Our API should accept a handicap and club type, then:

1. Look up the appropriate stock ball flight parameters
2. Apply our weather physics
3. Return adjusted distances

### API Design

Add two new optional parameters to the existing `/api/v1/calculate` endpoint:

```python
POST /api/v1/calculate
{
  # NEW OPTION A: Handicap + Club (we look up ball flight parameters)
  "player_handicap": 15,
  "club": "7_iron",
  
  # OR OPTION B: Direct ball flight (existing behavior)
  "ball_speed": 165,
  "launch_angle": 12.5,
  "spin_rate": 2800,
  
  # Weather (either method)
  "location": {"lat": 33.45, "lng": -112.07}
  # or "conditions_override": {...}
}
```

**Logic:**
- If `player_handicap` AND `club` provided → look up stock parameters → calculate
- If `ball_speed`, `launch_angle`, `spin_rate` provided → use directly (existing)
- If both sets provided → use handicap/club (takes precedence)
- If neither provided → return error

### Stock Distance Lookup Table

Create a lookup table with 4 handicap tiers × 14 clubs = 56 entries

**Handicap Tiers:**
- **Scratch:** 0-5 handicap
- **Low:** 6-12 handicap  
- **Mid:** 13-20 handicap
- **High:** 21-36 handicap

**Clubs:**
- Woods: driver, 3_wood, 5_wood
- Irons: 3_iron, 4_iron, 5_iron, 6_iron, 7_iron, 8_iron, 9_iron
- Wedges: pw (pitching), gw (gap), sw (sand), lw (lob)

### Stock Distance Data Structure

For each handicap tier, store for each club:
- `carry`: Expected carry distance (yards)
- `ball_speed`: Ball speed off clubface (mph)
- `launch_angle`: Vertical launch angle (degrees)
- `spin`: Backspin rate (rpm)

```python
STOCK_DISTANCES = {
    "scratch": {  # 0-5 handicap
        "driver": {
            "carry": 280,
            "ball_speed": 167,
            "launch_angle": 11.2,
            "spin": 2600
        },
        "7_iron": {
            "carry": 180,
            "ball_speed": 125,
            "launch_angle": 16.0,
            "spin": 5500
        },
        # ... all 14 clubs
    },
    "low": {  # 6-12 handicap
        "driver": {
            "carry": 260,
            "ball_speed": 158,
            "launch_angle": 12.0,
            "spin": 2800
        },
        # ... all 14 clubs
    },
    "mid": {  # 13-20 handicap
        "driver": {
            "carry": 230,
            "ball_speed": 145,
            "launch_angle": 13.0,
            "spin": 3200
        },
        # ... all 14 clubs
    },
    "high": {  # 21-36 handicap
        "driver": {
            "carry": 200,
            "ball_speed": 132,
            "launch_angle": 14.0,
            "spin": 3600
        },
        # ... all 14 clubs
    }
}
```

### Complete Stock Distance Data

**SCRATCH GOLFER (0-5 Handicap)**

| Club | Carry (yds) | Ball Speed (mph) | Launch (°) | Spin (rpm) |
|------|-------------|------------------|------------|------------|
| driver | 280 | 167 | 11.2 | 2600 |
| 3_wood | 255 | 158 | 10.5 | 3200 |
| 5_wood | 235 | 150 | 11.0 | 3800 |
| 3_iron | 220 | 145 | 12.0 | 4000 |
| 4_iron | 210 | 140 | 13.0 | 4200 |
| 5_iron | 200 | 135 | 14.0 | 4500 |
| 6_iron | 190 | 130 | 15.0 | 5000 |
| 7_iron | 180 | 125 | 16.0 | 5500 |
| 8_iron | 170 | 120 | 17.5 | 6000 |
| 9_iron | 160 | 115 | 19.0 | 6500 |
| pw | 150 | 110 | 21.0 | 7000 |
| gw | 130 | 100 | 24.0 | 8000 |
| sw | 110 | 90 | 27.0 | 9000 |
| lw | 90 | 80 | 30.0 | 9500 |

**LOW HANDICAP (6-12)**

| Club | Carry (yds) | Ball Speed (mph) | Launch (°) | Spin (rpm) |
|------|-------------|------------------|------------|------------|
| driver | 260 | 158 | 12.0 | 2800 |
| 3_wood | 235 | 148 | 11.0 | 3400 |
| 5_wood | 215 | 140 | 11.5 | 4000 |
| 3_iron | 200 | 135 | 13.0 | 4300 |
| 4_iron | 190 | 130 | 14.0 | 4500 |
| 5_iron | 180 | 125 | 15.0 | 4800 |
| 6_iron | 170 | 120 | 16.0 | 5300 |
| 7_iron | 160 | 115 | 17.0 | 5800 |
| 8_iron | 150 | 110 | 18.5 | 6300 |
| 9_iron | 140 | 105 | 20.0 | 6800 |
| pw | 130 | 100 | 22.0 | 7500 |
| gw | 110 | 90 | 25.0 | 8500 |
| sw | 90 | 80 | 28.0 | 9500 |
| lw | 70 | 70 | 31.0 | 10000 |

**MID HANDICAP (13-20)**

| Club | Carry (yds) | Ball Speed (mph) | Launch (°) | Spin (rpm) |
|------|-------------|------------------|------------|------------|
| driver | 230 | 145 | 13.0 | 3200 |
| 3_wood | 210 | 135 | 12.0 | 3800 |
| 5_wood | 190 | 127 | 12.5 | 4400 |
| 3_iron | 175 | 122 | 14.0 | 4700 |
| 4_iron | 165 | 117 | 15.0 | 5000 |
| 5_iron | 155 | 112 | 16.0 | 5300 |
| 6_iron | 145 | 107 | 17.5 | 5800 |
| 7_iron | 135 | 102 | 19.0 | 6300 |
| 8_iron | 125 | 97 | 21.0 | 6800 |
| 9_iron | 115 | 92 | 23.0 | 7300 |
| pw | 105 | 87 | 25.0 | 8000 |
| gw | 90 | 78 | 27.0 | 9000 |
| sw | 75 | 70 | 30.0 | 10000 |
| lw | 60 | 62 | 33.0 | 10500 |

**HIGH HANDICAP (21-36)**

| Club | Carry (yds) | Ball Speed (mph) | Launch (°) | Spin (rpm) |
|------|-------------|------------------|------------|------------|
| driver | 200 | 132 | 14.0 | 3600 |
| 3_wood | 180 | 122 | 13.0 | 4200 |
| 5_wood | 165 | 115 | 13.5 | 4800 |
| 3_iron | 150 | 110 | 15.0 | 5200 |
| 4_iron | 140 | 105 | 16.0 | 5500 |
| 5_iron | 130 | 100 | 17.5 | 5900 |
| 6_iron | 120 | 95 | 19.0 | 6400 |
| 7_iron | 110 | 90 | 21.0 | 6900 |
| 8_iron | 100 | 85 | 23.0 | 7400 |
| 9_iron | 90 | 80 | 25.0 | 7900 |
| pw | 80 | 75 | 27.0 | 8500 |
| gw | 70 | 68 | 29.0 | 9500 |
| sw | 60 | 62 | 32.0 | 10500 |
| lw | 50 | 56 | 35.0 | 11000 |

### Handicap to Tier Mapping

```python
def get_handicap_tier(handicap: int) -> str:
    if 0 <= handicap <= 5:
        return "scratch"
    elif 6 <= handicap <= 12:
        return "low"
    elif 13 <= handicap <= 20:
        return "mid"
    elif 21 <= handicap <= 36:
        return "high"
    else:
        raise ValueError("Handicap must be between 0 and 36")
```

### Implementation Options

**Option A: In-Memory Dictionary (Recommended for MVP)**
- Store as Python constant
- Fast lookups
- Easy to modify
- No database overhead

**Option B: Database Table (Future Enhancement)**
- More flexible
- Can add custom distances per client
- Supports future features (women's distances, junior distances, etc.)

For this implementation, use **Option A** (in-memory dictionary).

---

## Testing Requirements

### Test Environment

**CRITICAL:** All testing must be performed in STAGING environment only.

- Database: PostgreSQL (staging instance on Railway)
- API: Staging URL (not production)
- No production data should be affected

### Test Objectives

1. Verify stock distances are mathematically reasonable
2. Verify weather conditions affect distances appropriately  
3. Verify handicap tiers show proper distance gaps
4. Verify all presets produce playable results
5. Identify any edge cases or unrealistic outputs

### Test Matrix Structure

**Dimensions to Test:**
- **Clubs:** driver, 7_iron, pw (representative sample of woods, irons, wedges)
- **Handicap Tiers:** All 4 (scratch, low, mid, high)
- **Weather Presets:** All 10 presets + custom extreme
- **Scenarios:** Baseline, favorable, adverse

### Required Test Cases

#### Test 1: Baseline Stock Distances (Calm Day)

For each handicap tier and each club:
- Use `player_handicap` and `club` parameters
- Use "calm_day" preset conditions
- Verify calculated carry is within 5% of stock carry
- Verify better players hit farther than worse players

**Expected Pattern:**
- Scratch > Low > Mid > High (for same club)
- Driver > 7-iron > PW (for same handicap)

#### Test 2: Preset Impact Analysis

For a scratch golfer with driver:
- Test all 10 presets
- Compare against calm_day baseline
- Verify directional correctness:
  - Headwind → shorter
  - Tailwind → longer
  - High altitude → longer
  - Low temperature → shorter
  - High temperature → longer

#### Test 3: Extreme Condition Handling

- Hurricane Hero (65mph headwind) → should reduce distance significantly
- Desert Inferno (115°F, 3500ft altitude) → should increase distance
- Polar Vortex (-25°F, 40mph wind) → should reduce distance severely
- Tornado Alley (85mph wind) → test that calculation doesn't fail

#### Test 4: Cross-Handicap Preset Comparison

For Hurricane Hero preset:
- Test all 4 handicap tiers with 7-iron
- Verify distance loss is proportional
- Scratch golfer should still hit farther than high handicapper

#### Test 5: Parameter Precedence

- Send both `player_handicap + club` AND `ball_speed + launch + spin`
- Verify handicap/club takes precedence
- Send both `location` AND `conditions_override`
- Verify conditions_override takes precedence

#### Test 6: Error Handling

- Invalid handicap (negative, > 36)
- Invalid club name ("putter", "1_iron")
- Out of range wind speed (200 mph)
- Out of range temperature (150°F)
- Missing required parameters

### Test Output Format

Generate a comprehensive markdown report with these sections:

```markdown
# Golf Physics API - Gaming Enhancement Test Report

**Test Date:** [timestamp]
**Environment:** Staging (Railway)
**Database:** PostgreSQL (staging)
**Tester:** Claude Code
**Total Tests Run:** [count]

---

## Executive Summary

- **Tests Passed:** [count] / [total]
- **Tests Failed:** [count]
- **Warnings:** [count]
- **Overall Status:** PASS / FAIL / NEEDS REVIEW

---

## Section 1: Baseline Stock Distances (Calm Day Preset)

This table validates that stock distances are reasonable and properly ordered.

| Handicap | Club | Stock Carry | Calculated | Difference | % Error | Status |
|----------|------|-------------|------------|------------|---------|--------|
| Scratch | Driver | 280 | 279.8 | -0.2 | -0.07% | ✅ PASS |
| Scratch | 7-Iron | 180 | 180.2 | +0.2 | +0.11% | ✅ PASS |
| Scratch | PW | 150 | 149.5 | -0.5 | -0.33% | ✅ PASS |
| Low | Driver | 260 | 260.3 | +0.3 | +0.12% | ✅ PASS |
| Low | 7-Iron | 160 | 159.7 | -0.3 | -0.19% | ✅ PASS |
| Low | PW | 130 | 130.1 | +0.1 | +0.08% | ✅ PASS |
| Mid | Driver | 230 | 229.6 | -0.4 | -0.17% | ✅ PASS |
| Mid | 7-Iron | 135 | 135.2 | +0.2 | +0.15% | ✅ PASS |
| Mid | PW | 105 | 104.8 | -0.2 | -0.19% | ✅ PASS |
| High | Driver | 200 | 200.1 | +0.1 | +0.05% | ✅ PASS |
| High | 7-Iron | 110 | 109.8 | -0.2 | -0.18% | ✅ PASS |
| High | PW | 80 | 80.2 | +0.2 | +0.25% | ✅ PASS |

**Analysis:** All stock distances within acceptable variance (<1%). Distance progression correct (Scratch > Low > Mid > High).

---

## Section 2: Weather Preset Impact (Scratch Golfer, Driver)

This table shows how each preset affects distance vs. calm conditions.

| Preset | Wind (mph) | Temp (°F) | Alt (ft) | Carry | vs Calm | % Change | Physics Check | Status |
|--------|-----------|-----------|----------|-------|---------|----------|---------------|--------|
| Calm Day | 3 | 72 | 100 | 280 | 0 | 0% | Baseline | ✅ PASS |
| Hurricane Hero | 65 | 78 | 0 | 245 | -35 | -12.5% | Headwind penalty correct | ✅ PASS |
| Arctic Assault | 30 | -15 | 100 | 252 | -28 | -10.0% | Cold air + wind penalty | ✅ PASS |
| Desert Inferno | 20 | 115 | 3500 | 295 | +15 | +5.4% | Altitude bonus correct | ✅ PASS |
| Tornado Alley | 85 | 68 | 1200 | 228 | -52 | -18.6% | Extreme wind penalty | ✅ PASS |
| Monsoon Madness | 45 | 85 | 50 | 256 | -24 | -8.6% | Moderate wind penalty | ✅ PASS |
| Mountain Challenge | 15 | 58 | 8500 | 308 | +28 | +10.0% | High altitude bonus | ✅ PASS |
| Polar Vortex | 40 | -25 | 200 | 238 | -42 | -15.0% | Extreme cold + wind | ✅ PASS |
| Dust Bowl | 25 | 95 | 2200 | 282 | +2 | +0.7% | Heat + altitude offset | ✅ PASS |
| Typhoon Terror | 95 | 82 | 0 | 215 | -65 | -23.2% | Extreme wind penalty | ✅ PASS |

**Analysis:** All weather effects directionally correct. Altitude increases distance, headwinds decrease, cold reduces, etc.

---

## Section 3: Hurricane Hero - Cross-Handicap Impact

Shows how the same extreme conditions affect different skill levels.

| Handicap | Club | Calm Carry | Hurricane Carry | Loss (yds) | % Loss | Proportional? | Status |
|----------|------|-----------|-----------------|------------|--------|---------------|--------|
| Scratch | Driver | 280 | 245 | -35 | -12.5% | Baseline | ✅ PASS |
| Low | Driver | 260 | 228 | -32 | -12.3% | ✅ Similar % | ✅ PASS |
| Mid | Driver | 230 | 202 | -28 | -12.2% | ✅ Similar % | ✅ PASS |
| High | Driver | 200 | 176 | -24 | -12.0% | ✅ Similar % | ✅ PASS |
| Scratch | 7-Iron | 180 | 162 | -18 | -10.0% | Less than driver | ✅ PASS |
| Mid | 7-Iron | 135 | 122 | -13 | -9.6% | ✅ Similar % | ✅ PASS |

**Analysis:** Wind affects all skill levels proportionally. Scratch still hits farther than high handicap in all conditions.

---

## Section 4: Desert Inferno - Altitude Bonus

High altitude + heat should significantly increase distance.

| Handicap | Club | Calm Carry | Desert Carry | Gain (yds) | % Gain | Status |
|----------|------|-----------|--------------|------------|--------|--------|
| Scratch | Driver | 280 | 295 | +15 | +5.4% | ✅ PASS |
| Low | Driver | 260 | 274 | +14 | +5.4% | ✅ PASS |
| Mid | Driver | 230 | 242 | +12 | +5.2% | ✅ PASS |
| Scratch | 7-Iron | 180 | 189 | +9 | +5.0% | ✅ PASS |

**Analysis:** Altitude bonus consistent across skill levels. Thin air physics working correctly.

---

## Section 5: Edge Cases & Error Handling

| Test Case | Input | Expected Result | Actual Result | Status |
|-----------|-------|----------------|---------------|--------|
| Invalid handicap (-5) | handicap: -5 | 400 Error | 400 Error | ✅ PASS |
| Invalid handicap (50) | handicap: 50 | 400 Error | 400 Error | ✅ PASS |
| Invalid club ("putter") | club: "putter" | 400 Error | 400 Error | ✅ PASS |
| Wind too high (200) | wind_speed: 200 | 400 Error | 400 Error | ✅ PASS |
| Temp too high (150) | temperature: 150 | 400 Error | 400 Error | ✅ PASS |
| Both location + override | Both parameters | Uses override | Uses override | ✅ PASS |
| Both handicap + ball_speed | Both parameters | Uses handicap | Uses handicap | ✅ PASS |
| Missing all params | No params | 400 Error | 400 Error | ✅ PASS |

---

## Section 6: Sanity Checks

| Check | Condition | Result | Status |
|-------|-----------|--------|--------|
| Driver > 7-Iron | All handicaps, calm day | ✅ True for all | ✅ PASS |
| 7-Iron > PW | All handicaps, calm day | ✅ True for all | ✅ PASS |
| Scratch > Low | All clubs, calm day | ✅ True for all | ✅ PASS |
| Low > Mid | All clubs, calm day | ✅ True for all | ✅ PASS |
| Mid > High | All clubs, calm day | ✅ True for all | ✅ PASS |
| Headwind < Calm | All tests | ✅ True for all | ✅ PASS |
| Tailwind > Calm | All tests | ✅ True for all | ✅ PASS |
| High altitude > Low | Mountain vs Calm | ✅ True for all | ✅ PASS |

---

## Section 7: Failed Tests

[List any tests that failed with details on what went wrong]

Example:
- **Test:** Polar Vortex with Lob Wedge (High Handicapper)
- **Expected:** ~40 yards
- **Actual:** 12 yards
- **Issue:** Extreme cold causing unrealistic distance loss
- **Recommendation:** Add minimum distance floor or adjust cold penalty for short clubs

---

## Section 8: Warnings & Concerns

[List anything that passed but seems questionable]

Example:
- **Warning:** Typhoon Terror reduces driver distance by 65 yards (-23%). While mathematically correct for 95mph winds, this might be unplayable in a gaming context. Consider capping extreme presets at -20% for better user experience.

---

## Section 9: Recommendations

Based on testing, here are recommendations:

1. **Stock Distances:** All appear accurate and reasonable. No changes needed.

2. **Preset Adjustments:** Consider modifying the following:
   - [Any presets that need tweaking]

3. **Edge Cases:** Add handling for:
   - [Any edge cases discovered]

4. **Documentation:** Update API docs to clarify:
   - Parameter precedence (handicap/club overrides ball_speed/launch/spin)
   - Valid ranges for all inputs
   - Example responses for each preset

---

## Section 10: Sample API Calls

### Successful Calls

```bash
# Scratch golfer, driver, calm conditions
curl -X POST https://staging.golfphysics.io/api/v1/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "player_handicap": 2,
    "club": "driver",
    "conditions_override": {
      "wind_speed": 3,
      "wind_direction": 90,
      "temperature": 72,
      "humidity": 50,
      "altitude": 100,
      "air_pressure": 30.0
    }
  }'

# Response:
{
  "carry_distance": 279.8,
  "total_distance": 295.3,
  "conditions": {
    "source": "override",
    ...
  }
}
```

[More examples...]

---

## Appendix: Complete Test Data

[Include CSV or additional tables with ALL test results if needed]

```

### Test Execution Script

Provide a Python test script that:
1. Connects to staging database
2. Runs all test cases systematically
3. Collects results
4. Generates the markdown report above

---

## Implementation Checklist

Use this checklist to track progress:

### Feature 1: Conditions Override
- [ ] Add `conditions_override` parameter to calculate endpoint
- [ ] Implement validation for all 6 condition parameters
- [ ] Implement precedence logic (override > location)
- [ ] Update response to include conditions source
- [ ] Handle edge cases (both params, neither param)
- [ ] Write unit tests for validation logic

### Feature 2: Weather Presets
- [ ] Create WEATHER_PRESETS dictionary with 10 presets
- [ ] Implement GET /api/v1/presets endpoint
- [ ] Return proper JSON structure
- [ ] Add API documentation
- [ ] Test all presets individually

### Feature 3: Handicap-Based Distances
- [ ] Create STOCK_DISTANCES dictionary (4 tiers × 14 clubs)
- [ ] Implement get_handicap_tier() function
- [ ] Add `player_handicap` and `club` parameters to calculate endpoint
- [ ] Implement lookup logic
- [ ] Implement parameter precedence (handicap/club > ball_speed/launch/spin)
- [ ] Validate handicap range (0-36)
- [ ] Validate club names
- [ ] Write unit tests for tier mapping

### Testing & Validation
- [ ] Set up staging test environment
- [ ] Create comprehensive test script
- [ ] Run Test 1: Baseline Stock Distances
- [ ] Run Test 2: Preset Impact Analysis
- [ ] Run Test 3: Extreme Condition Handling
- [ ] Run Test 4: Cross-Handicap Preset Comparison
- [ ] Run Test 5: Parameter Precedence
- [ ] Run Test 6: Error Handling
- [ ] Generate test report markdown
- [ ] Review results for unrealistic outputs
- [ ] Document any recommended adjustments

### Documentation
- [ ] Update API documentation
- [ ] Add usage examples
- [ ] Document parameter precedence rules
- [ ] Document valid ranges for all inputs
- [ ] Add preset reference guide
- [ ] Update changelog

### Final Deliverables
- [ ] All code changes committed to staging
- [ ] Comprehensive test report generated
- [ ] API documentation updated
- [ ] Migration guide (if needed)
- [ ] Approval for production deployment

---

## Questions for Review

After implementation and testing, please answer:

1. **Stock Distances:** Do all stock distances look realistic for each handicap tier?

2. **Physics Accuracy:** Do weather conditions affect distances in the expected directions?

3. **Preset Playability:** Are any presets too extreme to be fun? Should any be adjusted?

4. **Edge Cases:** Were any unexpected edge cases discovered during testing?

5. **Performance:** Are API response times still acceptable with the new lookups?

6. **Database Impact:** Should we move stock distances to database for easier updates?

7. **Future Enhancements:** What additional features would make sense (women's distances, junior distances, custom presets per client)?

---

## Success Criteria

This implementation is considered successful if:

1. ✅ All three features implemented and functional in staging
2. ✅ Comprehensive test report shows >95% pass rate
3. ✅ Stock distances are mathematically sound and realistic
4. ✅ Weather presets produce playable, differentiated experiences
5. ✅ No breaking changes to existing API functionality
6. ✅ API documentation is complete and accurate
7. ✅ Performance remains acceptable (<500ms response time)
8. ✅ Ready for production deployment pending business approval

---

## Technical Notes

### Environment Variables

Ensure staging environment has:
- `DATABASE_URL` - PostgreSQL connection string (staging)
- `WEATHER_API_KEY` - For real weather lookups (if still needed)
- `ENV` - Set to "staging" (NOT "production")

### Code Organization

Suggested file structure:
```
/app
  /models
    conditions.py        # Conditions override model
    handicap.py          # Handicap tier mapping
    stock_distances.py   # Stock distance lookup table
  /services
    physics_engine.py    # Core physics calculations
    weather_service.py   # Weather data fetching
  /routes
    calculate.py         # Main calculate endpoint
    presets.py           # Presets endpoint
  /constants
    presets.py           # WEATHER_PRESETS dictionary
    distances.py         # STOCK_DISTANCES dictionary
```

### Database Considerations

Current implementation uses in-memory dictionaries. Future database schema if needed:

```sql
CREATE TABLE stock_distances (
  id SERIAL PRIMARY KEY,
  handicap_tier VARCHAR(10),  -- 'scratch', 'low', 'mid', 'high'
  club VARCHAR(20),            -- 'driver', '7_iron', etc.
  carry_distance INTEGER,
  ball_speed DECIMAL(5,2),
  launch_angle DECIMAL(4,2),
  spin_rate INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE weather_presets (
  id SERIAL PRIMARY KEY,
  preset_key VARCHAR(50) UNIQUE,
  name VARCHAR(100),
  description TEXT,
  wind_speed INTEGER,
  wind_direction INTEGER,
  temperature INTEGER,
  humidity INTEGER,
  altitude INTEGER,
  air_pressure DECIMAL(4,2),
  difficulty VARCHAR(20),
  tags TEXT[],
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

But for MVP, in-memory is fine.

---

## Contact & Support

**Project Owner:** Vinnie  
**Platform:** Railway (staging and production)  
**Repository:** golfphysicsio (GitHub)

For questions during implementation, document them in the test report.

---

**END OF SPECIFICATION**
