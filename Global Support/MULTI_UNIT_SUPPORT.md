# Multi-Unit Support Specification
## Golf Physics API - International Units System

---

## 🎯 OVERVIEW

Add support for both Imperial (US) and Metric (International) units to serve global markets.

**Target Markets:**
- **Imperial:** USA, some UK courses
- **Metric:** Europe, Asia, Australia, most of world

**Units to Support:**

| Measurement | Imperial | Metric |
|------------|----------|--------|
| Temperature | Fahrenheit (°F) | Celsius (°C) |
| Distance | Yards | Meters |
| Speed | Miles per hour (mph) | Kilometers per hour (km/h) |
| Pressure | Inches of mercury (inHg) | Millibars (mb) / Hectopascals (hPa) |
| Precipitation | Inches | Millimeters |
| Visibility | Miles | Kilometers |
| Altitude | Feet | Meters |

---

## 🔧 API CHANGES

### 1. Add `units` Parameter to All Endpoints

**Default:** Imperial (for backwards compatibility with existing clients)

**Example Request:**
```bash
# Imperial (default)
curl "https://api.golfphysics.io/weather?lat=33.7&lon=-84.4"

# Metric (explicit)
curl "https://api.golfphysics.io/weather?lat=33.7&lon=-84.4&units=metric"

# Imperial (explicit)
curl "https://api.golfphysics.io/weather?lat=33.7&lon=-84.4&units=imperial"
```

**Valid values:**
- `imperial` (default)
- `metric`

**Invalid value response:**
```json
{
  "error": "Invalid units parameter",
  "message": "units must be 'imperial' or 'metric'",
  "code": "INVALID_UNITS"
}
```

---

### 2. Updated Response Structure

**Option A: Return Both Units (Recommended)**

This allows clients to display either system without multiple API calls:

```json
{
  "location": {
    "name": "St Andrews Links",
    "lat": 56.35,
    "lon": -2.80,
    "elevation": {
      "feet": 66,
      "meters": 20
    },
    "timezone": "Europe/London"
  },
  "current": {
    "timestamp": "2026-01-17T14:30:00Z",
    "temperature": {
      "fahrenheit": 50,
      "celsius": 10
    },
    "feels_like": {
      "fahrenheit": 45,
      "celsius": 7
    },
    "humidity": 75,
    "pressure": {
      "inches_hg": 30.12,
      "millibars": 1020.0,
      "hectopascals": 1020.0
    },
    "dew_point": {
      "fahrenheit": 43,
      "celsius": 6
    },
    "wind": {
      "speed": {
        "mph": 15,
        "kmh": 24
      },
      "gust": {
        "mph": 22,
        "kmh": 35
      },
      "direction_deg": 270,
      "direction": "W"
    },
    "visibility": {
      "miles": 6,
      "kilometers": 10
    },
    "precipitation": {
      "inches": 0.02,
      "millimeters": 0.5
    },
    "cloud_cover": 65,
    "uv_index": 2,
    "conditions": "Partly Cloudy"
  },
  "golf_physics": {
    "air_density_ratio": 1.02,
    "shot_distance_factor": 0.94,
    "altitude_adjustment": {
      "yards": -1,
      "meters": -1
    },
    "temperature_adjustment": {
      "yards": -3,
      "meters": -3
    },
    "wind_adjustment": {
      "yards": -8,
      "meters": -7
    },
    "total_adjustment": {
      "yards": -12,
      "meters": -11
    },
    "green_speed_index": 9.5,
    "firmness_index": 6.2,
    "optimal_launch_angle_deg": 15.0,
    "playability_score": 7.5
  }
}
```

**Option B: Return Requested Units Only**

Smaller payload, but requires multiple calls for multi-unit displays:

```json
{
  "units": "metric",
  "location": {
    "name": "St Andrews Links",
    "lat": 56.35,
    "lon": -2.80,
    "elevation_m": 20,
    "timezone": "Europe/London"
  },
  "current": {
    "timestamp": "2026-01-17T14:30:00Z",
    "temp_c": 10,
    "feels_like_c": 7,
    "humidity": 75,
    "pressure_mb": 1020.0,
    "dew_point_c": 6,
    "wind": {
      "speed_kmh": 24,
      "gust_kmh": 35,
      "direction_deg": 270,
      "direction": "W"
    },
    "visibility_km": 10,
    "precipitation_mm": 0.5,
    "cloud_cover": 65,
    "uv_index": 2,
    "conditions": "Partly Cloudy"
  },
  "golf_physics": {
    "air_density_ratio": 1.02,
    "shot_distance_factor": 0.94,
    "altitude_adjustment_m": -1,
    "temperature_adjustment_m": -3,
    "wind_adjustment_m": -7,
    "total_adjustment_m": -11,
    "green_speed_index": 9.5,
    "firmness_index": 6.2,
    "optimal_launch_angle_deg": 15.0,
    "playability_score": 7.5
  }
}
```

