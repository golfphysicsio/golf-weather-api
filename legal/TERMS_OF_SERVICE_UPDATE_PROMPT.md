# PROMPT FOR CLAUDE CODE - Update Terms of Service

**Add Critical Legal Protection Clauses**

---

```
I need you to update the Golf Physics API Terms of Service to include essential protective legal clauses.

This is CRITICAL for liability protection before launching with enterprise customers.

---

## CONTEXT

Golf Physics API (api.golfphysics.io) is a B2B SaaS API that calculates golf ball trajectory based on environmental conditions. We provide physics-based estimates for how weather affects golf shots.

Customers include:
- Launch monitor companies (inRange Golf)
- Golf course management software
- Golf app developers

We need legal protection against:
1. Claims that our calculations are inaccurate
2. Lawsuits for lost business/tournaments due to API issues
3. Liability for customer decisions based on our data
4. Expensive court battles (prefer arbitration)

---

## YOUR TASK

Update the Terms of Service document to include the following protective clauses.

---

## LOCATION OF TERMS OF SERVICE

**Find the file:**
- Could be: `website-dist/terms.html`
- Or: `golfphysics-website/public/terms.html`
- Or: `docs/TERMS_OF_SERVICE.md`
- Or: May need to be created

**If it doesn't exist:** Create a new file at `website-dist/terms.html`

---

## REQUIRED SECTIONS TO ADD

Add these sections to the Terms of Service. Use clear, professional legal language.

---

### SECTION 1: SERVICE DESCRIPTION & NATURE OF ESTIMATES

**Add this near the beginning (after "Acceptance of Terms"):**

```
2. NATURE OF SERVICE

2.1 Informational Purposes Only

The Golf Physics API provides physics-based estimates and calculations for informational purposes only. The Service:

a) Calculates estimated ball flight trajectories based on environmental data and physics models
b) Provides weather data aggregated from third-party sources
c) Offers simulations of golf ball performance under various conditions

2.2 No Substitute for Experience

The Service is not a substitute for:
- On-course experience and judgment
- Professional golf instruction
- Equipment fitting by qualified professionals
- Real-world testing and validation

2.3 Estimates May Vary

Results provided by the Service are estimates based on:
- Mathematical models and physics equations
- Weather data from third-party providers
- Standard atmospheric conditions
- Typical equipment specifications

Actual results may vary based on:
- Equipment variations (ball type, club specifications)
- Swing mechanics and player skill
- Course conditions not captured in weather data
- Local microclimates and terrain effects
- Measurement accuracy of input data

2.4 Validation

While our calculations are validated against industry-standard launch monitor data with typical accuracy of ±2 yards (±0.7%), individual results may vary. We make no guarantee that our estimates will match real-world results in all cases.
```

---

### SECTION 2: DISCLAIMER OF WARRANTIES

**Add this section:**

```
8. DISCLAIMER OF WARRANTIES

8.1 "AS IS" Service

THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:

a) Warranties of merchantability
b) Fitness for a particular purpose
c) Non-infringement
d) Accuracy, reliability, or correctness of data
e) Uninterrupted or error-free operation
f) Results obtained from use of the Service

8.2 No Guarantee of Accuracy

We do not warrant, guarantee, or make any representations regarding:
- The accuracy of calculations or estimates
- The reliability of weather data
- The performance of the Service
- The suitability for any specific use case
- Compatibility with your systems or software

8.3 Third-Party Data

Weather data is obtained from third-party providers. We do not guarantee the accuracy, completeness, or timeliness of such data.

8.4 Your Responsibility

You acknowledge and agree that:
- You are solely responsible for decisions based on Service data
- You should verify critical information through other sources
- You assume all risk associated with use of the Service
- Professional judgment should always supersede API estimates
```

---

### SECTION 3: LIMITATION OF LIABILITY

**Add this section:**

```
9. LIMITATION OF LIABILITY

9.1 Maximum Liability

TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING FROM OR RELATED TO THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO LIABILITY.

For free tier users, maximum liability shall not exceed $100 USD.

9.2 Exclusion of Consequential Damages

IN NO EVENT SHALL WE BE LIABLE FOR:

