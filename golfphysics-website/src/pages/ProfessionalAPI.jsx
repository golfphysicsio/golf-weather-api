import { Link } from 'react-router-dom'
import {
  Target, CheckCircle, ArrowRight, Wind, Thermometer, Mountain,
  Droplets, Gauge, Settings, Shield, Clock, Code, Zap
} from 'lucide-react'

export default function ProfessionalAPI() {
  const useCases = [
    {
      icon: '🎯',
      title: 'Launch Monitor Integration',
      subtitle: 'inRange, TrackMan, Foresight, etc.',
      description: 'Add atmospheric adjustments to ball flight data. Show golfers their true distances anywhere.',
      benefit: 'Players trust your numbers because they reflect real conditions.',
    },
    {
      icon: '👨‍🏫',
      title: 'Golf Instruction',
      subtitle: 'Coaches and Teaching Pros',
      description: 'Compare indoor and outdoor performance. Understand how conditions affect student data.',
      benefit: 'More accurate coaching insights, better lesson outcomes.',
    },
    {
      icon: '🔧',
      title: 'Club Fitting',
      subtitle: 'Custom Fitting Studios',
      description: 'Account for altitude and temperature in fitting sessions. Ensure recommendations work everywhere.',
      benefit: 'Fittings that transfer to the course, not just the studio.',
    },
    {
      icon: '⛳',
      title: 'Practice Facilities',
      subtitle: 'Premium Ranges and Academies',
      description: 'Display real-time playing conditions. Help golfers understand their true distances.',
      benefit: 'Enhanced experience that serious golfers appreciate.',
    },
  ]

  const features = [
    {
      icon: <Wind className="w-6 h-6" />,
      title: 'Real-Time Weather',
      description: 'Current conditions by GPS coordinates. Temperature, wind, humidity, pressure.',
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: 'Custom Conditions',
      description: 'Test any scenario with conditions_override. Perfect for "what if" analysis.',
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Tour-Accurate Physics',
      description: 'Validated within ±2% of TrackMan benchmarks. The math golfers can trust.',
    },
    {
      icon: <Gauge className="w-6 h-6" />,
      title: 'Tournament-Level Validation',
      description: 'Wind: 0-40mph. Temperature: 32-105°F. Altitude: 0-8,000ft. Realistic playable conditions only.',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Fast Response',
      description: '<200ms average response time. Real-time updates every 5 minutes.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '99.9% Uptime SLA',
      description: 'Enterprise-grade reliability. Tournament-ready performance.',
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-pro text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">Professional API</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Tour-Accurate Physics
              <br />
              For Real Improvement
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Atmospheric adjustments validated against TrackMan data.
              Give your golfers distances they can trust—anywhere they play.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="bg-white text-pro-blue px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all text-center">
                Request API Access
              </Link>
              <Link to="/docs" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all text-center">
                View Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ball Flight Data Without Context Is Just Numbers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A 280-yard drive in Denver isn't the same as 280 in Miami.
              Your golfers deserve to know the difference.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">The Problem</h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">×</span>
                  Indoor simulator distances don't match outdoor play
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">×</span>
                  Players don't trust numbers that feel "off"
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">×</span>
                  Club fittings don't transfer to different elevations
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">×</span>
                  Weather affects ball flight, but apps ignore it
                </li>
              </ul>
            </div>
            <div className="bg-pro-blue/5 border border-pro-blue/20 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">The Solution</h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-pro-blue flex-shrink-0 mt-0.5" />
                  Real atmospheric adjustments for any location
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-pro-blue flex-shrink-0 mt-0.5" />
                  Tour-accurate physics validated against TrackMan
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-pro-blue flex-shrink-0 mt-0.5" />
                  Distances golfers can trust and verify
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-pro-blue flex-shrink-0 mt-0.5" />
                  Simple API integration in under 30 minutes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built For Golf Technology Companies
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{useCase.title}</h3>
                <p className="text-pro-blue font-medium text-sm mb-4">{useCase.subtitle}</p>
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <div className="bg-pro-blue/5 rounded-lg px-4 py-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-pro-blue">Result:</span> {useCase.benefit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Professional-Grade Features
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card">
                <div className="w-12 h-12 bg-pro-blue/10 rounded-lg flex items-center justify-center text-pro-blue mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Example */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple Integration
            </h2>
            <p className="text-gray-600">One API call. Complete atmospheric adjustment.</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto max-w-4xl mx-auto">
            <div className="flex gap-4 mb-4">
              <span className="text-white bg-pro-blue px-4 py-1 rounded text-sm">POST /api/v1/calculate</span>
            </div>
            <pre className="text-gray-300 text-sm font-mono">
{`// Calculate trajectory with real weather
const response = await fetch(
  'https://golf-weather-api-staging.up.railway.app/api/v1/calculate',
  {
    method: 'POST',
    headers: {
      'X-API-Key': 'your_api_key',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ball_speed: 167,        // mph
      launch_angle: 11.2,     // degrees
      spin_rate: 2600,        // rpm
      location: {
        lat: 39.7392,         // Denver
        lng: -104.9903
      }
    })
  }
);

const data = await response.json();
// Returns: adjusted carry, total distance, impact breakdown`}
            </pre>
          </div>

          <div className="text-center mt-8">
            <Link to="/docs" className="btn-pro inline-flex items-center gap-2">
              <Code className="w-4 h-4" />
              Full API Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Physics Validation */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Science Behind The Numbers
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="text-center p-6">
              <Wind className="w-10 h-10 text-pro-blue mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Wind Effects</h3>
              <p className="text-gray-600 text-sm">Headwind, tailwind, crosswind vector decomposition</p>
            </div>
            <div className="text-center p-6">
              <Thermometer className="w-10 h-10 text-pro-blue mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Temperature</h3>
              <p className="text-gray-600 text-sm">Air density changes + ball compression effects</p>
            </div>
            <div className="text-center p-6">
              <Mountain className="w-10 h-10 text-pro-blue mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Altitude</h3>
              <p className="text-gray-600 text-sm">Reduced drag at elevation (~2% per 1,000ft)</p>
            </div>
            <div className="text-center p-6">
              <Droplets className="w-10 h-10 text-pro-blue mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Humidity</h3>
              <p className="text-gray-600 text-sm">Air density adjustments for moisture content</p>
            </div>
          </div>

          <div className="bg-pro-blue/5 border border-pro-blue/20 rounded-xl p-8 text-center max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Validated Within ±2% of TrackMan Data</h3>
            <p className="text-gray-600 mb-6">
              Our physics engine has been tested against real TrackMan data across 100+ scenarios.
              The math is real. The results are trustworthy.
            </p>
            <Link to="/science" className="btn-pro-outline inline-flex items-center gap-2">
              Read The Science <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pure Physics Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Pure Physics Simulation
              </h2>
              <p className="text-gray-600 mb-6">
                The Professional API uses a complete 6-DOF physics simulation with no empirical shortcuts.
                Both drag AND lift forces are calculated using relative airspeed—the ball's speed through
                the air, not over the ground.
              </p>
              <p className="text-gray-600 mb-6">
                This means our results correctly show how tailwinds actually affect ball flight:
                reduced relative airspeed means less drag (good), but also less lift (limits the benefit).
              </p>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3">Validation Caps</h4>
                <p className="text-gray-600 text-sm mb-4">
                  The Professional API enforces realistic tournament-level conditions:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-pro-blue" />
                    Wind: 0-40 mph (realistic maximum for playable golf)
                  </li>
                  <li className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-pro-blue" />
                    Temperature: 32-105°F (playable conditions)
                  </li>
                  <li className="flex items-center gap-2">
                    <Mountain className="w-4 h-4 text-pro-blue" />
                    Altitude: 0-8,000 ft (covers all major golf courses)
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-8 text-white">
              <h3 className="text-xl font-bold mb-6">Why This Matters</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-blue-300 mb-2">The Lift Paradox</h4>
                  <p className="text-gray-300 text-sm">
                    Many apps calculate wind as a simple push/pull on the ball. In reality, tailwinds
                    reduce the ball's relative airspeed, which reduces both drag AND lift. The ball
                    drops sooner than simplified models predict.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-300 mb-2">Professional Accuracy</h4>
                  <p className="text-gray-300 text-sm">
                    Our engine calculates: F_lift = ½ρv²_rel × C_L × A, where v_rel is the ball's
                    speed through the air. This is the same approach used by TrackMan and tour-level
                    launch monitors.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-300 mb-2">No Empirical Shortcuts</h4>
                  <p className="text-gray-300 text-sm">
                    Unlike gaming applications that use simplified formulas, the Professional API
                    runs a full physics simulation every time. The accuracy is in the physics, not
                    in curve-fitting to expected results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Professional API Pricing
            </h2>
            <p className="text-gray-600">Simple, transparent pricing per facility</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                $299<span className="text-base font-normal text-gray-500">/month</span>
              </p>
              <p className="text-gray-500 text-sm mb-6">per facility</p>
              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-pro-blue" />
                  25,000 requests/day
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-pro-blue" />
                  Real-time weather
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-pro-blue" />
                  Custom conditions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-pro-blue" />
                  99.9% uptime SLA
                </li>
              </ul>
              <Link to="/contact" className="btn-pro-outline w-full text-center block">
                Get Started
              </Link>
            </div>

            {/* Professional */}
            <div className="bg-white rounded-xl p-8 border-2 border-pro-blue shadow-lg relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pro-blue text-white text-xs px-3 py-1 rounded-full">
                Most Popular
              </span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Professional</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                $599<span className="text-base font-normal text-gray-500">/month</span>
              </p>
              <p className="text-gray-500 text-sm mb-6">per facility</p>
              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-pro-blue" />
                  100,000 requests/day
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-pro-blue" />
                  Everything in Starter
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-pro-blue" />
                  Priority support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-pro-blue" />
                  Volume discounts available
                </li>
              </ul>
              <Link to="/contact" className="btn-pro w-full text-center block">
                Get Started
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">Custom</p>
              <p className="text-gray-500 text-sm mb-6">tailored to your needs</p>
              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-pro-blue" />
                  Unlimited requests
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-pro-blue" />
                  Dedicated infrastructure
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-pro-blue" />
                  99.99% uptime SLA
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-pro-blue" />
                  Custom integrations
                </li>
              </ul>
              <Link to="/contact" className="btn-pro-outline w-full text-center block">
                Contact Sales
              </Link>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link to="/pricing" className="text-pro-blue font-medium hover:underline inline-flex items-center gap-2">
              View Full Pricing Details <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-pro text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Add Tour-Accurate Physics?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join leading golf technology companies using real atmospheric adjustments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-white text-pro-blue px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all">
              Request API Access
            </Link>
            <Link to="/docs" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all">
              View Documentation
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
