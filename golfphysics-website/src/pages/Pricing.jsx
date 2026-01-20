import { Link } from 'react-router-dom'
import { CheckCircle, HelpCircle, Target, Gamepad2, Building2, BookOpen } from 'lucide-react'

export default function Pricing() {
  const faqs = [
    {
      question: 'Do I get both Professional AND Gaming APIs?',
      answer: 'Yes! Every customer gets full access to both APIs. Use whichever endpoints fit your use case - there\'s no separation or extra charge.',
    },
    {
      question: 'What if I only need the Professional API?',
      answer: 'Same price - $299/month includes everything. You\'re free to use only what you need. Think of it as an all-you-can-eat buffet - pay one price, choose what you want.',
    },
    {
      question: 'Can I start with 1 facility and add more later?',
      answer: 'Absolutely. Add facilities anytime and volume discounts apply automatically. Start small, scale as you grow.',
    },
    {
      question: 'What counts as a "facility"?',
      answer: 'One physical location with golf bays or simulators. For inRange customers: 1 range = 1 facility, regardless of how many bays (20 bays = still 1 facility). For Topgolf-style venues: 1 location = 1 facility.',
    },
    {
      question: 'Is there a free tier for testing?',
      answer: 'Yes! Contact us for a 30-day pilot at one facility. Full access to both APIs, all features, no credit card required. Perfect for testing integration before committing.',
    },
    {
      question: 'What happens if I exceed 750,000 calls/month?',
      answer: 'Highly unlikely for a single facility (that\'s 25,000/day). If you do exceed it, we\'ll contact you about custom capacity pricing. We\'ll never cut you off without warning.',
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, cancel anytime with 30 days notice. No long-term contracts required. Volume discounts require maintaining the facility count, but still month-to-month.',
    },
    {
      question: 'How do volume discounts work exactly?',
      answer: 'Automatic. When you connect your 2nd facility, pricing drops to $275/month per facility (both facilities). Add a 6th facility and everyone drops to $249/month. The discount applies to all facilities, not just new ones.',
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple Pricing. Everything Included.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional physics + Gaming modes in one unified API.
            <br />
            $299/month per facility. Volume discounts available.
          </p>
        </div>
      </section>

      {/* Main Pricing Card */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border-4 border-golf-green p-8">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block bg-golf-green text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                EVERYTHING INCLUDED
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Golf Physics API - Complete</h2>
              <div className="text-5xl font-bold text-golf-green mb-2">
                $299<span className="text-2xl text-gray-600">/month</span>
              </div>
              <p className="text-gray-600">per facility</p>
            </div>

            {/* What's Included */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">

              {/* Professional API */}
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Target className="w-6 h-6 mr-2 text-pro-blue" />
                  Professional API
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-golf-green mr-2 flex-shrink-0 mt-0.5" />
                    <span>Tour-accurate physics calculations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-golf-green mr-2 flex-shrink-0 mt-0.5" />
                    <span>Real-time weather integration</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-golf-green mr-2 flex-shrink-0 mt-0.5" />
                    <span>Shot distance calculations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-golf-green mr-2 flex-shrink-0 mt-0.5" />
                    <span>Environmental effects breakdown</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-golf-green mr-2 flex-shrink-0 mt-0.5" />
                    <span>Launch monitor integration</span>
                  </li>
                </ul>
              </div>

              {/* Gaming API */}
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Gamepad2 className="w-6 h-6 mr-2 text-gaming-orange" />
                  Gaming API
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-golf-green mr-2 flex-shrink-0 mt-0.5" />
                    <span>10 extreme weather game modes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-golf-green mr-2 flex-shrink-0 mt-0.5" />
                    <span>Handicap-based shot simulation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-golf-green mr-2 flex-shrink-0 mt-0.5" />
                    <span>Preset challenges & scenarios</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-golf-green mr-2 flex-shrink-0 mt-0.5" />
                    <span>Entertainment venue features</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-golf-green mr-2 flex-shrink-0 mt-0.5" />
                    <span>Leaderboards & competitions</span>
                  </li>
                </ul>
              </div>

              {/* Enterprise Features */}
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Building2 className="w-6 h-6 mr-2 text-gray-700" />
                  Enterprise Features
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-golf-green mr-2 flex-shrink-0 mt-0.5" />
                    <span>Metadata tracking (facility, bay, player, session)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-golf-green mr-2 flex-shrink-0 mt-0.5" />
                    <span>Multi-location support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-golf-green mr-2 flex-shrink-0 mt-0.5" />
                    <span>99.9% uptime SLA</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-golf-green mr-2 flex-shrink-0 mt-0.5" />
                    <span>750,000 API calls/month</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-golf-green mr-2 flex-shrink-0 mt-0.5" />
                    <span>Response time &lt;100ms</span>
                  </li>
                </ul>
              </div>

              {/* Support & Docs */}
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <BookOpen className="w-6 h-6 mr-2 text-gray-700" />
                  Support & Documentation
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-golf-green mr-2 flex-shrink-0 mt-0.5" />
                    <span>Full API documentation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-golf-green mr-2 flex-shrink-0 mt-0.5" />
                    <span>Code examples (JS, Python, Swift)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-golf-green mr-2 flex-shrink-0 mt-0.5" />
                    <span>Email + chat support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-golf-green mr-2 flex-shrink-0 mt-0.5" />
                    <span>Integration assistance</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-golf-green mr-2 flex-shrink-0 mt-0.5" />
                    <span>Priority bug fixes</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Perfect For */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-bold mb-3">Perfect for:</h3>
              <div className="grid md:grid-cols-2 gap-2 text-gray-700">
                <div>• Launch monitor companies (inRange, TrackMan)</div>
                <div>• Entertainment venues (Topgolf-style)</div>
                <div>• Golf course management systems</div>
                <div>• Mobile apps & coaching platforms</div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                to="/contact"
                className="inline-block bg-golf-green text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-golf-green-dark transition-colors"
              >
                Get Started - $299/month
              </Link>
              <p className="text-sm text-gray-500 mt-3">
                30-day pilot available • No credit card required • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Volume Discounts Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Volume Discounts</h2>
            <p className="text-xl text-gray-600">
              The more facilities you connect, the more you save.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-golf-green text-white">
                <tr>
                  <th className="py-4 px-6 text-left font-semibold">Facilities</th>
                  <th className="py-4 px-6 text-left font-semibold">Price per Facility</th>
                  <th className="py-4 px-6 text-left font-semibold hidden sm:table-cell">Monthly Total</th>
                  <th className="py-4 px-6 text-left font-semibold">Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-6 font-medium">1 facility</td>
                  <td className="py-4 px-6">$299/month</td>
                  <td className="py-4 px-6 hidden sm:table-cell">$299</td>
                  <td className="py-4 px-6 text-gray-500">Base price</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-6 font-medium">2-5 facilities</td>
                  <td className="py-4 px-6 text-golf-green font-semibold">$275/month</td>
                  <td className="py-4 px-6 hidden sm:table-cell">$550 - $1,375</td>
                  <td className="py-4 px-6 text-golf-green">Save 8%</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">6-10 facilities</td>
                  <td className="py-4 px-6 text-golf-green font-semibold">$249/month</td>
                  <td className="py-4 px-6 hidden sm:table-cell">$1,494 - $2,490</td>
                  <td className="py-4 px-6 text-golf-green">Save 17%</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-6 font-medium">11-20 facilities</td>
                  <td className="py-4 px-6 text-golf-green font-semibold">$225/month</td>
                  <td className="py-4 px-6 hidden sm:table-cell">$2,475 - $4,500</td>
                  <td className="py-4 px-6 text-golf-green">Save 25%</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">21+ facilities</td>
                  <td className="py-4 px-6 font-semibold">Custom pricing</td>
                  <td className="py-4 px-6 hidden sm:table-cell">Contact sales</td>
                  <td className="py-4 px-6 text-golf-green">Maximum savings</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-center mt-8">
            <p className="text-lg mb-4">
              <span className="font-semibold">Annual prepay:</span> Save 15% (equivalent to 2 months free)
            </p>
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise Solutions</h2>
              <p className="text-xl text-gray-300">
                Need custom features or managing 50+ facilities?
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start">
                <span className="text-2xl mr-3">✓</span>
                <div>
                  <h3 className="font-semibold mb-1">White-label branding</h3>
                  <p className="text-gray-400 text-sm">Your logo, your colors, your domain</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">✓</span>
                <div>
                  <h3 className="font-semibold mb-1">Custom subdomain</h3>
                  <p className="text-gray-400 text-sm">weather.yourcompany.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">✓</span>
                <div>
                  <h3 className="font-semibold mb-1">On-premise deployment</h3>
                  <p className="text-gray-400 text-sm">Host on your infrastructure</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">✓</span>
                <div>
                  <h3 className="font-semibold mb-1">Dedicated support engineer</h3>
                  <p className="text-gray-400 text-sm">Direct Slack/Teams access</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">✓</span>
                <div>
                  <h3 className="font-semibold mb-1">Custom SLA (99.99%+)</h3>
                  <p className="text-gray-400 text-sm">Maximum uptime guarantees</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">✓</span>
                <div>
                  <h3 className="font-semibold mb-1">Co-development opportunities</h3>
                  <p className="text-gray-400 text-sm">Custom features built for you</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">✓</span>
                <div>
                  <h3 className="font-semibold mb-1">Revenue sharing models</h3>
                  <p className="text-gray-400 text-sm">Partnership opportunities</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">✓</span>
                <div>
                  <h3 className="font-semibold mb-1">Priority feature requests</h3>
                  <p className="text-gray-400 text-sm">Influence roadmap direction</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/contact"
                className="inline-block bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Sales for Custom Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-bold text-lg mb-2 flex items-start gap-2">
                    <HelpCircle className="w-5 h-5 text-golf-green flex-shrink-0 mt-0.5" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 ml-7">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-golf-green text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            One price. Everything included. Start with a 30-day pilot.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-golf-green px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all"
            >
              Get Started - $299/month
            </Link>
            <Link
              to="/docs"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
