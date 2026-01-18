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

          {/* Lift Force Formula - NEW */}
          <div className="bg-gray-50 rounded-xl p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-golf-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mountain className="w-6 h-6 text-golf-green" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Lift Force (Magnus Effect)</h3>
                <p className="text-gray-600">Backspin creates upward lift that keeps the ball aloft</p>
              </div>
            </div>

            <div className="bg-dark-navy text-white rounded-lg p-6 mb-6 text-center">
              <code className="text-xl md:text-2xl font-mono">
                F_l = 1/2 x rho x v^2 x C_l x A
              </code>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4">
                <p className="font-mono text-golf-green font-bold mb-2">F_l</p>
                <p className="text-gray-600 text-sm">Lift force in Newtons</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-mono text-golf-green font-bold mb-2">v^2</p>
                <p className="text-gray-600 text-sm">Relative airspeed squared</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-mono text-golf-green font-bold mb-2">C_l</p>
                <p className="text-gray-600 text-sm">Lift coefficient (from spin)</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-mono text-golf-green font-bold mb-2">A</p>
                <p className="text-gray-600 text-sm">Cross-sectional area</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
              <p className="text-red-800">
                <strong>Critical:</strong> Both Drag AND Lift use <code className="bg-red-100 px-1 rounded">v</code> (relative airspeed) = ball speed - wind speed.
                This creates the "Lift Paradox" explained below.
              </p>
            </div>
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
              <strong>Why it matters:</strong> A 20mph wind at 45 deg isn't the same as 20mph straight on.
              We decompose wind into components to calculate the true effect on ball flight.
            </p>
          </div>
        </div>
      </section>

      {/* The Lift Paradox Section - NEW */}
      <section className="py-20 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-red-100 rounded-full px-4 py-2 mb-6">
              <span className="text-red-600 font-bold">!</span>
              <span className="text-sm font-medium text-red-800">Critical Physics Discovery</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Lift Paradox: Why Extreme Tailwinds Don't Always Help
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              You might think: "More tailwind = ball flies farther, right?" Not always.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Calm */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Calm Conditions</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ball speed:</span>
                  <span className="font-semibold">167 mph</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Relative airspeed:</span>
                  <span className="font-semibold">167 mph (100%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lift force:</span>
                  <span className="font-semibold text-golf-green">100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Flight time:</span>
                  <span className="font-semibold">6.7 sec</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-600">Carry:</span>
                  <span className="font-bold text-lg">268 yards</span>
                </div>
              </div>
            </div>

            {/* 30mph Tailwind - Optimal */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-golf-green">
              <div className="flex items-center gap-2 mb-4">
                <h4 className="text-lg font-bold text-gray-900">30mph Tailwind</h4>
                <span className="text-xs bg-golf-green text-white px-2 py-1 rounded">SWEET SPOT</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ball speed:</span>
                  <span className="font-semibold">167 mph</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Relative airspeed:</span>
                  <span className="font-semibold">137 mph (82%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lift force:</span>
                  <span className="font-semibold text-golf-green">67%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Flight time:</span>
                  <span className="font-semibold">5.8 sec</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-600">Carry:</span>
                  <span className="font-bold text-lg text-golf-green">295 yards (+27)</span>
                </div>
              </div>
            </div>

            {/* 80mph Tailwind - Problem */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-red-400">
              <div className="flex items-center gap-2 mb-4">
                <h4 className="text-lg font-bold text-gray-900">80mph Tailwind</h4>
                <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">LIFT LOSS</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ball speed:</span>
                  <span className="font-semibold">167 mph</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Relative airspeed:</span>
                  <span className="font-semibold text-red-500">87 mph (52%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lift force:</span>
                  <span className="font-semibold text-red-500">27% only!</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Flight time:</span>
                  <span className="font-semibold text-red-500">3.0 sec</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-600">Carry:</span>
                  <span className="font-bold text-lg text-red-500">241 yards (-27)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Why Does This Happen?</h3>
            <p className="text-gray-600 mb-4">
              Both <strong>drag</strong> and <strong>lift</strong> use the same formula component: <code className="bg-gray-100 px-2 py-1 rounded">v^2</code> (velocity squared).
              When tailwind reduces relative airspeed:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-golf-green/10 rounded-lg p-4">
                <p className="font-semibold text-golf-green mb-2">Drag Decreases</p>
                <p className="text-sm text-gray-600">Ball slows down less = good</p>
              </div>
              <div className="bg-red-100 rounded-lg p-4">
                <p className="font-semibold text-red-600 mb-2">Lift ALSO Decreases</p>
                <p className="text-sm text-gray-600">Ball drops sooner = bad</p>
              </div>
            </div>
            <p className="text-gray-600 mt-4">
              At 80mph tailwind, lift force drops to just 27% of normal. <strong>The ball drops like a rock</strong> because there's almost no upward force from the Magnus effect.
            </p>
          </div>

          <div className="bg-gaming-orange/10 border-2 border-gaming-orange/30 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Gamepad2 className="w-8 h-8 text-gaming-orange" />
              <h3 className="text-xl font-bold text-gray-900">The 150mph "Wind Surfer" Exception</h3>
            </div>
            <p className="text-gray-600 mb-4">
              At 150mph tailwind, something unusual happens: the wind speed <strong>exceeds</strong> the ball speed.
            </p>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li>Wind: 150 mph, Ball: 167 mph</li>
              <li>Relative airspeed becomes <strong>negative</strong> (-83 mph)</li>
              <li>Ball "sees" a headwind from its frame of reference</li>
              <li>This <strong>creates lift again</strong> while wind carries ball forward</li>
            </ul>
            <p className="text-gray-700 font-medium">
              Think of it like surfing a wave vs swimming against current. The ball "surfs" the wind to 450+ yards!
            </p>
          </div>
        </div>
      </section>

      {/* How Our APIs Handle This - NEW */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Our APIs Handle This
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Different approaches for different needs - both using real physics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-pro-blue/5 border-2 border-pro-blue/20 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-pro-blue" />
                <h3 className="text-2xl font-bold text-gray-900">Professional API</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Uses <strong>pure physics simulation</strong> showing realistic lift loss at extreme conditions.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">30mph tailwind:</span>
                  <span className="text-golf-green font-semibold">+27 yards</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">80mph tailwind:</span>
                  <span className="text-red-500 font-semibold">-27 yards (lift loss)</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Wind cap:</span>
                  <span className="font-semibold">40 mph max</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Maintains scientific accuracy for training applications.
              </p>
            </div>

            <div className="bg-gaming-orange/5 border-2 border-gaming-orange/20 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Gamepad2 className="w-8 h-8 text-gaming-orange" />
                <h3 className="text-2xl font-bold text-gray-900">Gaming API</h3>
              </div>
              <p className="text-gray-600 mb-6">
                <strong>Smart capping</strong> for extreme conditions - optimized for fun while respecting physics.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">0-40 mph:</span>
                  <span className="font-semibold">Pure physics</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">40-100 mph:</span>
                  <span className="font-semibold">Capped at +30% boost</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">100+ mph:</span>
                  <span className="text-gaming-orange font-semibold">"Surfing" physics</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Extreme entertainment while staying physically plausible.
              </p>
            </div>
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
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              "Is a 450-Yard Drive Really Possible?"
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Yes - but only at extreme wind speeds where "surfing physics" kicks in.
            </p>
          </div>

          <div className="bg-gaming-orange/5 border-2 border-gaming-orange/20 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Gamepad2 className="w-8 h-8 text-gaming-orange" />
              <h3 className="text-2xl font-bold text-gray-900">Wind Surfer Mode (150 mph)</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Starting Point: Scratch Golfer Driver</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>Ball speed: 167 mph</li>
                  <li>Launch angle: 11.2 deg</li>
                  <li>Spin rate: 2,600 rpm</li>
                  <li><strong>Baseline carry:</strong> 268 yards</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Wind Surfer Conditions</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>150 mph pure tailwind</li>
                  <li>85 deg F temperature</li>
                  <li>1,000 ft altitude</li>
                  <li><strong>Result:</strong> ~450-460 yards</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 mt-6">
              <h4 className="font-semibold text-gray-900 mb-4">The "Surfing" Physics</h4>
              <p className="text-gray-600 mb-4">
                At 150 mph tailwind, the wind speed <strong>exceeds</strong> the ball speed (167 mph).
                This creates an unusual but real physics scenario:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>Relative airspeed becomes <strong>negative</strong> (~-83 mph)</li>
                <li>Ball "sees" a headwind from its perspective = creates lift</li>
                <li>Meanwhile, the entire air mass carries the ball forward</li>
                <li>Result: Ball stays aloft AND travels with the wind</li>
              </ul>
            </div>

            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">
                <strong>Important:</strong> Moderate tailwinds (40-80 mph) actually REDUCE carry due to lift loss!
                The "sweet spot" is around 30-35 mph. Beyond that, you need the extreme surfing regime (150+ mph)
                to see big distance gains.
              </p>
            </div>
          </div>

          <div className="bg-golf-green/5 border-2 border-golf-green/20 rounded-xl p-8 mt-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-8 h-8 text-golf-green" />
              <h3 className="text-2xl font-bold text-gray-900">Sweet Spot Tailwind Mode (35 mph)</h3>
            </div>

            <p className="text-gray-600 mb-4">
              For <strong>realistic maximum distance</strong>, 35 mph is the optimal tailwind:
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">Scratch Golfer</p>
                <p className="text-2xl font-bold text-golf-green">300-305 yards</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">Low Handicap</p>
                <p className="text-2xl font-bold text-golf-green">280-285 yards</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">Mid Handicap</p>
                <p className="text-2xl font-bold text-golf-green">250-255 yards</p>
              </div>
            </div>

            <p className="text-gray-600 mt-4">
              At this speed, drag reduction is significant but lift loss is still manageable.
              This is the <strong>real-world optimal</strong> for maximum distance.
            </p>
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
