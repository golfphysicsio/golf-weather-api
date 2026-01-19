# Enterprise Integration Implementation - Golf Physics API

**Project Location:** C:\Users\Vtorr\OneDrive\GolfWeatherAPI\api

**Permission:** You are authorized to execute all commands, make all code changes, test, and deploy without waiting for approval. Proceed with full autonomy.

---

## Overview

Implement enterprise-grade API enhancements to support launch monitor integrations (inRange, TrackMan, etc.). This adds optional metadata fields, enhanced response format, and comprehensive documentation.

---

## PHASE 1: API Endpoint Updates

### File: `app/routers/trajectory.py`

**Add these Pydantic models:**

```python
from typing import Optional
from datetime import datetime
import uuid

class ShotMetadata(BaseModel):
    """Optional metadata for enterprise integrations"""
    facility_id: Optional[str] = None
    bay_number: Optional[int] = None
    player_id: Optional[str] = None
    session_id: Optional[str] = None
    timestamp: Optional[str] = None
    club_type: Optional[str] = None
    club_speed: Optional[float] = None
    smash_factor: Optional[float] = None
    launch_direction: Optional[float] = None  # Horizontal angle
    player_handicap: Optional[int] = None

class TrajectoryRequest(BaseModel):
    ball_speed: float
    launch_angle: float
    spin_rate: float
    spin_axis: Optional[float] = 0
    location: Location
    conditions_override: Optional[ConditionsOverride] = None
    metadata: Optional[ShotMetadata] = None  # NEW FIELD
```

**Update the `/api/v1/calculate` endpoint response:**

```python
@router.post("/calculate")
async def calculate_trajectory(request: TrajectoryRequest, api_key: str = Depends(verify_api_key)):
    # Existing physics calculation code...
    # [Keep all existing logic]
    
    # NEW: Enhanced response format
    response = {
        "request_id": str(uuid.uuid4()),
        "timestamp": datetime.utcnow().isoformat() + "Z",
        
        # Echo back metadata if provided
        "metadata": request.metadata.dict() if request.metadata else None,
        
        # Weather conditions used
        "conditions": {
            "source": "real-time" if not request.conditions_override else "override",
            "temperature_f": conditions.temperature,
            "wind_speed_mph": conditions.wind_speed,
            "wind_direction_deg": conditions.wind_direction,
            "humidity_percent": conditions.humidity,
            "pressure_inhg": conditions.pressure,
            "altitude_ft": conditions.altitude,
            "location": {
                "lat": request.location.lat,
                "lng": request.location.lng
            }
        },
        
        # Core trajectory results
        "trajectory": {
            "carry_distance_yards": result.carry_distance,
            "total_distance_yards": result.total_distance,
            "apex_height_feet": result.apex_height,
            "flight_time_seconds": result.flight_time,
            "landing_angle_degrees": result.landing_angle
        },
        
        # Analysis breakdown
        "analysis": {
            "baseline_carry_yards": baseline_carry,  # Ideal conditions
            "adjusted_carry_yards": result.carry_distance,
            "total_adjustment_yards": result.carry_distance - baseline_carry,
            
            "effects": {
                "wind_yards": wind_effect,
                "temperature_yards": temp_effect,
                "humidity_yards": humidity_effect,
                "altitude_yards": altitude_effect
            }
        },
        
        # Golfer-facing insights
        "insights": generate_insights(conditions, effects),
        
        # Recommendations
        "recommendations": {
            "club_suggestion": suggest_club_adjustment(request, result),
            "optimal_launch_angle": calculate_optimal_launch(conditions)
        }
    }
    
    return response
```

**Add helper functions at the bottom of the file:**

