import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Code, Building2, BarChart3, Zap, Shield, Copy, Check } from 'lucide-react'

export default function Enterprise() {
  const [copiedCode, setCopiedCode] = useState(null)

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const CodeBlock = ({ code, id }) => (
    <div className="relative">
      <div className="absolute top-2 right-2">
        <button
          onClick={() => copyCode(code, id)}
          className="text-gray-400 hover:text-white p-2 rounded"
          title="Copy code"
        >
          {copiedCode === id ? <Check className="w-4 h-4 text-golf-green" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm font-mono">
        <code>{code}</code>
      </pre>
    </div>
  )

  const metadataFields = [
    { field: 'facility_id', type: 'string', description: 'Your facility/location identifier' },
    { field: 'bay_number', type: 'integer', description: 'Bay or station number (1-100)' },
    { field: 'player_id', type: 'string', description: 'Player identifier from your system' },
    { field: 'session_id', type: 'string', description: 'Group multiple shots together' },
    { field: 'timestamp', type: 'string', description: 'ISO 8601 timestamp of shot' },
    { field: 'club_type', type: 'string', description: 'driver, 3-wood, 7-iron, etc.' },
    { field: 'club_speed', type: 'float', description: 'Club head speed in mph' },
    { field: 'smash_factor', type: 'float', description: 'Ball speed / club speed ratio' },
    { field: 'launch_direction', type: 'float', description: 'Horizontal launch angle (degrees)' },
    { field: 'player_handicap', type: 'integer', description: 'Player handicap (0-54)' },
  ]

  const requestExample = `POST https://api.golfphysics.io/api/v1/calculate
X-API-Key: your_api_key_here
Content-Type: application/json

{
  // CORE PHYSICS DATA (required)
  "ball_speed": 145.2,
  "launch_angle": 12.3,
  "spin_rate": 5842,
  "spin_axis": -5,

  // LOCATION (required - or use conditions_override)
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
    "club_speed": 105.3,
    "smash_factor": 1.38,
    "launch_direction": -2.1,
    "player_handicap": 15
  }
}`

  const responseExample = `{
  "request_id": "uuid-1234-5678",
  "timestamp": "2026-01-18T14:30:05Z",

  // Your metadata echoed back
  "metadata": {
    "facility_id": "inrange_atlanta_001",
    "bay_number": 12,
    "player_id": "user_12345",
    "club_type": "7-iron",
    "player_handicap": 15
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
    "location": { "lat": 33.749, "lng": -84.388 }
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
    "baseline_carry_yards": 162,
    "adjusted_carry_yards": 156,
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
    "8mph headwind reducing 3 yards",
    "High humidity (72%) reducing 2 yards",
    "Cool temperature (65F) costing 1 yard"
  ],

  // Recommendations
  "recommendations": {
    "club_suggestion": "Consider 6-iron for 162-yard target",
    "optimal_launch_angle": 13.2
  }
}`

  const jsExample = `const axios = require('axios');

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
        club_type: shotData.clubType,
        player_handicap: shotData.handicap
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
}`

  const pythonExample = `import requests
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
                'club_type': shot_data['club_type'],
                'player_handicap': shot_data.get('handicap')
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

    return data`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-golf text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Enterprise Integration</h1>
          <p className="text-xl max-w-3xl opacity-90">
            Seamlessly integrate Golf Physics API into your launch monitor platform.
            Built for high-volume, mission-critical applications.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="card">
            <Building2 className="w-12 h-12 text-golf-green mb-4" />
            <h3 className="text-lg font-semibold mb-2">Multi-Facility Support</h3>
            <p className="text-gray-600 text-sm">Track usage across all your locations with facility-level analytics</p>
          </div>
          <div className="card">
            <BarChart3 className="w-12 h-12 text-golf-green mb-4" />
            <h3 className="text-lg font-semibold mb-2">Per-Bay Tracking</h3>
            <p className="text-gray-600 text-sm">Monitor performance and usage at the individual bay level</p>
          </div>
          <div className="card">
            <Zap className="w-12 h-12 text-golf-green mb-4" />
            <h3 className="text-lg font-semibold mb-2">Real-Time Responses</h3>
            <p className="text-gray-600 text-sm">Sub-100ms latency for seamless golfer experience</p>
          </div>
          <div className="card">
            <Code className="w-12 h-12 text-golf-green mb-4" />
            <h3 className="text-lg font-semibold mb-2">Simple Integration</h3>
            <p className="text-gray-600 text-sm">REST API with comprehensive documentation and SDKs</p>
          </div>
        </div>

        {/* Request Format */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Request Format</h2>
          <p className="text-gray-600 mb-4">
            Send shot data from your launch monitor along with optional metadata for tracking and analytics.
          </p>
          <CodeBlock code={requestExample} id="request" />
        </div>

        {/* Response Format */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Response Format</h2>
          <p className="text-gray-600 mb-4">
            Receive detailed physics calculations with weather effects breakdown and actionable insights.
          </p>
          <CodeBlock code={responseExample} id="response" />
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
                {metadataFields.map((item) => (
                  <tr key={item.field}>
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">{item.field}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.description}</td>
                  </tr>
                ))}
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
            <CodeBlock code={jsExample} id="js" />
          </div>

          {/* Python */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Python</h3>
            <CodeBlock code={pythonExample} id="python" />
          </div>
        </div>

        {/* Best Practices */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Best Practices</h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-golf-green" />
                  API Key Security
                </h3>
                <p className="text-gray-600">Store API keys securely in environment variables. Never expose keys in client-side code.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-golf-green" />
                  Use Metadata for Analytics
                </h3>
                <p className="text-gray-600">Include facility_id and bay_number to track usage patterns and optimize your facility operations.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-golf-green" />
                  Async Processing
                </h3>
                <p className="text-gray-600">Make API calls asynchronously to avoid blocking your launch monitor's UI. Our typical response time is under 100ms.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Code className="w-5 h-5 text-golf-green" />
                  Display Insights to Golfers
                </h3>
                <p className="text-gray-600">Show the insights array to help golfers understand environmental effects on their shots.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-golf text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Integrate?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Contact our enterprise team to discuss your integration needs and get started.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/contact"
              className="bg-white text-golf-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center justify-center"
            >
              Contact Sales
            </Link>
            <Link
              to="/docs"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-golf-green transition inline-flex items-center justify-center"
            >
              View Full Docs
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
