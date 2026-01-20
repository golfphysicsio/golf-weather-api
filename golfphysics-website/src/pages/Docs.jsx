import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Check, Zap, Shield, Code, Book, BarChart3, Gamepad2, Target, Building2 } from 'lucide-react'

export default function Docs() {
  const [activeSection, setActiveSection] = useState('quickstart')
  const [copiedCode, setCopiedCode] = useState(null)

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const sections = [
    { id: 'quickstart', label: 'Quick Start', icon: Zap },
    { id: 'authentication', label: 'Authentication', icon: Shield },
    { id: 'trajectory', label: 'POST /trajectory', icon: Code, category: 'professional' },
    { id: 'enterprise-metadata', label: 'Enterprise Metadata', icon: Building2, category: 'professional' },
    { id: 'gaming-presets', label: 'Gaming Presets', icon: Gamepad2, category: 'gaming' },
    { id: 'game-modes', label: 'Game Modes', icon: Gamepad2, category: 'gaming' },
    { id: 'sdks', label: 'SDKs', icon: Book },
    { id: 'errors', label: 'Error Handling', icon: BarChart3 },
  ]

  const CodeBlock = ({ code, language, id }) => (
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

  const gameModes = [
    { name: 'hurricane_hero', wind: '40-60 mph tailwind', temp: '75°F', description: 'Maximum distance mode' },
    { name: 'arctic_assault', wind: '20-30 mph headwind', temp: '-10°F', description: 'Frozen conditions' },
    { name: 'desert_inferno', wind: '15 mph crosswind', temp: '115°F', description: 'Extreme heat' },
    { name: 'monsoon_madness', wind: '35 mph variable', temp: '85°F', humidity: '95%', description: 'Storm conditions' },
    { name: 'mountain_challenge', wind: '10 mph', altitude: '8,500 ft', description: 'Thin air golf' },
    { name: 'maximum_tailwind', wind: '80 mph tailwind', temp: '85°F', description: 'Record-breaking distances' },
    { name: 'hurricane_apocalypse', wind: '100+ mph tailwind', temp: '85°F', description: 'Category 5 winds' },
    { name: 'everest_challenge', wind: '25 mph', altitude: '14,000 ft', description: 'Extreme altitude' },
    { name: 'crosswind_chaos', wind: '50 mph crosswind', temp: '70°F', description: 'Lateral control test' },
    { name: 'death_valley_heat', wind: '5 mph', temp: '130°F', description: 'Maximum heat' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">API Documentation</h1>
          <p className="text-gray-600 mt-2">Everything you need to integrate Golf Physics API</p>
          <div className="flex gap-4 mt-4">
            <Link to="/professional" className="inline-flex items-center gap-2 text-sm text-pro-blue hover:underline">
              <Target className="w-4 h-4" />
              Professional API
            </Link>
            <Link to="/gaming" className="inline-flex items-center gap-2 text-sm text-gaming-orange hover:underline">
              <Gamepad2 className="w-4 h-4" />
              Gaming API
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="sticky top-24">
              <ul className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon
                  return (
                    <li key={section.id}>
                      <button
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeSection === section.id
                            ? section.category === 'gaming'
                              ? 'bg-gaming-orange text-white'
                              : section.category === 'professional'
                              ? 'bg-pro-blue text-white'
                              : 'bg-golf-green text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{section.label}</span>
                        {section.category === 'gaming' && activeSection !== section.id && (
                          <span className="ml-auto text-xs bg-gaming-orange/10 text-gaming-orange px-1.5 py-0.5 rounded">Gaming</span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Quick Start */}
            {activeSection === 'quickstart' && (
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Start</h2>
                <p className="text-gray-600 mb-6">Get up and running with Golf Physics API in minutes.</p>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Request Your API Key</h3>
                    <p className="text-gray-600 mb-4">
                      <Link to="/contact" className="text-golf-green hover:underline">Request API access</Link> - we'll email your credentials. Select Professional, Gaming, or Both based on your needs.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Make Your First Request</h3>
                    <div className="mb-4">
                      <p className="text-sm font-medium text-pro-blue mb-2">Professional API - Accurate Physics</p>
                      <CodeBlock
                        id="quickstart-professional"
                        code={`curl -X POST "https://api.golfphysics.io/v1/trajectory" \\
  -H "X-API-Key: your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "shot": {
      "ball_speed_mph": 150,
      "launch_angle_deg": 12,
      "spin_rate_rpm": 2500
    },
    "conditions": {
      "temperature_f": 72,
      "wind_speed_mph": 10,
      "wind_direction_deg": 0
    }
  }'`}
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gaming-orange mb-2">Gaming API - Extreme Weather Presets</p>
                      <CodeBlock
                        id="quickstart-gaming"
                        code={`curl -X POST "https://api.golfphysics.io/v1/trajectory" \\
  -H "X-API-Key: your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "shot": {
      "ball_speed_mph": 165,
      "launch_angle_deg": 11,
      "spin_rate_rpm": 2200
    },
    "preset": "hurricane_hero",
    "handicap": 15
  }'`}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Use the Response</h3>
                    <CodeBlock
                      id="quickstart-response"
                      code={`{
  "adjusted": {
    "carry": { "yards": 285.4, "meters": 261.0 },
    "total": { "yards": 312.8, "meters": 286.1 },
    "lateral_drift": { "yards": 0.0, "meters": 0.0 },
    "apex_height": { "yards": 32.1, "meters": 29.4 }
  },
  "baseline": {
    "carry": { "yards": 245.2, "meters": 224.2 },
    "total": { "yards": 270.8, "meters": 247.6 }
  },
  "impact_breakdown": {
    "wind_effect": { "yards": 40.2, "meters": 36.8 },
    "temperature_effect": { "yards": 0.0, "meters": 0.0 }
  },
  "game_mode": {
    "name": "Hurricane Hero",
    "difficulty": "medium",
    "conditions_applied": {
      "wind_speed_mph": 50,
      "wind_direction_deg": 180,
      "temperature_f": 75
    }
  }
}`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Authentication */}
            {activeSection === 'authentication' && (
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication</h2>
                <p className="text-gray-600 mb-6">All API requests require authentication via API key.</p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Headers</h3>
                <p className="text-gray-600 mb-4">Include your API key in the request header:</p>
                <CodeBlock
                  id="auth-header"
                  code={`X-API-Key: your_api_key_here`}
                />

                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Rate Limits by Tier</h3>

                <p className="text-sm font-medium text-pro-blue mb-2">Professional API Tiers</p>
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full border border-gray-200 rounded-lg text-sm">
                    <thead className="bg-pro-blue/5">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Tier</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Price</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Requests/Month</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-gray-700">Starter</td>
                        <td className="px-4 py-3 text-gray-700">$299/mo</td>
                        <td className="px-4 py-3 text-gray-700">50,000</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-gray-700">Professional</td>
                        <td className="px-4 py-3 text-gray-700">$599/mo</td>
                        <td className="px-4 py-3 text-gray-700">200,000</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-gray-700">Enterprise</td>
                        <td className="px-4 py-3 text-gray-700">Custom</td>
                        <td className="px-4 py-3 text-gray-700">Unlimited</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-sm font-medium text-gaming-orange mb-2">Gaming API Tiers</p>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg text-sm">
                    <thead className="bg-gaming-orange/5">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Tier</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Price</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Requests/Month</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-gray-700">Venue</td>
                        <td className="px-4 py-3 text-gray-700">$1,499/mo</td>
                        <td className="px-4 py-3 text-gray-700">500,000</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-gray-700">Venue Pro</td>
                        <td className="px-4 py-3 text-gray-700">$2,499/mo</td>
                        <td className="px-4 py-3 text-gray-700">2,000,000</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-gray-700">Enterprise</td>
                        <td className="px-4 py-3 text-gray-700">$3,999+/mo</td>
                        <td className="px-4 py-3 text-gray-700">Unlimited</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  <Link to="/pricing" className="text-golf-green hover:underline">View full pricing details</Link>
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Rate Limit Headers</h3>
                <p className="text-gray-600 mb-4">Rate limit info is returned with every response:</p>
                <CodeBlock
                  id="rate-headers"
                  code={`X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1640995200`}
                />
              </div>
            )}

            {/* Trajectory Endpoint */}
            {activeSection === 'trajectory' && (
              <div className="prose max-w-none">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">POST /v1/trajectory</h2>
                  <span className="text-xs bg-pro-blue/10 text-pro-blue px-2 py-1 rounded-full">Professional</span>
                </div>
                <p className="text-gray-600 mb-6">Calculate adjusted shot trajectory based on environmental conditions with tour-accurate physics.</p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Endpoint</h3>
                <CodeBlock
                  id="trajectory-endpoint"
                  code={`POST https://api.golfphysics.io/v1/trajectory`}
                />

                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Request Body</h3>
                <CodeBlock
                  id="trajectory-request"
                  code={`{
  "shot": {
    "ball_speed_mph": 150,      // Required: 50-225 mph
    "launch_angle_deg": 12,     // Required: -10 to 60 degrees
    "spin_rate_rpm": 2500,      // Required: 0-15000 rpm
    "spin_axis_deg": 0,         // Optional: -90 to 90 (default: 0)
    "direction_deg": 0          // Optional: -45 to 45 (default: 0)
  },
  "conditions": {
    "wind_speed_mph": 10,       // Optional: 0-100 (default: 0)
    "wind_direction_deg": 0,    // Optional: 0-360 (default: 0)
    "temperature_f": 72,        // Optional: -20 to 130 (default: 70)
    "altitude_ft": 500,         // Optional: -1000 to 15000 (default: 0)
    "humidity_pct": 50,         // Optional: 0-100 (default: 50)
    "pressure_inhg": 29.92      // Optional: 25-32 (default: 29.92)
  }
}`}
                />

                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Response</h3>
                <p className="text-gray-600 mb-4">All distance values include both yards and meters:</p>
                <CodeBlock
                  id="trajectory-response"
                  code={`{
  "adjusted": {
    "carry": { "yards": 220.9, "meters": 202.0 },
    "total": { "yards": 249.6, "meters": 228.2 },
    "lateral_drift": { "yards": 0.0, "meters": 0.0 },
    "apex_height": { "yards": 30.5, "meters": 27.9 },
    "flight_time_seconds": 6.32,
    "landing_angle_deg": 46.5
  },
  "baseline": {
    "carry": { "yards": 234.2, "meters": 214.2 },
    "total": { "yards": 270.8, "meters": 247.6 }
  },
  "impact_breakdown": {
    "wind_effect": { "yards": -13.3, "meters": -12.2 },
    "wind_lateral": { "yards": 0.0, "meters": 0.0 },
    "temperature_effect": { "yards": 0.0, "meters": 0.0 },
    "altitude_effect": { "yards": 0.0, "meters": 0.0 },
    "humidity_effect": { "yards": 0.0, "meters": 0.0 },
    "total_adjustment": { "yards": -13.3, "meters": -12.2 }
  }
}`}
                />
              </div>
            )}

            {/* Enterprise Metadata */}
            {activeSection === 'enterprise-metadata' && (
              <div className="prose max-w-none">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Enterprise Metadata</h2>
                  <span className="text-xs bg-pro-blue/10 text-pro-blue px-2 py-1 rounded-full">Professional</span>
                </div>

                <p className="text-gray-600 mb-6">
                  For launch monitor integrations, you can include optional metadata to track
                  shots across facilities, bays, and players.
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
                  <p className="font-semibold mb-2">All metadata fields are optional</p>
                  <p className="text-sm text-gray-600">
                    Metadata is echoed back in the response and can be used for your internal
                    tracking and analytics. It does not affect physics calculations.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Request with Metadata</h3>
                <CodeBlock
                  id="enterprise-request"
                  code={`{
  "ball_speed": 145.2,
  "launch_angle": 12.3,
  "spin_rate": 5842,
  "location": {"lat": 33.749, "lng": -84.388},

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
                />

                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Enhanced Response</h3>
                <p className="text-gray-600 mb-4">
                  The response includes your metadata, plus insights and recommendations:
                </p>
                <CodeBlock
                  id="enterprise-response"
                  code={`{
  "request_id": "uuid-1234-5678",
  "timestamp": "2026-01-18T14:30:05Z",

  "metadata": {
    "facility_id": "your_facility_id",
    "bay_number": 12,
    "player_id": "player_12345",
    "club_type": "7-iron"
  },

  "trajectory": {
    "carry_distance_yards": 156,
    "total_distance_yards": 164,
    "apex_height_feet": 82
  },

  "insights": [
    "8mph headwind reducing 3 yards",
    "High humidity (72%) reducing 2 yards"
  ],

  "recommendations": {
    "club_suggestion": "Consider 6-iron for 162-yard target",
    "optimal_launch_angle": 13.2
  }
}`}
                />

                <div className="mt-8">
                  <Link to="/enterprise" className="text-golf-green hover:underline font-semibold">
                    View full Enterprise Integration guide →
                  </Link>
                </div>
              </div>
            )}

            {/* Gaming Presets */}
            {activeSection === 'gaming-presets' && (
              <div className="prose max-w-none">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Gaming Presets</h2>
                  <span className="text-xs bg-gaming-orange/10 text-gaming-orange px-2 py-1 rounded-full">Gaming</span>
                </div>
                <p className="text-gray-600 mb-6">
                  Use preset game modes instead of manual conditions. Presets include handicap-adjusted difficulty
                  for fair competition across skill levels.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Request with Preset</h3>
                <CodeBlock
                  id="gaming-preset-request"
                  code={`{
  "shot": {
    "ball_speed_mph": 165,
    "launch_angle_deg": 11,
    "spin_rate_rpm": 2200
  },
  "preset": "hurricane_hero",  // Game mode preset name
  "handicap": 15               // Optional: adjusts difficulty (0-36)
}`}
                />

                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Handicap Adjustment</h3>
                <p className="text-gray-600 mb-4">
                  When you include a handicap, conditions are scaled to maintain competitive balance:
                </p>
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full border border-gray-200 rounded-lg text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Handicap</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Wind Adjustment</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Difficulty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-gray-700">0-5 (Scratch)</td>
                        <td className="px-4 py-3 text-gray-700">100% of preset</td>
                        <td className="px-4 py-3 text-gray-700">Full challenge</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-gray-700">6-15 (Low)</td>
                        <td className="px-4 py-3 text-gray-700">85% of preset</td>
                        <td className="px-4 py-3 text-gray-700">Moderate</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-gray-700">16-24 (Mid)</td>
                        <td className="px-4 py-3 text-gray-700">70% of preset</td>
                        <td className="px-4 py-3 text-gray-700">Accessible</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-gray-700">25-36 (High)</td>
                        <td className="px-4 py-3 text-gray-700">55% of preset</td>
                        <td className="px-4 py-3 text-gray-700">Beginner-friendly</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Response with Game Mode Info</h3>
                <CodeBlock
                  id="gaming-preset-response"
                  code={`{
  "adjusted": {
    "carry": { "yards": 285.4, "meters": 261.0 },
    "total": { "yards": 312.8, "meters": 286.1 },
    "lateral_drift": { "yards": 0.0, "meters": 0.0 }
  },
  "baseline": {
    "carry": { "yards": 245.2, "meters": 224.2 },
    "total": { "yards": 270.8, "meters": 247.6 }
  },
  "game_mode": {
    "name": "Hurricane Hero",
    "preset": "hurricane_hero",
    "difficulty": "medium",
    "handicap_applied": 15,
    "conditions_applied": {
      "wind_speed_mph": 42.5,  // 85% of 50mph for handicap 15
      "wind_direction_deg": 180,
      "temperature_f": 75
    }
  },
  "leaderboard": {
    "distance_score": 312.8,
    "bonus_multiplier": 1.15,
    "final_score": 359.7
  }
}`}
                />
              </div>
            )}

            {/* Game Modes */}
            {activeSection === 'game-modes' && (
              <div className="prose max-w-none">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Available Game Modes</h2>
                  <span className="text-xs bg-gaming-orange/10 text-gaming-orange px-2 py-1 rounded-full">Gaming</span>
                </div>
                <p className="text-gray-600 mb-6">
                  10 extreme weather challenges, each with unique physics-based conditions.
                </p>

                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg text-sm">
                    <thead className="bg-gaming-orange/5">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Preset Name</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Conditions</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {gameModes.map((mode, index) => (
                        <tr key={mode.name} className={index >= 5 ? 'bg-red-50/30' : ''}>
                          <td className="px-4 py-3 font-mono text-sm text-gray-700">
                            {mode.name}
                            {index >= 5 && (
                              <span className="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Extreme</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            <div className="space-y-1">
                              <div>{mode.wind}</div>
                              <div className="text-gray-500 text-xs">
                                {mode.temp}
                                {mode.humidity && `, ${mode.humidity} humidity`}
                                {mode.altitude && `, ${mode.altitude}`}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-700">{mode.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Example: Hurricane Hero</h3>
                <CodeBlock
                  id="hurricane-hero-example"
                  code={`// Hurricane Hero: 50mph tailwind, 75°F
// A scratch golfer's 165mph ball speed drive:
// - Baseline carry: 245 yards
// - Wind boost: +40 yards
// - Final carry: 285 yards
// - Total distance: 312+ yards

const response = await fetch('https://api.golfphysics.io/v1/trajectory', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    shot: {
      ball_speed_mph: 165,
      launch_angle_deg: 11,
      spin_rate_rpm: 2200
    },
    preset: 'hurricane_hero'
  })
});`}
                />

                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Example: Crosswind Chaos</h3>
                <CodeBlock
                  id="crosswind-example"
                  code={`// Crosswind Chaos: 50mph crosswind
// Tests lateral control and shot shaping
// Great for closest-to-pin competitions

const response = await fetch('https://api.golfphysics.io/v1/trajectory', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    shot: {
      ball_speed_mph: 140,
      launch_angle_deg: 25,
      spin_rate_rpm: 7500,
      spin_axis_deg: -15  // Draw to fight the wind
    },
    preset: 'crosswind_chaos',
    handicap: 18
  })
});`}
                />
              </div>
            )}

            {/* SDKs */}
            {activeSection === 'sdks' && (
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">SDKs & Client Libraries</h2>
                <p className="text-gray-600 mb-6">Official SDKs for popular platforms.</p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">JavaScript / TypeScript</h3>
                <CodeBlock
                  id="sdk-js-install"
                  code={`npm install @golfphysics/sdk`}
                />
                <CodeBlock
                  id="sdk-js-usage"
                  code={`import { GolfPhysicsClient } from '@golfphysics/sdk';

const client = new GolfPhysicsClient({
  apiKey: process.env.GOLF_PHYSICS_API_KEY
});

// Professional API: Custom conditions
const proResult = await client.trajectory({
  shot: {
    ball_speed_mph: 150,
    launch_angle_deg: 12,
    spin_rate_rpm: 2500
  },
  conditions: {
    temperature_f: 72,
    wind_speed_mph: 10
  }
});

// Gaming API: Use presets
const gameResult = await client.trajectory({
  shot: {
    ball_speed_mph: 165,
    launch_angle_deg: 11,
    spin_rate_rpm: 2200
  },
  preset: 'hurricane_hero',
  handicap: 15
});

console.log(\`Pro carry: \${proResult.adjusted.carry.yards} yards\`);
console.log(\`Game carry: \${gameResult.adjusted.carry.yards} yards\`);`}
                />

                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Python</h3>
                <CodeBlock
                  id="sdk-py-install"
                  code={`pip install golf-physics`}
                />
                <CodeBlock
                  id="sdk-py-usage"
                  code={`from golf_physics import GolfPhysicsClient
import os

client = GolfPhysicsClient(api_key=os.environ['GOLF_PHYSICS_API_KEY'])

# Professional API
pro_result = client.trajectory(
    shot={
        'ball_speed_mph': 150,
        'launch_angle_deg': 12,
        'spin_rate_rpm': 2500
    },
    conditions={
        'temperature_f': 72,
        'wind_speed_mph': 10
    }
)

# Gaming API
game_result = client.trajectory(
    shot={
        'ball_speed_mph': 165,
        'launch_angle_deg': 11,
        'spin_rate_rpm': 2200
    },
    preset='hurricane_hero',
    handicap=15
)

print(f"Pro carry: {pro_result['adjusted']['carry']['yards']} yards")
print(f"Game carry: {game_result['adjusted']['carry']['yards']} yards")`}
                />
              </div>
            )}

            {/* Errors */}
            {activeSection === 'errors' && (
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Handling</h2>
                <p className="text-gray-600 mb-6">The API uses standard HTTP status codes and returns detailed error messages.</p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Error Response Format</h3>
                <CodeBlock
                  id="error-format"
                  code={`{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}  // Optional additional context
  }
}`}
                />

                <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Common Error Codes</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Code</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">401</td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-700">MISSING_API_KEY</td>
                        <td className="px-4 py-3 text-sm text-gray-700">No API key provided</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">401</td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-700">INVALID_API_KEY</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Invalid or expired API key</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">400</td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-700">INVALID_PRESET</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Unknown game mode preset</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">422</td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-700">VALIDATION_ERROR</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Invalid request parameters</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">429</td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-700">RATE_LIMIT_EXCEEDED</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Too many requests</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">500</td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-700">INTERNAL_ERROR</td>
                        <td className="px-4 py-3 text-sm text-gray-700">Server error</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