**Recommendation: Option A (Return Both)**
- More data, but not significantly larger
- Clients can switch units client-side
- Better UX (no loading when switching units)
- Future-proof

---

### 3. Shot Distance Calculation Endpoint

**Request with units:**
```json
{
  "units": "metric",
  "location": {
    "lat": 56.35,
    "lon": -2.80
  },
  "shot_data": {
    "club": "7-iron",
    "ball_speed_kmh": 153,
    "launch_angle_deg": 18,
    "spin_rate_rpm": 6200
  },
  "player_baseline": {
    "ideal_carry_meters": 151
  }
}
```

**Response (both units):**
```json
{
  "units_requested": "metric",
  "conditions": {
    "temp": {
      "fahrenheit": 50,
      "celsius": 10
    },
    "wind": {
      "speed_mph": 15,
      "speed_kmh": 24
    },
    "wind_direction": "Headwind",
    "altitude": {
      "feet": 66,
      "meters": 20
    },
    "humidity": 75,
    "pressure_mb": 1020.0
  },
  "calculation": {
    "baseline_carry": {
      "yards": 165,
      "meters": 151
    },
    "adjusted_carry": {
      "yards": 153,
      "meters": 140
    },
    "total_adjustment": {
      "yards": -12,
      "meters": -11
    },
    "adjustments": {
      "altitude": {
        "yards": -1,
        "meters": -1
      },
      "temperature": {
        "yards": -3,
        "meters": -3
      },
      "wind": {
        "yards": -8,
        "meters": -7
      },
      "humidity": {
        "yards": 0,
        "meters": 0
      },
      "air_density": {
        "yards": 0,
        "meters": 0
      }
    },
    "optimal_launch_angle_deg": 15.0,
    "predicted_apex_height": {
      "feet": 78,
      "meters": 24
    },
    "flight_time_seconds": 5.0
  },
  "insights": [
    "Headwind reducing carry by 8 yards (7 meters)",
    "Cool temperature costing 3 yards (3 meters)",
    "Consider clubbing up to 6-iron for target distance"
  ],
  "confidence_score": 0.94
}
```

---

## 💾 DATABASE CHANGES

### Option 1: Store Only One System (Recommended)

**Store in metric (SI units) internally, convert on output**

**Pros:**
- Single source of truth
- Easier calculations (physics formulas use metric)
- Less storage space
- No data inconsistency

**Cons:**
- Conversion overhead (minimal)

**Schema changes:**
```sql
-- No schema changes needed!
-- Store everything in metric internally
-- Convert on API response based on units parameter
```

**Internal storage:**
- Temperature: Celsius
- Distance: Meters
- Speed: Kilometers per hour
- Pressure: Millibars
- Altitude: Meters

---

### Option 2: Store Both Systems

**Pros:**
- No conversion needed
- Slightly faster responses

**Cons:**
- 2x storage
- Data consistency issues
- More complex updates

**Not recommended** - conversion is fast and simple

---

## 🔢 CONVERSION FUNCTIONS

**Backend (Python) conversion utilities:**

