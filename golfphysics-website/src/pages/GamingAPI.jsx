import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Gamepad2, CheckCircle, ArrowRight, Wind, Thermometer, Mountain,
  Zap, Trophy, Users, TrendingUp, Smartphone, Share2
} from 'lucide-react'

export default function GamingAPI() {
  const [activeTab, setActiveTab] = useState('standard')

  const standardModes = [
    {
      name: 'Hurricane Hero',
      emoji: '🌀',
      tagline: 'Ride the tailwind to glory',
      description: 'Maximum tailwind pushes drives to insane distances. Players compete for longest drives with physics-accurate wind boost.',
      conditions: '75mph tailwind, 75°F, sea level',
      typicalResult: '400-500+ yard drives',
      playerExperience: '"Just hit 487 yards at Topgolf. This is insane!"',
      viralPotential: 'Screenshot-worthy distances that demand sharing',
    },
    {
      name: 'Arctic Assault',
      emoji: '❄️',
      tagline: 'Conquer the frozen fairway',
      description: 'Extreme cold reduces ball compression and flight. Strategic challenge that rewards precision over power.',
      conditions: '-10°F, 15mph headwind, snow effects',
      typicalResult: '40-60% reduced distance',
      playerExperience: '"Finally a challenge that makes me think!"',
      viralPotential: 'Unique seasonal content, winter engagement boost',
    },
    {
      name: 'Desert Inferno',
      emoji: '🏜️',
      tagline: 'Feel the heat boost your drive',
      description: 'Scorching temps and low humidity mean maximum distance. Hot air = thin air = long bombs.',
      conditions: '115°F, low humidity, slight tailwind',
      typicalResult: '15-25% distance increase',
      playerExperience: '"The ball just keeps flying in the desert heat!"',
      viralPotential: 'Summer seasonal promotion, heat wave tie-ins',
    },
    {
      name: 'Monsoon Madness',
      emoji: '🌧️',
      tagline: 'Battle the storm',
      description: 'Heavy rain and swirling winds create unpredictable conditions. Survival mode for the brave.',
      conditions: '40mph variable wind, heavy rain effects',
      typicalResult: 'Highly variable, accuracy challenged',
      playerExperience: '"You never know where it\'s going to land!"',
      viralPotential: 'Competitive chaos, tournament mode potential',
    },
    {
      name: 'Mountain Challenge',
      emoji: '⛰️',
      tagline: 'Thin air, massive distance',
      description: 'High altitude means less air resistance. Experience Colorado-level distance gains.',
      conditions: '8,500ft elevation, cool temps, calm wind',
      typicalResult: '12-18% distance increase',
      playerExperience: '"Is this what playing in Denver feels like?"',
      viralPotential: 'Educational + fun, "altitude effect" demonstrations',
    },
  ]

  const extremeModes = [
    {
      name: 'Maximum Tailwind',
      emoji: '💨',
      tagline: 'The ultimate distance chase',
      conditions: '150mph tailwind, optimal temp, sea level',
      typicalResult: '600+ yard drives possible',
      description: 'Push physics to the absolute limit. Record-breaking distances for the distance-obsessed.',
    },
    {
      name: 'Hurricane Apocalypse',
      emoji: '🌪️',
      tagline: 'Category 5 chaos',
      conditions: '150mph variable wind, extreme conditions',
      typicalResult: 'Completely unpredictable',
      description: 'Maximum chaos mode. Will your ball go forward, backward, or sideways?',
    },
    {
      name: 'Everest Challenge',
      emoji: '🏔️',
      tagline: 'Golf at 29,000 feet',
      conditions: '29,000ft elevation, extreme cold, thin air',
      typicalResult: '25-35% distance increase (if you can hit it)',
      description: 'The ultimate altitude test. Extreme cold vs. extreme thin air.',
    },
    {
      name: 'Crosswind Chaos',
      emoji: '↔️',
      tagline: 'Master the sideways challenge',
      conditions: '80mph pure crosswind',
      typicalResult: '100+ yard lateral movement',
      description: 'How far can the ball curve? Test your ability to aim way left to go right.',
    },
    {
      name: 'Death Valley Heat',
      emoji: '🔥',
      tagline: 'Record-breaking temperatures',
      conditions: '130°F, bone-dry humidity, slight tailwind',
      typicalResult: '20-30% distance increase',
      description: 'The hottest golf on Earth. Maximum ball speed from extreme heat.',
    },
  ]

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Handicap-Based Gameplay',
      description: 'No launch monitor required. Just enter handicap (0-36) and club. We calculate realistic ball flight.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Extreme Ranges',
      description: 'Wind 0-150mph, temps -40 to 130°F, altitude up to 15,000ft. Designed for entertainment.',
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: 'Leaderboard Ready',
      description: 'Built-in distance records and competition support. Track venue records instantly.',
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: 'Social Integration',
      description: 'Every extreme result is screenshot-worthy. Built for viral sharing.',
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-gaming text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
              <Gamepad2 className="w-4 h-4" />
              <span className="text-sm font-medium">Gaming API</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Turn Casual Rounds Into
              <br />
              Unforgettable Moments
            </h1>
            <p className="text-xl text-orange-100 mb-8">
              500-yard drives. Hurricane challenges. Viral TikTok content.
              <br />
              Real physics. Extreme fun.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="bg-white text-gaming-orange px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-50 transition-all text-center">
                Request Demo
              </Link>
              <a href="#modes" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all text-center">
                View Game Modes
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* The Opportunity */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Venue Has The Same Games As Everyone Else
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Casual golfers don't care about spin rates. They want fun,
              shareable moments that bring them back (and bring their friends).
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">The Challenge</h3>
              <p className="text-gray-600">
                Every entertainment venue offers the same target games and closest-to-pin challenges.
                There's nothing unique to talk about.
              </p>
            </div>
            <div className="text-center p-8 bg-gaming-orange/5 rounded-xl">
              <div className="text-5xl mb-4">🌀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">The Solution</h3>
              <p className="text-gray-600">
                Extreme weather game modes that are impossible anywhere else.
                Hurricane Hero. Arctic Assault. Content that refreshes itself.
              </p>
            </div>
            <div className="text-center p-8">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">The Result</h3>
              <p className="text-gray-600">
                "I just hit a 487-yard drive at Topgolf!" Screenshots. TikToks.
                Free marketing from every player.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Game Modes Section */}
      <section id="modes" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              10 Extreme Weather Game Modes
            </h2>
            <p className="text-xl text-gray-600">
              Each mode uses real atmospheric physics—just pushed to extremes.
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-lg p-1 shadow-sm inline-flex">
              <button
                onClick={() => setActiveTab('standard')}
                className={`px-6 py-3 rounded-md font-semibold transition-all ${
                  activeTab === 'standard'
                    ? 'bg-gaming-orange text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Standard Modes (5)
              </button>
              <button
                onClick={() => setActiveTab('extreme')}
                className={`px-6 py-3 rounded-md font-semibold transition-all ${
                  activeTab === 'extreme'
                    ? 'bg-gaming-orange text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Extreme Modes (5)
              </button>
            </div>
          </div>

          {/* Standard Modes */}
          {activeTab === 'standard' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {standardModes.map((mode, index) => (
                <div key={index} className="game-mode-card">
                  <div className="text-4xl mb-4">{mode.emoji}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{mode.name}</h3>
                  <p className="text-gaming-orange font-medium text-sm mb-4">{mode.tagline}</p>
                  <p className="text-gray-600 text-sm mb-4">{mode.description}</p>

                  <div className="space-y-3 text-sm">
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <span className="font-semibold text-gray-700">Conditions:</span>
                      <span className="text-gray-600 ml-2">{mode.conditions}</span>
                    </div>
                    <div className="bg-gaming-orange/10 rounded-lg px-3 py-2">
                      <span className="font-semibold text-gaming-orange">Result:</span>
                      <span className="text-gray-700 ml-2">{mode.typicalResult}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <p className="text-gray-500 text-xs italic">"{mode.playerExperience}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Extreme Modes */}
          {activeTab === 'extreme' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {extremeModes.map((mode, index) => (
                <div key={index} className="game-mode-card border-gaming-orange/30">
                  <div className="absolute top-3 right-3 bg-gaming-orange text-white text-xs px-2 py-1 rounded">
                    EXTREME
                  </div>
                  <div className="text-4xl mb-4">{mode.emoji}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{mode.name}</h3>
                  <p className="text-gaming-orange font-medium text-sm mb-4">{mode.tagline}</p>
                  <p className="text-gray-600 text-sm mb-4">{mode.description}</p>

                  <div className="space-y-3 text-sm">
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <span className="font-semibold text-gray-700">Conditions:</span>
                      <span className="text-gray-600 ml-2">{mode.conditions}</span>
                    </div>
                    <div className="bg-gaming-orange/10 rounded-lg px-3 py-2">
                      <span className="font-semibold text-gaming-orange">Result:</span>
                      <span className="text-gray-700 ml-2">{mode.typicalResult}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Viral Opportunity */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Built For Viral Moments
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Every extreme result is a screenshot waiting to happen.
                Players market your venue for free.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gaming-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-5 h-5 text-gaming-orange" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">TikTok-Ready Results</h3>
                    <p className="text-gray-600 text-sm">
                      "500-yard drive!" videos generate thousands of views and venue tags.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gaming-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-5 h-5 text-gaming-orange" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Venue Records</h3>
                    <p className="text-gray-600 text-sm">
                      Track and display longest drives. Create competitive content that brings players back.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gaming-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-gaming-orange" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Group Entertainment</h3>
                    <p className="text-gray-600 text-sm">
                      Hurricane challenges create shared experiences that groups talk about.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-8 text-white">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">📱</div>
                <h3 className="text-2xl font-bold mb-2">The Viral Loop</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gaming-orange rounded-full flex items-center justify-center font-bold">1</div>
                  <span>Player hits 487-yard drive in Hurricane Hero</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gaming-orange rounded-full flex items-center justify-center font-bold">2</div>
                  <span>Screenshots result, posts to TikTok</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gaming-orange rounded-full flex items-center justify-center font-bold">3</div>
                  <span>Friends see it, want to try</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gaming-orange rounded-full flex items-center justify-center font-bold">4</div>
                  <span>More venue visits, more content</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Designed For Entertainment Venues
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-gaming-orange/10 rounded-lg flex items-center justify-center text-gaming-orange mb-4">
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dead Simple Integration
            </h2>
            <p className="text-gray-600">Handicap + Club + Preset = Instant gameplay</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto max-w-4xl mx-auto">
            <div className="flex gap-4 mb-4">
              <span className="text-white bg-gaming-orange px-4 py-1 rounded text-sm">POST /api/v1/gaming/trajectory</span>
            </div>
            <pre className="text-gray-300 text-sm font-mono">
{`// Hurricane Hero mode - no launch monitor needed!
const response = await fetch(
  'https://golf-weather-api-staging.up.railway.app/api/v1/gaming/trajectory',
  {
    method: 'POST',
    headers: {
      'X-API-Key': 'your_api_key',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      shot: {
        player_handicap: 15,  // Just need handicap
        club: "driver"        // And club selection
      },
      preset: "hurricane_hero"  // 75mph tailwind
    })
  }
);

const data = await response.json();
// Returns: ~450 yard drive for mid-handicapper!`}
            </pre>
          </div>

          <div className="text-center mt-8">
            <Link to="/docs#gaming" className="btn-gaming inline-flex items-center gap-2">
              View Gaming API Docs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The ROI Is Clear
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <TrendingUp className="w-10 h-10 text-gaming-orange mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">+15-25%</h3>
              <p className="text-gray-600">Longer play sessions</p>
            </div>
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <Users className="w-10 h-10 text-gaming-orange mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">+20%</h3>
              <p className="text-gray-600">Repeat visit rate</p>
            </div>
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <Share2 className="w-10 h-10 text-gaming-orange mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-gray-600">Social media marketing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Gaming API Pricing
            </h2>
            <p className="text-gray-600">Per-venue pricing with ROI that pays for itself</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Venue */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Venue</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                $1,499<span className="text-base font-normal text-gray-500">/month</span>
              </p>
              <p className="text-gray-500 text-sm mb-6">per location</p>
              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gaming-orange" />
                  5 standard game modes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gaming-orange" />
                  50,000 requests/day
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gaming-orange" />
                  Handicap-based gameplay
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gaming-orange" />
                  Basic analytics
                </li>
              </ul>
              <Link to="/contact" className="btn-gaming-outline w-full text-center block">
                Get Started
              </Link>
            </div>

            {/* Venue Pro */}
            <div className="bg-white rounded-xl p-8 border-2 border-gaming-orange shadow-lg relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gaming-orange text-white text-xs px-3 py-1 rounded-full">
                Most Popular
              </span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Venue Pro</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                $2,499<span className="text-base font-normal text-gray-500">/month</span>
              </p>
              <p className="text-gray-500 text-sm mb-6">per location</p>
              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gaming-orange" />
                  All 10 game modes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gaming-orange" />
                  150,000 requests/day
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gaming-orange" />
                  Leaderboard integration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gaming-orange" />
                  Custom branding options
                </li>
              </ul>
              <Link to="/contact" className="btn-gaming w-full text-center block">
                Get Started
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                $3,999+<span className="text-base font-normal text-gray-500">/month</span>
              </p>
              <p className="text-gray-500 text-sm mb-6">multi-location chains</p>
              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gaming-orange" />
                  Everything in Pro
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gaming-orange" />
                  Multi-venue management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gaming-orange" />
                  Custom game modes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gaming-orange" />
                  Dedicated support
                </li>
              </ul>
              <Link to="/contact" className="btn-gaming-outline w-full text-center block">
                Contact Sales
              </Link>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link to="/pricing" className="text-gaming-orange font-medium hover:underline inline-flex items-center gap-2">
              View Full Pricing & ROI Calculator <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-gaming text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready To Create Unforgettable Moments?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Turn your venue into the must-visit spot for extreme golf experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-white text-gaming-orange px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-50 transition-all">
              Request Demo
            </Link>
            <Link to="/pricing" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all">
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