a) Loss of profits, revenue, or business opportunities
b) Loss of data or information
c) Loss of anticipated savings
d) Business interruption
e) Loss of goodwill or reputation
f) Any indirect, incidental, special, consequential, or punitive damages

EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

9.3 No Liability for User Decisions

We shall not be liable for:
- Decisions you make based on Service data
- Poor performance in golf tournaments or events
- Equipment purchases based on our recommendations
- Travel or preparation for golf destinations
- Business decisions based on our estimates
- Any third-party claims arising from your use of the Service

9.4 Force Majeure

We are not liable for delays or failures in performance resulting from causes beyond our reasonable control, including but not limited to:
- Acts of God, natural disasters, or severe weather
- War, terrorism, riots, or civil unrest
- Internet service provider failures
- Power outages or telecommunications failures
- Third-party API or data provider outages
- Government actions or regulations
- Strikes or labor disputes

9.5 Your Acknowledgment

By using the Service, you acknowledge that:
- Golf performance depends on many factors beyond weather
- Our estimates are one tool among many for decision-making
- You will not rely solely on our Service for critical decisions
- You understand the limitations of physics-based modeling
```

---

### SECTION 4: INDEMNIFICATION

**Add this section:**

```
10. INDEMNIFICATION

10.1 Your Indemnification of Us

You agree to indemnify, defend, and hold harmless Golf Physics LLC, its officers, directors, employees, agents, and affiliates from and against any and all claims, damages, losses, costs, expenses, and liabilities (including reasonable attorneys' fees) arising from or related to:

a) Your use or misuse of the Service
b) Your violation of these Terms
c) Your violation of any rights of another party
d) Decisions you make based on Service data
e) Your representations to third parties about the Service
f) Claims by your customers or users related to Service data
g) Integration of the Service into your products or services

10.2 Process

We will:
- Promptly notify you of any claim subject to indemnification
- Give you reasonable cooperation in the defense
- Allow you to control the defense and settlement

However, you may not settle any claim that:
- Admits fault on our behalf without our written consent
- Imposes any obligation on us without our written consent
- Does not include a full release of all claims against us

10.3 Our Right to Participate

We reserve the right to participate in the defense of any claim at our own expense.
```

---

### SECTION 5: DISPUTE RESOLUTION & ARBITRATION

**Add this section:**

```
11. DISPUTE RESOLUTION

11.1 Informal Resolution

Before filing any formal claim, you agree to contact us at legal@golfphysics.io and attempt to resolve the dispute informally. We will attempt to resolve the dispute through good faith negotiations within 30 days.

11.2 Binding Arbitration

If informal resolution fails, any dispute arising from or relating to these Terms or the Service shall be resolved through binding arbitration, except as provided below.

Arbitration will be conducted by:
- Administrator: American Arbitration Association (AAA)
- Rules: AAA Commercial Arbitration Rules
- Location: Miami-Dade County, Florida (or remote/video if agreed)
- Language: English
- Number of Arbitrators: One (1)

11.3 Arbitration Procedures

a) Either party may initiate arbitration by written notice
b) Each party bears its own attorneys' fees and costs
c) Arbitrator's fees split equally unless arbitrator orders otherwise
d) Discovery shall be limited to information directly relevant to the dispute
e) Arbitrator's decision is final and binding
f) Judgment may be entered in any court of competent jurisdiction

11.4 Exceptions to Arbitration

Either party may bring an action in court for:
- Injunctive or equitable relief
- Protection of intellectual property rights
- Collection of fees owed
- Small claims court actions (under jurisdictional limits)

11.5 No Class Actions

YOU AGREE THAT DISPUTES WILL BE ARBITRATED ONLY ON AN INDIVIDUAL BASIS AND NOT AS A CLASS ACTION, CONSOLIDATED ACTION, OR REPRESENTATIVE ACTION.

You waive any right to:
- Participate in a class action lawsuit
- Participate in a class-wide arbitration
- Serve as a representative or private attorney general
- Consolidate your claims with those of others

11.6 Opt-Out Right

You may opt out of this arbitration agreement by sending written notice to legal@golfphysics.io within 30 days of first accepting these Terms. Your notice must include:
- Your name and email address
- Statement: "I opt out of the arbitration agreement"
- Your signature (electronic signature acceptable)