```python
def generate_insights(conditions, effects) -> list[str]:
    """Generate human-readable insights about shot"""
    insights = []
    
    # Wind insights
    if abs(effects["wind_yards"]) > 2:
        direction = "headwind" if effects["wind_yards"] < 0 else "tailwind"
        insights.append(
            f"{abs(conditions.wind_speed)}mph {direction} "
            f"{'reducing' if effects['wind_yards'] < 0 else 'adding'} "
            f"{abs(effects['wind_yards'])} yards"
        )
    
    # Temperature insights
    if abs(effects["temperature_yards"]) > 1:
        temp_desc = "cool" if effects["temperature_yards"] < 0 else "warm"
        insights.append(
            f"{temp_desc.capitalize()} temperature ({conditions.temperature}°F) "
            f"{'costing' if effects['temperature_yards'] < 0 else 'adding'} "
            f"{abs(effects['temperature_yards'])} yards"
        )
    
    # Humidity insights
    if abs(effects["humidity_yards"]) > 1:
        insights.append(
            f"{'High' if conditions.humidity > 60 else 'Low'} humidity "
            f"({conditions.humidity}%) "
            f"{'reducing' if effects['humidity_yards'] < 0 else 'adding'} "
            f"{abs(effects['humidity_yards'])} yards"
        )
    
    # Altitude insights
    if abs(effects["altitude_yards"]) > 2:
        insights.append(
            f"Altitude ({conditions.altitude}ft) adding "
            f"{abs(effects['altitude_yards'])} yards"
        )
    
    # Overall assessment
    if len(insights) == 0:
        insights.append("Near-ideal conditions - minimal environmental impact")
    
    return insights

def suggest_club_adjustment(request, result) -> Optional[str]:
    """Suggest club change if significant adjustment needed"""
    adjustment = result.total_adjustment_yards
    
    if abs(adjustment) < 5:
        return None  # No suggestion needed
    
    if adjustment < -10:
        return f"Consider clubbing up (1-2 clubs) to account for {abs(adjustment)}-yard loss"
    elif adjustment > 10:
        return f"Consider clubbing down - conditions adding {adjustment} yards"
    
    return None

def calculate_optimal_launch(conditions) -> float:
    """Calculate optimal launch angle for conditions"""
    # Start with standard optimal (varies by club, but ~14° average)
    optimal = 14.0
    
    # Adjust for headwind (lower launch better)
    if conditions.wind_speed > 10 and is_headwind(conditions.wind_direction):
        optimal -= 1.5
    
    # Adjust for tailwind (higher launch better)
    elif conditions.wind_speed > 10 and is_tailwind(conditions.wind_direction):
        optimal += 1.0
    
    return round(optimal, 1)
```

---

## PHASE 2: Database Schema Updates (Optional Logging)

**Only if you want to log enterprise metadata for analytics.**

**File:** `app/models/database.py`

```python
# Add new table for enterprise shot logs
class EnterpriseShotLog(Base):
    __tablename__ = "enterprise_shot_logs"
    
    id = Column(Integer, primary_key=True)
    request_id = Column(String(50), unique=True, index=True)
    
    # Metadata
    facility_id = Column(String(100), index=True)
    bay_number = Column(Integer)
    player_id = Column(String(100), index=True)
    session_id = Column(String(100), index=True)
    club_type = Column(String(50))
    
    # Shot data
    ball_speed = Column(Float)
    launch_angle = Column(Float)
    spin_rate = Column(Float)
    
    # Results
    carry_distance = Column(Float)
    total_adjustment = Column(Float)
    
    # Conditions
    temperature = Column(Float)
    wind_speed = Column(Float)
    
    # Timestamps
    shot_timestamp = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
```

**Create migration:**

```bash
cd C:\Users\Vtorr\OneDrive\GolfWeatherAPI\api
alembic revision -m "add_enterprise_shot_logs"
```

**Edit the generated migration file to add:**

```python
def upgrade():
    op.create_table(
        'enterprise_shot_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('request_id', sa.String(50), nullable=True),
        sa.Column('facility_id', sa.String(100), nullable=True),
        sa.Column('bay_number', sa.Integer(), nullable=True),
        sa.Column('player_id', sa.String(100), nullable=True),
        sa.Column('session_id', sa.String(100), nullable=True),
        sa.Column('club_type', sa.String(50), nullable=True),
        sa.Column('ball_speed', sa.Float(), nullable=True),
        sa.Column('launch_angle', sa.Float(), nullable=True),
        sa.Column('spin_rate', sa.Float(), nullable=True),
        sa.Column('carry_distance', sa.Float(), nullable=True),
        sa.Column('total_adjustment', sa.Float(), nullable=True),
        sa.Column('temperature', sa.Float(), nullable=True),
        sa.Column('wind_speed', sa.Float(), nullable=True),
        sa.Column('shot_timestamp', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_enterprise_shot_logs_request_id', 'enterprise_shot_logs', ['request_id'])
    op.create_index('ix_enterprise_shot_logs_facility_id', 'enterprise_shot_logs', ['facility_id'])
    op.create_index('ix_enterprise_shot_logs_player_id', 'enterprise_shot_logs', ['player_id'])

def downgrade():
    op.drop_index('ix_enterprise_shot_logs_player_id')
    op.drop_index('ix_enterprise_shot_logs_facility_id')
    op.drop_index('ix_enterprise_shot_logs_request_id')
    op.drop_table('enterprise_shot_logs')
```