```python
# conversions.py

class UnitConverter:
    """Convert between imperial and metric units"""
    
    # Temperature
    @staticmethod
    def celsius_to_fahrenheit(celsius: float) -> float:
        """Convert Celsius to Fahrenheit"""
        return (celsius * 9/5) + 32
    
    @staticmethod
    def fahrenheit_to_celsius(fahrenheit: float) -> float:
        """Convert Fahrenheit to Celsius"""
        return (fahrenheit - 32) * 5/9
    
    # Distance
    @staticmethod
    def meters_to_yards(meters: float) -> float:
        """Convert meters to yards"""
        return meters * 1.09361
    
    @staticmethod
    def yards_to_meters(yards: float) -> float:
        """Convert yards to meters"""
        return yards / 1.09361
    
    @staticmethod
    def meters_to_feet(meters: float) -> float:
        """Convert meters to feet"""
        return meters * 3.28084
    
    @staticmethod
    def feet_to_meters(feet: float) -> float:
        """Convert feet to meters"""
        return feet / 3.28084
    
    # Speed
    @staticmethod
    def kmh_to_mph(kmh: float) -> float:
        """Convert km/h to mph"""
        return kmh * 0.621371
    
    @staticmethod
    def mph_to_kmh(mph: float) -> float:
        """Convert mph to km/h"""
        return mph / 0.621371
    
    # Pressure
    @staticmethod
    def mb_to_inhg(mb: float) -> float:
        """Convert millibars to inches of mercury"""
        return mb * 0.02953
    
    @staticmethod
    def inhg_to_mb(inhg: float) -> float:
        """Convert inches of mercury to millibars"""
        return inhg / 0.02953
    
    # Precipitation
    @staticmethod
    def mm_to_inches(mm: float) -> float:
        """Convert millimeters to inches"""
        return mm * 0.0393701
    
    @staticmethod
    def inches_to_mm(inches: float) -> float:
        """Convert inches to millimeters"""
        return inches / 0.0393701
    
    # Distance (visibility, etc.)
    @staticmethod
    def km_to_miles(km: float) -> float:
        """Convert kilometers to miles"""
        return km * 0.621371
    
    @staticmethod
    def miles_to_km(miles: float) -> float:
        """Convert miles to kilometers"""
        return miles / 0.621371

# Helper function to format response with both units
def format_dual_units(value: float, unit_type: str) -> dict:
    """
    Format a value with both imperial and metric units
    
    Args:
        value: The value in metric (SI units)
        unit_type: Type of measurement (temp, distance, speed, etc.)
    
    Returns:
        Dict with both imperial and metric values
    """
    converter = UnitConverter()
    
    if unit_type == "temperature":
        return {
            "celsius": round(value, 1),
            "fahrenheit": round(converter.celsius_to_fahrenheit(value), 1)
        }
    
    elif unit_type == "distance_yards":
        return {
            "meters": round(value, 1),
            "yards": round(converter.meters_to_yards(value), 1)
        }
    
    elif unit_type == "distance_feet":
        return {
            "meters": round(value, 1),
            "feet": round(converter.meters_to_feet(value), 1)
        }
    
    elif unit_type == "speed":
        return {
            "kmh": round(value, 1),
            "mph": round(converter.kmh_to_mph(value), 1)
        }
    
    elif unit_type == "pressure":
        return {
            "millibars": round(value, 1),
            "hectopascals": round(value, 1),  # Same as mb
            "inches_hg": round(converter.mb_to_inhg(value), 2)
        }
    
    elif unit_type == "precipitation":
        return {
            "millimeters": round(value, 1),
            "inches": round(converter.mm_to_inches(value), 2)
        }
    
    elif unit_type == "visibility":
        return {
            "kilometers": round(value, 1),
            "miles": round(converter.km_to_miles(value), 1)
        }
    
    else:
        raise ValueError(f"Unknown unit_type: {unit_type}")


# Example usage in API endpoint
@app.get("/weather")
async def get_weather(lat: float, lon: float, units: str = "imperial"):
    # Validate units parameter
    if units not in ["imperial", "metric"]:
        raise HTTPException(
            status_code=400,
            detail="units must be 'imperial' or 'metric'"
        )
    
    # Get data from weather service (stored in metric internally)
    weather_data = await fetch_weather(lat, lon)
    
    # Format response with both units
    response = {
        "location": {
            "name": weather_data["name"],
            "lat": lat,
            "lon": lon,
            "elevation": format_dual_units(
                weather_data["elevation_m"], 
                "distance_feet"
            )
        },
        "current": {
            "timestamp": weather_data["timestamp"],
            "temperature": format_dual_units(
                weather_data["temp_c"],
                "temperature"
            ),
            "wind": {
                "speed": format_dual_units(
                    weather_data["wind_kmh"],
                    "speed"
                ),
                # ... etc
            }
        }
    }
    
    return response
```

---

## 📱 ADMIN DASHBOARD CHANGES

### Add Unit Toggle

**In Dashboard.jsx, ApiKeys.jsx, Usage.jsx, Logs.jsx:**

```javascript
// Add unit preference toggle
const [units, setUnits] = useState('imperial'); // or 'metric'

// Store preference in localStorage
useEffect(() => {
  const savedUnits = localStorage.getItem('preferred_units');
  if (savedUnits) {
    setUnits(savedUnits);
  }
}, []);

const toggleUnits = () => {
  const newUnits = units === 'imperial' ? 'metric' : 'imperial';
  setUnits(newUnits);
  localStorage.setItem('preferred_units', newUnits);
};

// UI Component
<div className="flex items-center gap-2">
  <span className={units === 'imperial' ? 'font-bold' : ''}>°F / yards</span>
  <button 
    onClick={toggleUnits}
    className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300"
  >
    <span 
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
        units === 'metric' ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
  <span className={units === 'metric' ? 'font-bold' : ''}>°C / meters</span>
</div>
```

