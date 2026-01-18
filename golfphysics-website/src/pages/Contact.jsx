import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, MessageSquare, Handshake, Send, CheckCircle, Target, Gamepad2 } from 'lucide-react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

export default function Contact() {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    category: 'general',
    message: '',
    useCase: '',
    expectedRequests: '',
    interest: '' // 'professional', 'gaming', or 'both'
  })
  const [submitted, setSubmitted] = useState(false)
  const [formType, setFormType] = useState('apikey') // 'contact' or 'apikey'
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Get reCAPTCHA token
      let recaptchaToken = null
      if (executeRecaptcha) {
        recaptchaToken = await executeRecaptcha(formType === 'apikey' ? 'api_key_request' : 'contact_form')
      }

      // In production, send to backend with reCAPTCHA token
      console.log('Form submitted:', { ...formData, recaptcha_token: recaptchaToken })
      setSubmitted(true)
    } catch (err) {
      console.error('Form submission error:', err)
      setSubmitted(true) // Show success for demo
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactOptions = [
    {
      icon: Mail,
      title: 'Sales',
      description: 'Questions about pricing or features?',
      email: 'sales@golfphysics.io',
      color: 'text-golf-green',
      bg: 'bg-golf-green/10',
    },
    {
      icon: MessageSquare,
      title: 'Support',
      description: 'Need technical help?',
      email: 'support@golfphysics.io',
      color: 'text-pro-blue',
      bg: 'bg-pro-blue/10',
    },
    {
      icon: Handshake,
      title: 'Partnership',
      description: 'Interested in partnering?',
      email: 'partners@golfphysics.io',
      color: 'text-gaming-orange',
      bg: 'bg-gaming-orange/10',
    },
  ]

  const professionalUseCases = [
    { value: 'launch_monitor', label: 'Launch Monitor Integration' },
    { value: 'coaching', label: 'Coaching / Training App' },
    { value: 'club_fitting', label: 'Club Fitting Software' },
    { value: 'course_management', label: 'Course Management' },
    { value: 'mobile_app', label: 'Mobile Golf App' },
  ]

  const gamingUseCases = [
    { value: 'entertainment_venue', label: 'Entertainment Venue (Topgolf-style)' },
    { value: 'simulator_gaming', label: 'Simulator Gaming' },
    { value: 'sports_bar', label: 'Sports Bar / Lounge' },
    { value: 'driving_range', label: 'Driving Range Enhancement' },
    { value: 'mobile_game', label: 'Mobile Game' },
  ]

  const getUseCases = () => {
    if (formData.interest === 'professional') return professionalUseCases
    if (formData.interest === 'gaming') return gamingUseCases
    if (formData.interest === 'both') return [...professionalUseCases, ...gamingUseCases]
    return []
  }

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <CheckCircle className="w-16 h-16 text-golf-green mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {formType === 'apikey' ? 'Welcome to Golf Physics!' : 'Message Sent!'}
            </h2>
            {formType === 'apikey' ? (
              <>
                <p className="text-gray-600 mb-6">
                  Your API key request has been received. Check your email for next steps.
                </p>
                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-500 mb-2">Interest:</p>
                  <p className="text-golf-green font-medium capitalize">
                    {formData.interest === 'both' ? 'Professional & Gaming API' : `${formData.interest} API`}
                  </p>
                </div>
                <div className="space-y-2 text-left text-sm text-gray-600">
                  <p className="font-semibold">Next Steps:</p>
                  <p>1. <Link to="/docs" className="text-golf-green hover:underline">View Quick Start Guide</Link></p>
                  <p>2. <Link to={formData.interest === 'gaming' ? '/gaming' : '/professional'} className="text-golf-green hover:underline">Explore API Features</Link></p>
                  <p>3. Make your first API call</p>
                </div>
              </>
            ) : (
              <p className="text-gray-600 mb-6">
                We'll get back to you within 24 hours.
              </p>
            )}
            <button
              onClick={() => {
                setSubmitted(false)
                setFormData({
                  name: '',
                  email: '',
                  company: '',
                  category: 'general',
                  message: '',
                  useCase: '',
                  expectedRequests: '',
                  interest: ''
                })
              }}
              className="btn-secondary mt-4"
            >
              {formType === 'apikey' ? 'Request Another Key' : 'Send Another Message'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-golf-green to-golf-green-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get Started with Golf Physics</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Whether you're building professional training tools or entertainment games,
            we're here to help.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {contactOptions.map((option) => {
              const Icon = option.icon
              return (
                <div key={option.title} className={`${option.bg} rounded-xl p-6 text-center`}>
                  <Icon className={`w-10 h-10 ${option.color} mx-auto mb-4`} />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                  <a
                    href={`mailto:${option.email}`}
                    className={`${option.color} font-medium hover:underline text-sm`}
                  >
                    {option.email}
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Form Tabs */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Buttons */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setFormType('apikey')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                formType === 'apikey'
                  ? 'text-golf-green border-b-2 border-golf-green'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Get API Access
            </button>
            <button
              onClick={() => setFormType('contact')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                formType === 'contact'
                  ? 'text-golf-green border-b-2 border-golf-green'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Send a Message
            </button>
          </div>

          {/* API Key Form */}
          {formType === 'apikey' && (
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Request API Access</h2>
              <p className="text-gray-600 mb-6">Tell us about your project and we'll get you set up.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Interest Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Which API are you interested in? *
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, interest: 'professional', useCase: '' })}
                      className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                        formData.interest === 'professional'
                          ? 'border-pro-blue bg-pro-blue/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                        formData.interest === 'professional' ? 'bg-pro-blue/10' : 'bg-gray-100'
                      }`}>
                        <Target className={`w-5 h-5 ${formData.interest === 'professional' ? 'text-pro-blue' : 'text-gray-400'}`} />
                      </div>
                      <span className={`text-sm font-medium ${formData.interest === 'professional' ? 'text-pro-blue' : 'text-gray-700'}`}>
                        Professional
                      </span>
                      <span className="text-xs text-gray-500 mt-1">Training & Accuracy</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, interest: 'gaming', useCase: '' })}
                      className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                        formData.interest === 'gaming'
                          ? 'border-gaming-orange bg-gaming-orange/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                        formData.interest === 'gaming' ? 'bg-gaming-orange/10' : 'bg-gray-100'
                      }`}>
                        <Gamepad2 className={`w-5 h-5 ${formData.interest === 'gaming' ? 'text-gaming-orange' : 'text-gray-400'}`} />
                      </div>
                      <span className={`text-sm font-medium ${formData.interest === 'gaming' ? 'text-gaming-orange' : 'text-gray-700'}`}>
                        Gaming
                      </span>
                      <span className="text-xs text-gray-500 mt-1">Entertainment</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, interest: 'both', useCase: '' })}
                      className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                        formData.interest === 'both'
                          ? 'border-golf-green bg-golf-green/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                        formData.interest === 'both' ? 'bg-golf-green/10' : 'bg-gray-100'
                      }`}>
                        <div className="flex -space-x-1">
                          <Target className={`w-4 h-4 ${formData.interest === 'both' ? 'text-pro-blue' : 'text-gray-400'}`} />
                          <Gamepad2 className={`w-4 h-4 ${formData.interest === 'both' ? 'text-gaming-orange' : 'text-gray-400'}`} />
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${formData.interest === 'both' ? 'text-golf-green' : 'text-gray-700'}`}>
                        Both
                      </span>
                      <span className="text-xs text-gray-500 mt-1">Full Platform</span>
                    </button>
                  </div>
                </div>

                {formData.interest && (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golf-green focus:border-golf-green"
                          placeholder="Your Company"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Work Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golf-green focus:border-golf-green"
                          placeholder="you@company.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="useCase" className="block text-sm font-medium text-gray-700 mb-2">
                        Use Case *
                      </label>
                      <select
                        id="useCase"
                        name="useCase"
                        value={formData.useCase}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golf-green focus:border-golf-green"
                      >
                        <option value="">Select your use case</option>
                        {getUseCases().map(uc => (
                          <option key={uc.value} value={uc.value}>{uc.label}</option>
                        ))}
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Monthly Requests
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        {['< 100K', '100K - 1M', '1M+'].map((option) => (
                          <label
                            key={option}
                            className={`flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
                              formData.expectedRequests === option
                                ? 'border-golf-green bg-golf-green/5 text-golf-green'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <input
                              type="radio"
                              name="expectedRequests"
                              value={option}
                              checked={formData.expectedRequests === option}
                              onChange={handleChange}
                              className="sr-only"
                            />
                            <span className="text-sm font-medium">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Requesting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Request API Access
                        </>
                      )}
                    </button>
                  </>
                )}

                <p className="text-xs text-gray-500 text-center">
                  By signing up, you agree to our{' '}
                  <Link to="/terms" className="text-golf-green hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-golf-green hover:underline">Privacy Policy</Link>.
                  <br />
                  This site is protected by reCAPTCHA and the Google{' '}
                  <a href="https://policies.google.com/privacy" className="underline" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>{' '}and{' '}
                  <a href="https://policies.google.com/terms" className="underline" target="_blank" rel="noopener noreferrer">
                    Terms of Service
                  </a>{' '}apply.
                </p>
              </form>
            </div>
          )}

          {/* Contact Form */}
          {formType === 'contact' && (
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
              <p className="text-gray-600 mb-6">We typically respond within 24 hours.</p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golf-green focus:border-golf-green"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golf-green focus:border-golf-green"
                      placeholder="you@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contactCompany" className="block text-sm font-medium text-gray-700 mb-2">
                    Company (optional)
                  </label>
                  <input
                    type="text"
                    id="contactCompany"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golf-green focus:border-golf-green"
                    placeholder="Your company"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    What can we help with? *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golf-green focus:border-golf-green"
                  >
                    <option value="general">General question</option>
                    <option value="professional_api">Professional API inquiry</option>
                    <option value="gaming_api">Gaming API inquiry</option>
                    <option value="sales">Sales / Pricing</option>
                    <option value="support">Technical support</option>
                    <option value="partnership">Partnership opportunity</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golf-green focus:border-golf-green resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  This site is protected by reCAPTCHA and the Google{' '}
                  <a href="https://policies.google.com/privacy" className="underline" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>{' '}and{' '}
                  <a href="https://policies.google.com/terms" className="underline" target="_blank" rel="noopener noreferrer">
                    Terms of Service
                  </a>{' '}apply.
                </p>
              </form>
            </div>
          )}

          {/* FAQ Link */}
          <p className="text-center mt-8 text-gray-600">
            Looking for quick answers?{' '}
            <Link to="/pricing#faq" className="text-golf-green font-medium hover:underline">
              Check our FAQ
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