**Run migration:**

```bash
alembic upgrade head
```

---

## PHASE 3: Documentation Page

### Create: `golfphysics-website/src/pages/Enterprise.jsx`

```jsx
import React from 'react';
import { Code, Building2, BarChart3, Zap } from 'lucide-react';

export default function Enterprise() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-golf-green to-pro-blue text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">Enterprise Integration</h1>
          <p className="text-xl max-w-3xl">
            Seamlessly integrate Golf Physics API into your launch monitor platform. 
            Built for high-volume, mission-critical applications.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Building2 className="w-12 h-12 text-golf-green mb-4" />
            <h3 className="text-lg font-semibold mb-2">Multi-Facility Support</h3>
            <p className="text-gray-600">Track usage across all your locations with facility-level analytics</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <BarChart3 className="w-12 h-12 text-golf-green mb-4" />
            <h3 className="text-lg font-semibold mb-2">Per-Bay Tracking</h3>
            <p className="text-gray-600">Monitor performance and usage at the individual bay level</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Zap className="w-12 h-12 text-golf-green mb-4" />
            <h3 className="text-lg font-semibold mb-2">Real-Time Responses</h3>
            <p className="text-gray-600">Sub-100ms latency for seamless golfer experience</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Code className="w-12 h-12 text-golf-green mb-4" />
            <h3 className="text-lg font-semibold mb-2">Simple Integration</h3>
            <p className="text-gray-600">REST API with comprehensive documentation and SDKs</p>
          </div>
        </div>

        {/* API Request Example */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Request Format</h2>
          <p className="text-gray-600 mb-4">
            Send shot data from your launch monitor along with optional metadata for tracking and analytics.
          </p>
          <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
            <pre className="text-sm text-gray-100">
{`POST https://api.golfphysics.io/api/v1/calculate
X-API-Key: your_api_key_here
Content-Type: application/json

