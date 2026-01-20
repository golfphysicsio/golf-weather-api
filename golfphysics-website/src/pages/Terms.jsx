import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-300">Last updated: January 20, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing or using the Golf Physics API and website ("Service"), you agree to be bound by these
              Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 mb-4">
              Golf Physics provides an API service that calculates how weather conditions affect golf ball flight.
              The Service includes the Professional API (tour-accurate physics) and Gaming API (extreme weather modes).
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Account Registration</h2>
            <p className="text-gray-600 mb-4">To use our API, you must:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Register for an account and provide accurate information</li>
              <li>Maintain the security of your API keys</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
            <p className="text-gray-600 mb-4">
              You must be at least 18 years old or have legal authority to enter into this agreement on behalf of your organization.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. API Usage</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 Permitted Use</h3>
            <p className="text-gray-600 mb-4">You may use the API to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Integrate golf physics calculations into your applications</li>
              <li>Build products and services that use our trajectory calculations</li>
              <li>Display results to your end users</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.2 Prohibited Use</h3>
            <p className="text-gray-600 mb-4">You may not:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Resell, redistribute, or sublicense the API without authorization</li>
              <li>Attempt to reverse engineer, decompile, or extract our algorithms</li>
              <li>Exceed your rate limits or attempt to circumvent usage restrictions</li>
              <li>Use the Service for any illegal purpose</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Share your API keys with unauthorized parties</li>
              <li>Scrape, cache, or store API responses beyond reasonable operational needs</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.3 Rate Limits</h3>
            <p className="text-gray-600 mb-4">
              Your subscription tier determines your rate limits (requests per minute, day, and month).
              Exceeding limits may result in throttling or temporary suspension. We will notify you before
              taking action on persistent overages.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Pricing and Payment</h2>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Fees are billed monthly or annually as selected</li>
              <li>All fees are non-refundable except as required by law</li>
              <li>We may change pricing with 30 days notice</li>
              <li>You are responsible for all applicable taxes</li>
              <li>Failure to pay may result in suspension of service</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Service Level Agreement</h2>
            <p className="text-gray-600 mb-4">
              We commit to 99.9% uptime for paid tiers. This excludes scheduled maintenance (with advance notice),
              force majeure events, and issues caused by your systems or third parties.
            </p>
            <p className="text-gray-600 mb-4">
              If we fail to meet the SLA in a given month, you may be eligible for service credits upon request.
              Contact support within 30 days of the incident.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              Golf Physics retains all rights to the Service, including our algorithms, documentation, and branding.
              You retain ownership of your applications and data. By using the Service, you grant us a limited license
              to process your API requests.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-gray-600 mb-4">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. We do not guarantee that:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>The Service will be uninterrupted or error-free</li>
              <li>Results will be accurate for all conditions</li>
              <li>The Service will meet your specific requirements</li>
            </ul>
            <p className="text-gray-600 mb-4">
              While we validate our physics against professional data, golf ball flight is affected by many variables.
              Our calculations are estimates and should not be used as the sole basis for critical decisions.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, GOLF PHYSICS SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Any indirect, incidental, special, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damages exceeding the fees paid in the 12 months prior to the claim</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Indemnification</h2>
            <p className="text-gray-600 mb-4">
              You agree to indemnify and hold harmless Golf Physics from any claims, damages, or expenses arising
              from your use of the Service, violation of these Terms, or infringement of any third-party rights.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Termination</h2>
            <p className="text-gray-600 mb-4">
              Either party may terminate this agreement with 30 days notice. We may suspend or terminate your
              access immediately for:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Violation of these Terms</li>
              <li>Non-payment</li>
              <li>Suspected fraud or abuse</li>
              <li>Legal requirements</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Upon termination, your right to use the API ceases immediately. Provisions that should survive
              termination (such as liability limitations) will remain in effect.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Modifications to Terms</h2>
            <p className="text-gray-600 mb-4">
              We may modify these Terms at any time. Material changes will be communicated via email or
              prominent notice on our website at least 30 days before taking effect. Continued use after
              changes constitutes acceptance.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Governing Law</h2>
            <p className="text-gray-600 mb-4">
              These Terms are governed by the laws of the State of Delaware, USA, without regard to conflict
              of law principles. Any disputes shall be resolved in the courts of Delaware.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">14. General Provisions</h2>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and Golf Physics</li>
              <li><strong>Severability:</strong> If any provision is found unenforceable, the remaining provisions continue in effect</li>
              <li><strong>Waiver:</strong> Failure to enforce any right does not waive that right</li>
              <li><strong>Assignment:</strong> You may not assign your rights without our consent; we may assign freely</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">15. Contact</h2>
            <p className="text-gray-600 mb-4">
              Questions about these Terms? Contact us at:
            </p>
            <ul className="list-none text-gray-600 mb-4 space-y-1">
              <li>Email: <a href="mailto:legal@golfphysics.io" className="text-golf-green hover:underline">legal@golfphysics.io</a></li>
              <li>Website: <Link to="/contact" className="text-golf-green hover:underline">golfphysics.io/contact</Link></li>
            </ul>

          </div>
        </div>
      </section>
    </div>
  )
}