If you opt out, all other terms still apply, but disputes will be resolved in court.

11.7 Governing Law

These Terms shall be governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of law provisions.

11.8 Venue

If arbitration does not apply (due to opt-out or exception), exclusive venue for any litigation shall be the state or federal courts located in Miami-Dade County, Florida.
```

---

### SECTION 6: ACCEPTABLE USE POLICY

**Add this section:**

```
4. ACCEPTABLE USE

4.1 Permitted Use

You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to:

a) Use the Service in any way that violates applicable laws or regulations
b) Resell, redistribute, or sublicense access to the Service without written permission
c) Reverse engineer, decompile, or attempt to derive source code
d) Bypass or circumvent any security, rate limiting, or access controls
e) Use automated systems to make excessive API calls beyond your tier limits
f) Misrepresent the capabilities or accuracy of the Service
g) Use the Service to make safety-critical decisions without independent verification

4.2 Data Usage

You agree not to:
- Use our data to train competing machine learning models
- Scrape or harvest data beyond your API entitlement
- Cache data beyond reasonable operational needs (7 days maximum)
- Share API keys with unauthorized third parties
- Use the Service to build a competing weather or physics API

4.3 Account Security

You are responsible for:
- Maintaining the confidentiality of your API keys
- All activity under your account
- Notifying us immediately of unauthorized use
- Implementing reasonable security measures for API key storage

4.4 Compliance

If you integrate the Service into your product:
- You must disclose to your users that weather data is estimated
- You must include appropriate disclaimers about accuracy
- You must not make guarantees we don't make
- You remain responsible for your product's performance
```

---

### SECTION 7: SERVICE LEVEL & AVAILABILITY

**Add this section:**

```
5. SERVICE AVAILABILITY

5.1 Uptime Target

We target 99.9% uptime for paid tiers, calculated on a monthly basis. This excludes:
- Scheduled maintenance (announced 24 hours in advance)
- Force majeure events
- Issues caused by third-party providers
- DDoS attacks or similar malicious activity

5.2 No Guarantee

While we strive for high availability, we do not guarantee:
- Uninterrupted access to the Service
- Error-free operation
- Compatibility with all systems
- Specific response times (though we target <100ms)

5.3 Scheduled Maintenance

We reserve the right to:
- Perform scheduled maintenance during low-usage periods
- Make emergency updates without advance notice
- Temporarily suspend access for security reasons

5.4 Changes to Service

We reserve the right to:
- Modify features or functionality
- Update API endpoints or response formats
- Change rate limits or tier restrictions
- Discontinue features with reasonable notice (30 days for paid tiers)

5.5 No Liability for Downtime

We are not liable for losses resulting from service interruptions, except as specifically provided in your Service Level Agreement (SLA), if applicable to your tier.
```

---

### SECTION 8: DATA & PRIVACY

**Add this section:**

```
6. DATA HANDLING

6.1 Your Data

Data you provide to the Service includes:
- API request data (location, shot parameters)
- Account information
- Usage metadata

6.2 Our Data

All calculations, algorithms, models, and methodologies are our proprietary intellectual property. You may not:
- Reverse engineer our physics models
- Extract our calculation methods
- Build competing services based on our data

6.3 Aggregated Data

We reserve the right to use aggregated, anonymized data for:
- Service improvement
- Research and development
- Marketing and case studies
- Industry benchmarking

We will not share your specific data with third parties except:
- As required by law
- With your explicit permission
- To our service providers (under confidentiality agreements)

6.4 Data Retention

We retain:
- Usage logs: 90 days
- Account data: Duration of relationship + 1 year
- Billing records: 7 years (legal requirement)

6.5 Privacy Policy

Additional details are in our Privacy Policy at [URL]. By using the Service, you also agree to the Privacy Policy.
```

---

### SECTION 9: TERMINATION

**Add this section:**

```
7. TERMINATION

7.1 Termination by You

You may terminate your account at any time by:
- Canceling your subscription through the dashboard
- Sending written notice to support@golfphysics.io

Termination is effective at the end of your current billing period. No refunds for partial months.

7.2 Termination by Us