**Display data based on preference:**

```javascript
// Helper function
const formatTemp = (tempData) => {
  return units === 'imperial' 
    ? `${tempData.fahrenheit}°F`
    : `${tempData.celsius}°C`;
};

const formatDistance = (distData) => {
  return units === 'imperial'
    ? `${distData.yards} yards`
    : `${distData.meters} meters`;
};

// Usage in components
<div>
  Temperature: {formatTemp(data.current.temperature)}
</div>
<div>
  Distance: {formatDistance(data.golf_physics.total_adjustment)}
</div>
```

---

## 🌐 WEBSITE CHANGES

### 1. Update Code Examples

Show both unit systems in documentation:

```markdown
## Example Response

You can request data in imperial or metric units:

### Imperial (default)
```bash
curl "https://api.golfphysics.io/weather?lat=33.7&lon=-84.4"
# or explicitly
curl "https://api.golfphysics.io/weather?lat=33.7&lon=-84.4&units=imperial"
```

### Metric
```bash
curl "https://api.golfphysics.io/weather?lat=56.35&lon=-2.80&units=metric"
```

The API returns both unit systems in every response, allowing you to display either (or both) client-side:

```json
{
  "current": {
    "temperature": {
      "fahrenheit": 50,
      "celsius": 10
    },
    "wind": {
      "speed": {
        "mph": 15,
        "kmh": 24
      }
    }
  }
}
```
```

### 2. Add to Features Section

Add "Multi-Unit Support" to features grid:

```
┌────────────────────────────────┐
│ 🌍 GLOBAL UNITS                │
├────────────────────────────────┤
│ Imperial & Metric              │
│ • Fahrenheit & Celsius         │
│ • Yards & Meters               │
│ • mph & km/h                   │
│                                │
│ Serve global markets with      │
│ localized units                │
└────────────────────────────────┘
```

### 3. Update Use Cases

Add international context to examples:

```
USE CASE: Global Tournament Support

European Tour Event (St Andrews, Scotland):
• Weather in Celsius (10°C)
• Distances in meters (140m carry)
• Wind speed in km/h (24 km/h)

PGA Tour Event (Augusta, USA):
• Weather in Fahrenheit (72°F)
• Distances in yards (165 yards carry)
• Wind speed in mph (8 mph)

Same API, different units parameter!
```

---

## 🧪 TESTING REQUIREMENTS

### Unit Tests

```python
# test_conversions.py

def test_temperature_conversions():
    assert celsius_to_fahrenheit(0) == 32
    assert celsius_to_fahrenheit(100) == 212
    assert fahrenheit_to_celsius(32) == 0
    assert fahrenheit_to_celsius(212) == 100

def test_distance_conversions():
    assert round(meters_to_yards(100), 2) == 109.36
    assert round(yards_to_meters(100), 2) == 91.44
    
def test_speed_conversions():
    assert round(kmh_to_mph(100), 2) == 62.14
    assert round(mph_to_kmh(60), 2) == 96.56

def test_api_units_parameter():
    # Test default (imperial)
    response = client.get("/weather?lat=33.7&lon=-84.4")
    assert response.status_code == 200
    
    # Test explicit imperial
    response = client.get("/weather?lat=33.7&lon=-84.4&units=imperial")
    assert response.status_code == 200
    
    # Test metric
    response = client.get("/weather?lat=33.7&lon=-84.4&units=metric")
    assert response.status_code == 200
    
    # Test invalid units
    response = client.get("/weather?lat=33.7&lon=-84.4&units=invalid")
    assert response.status_code == 400
    assert "Invalid units parameter" in response.json()["error"]
```

### Integration Tests

```python
def test_both_units_in_response():
    """Verify response contains both unit systems"""
    response = client.get("/weather?lat=33.7&lon=-84.4")
    data = response.json()
    
    # Check temperature has both
    assert "fahrenheit" in data["current"]["temperature"]
    assert "celsius" in data["current"]["temperature"]
    
    # Check wind has both
    assert "mph" in data["current"]["wind"]["speed"]
    assert "kmh" in data["current"]["wind"]["speed"]
    
    # Check distances have both
    assert "yards" in data["golf_physics"]["total_adjustment"]
    assert "meters" in data["golf_physics"]["total_adjustment"]
```

