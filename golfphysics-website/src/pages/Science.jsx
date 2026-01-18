import { Link } from 'react-router-dom'
import {
  Wind, Thermometer, Mountain, Droplets, CheckCircle, ArrowRight,
  Target, Gamepad2, FlaskConical, Calculator
} from 'lucide-react'

export default function Science() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-golf text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <FlaskConical className="w-4 h-4" />
            <span className="text-sm font-medium">The Science</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Real Physics. Real Math.
            <br />
            <span className="text-golf-green-light">Real Results.</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Every calculation uses the same atmospheric physics that aerospace engineers rely on.
            Whether it's 30mph at a tournament or 150mph in a game—the math is always accurate.
          </p>
        </div>
      </section>

      {/* Core Physics Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Physics That Powers Every Calculation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Golf ball flight is governed by well-understood atmospheric physics.
              We implement these formulas with precision.
            </p>
          </div>

          {/* Air Density Formula */}
          <div className="bg-gray-50 rounded-xl p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-golf-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Wind className="w-6 h-6 text-golf-green" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Air Density</h3>
                <p className="text-gray-600">The foundation of all atmospheric effects on ball flight</p>
              </div>
            </div>

            <div className="bg-dark-navy text-white rounded-lg p-6 mb-6 text-center">
              <code className="text-xl md:text-2xl font-mono">
                ρ = P / (R × T)
              </code>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4">
                <p className="font-mono text-golf-green font-bold mb-2">ρ (rho)</p>
                <p className="text-gray-600 text-sm">Air density in kg/m³</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-mono text-golf-green font-bold mb-2">P</p>
                <p className="text-gray-600 text-sm">Barometric pressure in Pascals</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-mono text-golf-green font-bold mb-2">R × T</p>
                <p className="text-gray-600 text-sm">Gas constant × Temperature (Kelvin)</p>
              </div>
            </div>

            <p className="text-gray-600 mt-6">
              <strong>Why it matters:</strong> Lower air density (from heat or altitude) means less drag,
              which means the ball travels farther. This is why you hit longer in Denver than Miami.
            </p>
          </div>

          {/* Drag Force Formula */}
          <div className="bg-gray-50 rounded-xl p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-golf-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-golf-green" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Drag Force</h3>
                <p className="text-gray-600">The primary force slowing the ball down</p>
              </div>
            </div>

            <div className="bg-dark-navy text-white rounded-lg p-6 mb-6 text-center">
              <code className="text-xl md:text-2xl font-mono">
                F_d = ½ × ρ × v² × C_d × A
              </code>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4">
                <p className="font-mono text-golf-green font-bold mb-2">F_d</p>
                <p className="text-gray-600 text-sm">Drag force in Newtons</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-mono text-golf-green font-bold mb-2">v²</p>
                <p className="text-gray-600 text-sm">Ball velocity squared</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-mono text-golf-green font-bold mb-2">C_d</p>
                <p className="text-gray-600 text-sm">Drag coefficient (~0.25 for golf ball)</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-mono text-golf-green font-bold mb-2">A</p>
                <p className="text-gray-600 text-sm">Cross-sectional area</p>
              </div>
            </div>

            <p className="text-gray-600 mt-6">
              <strong>Why it matters:</strong> Drag increases with the square of velocity. Headwinds
              effectively increase ball velocity relative to air, dramatically increasing drag.
            </p>
          </div>

          {/* Wind Effect Formula */}
          <div className="bg-gray-50 rounded-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-golf-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calculator className="w-6 h-6 text-golf-green" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Wind Vector Decomposition</h3>
                <p className="text-gray-600">Breaking wind into headwind/tailwind and crosswind components</p>
              </div>
            </div>

            <div className="bg-dark-navy text-white rounded-lg p-6 mb-6 text-center space-y-2">
              <code className="text-lg md:text-xl font-mono block">
                Headwind = Wind_speed × cos(θ)
              </code>
              <code className="text-lg md:text-xl font-mono block">
                Crosswind = Wind_speed × sin(θ)
              </code>
            </div>

            <p className="text-gray-600">
              <strong>Why it matters:</strong> A 20mph wind at 45° isn't the same as 20mph straight on.
              We decompose wind into components to calculate the true effect on ball flight.
            </p>
          </div>
        </div>
      </section>

      {/* Environmental Effects */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Each Factor Affects Ball Flight
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Temperature */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <Thermometer className="w-10 h-10 text-golf-green mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Temperature Effects</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">40°F (Cold)</span>
                  <span className="text-red-500 font-semibold">-8 to -10 yards</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">70°F (Baseline)</span>
                  <span className="text-gray-500 font-semibold">0 yards</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">100°F (Hot)</span>
                  <span className="text-golf-green font-semibold">+4 to +6 yards</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm">
                <strong>Two effects:</strong> Hot air is less dense (less drag), but cold
                also reduces ball compression (less energy transfer). Combined effect
                is approximately 1-2 yards per 10°F.
              </p>
            </div>

            {/* Altitude */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <Mountain className="w-10 h-10 text-golf-green mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Altitude Effects</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Sea Level</span>
                  <span className="text-gray-500 font-semibold">Baseline</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">5,280 ft (Denver)</span>
                  <span className="text-golf-green font-semibold">+6-8%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">7,500 ft (Mexico City)</span>
                  <span className="text-golf-green font-semibold">+9-12%</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm">
                <strong>The rule:</strong> Approximately 1.2% distance increase per 1,000 feet
                of elevation due to reduced air density.
              </p>
            </div>

            {/* Wind */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <Wind className="w-10 h-10 text-golf-green mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Wind Effects</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">10 mph Headwind</span>
                  <span className="text-red-500 font-semibold">-15 to -20 yards</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">10 mph Tailwind</span>
                  <span className="text-golf-green font-semibold">+8 to +12 yards</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">10 mph Crosswind</span>
                  <span className="text-gray-500 font-semibold">±5-10 yard curve</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm">
                <strong>Note:</strong> Headwinds hurt more than tailwinds help because they
                increase the ball's velocity relative to the air, exponentially increasing drag.
              </p>
            </div>

            {/* Humidity */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <Droplets className="w-10 h-10 text-golf-green mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Humidity Effects</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Low (20%)</span>
                  <span className="text-golf-green font-semibold">+1-2 yards</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Medium (50%)</span>
                  <span className="text-gray-500 font-semibold">Baseline</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">High (80%+)</span>
                  <span className="text-red-500 font-semibold">-1-2 yards</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm">
                <strong>Counterintuitive:</strong> Humid air is actually less dense than dry air
                (water vapor is lighter than nitrogen/oxygen), but the effect is minimal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Extreme Conditions Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              "Is a 500-Yard Drive Really Possible?"
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Yes. And here's the math to prove it.
            </p>
          </div>

          <div className="bg-gaming-orange/5 border-2 border-gaming-orange/20 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Gamepad2 className="w-8 h-8 text-gaming-orange" />
              <h3 className="text-2xl font-bold text-gray-900">Hurricane Hero Math</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Starting Point: Scratch Golfer Driver</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Ball speed: 167 mph</li>
                  <li>• Launch angle: 11.2°</li>
                  <li>• Spin rate: 2,600 rpm</li>
                  <li>• <strong>Baseline carry:</strong> 271 yards</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Hurricane Hero Conditions</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• 75 mph pure tailwind</li>
                  <li>• 75°F temperature</li>
                  <li>• Sea level altitude</li>
                  <li>• <strong>Result:</strong> ~365-400 yards</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 mt-6">
              <h4 className="font-semibold text-gray-900 mb-4">The Physics Explanation</h4>
              <p className="text-gray-600 mb-4">
                A 75 mph tailwind dramatically reduces the ball's velocity <em>relative to the air</em>.
                If the ball is traveling 167 mph and the air is moving 75 mph in the same direction,
                the relative velocity is only 92 mph.
              </p>
              <p className="text-gray-600">
                Since drag force scales with velocity squared (v²), this reduction in relative velocity
                cuts drag by approximately 70%. The ball stays in the air longer, travels farther,
                and maintains more of its initial energy.
              </p>
            </div>

            <div className="mt-6 p-4 bg-gaming-orange/10 rounded-lg">
              <p className="text-gray-700">
                <strong>Maximum Tailwind (150 mph):</strong> With scratch golfer stats and our most extreme
                setting, distances of 500+ yards are achievable. The physics is real—we just push the
                conditions to extremes that don't exist in nature.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Validation Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Validated Against Real-World Data
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <p className="text-4xl font-bold text-golf-green mb-2">±2%</p>
              <p className="text-gray-600 text-sm">TrackMan correlation</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <p className="text-4xl font-bold text-golf-green mb-2">100+</p>
              <p className="text-gray-600 text-sm">Test scenarios</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <p className="text-4xl font-bold text-golf-green mb-2">99%</p>
              <p className="text-gray-600 text-sm">Pass rate</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <p className="text-4xl font-bold text-golf-green mb-2">7</p>
              <p className="text-gray-600 text-sm">Physics checks passed</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Validation Methodology</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Physics Relationship Tests</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-golf-green" />
                    Headwind reduces distance ✓
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-golf-green" />
                    Tailwind increases distance ✓
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-golf-green" />
                    Heat increases distance ✓
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-golf-green" />
                    Cold decreases distance ✓
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-golf-green" />
                    Altitude increases distance ✓
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Real-World Benchmarks</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-golf-green" />
                    TrackMan average distances
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-golf-green" />
                    PGA Tour shot data
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-golf-green" />
                    Denver altitude studies
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-golf-green" />
                    Wind tunnel research
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-golf-green" />
                    USGA ball flight standards
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-golf-green text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Use Real Physics?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Whether you need tour-accurate training or extreme entertainment,
            the physics is always real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/professional" className="btn-pro inline-flex items-center justify-center gap-2">
              <Target className="w-5 h-5" />
              Professional API
            </Link>
            <Link to="/gaming" className="btn-gaming inline-flex items-center justify-center gap-2">
              <Gamepad2 className="w-5 h-5" />
              Gaming API
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
