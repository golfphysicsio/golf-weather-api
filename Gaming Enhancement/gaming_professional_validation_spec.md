# Golf Physics API - Gaming vs Professional Validation Ranges

**Date:** January 18, 2026  
**Priority:** Medium (implement after testing complete)  
**Objective:** Differentiate Gaming API (extreme/fun) from Professional API (realistic/training)

---

## Overview

Currently both APIs share the same validation ranges (0-150mph wind, -40 to 130°F, etc.). This makes sense from a physics standpoint, but we want to:

1. **Gaming API** - Allow EXTREME conditions for entertainment and viral moments
2. **Professional API** - Restrict to REALISTIC conditions for training/accuracy

**Key Insight:** A 250-yard drive with 150mph tailwind = ~475 yards. This is mathematically correct AND insanely fun for gaming. But it's not realistic for professional training.

---

## Current State (Same Ranges)

Both `/api/v1/calculate` and `/api/v1/gaming/trajectory` accept:

```python
wind_speed: 0-150 mph
wind_direction: 0-360 degrees  
temperature: -40 to 130°F
humidity: 0-100%
altitude: -100 to 15,000 ft
air_pressure: 25-32 inHg
```

---

## Desired State (Different Ranges)

### Gaming API - EXTREME Ranges

**Philosophy:** "Real physics, unreal conditions"  
**Use Cases:** Distance challenges, viral moments, entertainment

```python
wind_speed: 0-150 mph           # Hurricane force - hit 500 yard drives!
wind_direction: 0-360 degrees   # Any direction
temperature: -40 to 130°F       # Arctic to desert extreme
humidity: 0-100%                # Full range
altitude: -100 to 15,000 ft     # Death Valley to Everest
air_pressure: 25-32 inHg        # Extreme atmospheric
```

**Example Scenarios:**
- 150mph tailwind → 475+ yard drives (mathematically accurate!)
- 150mph headwind → 85 yard drives (nearly impossible)
- 100mph crosswind → Ball curves 150 yards offline
- 15,000ft altitude → 350+ yard drives (thin air)

### Professional API - REALISTIC Ranges

**Philosophy:** "Tour-accurate conditions for real improvement"  
**Use Cases:** Training, instruction, club fitting, tournament simulation

```python
wind_speed: 0-35 mph            # Realistic tournament maximum
wind_direction: 0-360 degrees   # Any direction
temperature: 32 to 105°F        # Playable conditions
humidity: 0-100%                # Full range
altitude: 0 to 8,000 ft         # Realistic golf courses
air_pressure: 28-31 inHg        # Normal atmospheric range
```

**Rationale:**
- 35mph wind = Very strong but playable (tournament officials might delay)
- 32°F = Cold but playable with winter balls
- 105°F = Hot but playable with hydration
- 8,000ft = Highest major courses (Mexico City ~7,350ft)

---

## Implementation Tasks

### Task 1: Create Separate Validation Models

Create two distinct models for conditions override:

**File:** `app/models/requests.py`

```python
from pydantic import BaseModel, Field

class GamingConditionsOverride(BaseModel):
    """Extreme validation ranges for entertainment/gaming API"""
    wind_speed: int = Field(
        ge=0, le=150,
        description="Wind speed in mph (0-150). Extreme conditions for gaming!"
    )
    wind_direction: int = Field(
        ge=0, le=360,
        description="Wind direction in degrees (0-360)"
    )
    temperature: int = Field(
        ge=-40, le=130,
        description="Temperature in Fahrenheit (-40 to 130). Extreme temps!"
    )
    humidity: int = Field(
        ge=0, le=100,
        description="Humidity percentage (0-100)"
    )
    altitude: int = Field(
        ge=-100, le=15000,
        description="Altitude in feet (-100 to 15,000). From Death Valley to Everest!"
    )
    air_pressure: float = Field(
        ge=25.0, le=32.0,
        description="Air pressure in inHg (25-32)"
    )

class ProfessionalConditionsOverride(BaseModel):
    """Realistic validation ranges for professional/training API"""
    wind_speed: int = Field(
        ge=0, le=35,
        description="Wind speed in mph (0-35). Realistic tournament conditions."
    )
    wind_direction: int = Field(
        ge=0, le=360,
        description="Wind direction in degrees (0-360)"
    )
    temperature: int = Field(
        ge=32, le=105,
        description="Temperature in Fahrenheit (32-105). Playable conditions."
    )
    humidity: int = Field(
        ge=0, le=100,
        description="Humidity percentage (0-100)"
    )
    altitude: int = Field(
        ge=0, le=8000,
        description="Altitude in feet (0-8,000). Realistic golf course elevations."
    )
    air_pressure: float = Field(
        ge=28.0, le=31.0,
        description="Air pressure in inHg (28-31). Normal atmospheric range."
    )
```