We may suspend or terminate your access immediately if:
- You violate these Terms
- You exceed rate limits excessively
- Your payment method fails
- You engage in fraudulent activity
- Required by law

We may also terminate with 30 days' notice for any reason.

7.3 Effect of Termination

Upon termination:
- Your API keys are immediately deactivated
- You must cease all use of the Service
- You must delete any cached data
- Fees owed remain due and payable
- Sections that should survive (limitations, indemnification) remain in effect

7.4 Survival

These sections survive termination:
- Payment obligations
- Limitation of liability
- Indemnification
- Dispute resolution
- Intellectual property rights
```

---

### SECTION 10: MODIFICATIONS TO TERMS

**Add this section:**

```
12. CHANGES TO TERMS

12.1 Right to Modify

We reserve the right to modify these Terms at any time. We will notify you of material changes by:
- Email to your registered address
- Notice in the dashboard
- Posting updated Terms with revision date

12.2 Acceptance of Changes

Continued use of the Service after changes constitute acceptance of modified Terms.

If you do not agree to changes:
- Stop using the Service
- Terminate your account
- Your use until termination is governed by new Terms

12.3 Revision Date

These Terms were last revised: [INSERT DATE]

Check back periodically for updates.
```

---

### SECTION 11: CONTACT & NOTICES

**Add this section:**

```
13. CONTACT INFORMATION

13.1 Legal Notices

Send legal notices to:

Golf Physics LLC
Legal Department
[Your Address]
Email: legal@golfphysics.io

13.2 Customer Support

For support inquiries:
Email: support@golfphysics.io
Website: https://golfphysics.io/contact

13.3 Notices to You

We may send notices to:
- Email address on your account
- Dashboard notifications
- Postal address if provided

You are responsible for keeping contact information current.
```

---

### SECTION 12: ENTIRE AGREEMENT & SEVERABILITY

**Add this section:**

```
14. MISCELLANEOUS

14.1 Entire Agreement

These Terms, together with the Privacy Policy and any Service Level Agreement (SLA), constitute the entire agreement between you and Golf Physics LLC regarding the Service.

14.2 Severability

If any provision of these Terms is found invalid or unenforceable:
- That provision shall be modified to the minimum extent necessary
- All other provisions remain in full force and effect

14.3 No Waiver

Our failure to enforce any right or provision does not constitute a waiver of that right or provision.

14.4 Assignment

You may not assign these Terms without our written consent. We may assign these Terms to any affiliate or in connection with a merger or acquisition.

14.5 No Agency

Nothing in these Terms creates a partnership, joint venture, employment, or agency relationship.

14.6 Force Majeure

Neither party is liable for delays or failures due to causes beyond reasonable control.

14.7 Interpretation

- "Including" means "including but not limited to"
- Section headings are for convenience only
- "You" includes your agents and contractors
- "We"/"Us"/"Our" refers to Golf Physics LLC
```

---

## FORMATTING REQUIREMENTS

1. **Use clear hierarchical numbering:**
   - 1. Major Section
   - 1.1 Subsection
   - a) Sub-item

2. **Use bold for important warnings:**
   - Example: **LIMITATION OF LIABILITY**
   - Example: **NO CLASS ACTIONS**

3. **Use ALL CAPS for critical disclaimers:**
   - Example: THE SERVICE IS PROVIDED "AS IS"
   - Example: IN NO EVENT SHALL WE BE LIABLE

4. **Include effective date at top:**
   ```
   GOLF PHYSICS API - TERMS OF SERVICE
   Last Updated: [Current Date]
   Effective: [Current Date]
   ```

5. **Add table of contents at beginning:**
   ```
   TABLE OF CONTENTS
   1. Acceptance of Terms
   2. Nature of Service
   3. Account Registration
   4. Acceptable Use
   5. Service Availability
   ...
   ```

---

## FILE STRUCTURE

If creating a new Terms of Service file, use this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terms of Service - Golf Physics API</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            color: #333;
        }
        h1 {
            color: #2E7D32;
            border-bottom: 2px solid #2E7D32;
            padding-bottom: 10px;
        }
        h2 {
            color: #1B5E20;
            margin-top: 30px;
        }
        h3 {
            color: #424242;
        }
        .effective-date {
            color: #666;
            font-style: italic;
        }
        .important {
            background: #FFF3E0;
            border-left: 4px solid #F57C00;
            padding: 15px;
            margin: 20px 0;
        }
        .caps {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <h1>Golf Physics API - Terms of Service</h1>
    <p class="effective-date">Last Updated: [DATE]</p>
    <p class="effective-date">Effective: [DATE]</p>
    
    <!-- TABLE OF CONTENTS -->
    <!-- SECTIONS GO HERE -->
    
</body>
</html>
```

