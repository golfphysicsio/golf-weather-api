import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Target, Gamepad2, CheckCircle, X, HelpCircle, Calculator,
  TrendingUp, ArrowRight
} from 'lucide-react'

export default function Pricing() {
  const [activeTab, setActiveTab] = useState('professional')

  // ROI Calculator State
  const [monthlyVisitors, setMonthlyVisitors] = useState(5000)
  const [avgSpendPerVisit, setAvgSpendPerVisit] = useState(45)
  const [sessionIncrease, setSessionIncrease] = useState(15)

  // Calculate ROI
  const baselineRevenue = monthlyVisitors * avgSpendPerVisit
  const additionalRevenue = baselineRevenue * (sessionIncrease / 100)
  const monthlyCost = 2499 // Venue Pro tier
  const monthlyProfit = additionalRevenue - monthlyCost
  const roi = ((monthlyProfit / monthlyCost) * 100).toFixed(0)

  const professionalTiers = [
    {
      name: 'Starter',
      price: '$299',
      period: '/month per facility',
      description: 'For individual instructors and small studios',
      features: [
        '25,000 requests/day',
        'Real-time weather integration',
        'Custom conditions testing',
        '99.9% uptime SLA',
        'Email support',
        'API documentation access',
      ],
      notIncluded: [
        'Phone support',
        'Volume discounts',
        'Custom integrations',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Professional',
      price: '$599',
      period: '/month per facility',
      description: 'For launch monitor companies and training centers',
      features: [
        '100,000 requests/day',
        'Everything in Starter',
        'Priority phone support',
        'Technical onboarding call',
        'Volume discounts available',
        'Quarterly business reviews',
      ],
      notIncluded: [
        'Dedicated infrastructure',
        'Custom SLA terms',
      ],
      cta: 'Get Started',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'tailored pricing',
      description: 'For large organizations with custom needs',
      features: [
        'Unlimited requests',
        'Dedicated infrastructure',
        '99.99% uptime SLA',
        'Custom integrations',
        'Dedicated account manager',
        'White-label options',
        'Custom contract terms',
      ],
      notIncluded: [],
      cta: 'Contact Sales',
      popular: false,
    },
  ]

  const gamingTiers = [
    {
      name: 'Venue',
      price: '$1,499',
      period: '/month per location',
      description: 'For single entertainment venues',
      features: [
        '5 standard game modes',
        '50,000 requests/day',
        'Handicap-based gameplay',
        'Basic analytics dashboard',
        'Email support',
        'Integration guide',
      ],
      notIncluded: [
        'Extreme game modes',
        'Leaderboard integration',
        'Custom branding',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Venue Pro',
      price: '$2,499',
      period: '/month per location',
      description: 'Full entertainment experience',
      features: [
        'All 10 game modes',
        '150,000 requests/day',
        'Leaderboard integration',
        'Custom branding options',
        'Advanced analytics',
        'Priority support',
        'Seasonal content updates',
      ],
      notIncluded: [
        'Multi-venue management',
        'Custom game modes',
      ],
      cta: 'Get Started',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$3,999+',
      period: '/month for chains',
      description: 'For multi-location entertainment chains',
      features: [
        'Everything in Pro',
        'Multi-venue management',
        'Custom game modes',
        'Dedicated success manager',
        'Cross-venue leaderboards',
        'Marketing co-promotion',
        'White-label options',
      ],
      notIncluded: [],
      cta: 'Contact Sales',
      popular: false,
    },
  ]

  const faqs = [
    {
      question: 'What counts as a request?',
      answer: 'Each API call to calculate trajectory or fetch weather data counts as one request. Caching and best practices in our documentation help optimize usage.',
    },
    {
      question: 'Can I switch between plans?',
      answer: 'Yes, you can upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle.',
    },
    {
      question: 'Do you offer annual discounts?',
      answer: 'Yes, annual billing saves 15% compared to monthly. Contact sales for annual pricing.',
    },
    {
      question: 'What happens if I exceed my request limit?',
      answer: 'We\'ll notify you at 80% usage. Overage is billed at a per-request rate, or you can upgrade to a higher tier.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'We offer a 14-day free trial on all paid plans. No credit card required to start.',
    },
    {
      question: 'Can I use both Professional and Gaming APIs?',
      answer: 'Yes! Contact sales for bundled pricing if you need both APIs.',
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-golf text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Choose the API that fits your needs. Scale as you grow.
          </p>
        </div>
      </section>

      {/* Toggle Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="pricing-toggle max-w-md w-full">
              <button
                onClick={() => setActiveTab('professional')}
                className={`pricing-toggle-btn ${activeTab === 'professional' ? 'active-pro' : ''}`}
              >
                <Target className="w-4 h-4 inline mr-2" />
                Professional API
              </button>
              <button
                onClick={() => setActiveTab('gaming')}
                className={`pricing-toggle-btn ${activeTab === 'gaming' ? 'active-gaming' : ''}`}
              >
                <Gamepad2 className="w-4 h-4 inline mr-2" />
                Gaming API
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Professional Pricing */}
          {activeTab === 'professional' && (
            <>
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional API Pricing</h2>
                <p className="text-gray-600">Tour-accurate physics for training and improvement</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {professionalTiers.map((tier, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-xl p-8 shadow-sm relative ${
                      tier.popular ? 'border-2 border-pro-blue ring-2 ring-pro-blue/20' : 'border border-gray-200'
                    }`}
                  >
                    {tier.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pro-blue text-white text-xs px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{tier.price}</p>
                    <p className="text-gray-500 text-sm mb-4">{tier.period}</p>
                    <p className="text-gray-600 text-sm mb-6">{tier.description}</p>

                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-pro-blue flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                      {tier.notIncluded.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                          <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link
                      to="/contact"
                      className={`block w-full text-center py-3 rounded-lg font-semibold transition-all ${
                        tier.popular
                          ? 'bg-pro-blue text-white hover:bg-pro-blue-dark'
                          : 'border-2 border-pro-blue text-pro-blue hover:bg-pro-blue hover:text-white'
                      }`}
                    >
                      {tier.cta}
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Gaming Pricing */}
          {activeTab === 'gaming' && (
            <>
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Gaming API Pricing</h2>
                <p className="text-gray-600">Extreme weather for unforgettable entertainment</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {gamingTiers.map((tier, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-xl p-8 shadow-sm relative ${
                      tier.popular ? 'border-2 border-gaming-orange ring-2 ring-gaming-orange/20' : 'border border-gray-200'
                    }`}
                  >
                    {tier.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gaming-orange text-white text-xs px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{tier.price}</p>
                    <p className="text-gray-500 text-sm mb-4">{tier.period}</p>
                    <p className="text-gray-600 text-sm mb-6">{tier.description}</p>

                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-gaming-orange flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                      {tier.notIncluded.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                          <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link
                      to="/contact"
                      className={`block w-full text-center py-3 rounded-lg font-semibold transition-all ${
                        tier.popular
                          ? 'bg-gaming-orange text-white hover:bg-gaming-orange-dark'
                          : 'border-2 border-gaming-orange text-gaming-orange hover:bg-gaming-orange hover:text-white'
                      }`}
                    >
                      {tier.cta}
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ROI Calculator - Gaming Only */}
      {activeTab === 'gaming' && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gaming-orange/10 text-gaming-orange rounded-full px-4 py-2 mb-4">
                <Calculator className="w-4 h-4" />
                <span className="text-sm font-medium">ROI Calculator</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Calculate Your Return on Investment
              </h2>
              <p className="text-gray-600">
                See how extreme weather modes can impact your venue's revenue
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Visitors
                    </label>
                    <input
                      type="range"
                      min="1000"
                      max="20000"
                      step="500"
                      value={monthlyVisitors}
                      onChange={(e) => setMonthlyVisitors(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gaming-orange"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>1,000</span>
                      <span className="font-semibold text-gaming-orange">{monthlyVisitors.toLocaleString()}</span>
                      <span>20,000</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Average Spend Per Visit ($)
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      step="5"
                      value={avgSpendPerVisit}
                      onChange={(e) => setAvgSpendPerVisit(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gaming-orange"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>$20</span>
                      <span className="font-semibold text-gaming-orange">${avgSpendPerVisit}</span>
                      <span>$100</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Session/Spend Increase (%)
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="1"
                      value={sessionIncrease}
                      onChange={(e) => setSessionIncrease(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gaming-orange"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>5%</span>
                      <span className="font-semibold text-gaming-orange">{sessionIncrease}%</span>
                      <span>30%</span>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Current Monthly Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${baselineRevenue.toLocaleString()}</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Additional Monthly Revenue</p>
                    <p className="text-2xl font-bold text-golf-green">+${additionalRevenue.toLocaleString()}</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Gaming API Cost (Venue Pro)</p>
                    <p className="text-2xl font-bold text-gray-900">-${monthlyCost.toLocaleString()}</p>
                  </div>

                  <div className="roi-result">
                    <p className="text-sm text-orange-100 mb-1">Monthly Net Profit</p>
                    <p className="text-3xl font-bold">${monthlyProfit.toLocaleString()}</p>
                    <p className="text-lg mt-2">
                      <TrendingUp className="w-5 h-5 inline mr-1" />
                      {roi}% ROI
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-6 text-center">
                * Estimates based on typical venue performance improvements. Individual results may vary.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Feature Comparison */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Professional vs Gaming API
            </h2>
            <p className="text-gray-600">
              Choose the right API for your use case
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-6">
                    <div className="flex items-center justify-center gap-2 text-pro-blue font-semibold">
                      <Target className="w-4 h-4" />
                      Professional
                    </div>
                  </th>
                  <th className="text-center py-4 px-6">
                    <div className="flex items-center justify-center gap-2 text-gaming-orange font-semibold">
                      <Gamepad2 className="w-4 h-4" />
                      Gaming
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b">
                  <td className="py-4 px-6 text-gray-600">Target Market</td>
                  <td className="py-4 px-6 text-center">Launch monitors, instructors</td>
                  <td className="py-4 px-6 text-center">Entertainment venues</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 text-gray-600">Wind Range</td>
                  <td className="py-4 px-6 text-center">0-35 mph (realistic)</td>
                  <td className="py-4 px-6 text-center">0-150 mph (extreme)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 text-gray-600">Temperature Range</td>
                  <td className="py-4 px-6 text-center">20-110°F (playable)</td>
                  <td className="py-4 px-6 text-center">-40 to 130°F (extreme)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 text-gray-600">Input Method</td>
                  <td className="py-4 px-6 text-center">Ball speed, launch angle, spin</td>
                  <td className="py-4 px-6 text-center">Handicap + club (simple)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 text-gray-600">Weather Presets</td>
                  <td className="py-4 px-6 text-center">
                    <X className="w-4 h-4 text-gray-400 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <CheckCircle className="w-4 h-4 text-gaming-orange mx-auto" />
                    10 game modes
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 text-gray-600">Real-time Weather</td>
                  <td className="py-4 px-6 text-center">
                    <CheckCircle className="w-4 h-4 text-pro-blue mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <CheckCircle className="w-4 h-4 text-gaming-orange mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 text-gray-600">Custom Conditions</td>
                  <td className="py-4 px-6 text-center">
                    <CheckCircle className="w-4 h-4 text-pro-blue mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <CheckCircle className="w-4 h-4 text-gaming-orange mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-600">Starting Price</td>
                  <td className="py-4 px-6 text-center font-semibold text-pro-blue">$299/month</td>
                  <td className="py-4 px-6 text-center font-semibold text-gaming-orange">$1,499/month</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                  <HelpCircle className="w-5 h-5 text-golf-green flex-shrink-0 mt-0.5" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 ml-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-golf-green text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Start with a 14-day free trial. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-white text-golf-green px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all">
              Start Free Trial
            </Link>
            <Link to="/contact" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