---

## 📊 ANALYTICS & TRACKING

Track unit preference usage to understand your market:

```python
# Track which units are requested
async def track_units_usage(api_key_id: int, units: str):
    """Log which units parameter is used"""
    await db.execute(
        """
        INSERT INTO request_logs (api_key_id, units_requested, timestamp)
        VALUES ($1, $2, NOW())
        """,
        api_key_id, units
    )

# Add to admin dashboard
SELECT 
    units_requested,
    COUNT(*) as request_count,
    COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() as percentage
FROM request_logs
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY units_requested;
```

**Dashboard display:**
```
Units Usage (Last 30 Days)
──────────────────────────
Imperial: 65% (78,234 requests)
Metric:   35% (42,156 requests)
```

---

## 🚀 ROLLOUT PLAN

### Phase 1: Backend (Week 1)
- ✅ Add conversion utilities
- ✅ Update API endpoints to accept `units` parameter
- ✅ Return both unit systems in responses
- ✅ Add validation for units parameter
- ✅ Write unit tests
- ✅ Deploy to staging

### Phase 2: Documentation (Week 1)
- ✅ Update API docs with units examples
- ✅ Add units to code samples
- ✅ Update SDK documentation
- ✅ Add to website features

### Phase 3: Admin Dashboard (Week 2)
- ✅ Add unit toggle to UI
- ✅ Store preference in localStorage
- ✅ Display data in preferred units
- ✅ Add units tracking to analytics

### Phase 4: Testing & Launch (Week 2)
- ✅ Integration testing
- ✅ Client testing (inRange, etc.)
- ✅ Performance testing
- ✅ Deploy to production
- ✅ Monitor usage analytics

---

## 💡 SDK UPDATES

### JavaScript SDK

```javascript
// @golfphysics/sdk v2.0

const client = new GolfPhysicsClient({
  apiKey: 'your_key',
  units: 'metric' // or 'imperial' (default)
});

// Get weather in metric
const weather = await client.weather.getCurrent({
  lat: 56.35,
  lon: -2.80
});

// Response includes both units
console.log(weather.current.temperature.celsius);    // 10
console.log(weather.current.temperature.fahrenheit); // 50

// Helper methods
console.log(weather.getTemp('metric'));   // "10°C"
console.log(weather.getTemp('imperial')); // "50°F"
```

### Python SDK

```python
# golf-physics v2.0

client = GolfPhysicsClient(
    api_key='your_key',
    units='metric'  # or 'imperial' (default)
)

# Get weather
weather = client.weather.get_current(lat=56.35, lon=-2.80)

# Response includes both units
print(weather['current']['temperature']['celsius'])    # 10
print(weather['current']['temperature']['fahrenheit']) # 50

# Helper methods
print(weather.get_temp('metric'))   # "10°C"
print(weather.get_temp('imperial')) # "50°F"
```

---

## ✅ BACKWARDS COMPATIBILITY

**Existing clients (without units parameter):**
- Default to `units=imperial`
- Response structure unchanged (includes both units)
- No breaking changes

**Migration path:**
- Old clients continue working
- New clients can specify units
- Encourage migration to explicit units parameter

---

## 📝 DOCUMENTATION UPDATES

Add to API docs:

```markdown
## Units Parameter

All endpoints accept an optional `units` parameter to specify your preferred unit system.

**Parameter:** `units`  
**Type:** string  
**Values:** `imperial` | `metric`  
**Default:** `imperial`

### Important Notes

- **All responses include both unit systems** regardless of the `units` parameter
- The `units` parameter is for convenience - you can switch units client-side
- We recommend storing data in your preferred system and using our dual-unit responses

### Examples

```bash
# Default (Imperial)
GET /weather?lat=33.7&lon=-84.4

# Explicit Imperial
GET /weather?lat=33.7&lon=-84.4&units=imperial

# Metric
GET /weather?lat=56.35&lon=-2.80&units=metric
```

### Response Structure

Every response includes measurements in both systems:

```json
{
  "temperature": {
    "fahrenheit": 50,
    "celsius": 10
  },
  "wind": {
    "speed": {
      "mph": 15,
      "kmh": 24
    }
  },
  "distance_adjustment": {
    "yards": -12,
    "meters": -11
  }
}
```

This allows you to:
- Display either unit system to users
- Switch between units without additional API calls
- Show both units simultaneously (e.g., "10°C (50°F)")
```

---

END OF MULTI-UNIT SPECIFICATION