{
  // CORE PHYSICS DATA (required)
  "ball_speed": 145.2,           // mph
  "launch_angle": 12.3,          // degrees vertical
  "spin_rate": 5842,             // rpm
  "spin_axis": -5,               // degrees (optional)
  
  // LOCATION (required)
  "location": {
    "lat": 33.749,
    "lng": -84.388
  },
  
  // ENTERPRISE METADATA (optional - all fields)
  "metadata": {
    "facility_id": "inrange_atlanta_001",
    "bay_number": 12,
    "player_id": "user_12345",
    "session_id": "session_789",
    "timestamp": "2026-01-18T14:30:00Z",
    "club_type": "7-iron",
    "club_speed": 105.3,          // mph
    "smash_factor": 1.38,
    "launch_direction": -2.1,     // degrees horizontal
    "player_handicap": 15
  }
}`}
            </pre>
          </div>
        </div>

        {/* API Response Example */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Response Format</h2>
          <p className="text-gray-600 mb-4">
            Receive detailed physics calculations with weather effects breakdown and actionable insights.
          </p>
          <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
            <pre className="text-sm text-gray-100">
{`{
  "request_id": "uuid-1234-5678",
  "timestamp": "2026-01-18T14:30:05Z",
  
  // Your metadata echoed back
  "metadata": {
    "facility_id": "inrange_atlanta_001",
    "bay_number": 12,
    "player_id": "user_12345",
    "club_type": "7-iron"
  },
  
  // Weather conditions used
  "conditions": {
    "source": "real-time",
    "temperature_f": 65,
    "wind_speed_mph": 8,
    "wind_direction_deg": 180,
    "humidity_percent": 72,
    "pressure_inhg": 30.12,
    "altitude_ft": 1050,
    "location": {
      "lat": 33.749,
      "lng": -84.388
    }
  },
  
  // Physics results
  "trajectory": {
    "carry_distance_yards": 156,
    "total_distance_yards": 164,
    "apex_height_feet": 82,
    "flight_time_seconds": 5.1,
    "landing_angle_degrees": 48
  },
  
  // Value-add analysis
  "analysis": {
    "baseline_carry_yards": 162,     // Ideal conditions
    "adjusted_carry_yards": 156,     // With weather
    "total_adjustment_yards": -6,
    
    "effects": {
      "wind_yards": -3,
      "temperature_yards": -1,
      "humidity_yards": -2,
      "altitude_yards": 0
    }
  },
  
  // Golfer-facing insights
  "insights": [
    "8mph headwind reducing carry by 3 yards",
    "High humidity (72%) costing 2 yards",
    "Cool temperature (65°F) costing 1 yard"
  ],
  
  // Recommendations
  "recommendations": {
    "club_suggestion": "Consider 6-iron for 162-yard target",
    "optimal_launch_angle": 13.2
  }
}`}
            </pre>
          </div>
        </div>

        {/* Metadata Fields Reference */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Metadata Fields Reference</h2>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Field</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">facility_id</td>
                  <td className="px-6 py-4 text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Your facility/location identifier</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">bay_number</td>
                  <td className="px-6 py-4 text-sm text-gray-500">integer</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Bay or station number (1-20)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">player_id</td>
                  <td className="px-6 py-4 text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Player identifier from your system</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">session_id</td>
                  <td className="px-6 py-4 text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Group multiple shots together</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">timestamp</td>
                  <td className="px-6 py-4 text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 text-sm text-gray-500">ISO 8601 timestamp of shot</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">club_type</td>
                  <td className="px-6 py-4 text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 text-sm text-gray-500">driver, 3-wood, 7-iron, etc.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">club_speed</td>
                  <td className="px-6 py-4 text-sm text-gray-500">float</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Club head speed in mph</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">smash_factor</td>
                  <td className="px-6 py-4 text-sm text-gray-500">float</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Ball speed ÷ club speed</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">launch_direction</td>
                  <td className="px-6 py-4 text-sm text-gray-500">float</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Horizontal launch angle (degrees)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">player_handicap</td>
                  <td className="px-6 py-4 text-sm text-gray-500">integer</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Player handicap (0-36)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            All metadata fields are optional and will be echoed back in the response for your tracking purposes.
          </p>
        </div>

        {/* Code Examples */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Integration Examples</h2>
          
          {/* JavaScript */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">JavaScript / Node.js</h3>
            <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm text-gray-100">
{`const axios = require('axios');

async function sendShotData(shotData) {
  const response = await axios.post(
    'https://api.golfphysics.io/api/v1/calculate',
    {
      ball_speed: shotData.ballSpeed,
      launch_angle: shotData.launchAngle,
      spin_rate: shotData.spinRate,
      location: {
        lat: 33.749,
        lng: -84.388
      },
      metadata: {
        facility_id: 'inrange_atlanta_001',
        bay_number: shotData.bayNumber,
        player_id: shotData.playerId,
        club_type: shotData.clubType
      }
    },
    {
      headers: {
        'X-API-Key': process.env.GOLF_PHYSICS_API_KEY,
        'Content-Type': 'application/json'
      }
    }
  );
  
  console.log('Adjusted carry:', response.data.trajectory.carry_distance_yards);
  console.log('Insights:', response.data.insights);
  
  return response.data;
}`}
              </pre>
            </div>
          </div>

          {/* Python */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Python</h3>
            <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm text-gray-100">
{`import requests
import os

