import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-300">Last updated: January 20, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-600 mb-4">
              Golf Physics ("we," "our," or "us") operates the Golf Physics API and website at golfphysics.io.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
              you use our API services and visit our website.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 Account Information</h3>
            <p className="text-gray-600 mb-4">
              When you create an account or request API access, we collect:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Name and email address</li>
              <li>Company name and business information</li>
              <li>Billing information (processed securely through our payment provider)</li>
              <li>API keys and authentication credentials</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 API Usage Data</h3>
            <p className="text-gray-600 mb-4">
              When you use our API, we collect:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>API request metadata (endpoint, timestamp, response time)</li>
              <li>Request volume and patterns for rate limiting</li>
              <li>Error logs for debugging and service improvement</li>
              <li>IP addresses for security and abuse prevention</li>
            </ul>
            <p className="text-gray-600 mb-4">
              <strong>Note:</strong> We do not store the actual shot data or weather parameters you send to our API
              beyond what is necessary for processing the request and short-term caching.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.3 Website Analytics</h3>
            <p className="text-gray-600 mb-4">
              We use analytics tools to understand how visitors use our website. This includes:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Pages visited and time spent</li>
              <li>Referral sources</li>
              <li>Device and browser information</li>
              <li>Geographic location (country/region level)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">We use collected information to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Provide and maintain our API services</li>
              <li>Process your transactions and send related information</li>
              <li>Send administrative information (service updates, security alerts)</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Monitor and analyze usage patterns to improve our services</li>
              <li>Detect, prevent, and address technical issues or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Information Sharing</h2>
            <p className="text-gray-600 mb-4">
              We do not sell your personal information. We may share information with:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li><strong>Service Providers:</strong> Third parties that help us operate our business (payment processing, hosting, analytics)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Data Security</h2>
            <p className="text-gray-600 mb-4">
              We implement industry-standard security measures including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Encryption in transit (TLS/HTTPS) and at rest</li>
              <li>Secure API key management</li>
              <li>Regular security audits and monitoring</li>
              <li>Access controls and authentication</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Data Retention</h2>
            <p className="text-gray-600 mb-4">
              We retain your information for as long as your account is active or as needed to provide services.
              API usage logs are retained for 90 days for operational purposes. You may request deletion of your
              account and associated data by contacting us.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Your Rights</h2>
            <p className="text-gray-600 mb-4">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to or restrict processing</li>
              <li>Data portability</li>
            </ul>
            <p className="text-gray-600 mb-4">
              To exercise these rights, contact us at <a href="mailto:golfphysicsio@gmail.com" className="text-golf-green hover:underline">golfphysicsio@gmail.com</a>.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Cookies</h2>
            <p className="text-gray-600 mb-4">
              We use essential cookies to maintain your session and preferences. We may use analytics cookies
              to understand website usage. You can control cookies through your browser settings.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. International Transfers</h2>
            <p className="text-gray-600 mb-4">
              Your information may be transferred to and processed in countries other than your own.
              We ensure appropriate safeguards are in place for such transfers.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Children's Privacy</h2>
            <p className="text-gray-600 mb-4">
              Our services are not directed to individuals under 18. We do not knowingly collect information
              from children.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Changes to This Policy</h2>
            <p className="text-gray-600 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of material changes
              by posting the new policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <ul className="list-none text-gray-600 mb-4 space-y-1">
              <li>Email: <a href="mailto:golfphysicsio@gmail.com" className="text-golf-green hover:underline">golfphysicsio@gmail.com</a></li>
              <li>Website: <Link to="/contact#message" className="text-golf-green hover:underline">golfphysics.io/contact</Link></li>
            </ul>

          </div>
        </div>
      </section>
    </div>
  )
}
