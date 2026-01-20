import { Link } from 'react-router-dom'
import { Target, Lightbulb, Shield, Users, ArrowRight, CheckCircle, Zap } from 'lucide-react'

export default function About() {
  const values = [
    {
      icon: Target,
      title: 'Accuracy First',
      description: 'Every calculation is validated against TrackMan data. We don\'t ship features until they\'re within 2% of real-world results.',
      color: 'text-golf-green',
      bg: 'bg-golf-green/10'
    },
    {
      icon: Lightbulb,
      title: 'Transparency',
      description: 'We show our work. The Science page documents every formula, and our API provides detailed breakdowns of each environmental effect.',
      color: 'text-pro-blue',
      bg: 'bg-pro-blue/10'
    },
    {
      icon: Shield,
      title: 'Reliability',
      description: '99.9% uptime SLA. Enterprise-grade infrastructure. Your app depends on us, and we take that responsibility seriously.',
      color: 'text-gaming-orange',
      bg: 'bg-gaming-orange/10'
    },
    {
      icon: Users,
      title: 'Developer Focus',
      description: 'Built by developers, for developers. Clear documentation, helpful error messages, and responsive support when you need it.',
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    }
  ]

  const timeline = [
    {
      year: '2023',
      title: 'The Problem',
      description: 'Noticed launch monitor apps using oversimplified wind calculations. A 10mph headwind doesn\'t just subtract yards linearly.'
    },
    {
      year: '2024',
      title: 'Physics Research',
      description: 'Dove deep into golf ball aerodynamics, atmospheric physics, and TrackMan research. Built the core physics engine.'
    },
    {
      year: '2025',
      title: 'API Launch',
      description: 'Launched Golf Physics API with Professional tier. Achieved ±2% accuracy against TrackMan benchmarks.'
    },
    {
      year: '2026',
      title: 'Gaming Expansion',
      description: 'Introduced Gaming API with extreme weather presets for entertainment venues. Same physics, amplified for fun.'
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-golf-green to-golf-green-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Real Physics for Real Golf
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              We believe golf technology deserves better than approximations.
              That's why we built an API powered by actual atmospheric physics and
              validated against professional-grade launch monitors.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/science" className="bg-white text-golf-green px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                See the Science
              </Link>
              <Link to="/contact" className="text-white font-medium hover:underline flex items-center gap-2">
                Get in Touch <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                Make professional-grade golf physics accessible to every developer building
                golf technology, whether they're creating training tools for tour players
                or entertainment games for casual golfers.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Golf apps shouldn't have to choose between accuracy and simplicity.
                Our API handles the complex physics so you can focus on creating
                great user experiences.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-golf-green flex-shrink-0" />
                  <span className="text-gray-700">One API call replaces thousands of lines of physics code</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-golf-green flex-shrink-0" />
                  <span className="text-gray-700">Validated against TrackMan and real-world data</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-golf-green flex-shrink-0" />
                  <span className="text-gray-700">Works for both professional training and entertainment</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">The Physics Advantage</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Most Apps Use</p>
                  <p className="text-gray-700">Linear approximations: "10mph headwind = -10 yards"</p>
                </div>
                <div className="border-t pt-6">
                  <p className="text-sm font-medium text-golf-green mb-1">Golf Physics Uses</p>
                  <p className="text-gray-700">Real aerodynamics: drag coefficients, Magnus force, air density variations</p>
                </div>
                <div className="border-t pt-6">
                  <p className="text-sm font-medium text-gray-500 mb-1">The Result</p>
                  <p className="text-gray-700 font-medium">±2% accuracy vs ±15-20% with simple formulas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Markets Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              One Physics Engine, Two Applications
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The same validated physics that powers professional training also creates
              incredible gaming experiences when pushed to extremes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Professional */}
            <div className="bg-white rounded-2xl p-8 border-2 border-pro-blue/20">
              <div className="w-12 h-12 bg-pro-blue/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-pro-blue" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional API</h3>
              <p className="text-gray-600 mb-6">
                For launch monitors, coaching apps, and club fitters who need tour-accurate
                physics. Real conditions, real results.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-gray-700">
                  <Zap className="w-4 h-4 text-pro-blue" />
                  ±2% accuracy vs TrackMan
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <Zap className="w-4 h-4 text-pro-blue" />
                  Full trajectory data
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <Zap className="w-4 h-4 text-pro-blue" />
                  Detailed impact breakdowns
                </li>
              </ul>
              <Link to="/professional" className="btn-pro-outline">
                Learn More
              </Link>
            </div>

            {/* Gaming */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gaming-orange/20">
              <div className="w-12 h-12 bg-gaming-orange/10 rounded-xl flex items-center justify-center mb-6">
                <Lightbulb className="w-6 h-6 text-gaming-orange" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Gaming API</h3>
              <p className="text-gray-600 mb-6">
                For entertainment venues like Topgolf who want extreme weather challenges
                that are physically plausible and consistently fair.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-gray-700">
                  <Zap className="w-4 h-4 text-gaming-orange" />
                  10 weather game modes
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <Zap className="w-4 h-4 text-gaming-orange" />
                  Handicap-adjusted difficulty
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <Zap className="w-4 h-4 text-gaming-orange" />
                  Leaderboard-ready scoring
                </li>
              </ul>
              <Link to="/gaming" className="btn-gaming-outline">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Stand For</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide how we build and support Golf Physics API.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon
              return (
                <div key={value.title} className="text-center p-6">
                  <div className={`w-14 h-14 ${value.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-7 h-7 ${value.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600">
              From a physics problem to a production API.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" />

              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div key={item.year} className={`relative flex items-start gap-6 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Timeline dot */}
                    <div className="absolute left-4 md:left-1/2 w-8 h-8 bg-golf-green rounded-full flex items-center justify-center -translate-x-1/2 z-10">
                      <span className="text-white text-xs font-bold">{item.year.slice(-2)}</span>
                    </div>

                    {/* Content */}
                    <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                      <div className="bg-white rounded-xl p-6 shadow-sm">
                        <span className="text-sm font-bold text-golf-green">{item.year}</span>
                        <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-golf-green text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Something Great?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Whether you're building professional training tools or entertainment games,
            we'd love to help you get started.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-secondary">
              Get API Access
            </Link>
            <Link to="/docs" className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors">
              Read the Docs
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