---

## VERIFICATION STEPS

After making changes:

1. **Check file exists:**
   ```bash
   ls -la website-dist/terms.html
   # or wherever you placed it
   ```

2. **Validate HTML (if HTML file):**
   ```bash
   # Check for syntax errors
   grep -i "error" website-dist/terms.html
   ```

3. **Verify all sections present:**
   - [ ] Nature of Service (estimates disclaimer)
   - [ ] Disclaimer of Warranties
   - [ ] Limitation of Liability
   - [ ] Indemnification
   - [ ] Dispute Resolution & Arbitration
   - [ ] Acceptable Use
   - [ ] Service Availability
   - [ ] Data Handling
   - [ ] Termination
   - [ ] Modifications
   - [ ] Contact Info
   - [ ] Miscellaneous

4. **Check critical phrases:**
   ```bash
   grep -i "AS IS" website-dist/terms.html
   grep -i "arbitration" website-dist/terms.html
   grep -i "limitation of liability" website-dist/terms.html
   grep -i "indemnify" website-dist/terms.html
   ```

5. **Update website to link to Terms:**
   - Add link in footer: "Terms of Service"
   - Link during API key signup: "I agree to Terms of Service"
   - Link in pricing page: "Subject to Terms of Service"

---

## ADDITIONAL REQUIREMENTS

### Create Privacy Policy Link

Add a basic Privacy Policy at `website-dist/privacy.html` with:
- What data we collect (API usage, email, company info)
- How we use it (service delivery, analytics)
- Who we share it with (nobody except as required by law)
- How to request deletion
- Contact for privacy questions

### Update API Key Signup Flow

Modify the API key request form to include:

```javascript
<label>
  <input type="checkbox" name="agreed_to_terms" required>
  I agree to the <a href="/terms.html" target="_blank">Terms of Service</a>
  and <a href="/privacy.html" target="_blank">Privacy Policy</a>
</label>
```

### Add Disclaimer to Website

Add this to homepage footer:

```
Golf Physics API provides physics-based estimates for informational 
purposes only. Results may vary from actual on-course conditions. 
See our Terms of Service for full details.
```

---

## DEPLOYMENT

After updating Terms:

1. **If website is live:**
   ```bash
   cd golfphysics-website
   npm run build
   rm -rf ../website-dist
   cp -r dist ../website-dist
   git add ../website-dist
   git commit -m "Add comprehensive legal protections to Terms of Service"
   git push origin main
   ```

2. **Verify live:**
   - Visit https://www.golfphysics.io/terms.html
   - Confirm all sections visible
   - Test all internal links

3. **Notify existing customers (if any):**
   Email: "We've updated our Terms of Service. Please review at [link]"

---

## IMPORTANT NOTES

⚠️ **This is not legal advice.**

These Terms provide good baseline protection, but you should:
1. Have a Florida business lawyer review before using with paying customers
2. Ensure compliance with your state's laws
3. Update as your business evolves
4. Consult lawyer before first enterprise contract (inRange)

Estimated legal review cost: $500-$1,000

---

## DELIVERABLES

When complete, provide:

1. **Updated Terms of Service file**
   - Location: website-dist/terms.html
   - All 14 sections included
   - Properly formatted
   - Dated

2. **Updated website links**
   - Footer links to Terms
   - Signup form checkbox
   - Footer disclaimer added

3. **Verification checklist**
   - Confirm all sections present
   - Confirm critical phrases included
   - Confirm links work

4. **Deployment confirmation**
   - Live URL: https://www.golfphysics.io/terms.html
   - Screenshot or confirmation of live page

---

That's everything! Let me know when this is deployed to production.
```