### Task 2: Update Gaming API Endpoint

**File:** `app/routers/gaming.py`

Update `/api/v1/gaming/trajectory` to use `GamingConditionsOverride`:

```python
from app.models.requests import GamingConditionsOverride

@router.post("/trajectory")
async def gaming_trajectory(
    request: GamingTrajectoryRequest  # Uses GamingConditionsOverride
):
    # Existing logic
    pass
```

Make sure `GamingTrajectoryRequest` model uses `GamingConditionsOverride` for its `conditions_override` field.

### Task 3: Update Professional API Endpoint

**File:** `app/routers/trajectory.py`

Update `/api/v1/calculate` to use `ProfessionalConditionsOverride`:

```python
from app.models.requests import ProfessionalConditionsOverride

@router.post("/calculate")
async def calculate_trajectory(
    request: CalculateRequest  # Uses ProfessionalConditionsOverride
):
    # Existing logic
    pass
```

Make sure `CalculateRequest` model uses `ProfessionalConditionsOverride` for its `conditions_override` field.

### Task 4: Add EXTREME Gaming Presets

**File:** `app/constants/presets.py`

Add new extreme presets for gaming (in addition to existing ones):

```python
WEATHER_PRESETS = {
    # ... existing presets (calm_day, hurricane_hero, etc.)
    
    # NEW EXTREME PRESETS
    "maximum_tailwind": {
        "name": "Maximum Tailwind",
        "description": "Record-breaking distance mode - 150mph wind at your back!",
        "conditions": {
            "wind_speed": 150,
            "wind_direction": 180,  # Directly behind
            "temperature": 85,
            "humidity": 40,
            "altitude": 5000,  # Added altitude bonus
            "air_pressure": 29.0
        },
        "difficulty": "extreme",
        "tags": ["extreme", "distance-record", "viral", "tailwind"]
    },
    
    "hurricane_apocalypse": {
        "name": "Hurricane Apocalypse",
        "description": "Category 5 hurricane - can you even make contact?",
        "conditions": {
            "wind_speed": 120,
            "wind_direction": 0,  # Direct headwind
            "temperature": 80,
            "humidity": 98,
            "altitude": 0,
            "air_pressure": 27.5
        },
        "difficulty": "extreme",
        "tags": ["extreme", "wind", "hurricane", "impossible"]
    },
    
    "everest_challenge": {
        "name": "Everest Challenge",
        "description": "Thin air at extreme altitude - watch it fly!",
        "conditions": {
            "wind_speed": 40,
            "wind_direction": 270,
            "temperature": -10,
            "humidity": 20,
            "altitude": 15000,  # Near Everest base camp
            "air_pressure": 25.5
        },
        "difficulty": "extreme",
        "tags": ["extreme", "altitude", "thin-air", "distance"]
    },
    
    "crosswind_chaos": {
        "name": "Crosswind Chaos",
        "description": "100mph sidewind - can you keep it on the planet?",
        "conditions": {
            "wind_speed": 100,
            "wind_direction": 90,  # Pure crosswind
            "temperature": 72,
            "humidity": 50,
            "altitude": 500,
            "air_pressure": 30.0
        },
        "difficulty": "extreme",
        "tags": ["extreme", "crosswind", "accuracy-challenge"]
    },
    
    "death_valley_heat": {
        "name": "Death Valley Heat",
        "description": "Extreme heat below sea level - different physics!",
        "conditions": {
            "wind_speed": 15,
            "wind_direction": 225,
            "temperature": 130,  # Record heat
            "humidity": 5,
            "altitude": -100,  # Below sea level
            "air_pressure": 31.5
        },
        "difficulty": "extreme",
        "tags": ["extreme", "heat", "desert", "low-altitude"]
    }
}
```

