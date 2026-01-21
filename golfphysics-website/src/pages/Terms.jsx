import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-300">Last Updated: January 21, 2026</p>
          <p className="text-gray-300">Effective: January 21, 2026</p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Table of Contents</h2>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <a href="#acceptance" className="text-golf-green hover:underline">1. Acceptance of Terms</a>
            <a href="#nature" className="text-golf-green hover:underline">2. Nature of Service</a>
            <a href="#account" className="text-golf-green hover:underline">3. Account Registration</a>
            <a href="#acceptable-use" className="text-golf-green hover:underline">4. Acceptable Use</a>
            <a href="#availability" className="text-golf-green hover:underline">5. Service Availability</a>
            <a href="#data" className="text-golf-green hover:underline">6. Data Handling</a>
            <a href="#termination" className="text-golf-green hover:underline">7. Termination</a>
            <a href="#warranties" className="text-golf-green hover:underline">8. Disclaimer of Warranties</a>
            <a href="#liability" className="text-golf-green hover:underline">9. Limitation of Liability</a>
            <a href="#indemnification" className="text-golf-green hover:underline">10. Indemnification</a>
            <a href="#disputes" className="text-golf-green hover:underline">11. Dispute Resolution</a>
            <a href="#changes" className="text-golf-green hover:underline">12. Changes to Terms</a>
            <a href="#contact" className="text-golf-green hover:underline">13. Contact Information</a>
            <a href="#miscellaneous" className="text-golf-green hover:underline">14. Miscellaneous</a>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">

            {/* Section 1 */}
            <h2 id="acceptance" className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing or using the Golf Physics API and website ("Service"), you agree to be bound by these
              Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
            </p>
            <p className="text-gray-600 mb-4">
              You must be at least 18 years old or have legal authority to enter into this agreement on behalf of your organization.
            </p>

            {/* Section 2 - Nature of Service */}
            <h2 id="nature" className="text-2xl font-bold text-gray-900 mt-12 mb-4">2. Nature of Service</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 Informational Purposes Only</h3>
            <p className="text-gray-600 mb-4">
              The Golf Physics API provides physics-based estimates and calculations for informational purposes only. The Service:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Calculates estimated ball flight trajectories based on environmental data and physics models</li>
              <li>Provides weather data aggregated from third-party sources</li>
              <li>Offers simulations of golf ball performance under various conditions</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 No Substitute for Experience</h3>
            <p className="text-gray-600 mb-4">The Service is not a substitute for:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>On-course experience and judgment</li>
              <li>Professional golf instruction</li>
              <li>Equipment fitting by qualified professionals</li>
              <li>Real-world testing and validation</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.3 Estimates May Vary</h3>
            <p className="text-gray-600 mb-4">Results provided by the Service are estimates based on:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Mathematical models and physics equations</li>
              <li>Weather data from third-party providers</li>
              <li>Standard atmospheric conditions</li>
              <li>Typical equipment specifications</li>
            </ul>
            <p className="text-gray-600 mb-4">Actual results may vary based on:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Equipment variations (ball type, club specifications)</li>
              <li>Swing mechanics and player skill</li>
              <li>Course conditions not captured in weather data</li>
              <li>Local microclimates and terrain effects</li>
              <li>Measurement accuracy of input data</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.4 Validation</h3>
            <p className="text-gray-600 mb-4">
              While our calculations are validated against industry-standard launch monitor data with typical accuracy of ±2 yards (±0.7%),
              individual results may vary. We make no guarantee that our estimates will match real-world results in all cases.
            </p>

            {/* Section 3 - Account Registration */}
            <h2 id="account" className="text-2xl font-bold text-gray-900 mt-12 mb-4">3. Account Registration</h2>
            <p className="text-gray-600 mb-4">To use our API, you must:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Register for an account and provide accurate information</li>
              <li>Maintain the security of your API keys</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>

            {/* Section 4 - Acceptable Use */}
            <h2 id="acceptable-use" className="text-2xl font-bold text-gray-900 mt-12 mb-4">4. Acceptable Use</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 Permitted Use</h3>
            <p className="text-gray-600 mb-4">You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Use the Service in any way that violates applicable laws or regulations</li>
              <li>Resell, redistribute, or sublicense access to the Service without written permission</li>
              <li>Reverse engineer, decompile, or attempt to derive source code</li>
              <li>Bypass or circumvent any security, rate limiting, or access controls</li>
              <li>Use automated systems to make excessive API calls beyond your tier limits</li>
              <li>Misrepresent the capabilities or accuracy of the Service</li>
              <li>Use the Service to make safety-critical decisions without independent verification</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.2 Data Usage</h3>
            <p className="text-gray-600 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Use our data to train competing machine learning models</li>
              <li>Scrape or harvest data beyond your API entitlement</li>
              <li>Cache data beyond reasonable operational needs (7 days maximum)</li>
              <li>Share API keys with unauthorized third parties</li>
              <li>Use the Service to build a competing weather or physics API</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.3 Account Security</h3>
            <p className="text-gray-600 mb-4">You are responsible for:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Maintaining the confidentiality of your API keys</li>
              <li>All activity under your account</li>
              <li>Notifying us immediately of unauthorized use</li>
              <li>Implementing reasonable security measures for API key storage</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.4 Compliance</h3>
            <p className="text-gray-600 mb-4">If you integrate the Service into your product:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>You must disclose to your users that weather data is estimated</li>
              <li>You must include appropriate disclaimers about accuracy</li>
              <li>You must not make guarantees we don't make</li>
              <li>You remain responsible for your product's performance</li>
            </ul>

            {/* Section 5 - Service Availability */}
            <h2 id="availability" className="text-2xl font-bold text-gray-900 mt-12 mb-4">5. Service Availability</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.1 Uptime Target</h3>
            <p className="text-gray-600 mb-4">We target 99.9% uptime for paid tiers, calculated on a monthly basis. This excludes:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Scheduled maintenance (announced 24 hours in advance)</li>
              <li>Force majeure events</li>
              <li>Issues caused by third-party providers</li>
              <li>DDoS attacks or similar malicious activity</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.2 No Guarantee</h3>
            <p className="text-gray-600 mb-4">While we strive for high availability, we do not guarantee:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Uninterrupted access to the Service</li>
              <li>Error-free operation</li>
              <li>Compatibility with all systems</li>
              <li>Specific response times (though we target &lt;100ms)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.3 Scheduled Maintenance</h3>
            <p className="text-gray-600 mb-4">We reserve the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Perform scheduled maintenance during low-usage periods</li>
              <li>Make emergency updates without advance notice</li>
              <li>Temporarily suspend access for security reasons</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.4 Changes to Service</h3>
            <p className="text-gray-600 mb-4">We reserve the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Modify features or functionality</li>
              <li>Update API endpoints or response formats</li>
              <li>Change rate limits or tier restrictions</li>
              <li>Discontinue features with reasonable notice (30 days for paid tiers)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.5 No Liability for Downtime</h3>
            <p className="text-gray-600 mb-4">
              We are not liable for losses resulting from service interruptions, except as specifically provided in your Service Level Agreement (SLA), if applicable to your tier.
            </p>

            {/* Section 6 - Data Handling */}
            <h2 id="data" className="text-2xl font-bold text-gray-900 mt-12 mb-4">6. Data Handling</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.1 Your Data</h3>
            <p className="text-gray-600 mb-4">Data you provide to the Service includes:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>API request data (location, shot parameters)</li>
              <li>Account information</li>
              <li>Usage metadata</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.2 Our Data</h3>
            <p className="text-gray-600 mb-4">
              All calculations, algorithms, models, and methodologies are our proprietary intellectual property. You may not:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Reverse engineer our physics models</li>
              <li>Extract our calculation methods</li>
              <li>Build competing services based on our data</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.3 Aggregated Data</h3>
            <p className="text-gray-600 mb-4">We reserve the right to use aggregated, anonymized data for:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Service improvement</li>
              <li>Research and development</li>
              <li>Marketing and case studies</li>
              <li>Industry benchmarking</li>
            </ul>
            <p className="text-gray-600 mb-4">We will not share your specific data with third parties except:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>As required by law</li>
              <li>With your explicit permission</li>
              <li>To our service providers (under confidentiality agreements)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.4 Data Retention</h3>
            <p className="text-gray-600 mb-4">We retain:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Usage logs: 90 days</li>
              <li>Account data: Duration of relationship + 1 year</li>
              <li>Billing records: 7 years (legal requirement)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.5 Privacy Policy</h3>
            <p className="text-gray-600 mb-4">
              Additional details are in our <Link to="/privacy" className="text-golf-green hover:underline">Privacy Policy</Link>.
              By using the Service, you also agree to the Privacy Policy.
            </p>

            {/* Section 7 - Termination */}
            <h2 id="termination" className="text-2xl font-bold text-gray-900 mt-12 mb-4">7. Termination</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.1 Termination by You</h3>
            <p className="text-gray-600 mb-4">You may terminate your account at any time by:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Canceling your subscription through the dashboard</li>
              <li>Sending written notice to golfphysicsio@gmail.com</li>
            </ul>
            <p className="text-gray-600 mb-4">Termination is effective at the end of your current billing period. No refunds for partial months.</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.2 Termination by Us</h3>
            <p className="text-gray-600 mb-4">We may suspend or terminate your access immediately if:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>You violate these Terms</li>
              <li>You exceed rate limits excessively</li>
              <li>Your payment method fails</li>
              <li>You engage in fraudulent activity</li>
              <li>Required by law</li>
            </ul>
            <p className="text-gray-600 mb-4">We may also terminate with 30 days' notice for any reason.</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.3 Effect of Termination</h3>
            <p className="text-gray-600 mb-4">Upon termination:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Your API keys are immediately deactivated</li>
              <li>You must cease all use of the Service</li>
              <li>You must delete any cached data</li>
              <li>Fees owed remain due and payable</li>
              <li>Sections that should survive (limitations, indemnification) remain in effect</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.4 Survival</h3>
            <p className="text-gray-600 mb-4">These sections survive termination:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Payment obligations</li>
              <li>Limitation of liability</li>
              <li>Indemnification</li>
              <li>Dispute resolution</li>
              <li>Intellectual property rights</li>
            </ul>

            {/* Section 8 - Disclaimer of Warranties */}
            <h2 id="warranties" className="text-2xl font-bold text-gray-900 mt-12 mb-4">8. Disclaimer of Warranties</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.1 "AS IS" Service</h3>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
              <p className="text-gray-800 font-medium uppercase">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
            </div>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Warranties of merchantability</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement</li>
              <li>Accuracy, reliability, or correctness of data</li>
              <li>Uninterrupted or error-free operation</li>
              <li>Results obtained from use of the Service</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.2 No Guarantee of Accuracy</h3>
            <p className="text-gray-600 mb-4">We do not warrant, guarantee, or make any representations regarding:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>The accuracy of calculations or estimates</li>
              <li>The reliability of weather data</li>
              <li>The performance of the Service</li>
              <li>The suitability for any specific use case</li>
              <li>Compatibility with your systems or software</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.3 Third-Party Data</h3>
            <p className="text-gray-600 mb-4">
              Weather data is obtained from third-party providers. We do not guarantee the accuracy, completeness, or timeliness of such data.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.4 Your Responsibility</h3>
            <p className="text-gray-600 mb-4">You acknowledge and agree that:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>You are solely responsible for decisions based on Service data</li>
              <li>You should verify critical information through other sources</li>
              <li>You assume all risk associated with use of the Service</li>
              <li>Professional judgment should always supersede API estimates</li>
            </ul>

            {/* Section 9 - Limitation of Liability */}
            <h2 id="liability" className="text-2xl font-bold text-gray-900 mt-12 mb-4">9. Limitation of Liability</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.1 Maximum Liability</h3>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
              <p className="text-gray-800 font-medium uppercase">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING FROM OR RELATED TO THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO LIABILITY.
              </p>
            </div>
            <p className="text-gray-600 mb-4">For free tier users, maximum liability shall not exceed $100 USD.</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.2 Exclusion of Consequential Damages</h3>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
              <p className="text-gray-800 font-medium uppercase">IN NO EVENT SHALL WE BE LIABLE FOR:</p>
            </div>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Loss of profits, revenue, or business opportunities</li>
              <li>Loss of data or information</li>
              <li>Loss of anticipated savings</li>
              <li>Business interruption</li>
              <li>Loss of goodwill or reputation</li>
              <li>Any indirect, incidental, special, consequential, or punitive damages</li>
            </ul>
            <p className="text-gray-600 mb-4 font-medium">EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.3 No Liability for User Decisions</h3>
            <p className="text-gray-600 mb-4">We shall not be liable for:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Decisions you make based on Service data</li>
              <li>Poor performance in golf tournaments or events</li>
              <li>Equipment purchases based on our recommendations</li>
              <li>Travel or preparation for golf destinations</li>
              <li>Business decisions based on our estimates</li>
              <li>Any third-party claims arising from your use of the Service</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.4 Force Majeure</h3>
            <p className="text-gray-600 mb-4">
              We are not liable for delays or failures in performance resulting from causes beyond our reasonable control, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Acts of God, natural disasters, or severe weather</li>
              <li>War, terrorism, riots, or civil unrest</li>
              <li>Internet service provider failures</li>
              <li>Power outages or telecommunications failures</li>
              <li>Third-party API or data provider outages</li>
              <li>Government actions or regulations</li>
              <li>Strikes or labor disputes</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.5 Your Acknowledgment</h3>
            <p className="text-gray-600 mb-4">By using the Service, you acknowledge that:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Golf performance depends on many factors beyond weather</li>
              <li>Our estimates are one tool among many for decision-making</li>
              <li>You will not rely solely on our Service for critical decisions</li>
              <li>You understand the limitations of physics-based modeling</li>
            </ul>

            {/* Section 10 - Indemnification */}
            <h2 id="indemnification" className="text-2xl font-bold text-gray-900 mt-12 mb-4">10. Indemnification</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10.1 Your Indemnification of Us</h3>
            <p className="text-gray-600 mb-4">
              You agree to indemnify, defend, and hold harmless Golf Physics LLC, its officers, directors, employees, agents, and affiliates from and against any and all claims, damages, losses, costs, expenses, and liabilities (including reasonable attorneys' fees) arising from or related to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Your use or misuse of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Decisions you make based on Service data</li>
              <li>Your representations to third parties about the Service</li>
              <li>Claims by your customers or users related to Service data</li>
              <li>Integration of the Service into your products or services</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10.2 Process</h3>
            <p className="text-gray-600 mb-4">We will:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Promptly notify you of any claim subject to indemnification</li>
              <li>Give you reasonable cooperation in the defense</li>
              <li>Allow you to control the defense and settlement</li>
            </ul>
            <p className="text-gray-600 mb-4">However, you may not settle any claim that:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Admits fault on our behalf without our written consent</li>
              <li>Imposes any obligation on us without our written consent</li>
              <li>Does not include a full release of all claims against us</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10.3 Our Right to Participate</h3>
            <p className="text-gray-600 mb-4">We reserve the right to participate in the defense of any claim at our own expense.</p>

            {/* Section 11 - Dispute Resolution */}
            <h2 id="disputes" className="text-2xl font-bold text-gray-900 mt-12 mb-4">11. Dispute Resolution</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.1 Informal Resolution</h3>
            <p className="text-gray-600 mb-4">
              Before filing any formal claim, you agree to contact us at golfphysicsio@gmail.com and attempt to resolve the dispute informally. We will attempt to resolve the dispute through good faith negotiations within 30 days.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.2 Binding Arbitration</h3>
            <p className="text-gray-600 mb-4">
              If informal resolution fails, any dispute arising from or relating to these Terms or the Service shall be resolved through binding arbitration, except as provided below.
            </p>
            <p className="text-gray-600 mb-4">Arbitration will be conducted by:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Administrator: American Arbitration Association (AAA)</li>
              <li>Rules: AAA Commercial Arbitration Rules</li>
              <li>Location: Miami-Dade County, Florida (or remote/video if agreed)</li>
              <li>Language: English</li>
              <li>Number of Arbitrators: One (1)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.3 Arbitration Procedures</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Either party may initiate arbitration by written notice</li>
              <li>Each party bears its own attorneys' fees and costs</li>
              <li>Arbitrator's fees split equally unless arbitrator orders otherwise</li>
              <li>Discovery shall be limited to information directly relevant to the dispute</li>
              <li>Arbitrator's decision is final and binding</li>
              <li>Judgment may be entered in any court of competent jurisdiction</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.4 Exceptions to Arbitration</h3>
            <p className="text-gray-600 mb-4">Either party may bring an action in court for:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Injunctive or equitable relief</li>
              <li>Protection of intellectual property rights</li>
              <li>Collection of fees owed</li>
              <li>Small claims court actions (under jurisdictional limits)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.5 No Class Actions</h3>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
              <p className="text-gray-800 font-medium uppercase">
                YOU AGREE THAT DISPUTES WILL BE ARBITRATED ONLY ON AN INDIVIDUAL BASIS AND NOT AS A CLASS ACTION, CONSOLIDATED ACTION, OR REPRESENTATIVE ACTION.
              </p>
            </div>
            <p className="text-gray-600 mb-4">You waive any right to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Participate in a class action lawsuit</li>
              <li>Participate in a class-wide arbitration</li>
              <li>Serve as a representative or private attorney general</li>
              <li>Consolidate your claims with those of others</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.6 Opt-Out Right</h3>
            <p className="text-gray-600 mb-4">
              You may opt out of this arbitration agreement by sending written notice to golfphysicsio@gmail.com within 30 days of first accepting these Terms. Your notice must include:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Your name and email address</li>
              <li>Statement: "I opt out of the arbitration agreement"</li>
              <li>Your signature (electronic signature acceptable)</li>
            </ul>
            <p className="text-gray-600 mb-4">If you opt out, all other terms still apply, but disputes will be resolved in court.</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.7 Governing Law</h3>
            <p className="text-gray-600 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of law provisions.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.8 Venue</h3>
            <p className="text-gray-600 mb-4">
              If arbitration does not apply (due to opt-out or exception), exclusive venue for any litigation shall be the state or federal courts located in Miami-Dade County, Florida.
            </p>

            {/* Section 12 - Changes to Terms */}
            <h2 id="changes" className="text-2xl font-bold text-gray-900 mt-12 mb-4">12. Changes to Terms</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">12.1 Right to Modify</h3>
            <p className="text-gray-600 mb-4">We reserve the right to modify these Terms at any time. We will notify you of material changes by:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Email to your registered address</li>
              <li>Notice in the dashboard</li>
              <li>Posting updated Terms with revision date</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">12.2 Acceptance of Changes</h3>
            <p className="text-gray-600 mb-4">Continued use of the Service after changes constitute acceptance of modified Terms.</p>
            <p className="text-gray-600 mb-4">If you do not agree to changes:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Stop using the Service</li>
              <li>Terminate your account</li>
              <li>Your use until termination is governed by new Terms</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">12.3 Revision Date</h3>
            <p className="text-gray-600 mb-4">These Terms were last revised: January 21, 2026. Check back periodically for updates.</p>

            {/* Section 13 - Contact Information */}
            <h2 id="contact" className="text-2xl font-bold text-gray-900 mt-12 mb-4">13. Contact Information</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">13.1 Legal Notices</h3>
            <p className="text-gray-600 mb-4">Send legal notices to:</p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-gray-700">Golf Physics LLC</p>
              <p className="text-gray-700">Legal Department</p>
              <p className="text-gray-700">Email: <a href="mailto:golfphysicsio@gmail.com" className="text-golf-green hover:underline">golfphysicsio@gmail.com</a></p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">13.2 Customer Support</h3>
            <p className="text-gray-600 mb-4">For support inquiries:</p>
            <ul className="list-none text-gray-600 mb-4 space-y-1">
              <li>Email: <a href="mailto:golfphysicsio@gmail.com" className="text-golf-green hover:underline">golfphysicsio@gmail.com</a></li>
              <li>Website: <Link to="/contact#message" className="text-golf-green hover:underline">golfphysics.io/contact</Link></li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">13.3 Notices to You</h3>
            <p className="text-gray-600 mb-4">We may send notices to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Email address on your account</li>
              <li>Dashboard notifications</li>
              <li>Postal address if provided</li>
            </ul>
            <p className="text-gray-600 mb-4">You are responsible for keeping contact information current.</p>

            {/* Section 14 - Miscellaneous */}
            <h2 id="miscellaneous" className="text-2xl font-bold text-gray-900 mt-12 mb-4">14. Miscellaneous</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.1 Entire Agreement</h3>
            <p className="text-gray-600 mb-4">
              These Terms, together with the Privacy Policy and any Service Level Agreement (SLA), constitute the entire agreement between you and Golf Physics LLC regarding the Service.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.2 Severability</h3>
            <p className="text-gray-600 mb-4">If any provision of these Terms is found invalid or unenforceable:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>That provision shall be modified to the minimum extent necessary</li>
              <li>All other provisions remain in full force and effect</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.3 No Waiver</h3>
            <p className="text-gray-600 mb-4">
              Our failure to enforce any right or provision does not constitute a waiver of that right or provision.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.4 Assignment</h3>
            <p className="text-gray-600 mb-4">
              You may not assign these Terms without our written consent. We may assign these Terms to any affiliate or in connection with a merger or acquisition.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.5 No Agency</h3>
            <p className="text-gray-600 mb-4">
              Nothing in these Terms creates a partnership, joint venture, employment, or agency relationship.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.6 Force Majeure</h3>
            <p className="text-gray-600 mb-4">
              Neither party is liable for delays or failures due to causes beyond reasonable control.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.7 Interpretation</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>"Including" means "including but not limited to"</li>
              <li>Section headings are for convenience only</li>
              <li>"You" includes your agents and contractors</li>
              <li>"We"/"Us"/"Our" refers to Golf Physics LLC</li>
            </ul>

            {/* Footer Disclaimer */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 italic">
                Golf Physics API provides physics-based estimates for informational purposes only.
                Results may vary from actual on-course conditions. These Terms are subject to change.
                Please check back periodically for updates.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