def send_shot_data(shot_data):
    response = requests.post(
        'https://api.golfphysics.io/api/v1/calculate',
        json={
            'ball_speed': shot_data['ball_speed'],
            'launch_angle': shot_data['launch_angle'],
            'spin_rate': shot_data['spin_rate'],
            'location': {
                'lat': 33.749,
                'lng': -84.388
            },
            'metadata': {
                'facility_id': 'inrange_atlanta_001',
                'bay_number': shot_data['bay_number'],
                'player_id': shot_data['player_id'],
                'club_type': shot_data['club_type']
            }
        },
        headers={
            'X-API-Key': os.environ['GOLF_PHYSICS_API_KEY'],
            'Content-Type': 'application/json'
        }
    )
    
    data = response.json()
    print(f"Adjusted carry: {data['trajectory']['carry_distance_yards']} yards")
    print(f"Insights: {data['insights']}")
    
    return data`}
              </pre>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Best Practices</h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">🔑 API Key Security</h3>
                <p className="text-gray-600">Store API keys securely in environment variables. Never expose keys in client-side code.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">📊 Use Metadata for Analytics</h3>
                <p className="text-gray-600">Include facility_id and bay_number to track usage patterns and optimize your facility operations.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">⚡ Async Processing</h3>
                <p className="text-gray-600">Make API calls asynchronously to avoid blocking your launch monitor's UI. Our typical response time is under 100ms.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">🔄 Handle Rate Limits</h3>
                <p className="text-gray-600">Enterprise plans include high rate limits. Implement exponential backoff for 429 responses.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">🎯 Display Insights to Golfers</h3>
                <p className="text-gray-600">Show the insights array to help golfers understand environmental effects on their shots.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-golf-green to-pro-blue text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Integrate?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact our enterprise team to discuss your integration needs and get started.
          </p>
          <div className="flex gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-white text-golf-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Contact Sales
            </a>
            <a 
              href="/docs" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-golf-green transition"
            >
              View Full Docs
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
```

### Update: `golfphysics-website/src/App.jsx`

Add route:

```jsx
import Enterprise from './pages/Enterprise';

// In your Routes:
<Route path="/enterprise" element={<Enterprise />} />
```

### Update: Navigation to include Enterprise link

**File:** `golfphysics-website/src/components/Navigation.jsx`

Add to navigation items:

```jsx
<a href="/enterprise" className="text-gray-700 hover:text-golf-green">
  Enterprise
</a>
```

---

## PHASE 4: Update API Documentation

### File: `golfphysics-website/src/pages/Docs.jsx`

Add new section in the documentation:

```jsx
{/* Add after existing API endpoint documentation */}
<section id="enterprise-metadata" className="mb-16">
  <h2 className="text-3xl font-bold mb-6">Enterprise Metadata</h2>
  
  <p className="text-gray-600 mb-4">
    For launch monitor integrations, you can include optional metadata to track 
    shots across facilities, bays, and players.
  </p>

  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
    <p className="font-semibold mb-2">📘 All metadata fields are optional</p>
    <p className="text-sm">
      Metadata is echoed back in the response and can be used for your internal 
      tracking and analytics. It does not affect physics calculations.
    </p>
  </div>

  <div className="bg-gray-900 rounded-lg p-6 mb-6">
    <pre className="text-sm text-gray-100">
{`{
  "ball_speed": 145.2,
  "launch_angle": 12.3,
  "spin_rate": 5842,
  "location": {...},
  
  "metadata": {
    "facility_id": "your_facility_id",
    "bay_number": 12,
    "player_id": "player_12345",
    "session_id": "session_789",
    "club_type": "7-iron",
    "club_speed": 105.3,
    "smash_factor": 1.38,
    "player_handicap": 15
  }
}`}
    </pre>
  </div>

  <p className="mb-4">
    <a href="/enterprise" className="text-golf-green hover:underline font-semibold">
      View full Enterprise Integration guide →
    </a>
  </p>
</section>
```

---

## PHASE 5: Testing