### Task 5: Update API Documentation

Update Swagger/OpenAPI docs to clearly indicate the different ranges:

**Gaming API (`/api/v1/gaming/trajectory`):**
```
Conditions Override: Extreme ranges for entertainment
- Wind: 0-150 mph (hurricane force!)
- Temp: -40 to 130°F (arctic to desert)
- Altitude: -100 to 15,000 ft (Death Valley to Everest)

Use for: Distance challenges, viral moments, entertainment value
```

**Professional API (`/api/v1/calculate`):**
```
Conditions Override: Realistic ranges for training
- Wind: 0-35 mph (tournament conditions)
- Temp: 32 to 105°F (playable weather)
- Altitude: 0 to 8,000 ft (realistic courses)

Use for: Training, instruction, club fitting, accuracy
```

---

## Testing Requirements

After implementation, test the following scenarios:

### Test 1: Gaming API - Accept Extreme Values
```bash
curl -X POST https://staging-url/api/v1/gaming/trajectory \
  -H "Content-Type: application/json" \
  -H "X-API-Key: KEY" \
  -d '{
    "shot": {"player_handicap": 2, "club": "driver"},
    "conditions_override": {
      "wind_speed": 150,
      "wind_direction": 180,
      "temperature": 85,
      "humidity": 40,
      "altitude": 5000,
      "air_pressure": 29.0
    }
  }'
```
**Expected:** ✅ 200 OK, carry ~450-500 yards (extreme tailwind)

### Test 2: Gaming API - Use Extreme Presets
```bash
curl -X POST https://staging-url/api/v1/gaming/trajectory \
  -H "Content-Type: application/json" \
  -H "X-API-Key: KEY" \
  -d '{
    "shot": {"player_handicap": 2, "club": "driver"},
    "preset": "maximum_tailwind"
  }'
```
**Expected:** ✅ 200 OK, carry ~450-500 yards

### Test 3: Professional API - Reject Extreme Values
```bash
curl -X POST https://staging-url/api/v1/calculate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: KEY" \
  -d '{
    "ball_speed": 165,
    "launch_angle": 11.2,
    "spin_rate": 2600,
    "conditions_override": {
      "wind_speed": 150,
      "temperature": 85,
      "humidity": 40,
      "altitude": 5000,
      "air_pressure": 29.0
    }
  }'
```
**Expected:** ❌ 422 Validation Error - "wind_speed must be <= 35"

### Test 4: Professional API - Accept Realistic Values
```bash
curl -X POST https://staging-url/api/v1/calculate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: KEY" \
  -d '{
    "ball_speed": 165,
    "launch_angle": 11.2,
    "spin_rate": 2600,
    "conditions_override": {
      "wind_speed": 30,
      "wind_direction": 180,
      "temperature": 85,
      "humidity": 40,
      "altitude": 5000,
      "air_pressure": 29.5
    }
  }'
```
**Expected:** ✅ 200 OK, carry ~295-305 yards (moderate tailwind + altitude)

### Test 5: Verify Physics - Maximum Tailwind
```bash
curl -X POST https://staging-url/api/v1/gaming/trajectory \
  -H "Content-Type: application/json" \
  -H "X-API-Key: KEY" \
  -d '{
    "shot": {"player_handicap": 15, "club": "driver"},
    "preset": "maximum_tailwind"
  }'
```
**Expected:** ✅ Mid-handicapper (normally ~230 yds) should hit ~400+ yards
**Physics Check:** Extreme tailwind should ADD 170-200 yards

### Test 6: Verify Physics - Hurricane Apocalypse
```bash
curl -X POST https://staging-url/api/v1/gaming/trajectory \
  -H "Content-Type: application/json" \
  -H "X-API-Key: KEY" \
  -d '{
    "shot": {"player_handicap": 2, "club": "driver"},
    "preset": "hurricane_apocalypse"
  }'
```
**Expected:** ✅ Scratch golfer (normally ~280 yds) should hit ~80-100 yards
**Physics Check:** 120mph headwind should REDUCE distance by ~65-70%

---

## Expected Outcomes

### Physics Validation

Create a comparison table showing the different ranges produce realistic results:

| Scenario | Normal Carry | Gaming (150mph tail) | Professional (30mph tail) |
|----------|--------------|----------------------|---------------------------|
| Scratch Driver | 280 yds | ~475 yds | ~305 yds |
| Mid-handicap Driver | 230 yds | ~400 yds | ~250 yds |
| Scratch 7-iron | 180 yds | ~310 yds | ~195 yds |

| Scenario | Normal Carry | Gaming (120mph head) | Professional (30mph head) |
|----------|--------------|----------------------|---------------------------|
| Scratch Driver | 280 yds | ~90 yds | ~250 yds |
| Mid-handicap Driver | 230 yds | ~75 yds | ~210 yds |
| Scratch 7-iron | 180 yds | ~60 yds | ~165 yds |

### Marketing Differentiation

**Gaming API Website Section:**
```
🎮 EXTREME WEATHER GAMING

Hit 500-yard drives. Survive 120mph hurricanes. Play golf on Everest.

Real physics. Unreal conditions.

Perfect for:
✓ Entertainment venues (Topgolf, Drive Shack)
✓ Distance record challenges
✓ Viral social content
✓ Weekly tournaments

Features:
• 150mph winds (maximum chaos!)
• Everest altitude (15,000ft thin air)
• Desert heat (130°F physics)
• 5 EXTREME presets included
```

**Professional API Website Section:**
```
⛳ TOUR-ACCURATE TRAINING

Real conditions. Real improvement.

Perfect for:
✓ Launch monitor companies (inRange, TrackMan)
✓ Golf instructors
✓ Club fitters
✓ Serious practice facilities

Features:
• Realistic weather (0-35mph wind)
• Course conditions (32-105°F)
• Altitude adjustments (0-8,000ft)
• Tournament-grade accuracy
```

---

## Error Messages

### Gaming API - Out of Range
```json
{
  "detail": [
    {
      "loc": ["body", "conditions_override", "wind_speed"],
      "msg": "ensure this value is less than or equal to 150",
      "type": "value_error.number.not_le"
    }
  ]
}
```

### Professional API - Out of Range
```json
{
  "detail": [
    {
      "loc": ["body", "conditions_override", "wind_speed"],
      "msg": "ensure this value is less than or equal to 35",
      "type": "value_error.number.not_le"
    }
  ]
}
```

Different error messages clearly indicate which API and which limits apply.

---

## Implementation Checklist

- [ ] Create `GamingConditionsOverride` model with extreme ranges (0-150mph wind, etc.)
- [ ] Create `ProfessionalConditionsOverride` model with realistic ranges (0-35mph wind, etc.)
- [ ] Update Gaming API to use `GamingConditionsOverride`
- [ ] Update Professional API to use `ProfessionalConditionsOverride`
- [ ] Add 5 new EXTREME presets to gaming constants
- [ ] Update API documentation/Swagger with clear range differences
- [ ] Run 6 validation tests (3 gaming, 3 professional)
- [ ] Create physics comparison table showing extreme vs realistic results
- [ ] Update website/marketing copy to reflect differentiation
- [ ] Deploy to staging for validation
- [ ] Run final smoke tests
- [ ] Deploy to production

---

## Success Criteria

1. ✅ Gaming API accepts 150mph wind, returns ~475 yard drives
2. ✅ Professional API rejects 150mph wind with clear error
3. ✅ Professional API accepts 30mph wind, returns realistic distances
4. ✅ All 5 new EXTREME presets work and produce dramatic results
5. ✅ Physics is mathematically accurate for both ranges
6. ✅ Documentation clearly explains the different philosophies
7. ✅ Error messages clearly indicate which limits apply

---

## File Summary

**Files to Modify:**
- `app/models/requests.py` - Add two new validation models
- `app/routers/gaming.py` - Use GamingConditionsOverride
- `app/routers/trajectory.py` - Use ProfessionalConditionsOverride
- `app/constants/presets.py` - Add 5 new EXTREME presets

**Files to Create:**
- Test script for validation scenarios
- Physics comparison report (markdown table)

**Estimated Time:** 2-3 hours

---

## Notes

- Physics engine stays the same - it can handle any conditions
- Only validation ranges differ between APIs
- This reinforces dual-market positioning without duplicating code
- EXTREME presets are clearly labeled so users know what they're getting
- Professional API still allows challenging conditions (35mph wind is serious!)

---

**END OF SPECIFICATION**
