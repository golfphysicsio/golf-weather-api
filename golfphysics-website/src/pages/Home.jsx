import { Link } from 'react-router-dom'
import {
  Target, Gamepad2, Wind, Thermometer, Mountain, Droplets,
  CheckCircle, ArrowRight, Zap, TrendingUp, Users
} from 'lucide-react'

export default function Home() {
  return (
    <div>
      {/* Hero Section - Dual Market */}
      <section className="bg-gradient-golf text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Golf Experiences That Players
            <br />
            <span className="text-golf-green-light">Can't Stop Talking About</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10">
            Real atmospheric physics. Unreal player engagement.
            <br />
            From tour-accurate training to 500-yard viral moments.
          </p>

          {/* Dual CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/professional"
              className="bg-pro-blue text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-pro-blue-dark transition-all hover:shadow-lg inline-flex items-center justify-center gap-2"
            >
              <Target className="w-5 h-5" />
              Professional API
            </Link>
            <Link
              to="/gaming"
              className="bg-gaming-orange text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gaming-orange-dark transition-all hover:shadow-lg inline-flex items-center justify-center gap-2"
            >
              <Gamepad2 className="w-5 h-5" />
              Gaming API
            </Link>
          </div>

          {/* Visual concept hint */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-left">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-lg mb-2">Serious Training</h3>
              <p className="text-gray-300 text-sm">Tour-accurate atmospheric adjustments for real improvement</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-left">
              <div className="text-3xl mb-3">🎮</div>
              <h3 className="font-semibold text-lg mb-2">Viral Moments</h3>
              <p className="text-gray-300 text-sm">500-yard drives and extreme weather challenges</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Great Golf Technology Needs Great Experiences
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Launch Monitor Companies */}
            <div className="bg-pro-blue/5 border border-pro-blue/20 rounded-xl p-8">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">The Challenge</h3>
              <p className="text-gray-600 mb-6">
                Your technology is incredible, but ball flight data without context
                is just numbers. A 280-yard drive in Denver isn't the same as 280
                in Miami.
              </p>
              <div className="border-t pt-6">
                <h4 className="font-semibold text-pro-blue mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> The Solution
                </h4>
                <p className="text-gray-600 text-sm">
                  Tour-accurate atmospheric adjustments. Your players see true distances
                  anywhere—building trust in your technology and their game.
                </p>
              </div>
            </div>

            {/* Entertainment Venues */}
            <div className="bg-gaming-orange/5 border border-gaming-orange/20 rounded-xl p-8">
              <div className="text-3xl mb-4">🎮</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">The Challenge</h3>
              <p className="text-gray-600 mb-6">
                Every venue has the same games. Casual golfers don't care about spin
                rates—they want fun, shareable moments that bring them back.
              </p>
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gaming-orange mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> The Solution
                </h4>
                <p className="text-gray-600 text-sm">
                  Extreme weather game modes. Hurricane challenges. 500-yard drives.
                  Viral TikTok moments. Content that refreshes itself.
                </p>
              </div>
            </div>

            {/* The Outcome */}
            <div className="bg-golf-green/5 border border-golf-green/20 rounded-xl p-8">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">The Outcome</h3>
              <p className="text-gray-600 mb-6">
                Longer sessions. More repeat visits. Higher revenue per player.
                Enhanced experiences = enhanced profits.
              </p>
              <div className="border-t pt-6">
                <h4 className="font-semibold text-golf-green mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> All Backed By
                </h4>
                <p className="text-gray-600 text-sm">
                  Real atmospheric physics. The same math that aerospace engineers use.
                  Whether it's 30mph at a tournament or 150mph in a game—it's always accurate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Market Positioning */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              One Physics Engine. Two Perfect Applications.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Professional API Card */}
            <div className="card-pro p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-pro-blue/10 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-pro-blue" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Professional API</h3>
                  <p className="text-pro-blue font-medium">For Serious Golf</p>
                </div>
              </div>

              <p className="text-gray-600 mb-6 text-lg">
                Real conditions. Real improvement.
              </p>

              <div className="mb-6">
                <p className="font-semibold text-gray-900 mb-3">Perfect for:</p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-pro-blue" />
                    Launch monitor companies (inRange, TrackMan, Foresight)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-pro-blue" />
                    Golf instructors and club fitters
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-pro-blue" />
                    Premium practice facilities
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-pro-blue" />
                    Tournament simulation
                  </li>
                </ul>
              </div>

              <div className="mb-8">
                <p className="font-semibold text-gray-900 mb-3">Features:</p>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Tour-accurate atmospheric adjustments</li>
                  <li>• Real-time weather integration</li>
                  <li>• Custom condition testing</li>
                  <li>• Realistic training ranges (0-35mph wind, playable temps)</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Link to="/professional" className="btn-pro flex-1 text-center">
                  Learn More
                </Link>
                <Link to="/docs" className="btn-pro-outline flex-1 text-center">
                  Documentation
                </Link>
              </div>
            </div>

            {/* Gaming API Card */}
            <div className="card-gaming p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gaming-orange/10 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-gaming-orange" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Gaming API</h3>
                  <p className="text-gaming-orange font-medium">For Unforgettable Moments</p>
                </div>
              </div>

              <p className="text-gray-600 mb-6 text-lg">
                Extreme conditions. Extreme fun.
              </p>

              <div className="mb-6">
                <p className="font-semibold text-gray-900 mb-3">Perfect for:</p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gaming-orange" />
                    Entertainment venues (Topgolf, Drive Shack, Five Iron)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gaming-orange" />
                    Simulator bars and social golf
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gaming-orange" />
                    Distance challenges and tournaments
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gaming-orange" />
                    Viral social content
                  </li>
                </ul>
              </div>

              <div className="mb-8">
                <p className="font-semibold text-gray-900 mb-3">Features:</p>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• 10+ extreme weather game modes</li>
                  <li>• Handicap-based gameplay (no data required)</li>
                  <li>• Distance records and leaderboards</li>
                  <li>• Extreme ranges (150mph wind, Everest altitude)</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Link to="/gaming" className="btn-gaming flex-1 text-center">
                  Learn More
                </Link>
                <Link to="/gaming#modes" className="btn-gaming-outline flex-1 text-center">
                  View Game Modes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Science Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Backed By Real Physics. Not Guesswork.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every calculation uses atmospheric physics and ballistic mathematics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="card text-center">
              <Wind className="w-10 h-10 text-golf-green mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Air Density</h3>
              <p className="text-gray-600 text-sm">Temperature, altitude, pressure effects</p>
            </div>
            <div className="card text-center">
              <Thermometer className="w-10 h-10 text-golf-green mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Temperature</h3>
              <p className="text-gray-600 text-sm">Ball compression in cold weather</p>
            </div>
            <div className="card text-center">
              <Mountain className="w-10 h-10 text-golf-green mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Altitude</h3>
              <p className="text-gray-600 text-sm">Reduced drag in thin air</p>
            </div>
            <div className="card text-center">
              <Droplets className="w-10 h-10 text-golf-green mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Humidity</h3>
              <p className="text-gray-600 text-sm">Air resistance adjustments</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Whether it's a 30mph wind at a tournament or a 150mph hurricane in
              a game—the math is always accurate. The physics is always real.
            </p>
            <Link to="/science" className="btn-secondary inline-flex items-center gap-2">
              Read The Science <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-golf-green text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Built For The Best</h2>
            <p className="text-gray-200">
              Developed in partnership with leading launch monitor companies and entertainment venues.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold">99.9%</p>
              <p className="text-golf-green-light">Uptime SLA</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold">&lt;200ms</p>
              <p className="text-golf-green-light">Response time</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold">±2%</p>
              <p className="text-golf-green-light">Accuracy validated</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold">10+</p>
              <p className="text-golf-green-light">Game modes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready To Enhance The Experience?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              One API. Everything included. Professional physics + Gaming modes.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-white rounded-xl p-8 border-4 border-golf-green shadow-lg">
            <div className="text-center mb-6">
              <div className="inline-block bg-golf-green text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                EVERYTHING INCLUDED
              </div>
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-pro-blue" />
                  <span className="font-medium">Professional</span>
                </div>
                <span className="text-gray-400">+</span>
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-6 h-6 text-gaming-orange" />
                  <span className="font-medium">Gaming</span>
                </div>
              </div>
              <p className="text-4xl font-bold text-golf-green mb-2">
                $299<span className="text-xl text-gray-600">/month</span>
              </p>
              <p className="text-gray-600">per facility • Volume discounts available</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/contact" className="btn-primary flex-1 text-center py-3">
                Get Started
              </Link>
              <Link to="/pricing" className="btn-outline flex-1 text-center py-3">
                View Pricing
              </Link>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Questions?{' '}
              <Link to="/contact" className="text-golf-green font-medium hover:underline">
                Contact Us
              </Link>
              {' '}|{' '}
              <Link to="/docs" className="text-golf-green font-medium hover:underline">
                View API Documentation
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