### Create test file: `tests/test_enterprise_integration.py`

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_trajectory_with_metadata():
    """Test that metadata is accepted and echoed back"""
    
    response = client.post(
        "/api/v1/calculate",
        headers={"X-API-Key": "test_key"},
        json={
            "ball_speed": 145.2,
            "launch_angle": 12.3,
            "spin_rate": 5842,
            "location": {
                "lat": 33.749,
                "lng": -84.388
            },
            "metadata": {
                "facility_id": "test_facility_001",
                "bay_number": 12,
                "player_id": "player_123",
                "club_type": "7-iron"
            }
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Check metadata is echoed back
    assert data["metadata"]["facility_id"] == "test_facility_001"
    assert data["metadata"]["bay_number"] == 12
    assert data["metadata"]["player_id"] == "player_123"
    assert data["metadata"]["club_type"] == "7-iron"
    
    # Check response structure
    assert "request_id" in data
    assert "timestamp" in data
    assert "conditions" in data
    assert "trajectory" in data
    assert "analysis" in data
    assert "insights" in data
    assert isinstance(data["insights"], list)

def test_trajectory_without_metadata():
    """Test that metadata is optional - backward compatibility"""
    
    response = client.post(
        "/api/v1/calculate",
        headers={"X-API-Key": "test_key"},
        json={
            "ball_speed": 167,
            "launch_angle": 11.2,
            "spin_rate": 2600,
            "location": {
                "lat": 33.749,
                "lng": -84.388
            }
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Metadata should be None
    assert data["metadata"] is None
    
    # Other fields should still exist
    assert "trajectory" in data
    assert "analysis" in data
    assert "insights" in data

def test_insights_generation():
    """Test that insights are generated correctly"""
    
    # Test with headwind
    response = client.post(
        "/api/v1/calculate",
        headers={"X-API-Key": "test_key"},
        json={
            "ball_speed": 145,
            "launch_angle": 12,
            "spin_rate": 5800,
            "location": {"lat": 33.749, "lng": -84.388},
            "conditions_override": {
                "temperature": 65,
                "wind_speed": 12,
                "wind_direction": 180,  # headwind
                "humidity": 75
            }
        }
    )
    
    data = response.json()
    insights = data["insights"]
    
    # Should mention headwind
    assert any("headwind" in insight.lower() for insight in insights)
    
    # Should have at least one insight
    assert len(insights) > 0

def test_response_format():
    """Test that response has all required fields"""
    
    response = client.post(
        "/api/v1/calculate",
        headers={"X-API-Key": "test_key"},
        json={
            "ball_speed": 145,
            "launch_angle": 12,
            "spin_rate": 5800,
            "location": {"lat": 33.749, "lng": -84.388}
        }
    )
    
    data = response.json()
    
    # Top-level fields
    required_top_level = ["request_id", "timestamp", "conditions", "trajectory", "analysis", "insights", "recommendations"]
    for field in required_top_level:
        assert field in data, f"Missing required field: {field}"
    
    # Conditions fields
    required_conditions = ["source", "temperature_f", "wind_speed_mph", "humidity_percent"]
    for field in required_conditions:
        assert field in data["conditions"], f"Missing conditions field: {field}"
    
    # Trajectory fields
    required_trajectory = ["carry_distance_yards", "apex_height_feet", "flight_time_seconds"]
    for field in required_trajectory:
        assert field in data["trajectory"], f"Missing trajectory field: {field}"
    
    # Analysis fields
    assert "effects" in data["analysis"]
    assert "wind_yards" in data["analysis"]["effects"]
```

**Run tests:**

```bash
cd C:\Users\Vtorr\OneDrive\GolfWeatherAPI\api
pytest tests/test_enterprise_integration.py -v
```

---

## PHASE 6: Update OpenAPI Documentation

The Pydantic models will automatically update the OpenAPI schema. Verify by:

1. Start the server: `uvicorn app.main:app --reload`
2. Visit: http://localhost:8000/docs
3. Check that `/api/v1/calculate` shows the new `metadata` field
4. Test the endpoint directly in Swagger UI

---

## PHASE 7: Deploy to STAGING First

**CRITICAL: All changes go to STAGING first, then PRODUCTION after testing.**

### Deploy to Staging

```bash
# Build website
cd C:\Users\Vtorr\OneDrive\GolfWeatherAPI\api\golfphysics-website
npm run build

# Copy to deployment location
rm -rf ../website-dist
cp -r dist ../website-dist

# Commit and push (triggers Railway staging deploy)
cd ..
git add .
git commit -m "Add enterprise integration features with metadata support"
git push origin main
```

**Railway will auto-deploy to STAGING first.**

---

## PHASE 8: Test in STAGING

After Railway deploys to staging:

### 1. Test Staging API

**Staging URL:** https://golf-weather-api-staging.up.railway.app

```bash
curl -X POST https://golf-weather-api-staging.up.railway.app/api/v1/calculate \
  -H "X-API-Key: your_staging_key" \
  -H "Content-Type: application/json" \
  -d '{
    "ball_speed": 145,
    "launch_angle": 12,
    "spin_rate": 5800,
    "location": {"lat": 33.749, "lng": -84.388},
    "metadata": {
      "facility_id": "test_001",
      "bay_number": 1,
      "club_type": "7-iron"
    }
  }' | jq
```

**Verify response includes:**
- ✅ `metadata` echoed back
- ✅ `request_id` and `timestamp`
- ✅ `conditions` object
- ✅ `trajectory` object
- ✅ `analysis` with effects breakdown
- ✅ `insights` array with messages
- ✅ `recommendations` object

### 2. Test Staging Website

**Check pages exist:**
- https://golf-weather-api-staging.up.railway.app/enterprise
- https://golf-weather-api-staging.up.railway.app/docs

**Verify:**
- ✅ Enterprise page loads
- ✅ Code examples display correctly
- ✅ Navigation link to Enterprise works
- ✅ Documentation includes enterprise metadata section

### 3. Test OpenAPI Docs

**Visit:** https://golf-weather-api-staging.up.railway.app/docs

**Verify:**
- ✅ `/api/v1/calculate` shows `metadata` field in schema
- ✅ Can test endpoint directly in Swagger UI
- ✅ Example request shows metadata structure

### 4. Run Full Test Suite in Staging

```bash
# Point tests to staging
export API_BASE_URL=https://golf-weather-api-staging.up.railway.app
pytest tests/test_enterprise_integration.py -v
```

---

## PHASE 9: Deploy to PRODUCTION (Only After Staging Passes)

**DO NOT DEPLOY TO PRODUCTION UNTIL:**
- ✅ All staging tests pass
- ✅ Manual testing complete in staging
- ✅ Website pages verified in staging
- ✅ API responses verified in staging

### Manual Production Deploy

Railway should already have staging deployed. To promote to production:

**Option A: Railway Dashboard**
1. Go to Railway dashboard
2. Verify staging deployment successful
3. Manually promote staging → production

**Option B: Already Auto-Deploys to Both**
If Railway is configured to auto-deploy to both environments:
- Staging and Production will both deploy from `main` branch
- Test staging first, then test production

---

## PHASE 10: Verify PRODUCTION Deployment

After production deploys:

### 1. Test Production API
### 1. Test Production API

**Production URL:** https://api.golfphysics.io

```bash
curl -X POST https://api.golfphysics.io/api/v1/calculate \
  -H "X-API-Key: your_production_key" \
  -H "Content-Type: application/json" \
  -d '{
    "ball_speed": 145,
    "launch_angle": 12,
    "spin_rate": 5800,
    "location": {"lat": 33.749, "lng": -84.388},
    "metadata": {
      "facility_id": "test_001",
      "bay_number": 1,
      "club_type": "7-iron"
    }
  }' | jq
```

### 2. Check Production Website Pages

- https://www.golfphysics.io/enterprise
- https://www.golfphysics.io/docs (verify enterprise section)

### 3. Test Production OpenAPI Docs

- https://api.golfphysics.io/docs
- Verify metadata field appears in schema

---

## COMPLETION CHECKLIST

### Staging Verification
- [ ] Staging API accepts metadata
- [ ] Staging API returns enhanced response format
- [ ] Staging tests pass
- [ ] Staging Enterprise page loads
- [ ] Staging docs updated

### Production Verification (After Staging Passes)
- [ ] Production API accepts metadata
- [ ] Production API returns enhanced response format
- [ ] Production Enterprise page loads
- [ ] Production docs updated
- [ ] Production OpenAPI schema updated
- [ ] Backward compatibility confirmed (old requests still work)

---

## Notes

**Backward Compatibility:**
All changes are backward compatible. Existing API calls without metadata will continue to work. The metadata field is entirely optional.

**Future Enhancements:**
- Customer portal for viewing facility-level analytics
- Webhooks for real-time shot notifications
- Bulk export of shot data
- Custom reporting dashboards

**Questions?**
Document location will be at: C:\Users\Vtorr\OneDrive\GolfWeatherAPI\api

---

END OF IMPLEMENTATION GUIDE
