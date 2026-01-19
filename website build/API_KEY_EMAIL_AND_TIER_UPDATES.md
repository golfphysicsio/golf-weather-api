# API Key Generation & Free Tier Updates

**Updates to improve lead capture and tier economics**

---

## CHANGE 1: Email-Based API Key Generation

### Current Flow (Auto-Generate)
❌ User clicks "Get Free API Key"
❌ Key instantly displayed
❌ No lead capture
❌ No follow-up possible

### New Flow (Email-Based) ✅

#### Step 1: User Fills Form

**Form Fields:**
```
┌─────────────────────────────────────────┐
│  Request Your Free API Key              │
├─────────────────────────────────────────┤
│                                         │
│  Full Name: [___________________]       │
│                                         │
│  Email: [_______________________]       │
│                                         │
│  Company: [_____________________]       │
│  (Optional)                             │
│                                         │
│  Use Case: [Dropdown ▼]                │
│  • Launch Monitor Integration           │
│  • Golf Course Management               │
│  • Mobile App Development               │
│  • Tournament Software                  │
│  • Research/Academic                    │
│  • Other                                │
│                                         │
│  Describe your project:                 │
│  [_________________________________]    │
│  [_________________________________]    │
│  (Optional, helps us assist you)        │
│                                         │
│  Expected monthly volume:               │
│  ○ < 10K    ○ 10K-100K    ○ 100K+      │
│                                         │
│  □ I agree to Terms of Service          │
│                                         │
│  [Request API Key]                      │
└─────────────────────────────────────────┘
```

#### Step 2: Backend Processing

```python
# When form submitted:

1. Validate email format
2. Check if email already has API key
3. Generate new API key
4. Store in database:
   - email
   - name  
   - company
   - use_case
   - expected_volume
   - tier: 'free'
   - status: 'active'
   - created_at
5. Send welcome email with API key
6. Add to email list (for announcements)
7. If high-value prospect → Notify sales team
```

#### Step 3: Welcome Email Template

**Subject:** Your Golf Physics API Key is Ready

**Body:**
```
Hi [Name],

Welcome to Golf Physics API! Your free API key is ready.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUR API KEY:
golf_[random_string_here]

⚠️ Keep this key secure - it won't be shown again.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FREE TIER INCLUDES:
✅ 60 requests per minute
✅ 1,000 requests per day (~30K/month)
✅ Real-time weather data
✅ Physics-based calculations
✅ Multi-unit support (imperial + metric)
✅ Full API documentation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUICK START:

1. Make your first request:

curl "https://api.golfphysics.io/weather?lat=33.7&lon=-84.4" \
  -H "X-API-Key: golf_[your_key]"

2. View Documentation:
https://golfphysics.io/docs

3. See Code Examples:
https://golfphysics.io/docs#examples

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEED MORE REQUESTS?

Free tier is perfect for testing and development. When you're ready for production:

Standard Tier - $49/month
• 1,000 requests/min
• 100,000 requests/day
• Historical data
• 7-day forecasts
• Priority support

View Pricing: https://golfphysics.io/pricing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUESTIONS?

Email: support@golfphysics.io
Docs: https://golfphysics.io/docs

We're here to help you build amazing golf technology.

Best regards,
The Golf Physics Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

P.S. Tell us about your project! Reply to this email and let us know how you're using Golf Physics API. We love hearing from our developers.
```

#### Step 4: High-Value Prospect Notification

**If user indicates:**
- Company name provided
- Use case: "Launch Monitor Integration" or "Tournament Software"
- Expected volume: 100K+
- Company domain matches known golf tech companies

**Send internal notification:**
```
Subject: 🚨 High-Value Lead: [Company Name]

New API Key Request:

Name: [Name]
Email: [Email]
Company: [Company]
Use Case: Launch Monitor Integration
Expected Volume: 100K+ requests/month

Description:
[Their project description]

ACTION: Reach out within 24 hours to discuss Enterprise plan.

API Key: golf_[key]
Status: Free tier (will likely need upgrade)

View in Admin: https://api.golfphysics.io/admin/api-keys
```

---

## CHANGE 2: Updated Rate Limits

### Database Schema Update

```sql
-- Update rate limits for free tier
UPDATE tier_limits 
SET 
  requests_per_minute = 60,
  requests_per_day = 1000  -- Changed from 10000
WHERE tier = 'free';

-- Verify
SELECT * FROM tier_limits;

-- Expected:
-- tier: free
-- requests_per_minute: 60
-- requests_per_day: 1000
-- requests_per_month: 30000
```

### Backend Code Update

```python
# app/config.py or wherever rate limits are defined

RATE_LIMITS = {
    'free': {
        'requests_per_minute': 60,
        'requests_per_day': 1000,  # Changed from 10000
        'features': [
            'real_time_weather',
            'physics_calculations',
            'multi_unit_support'
        ],
        'excluded_features': [
            'historical_data',
            'forecasts',
            'analytics_dashboard'
        ]
    },
    'standard': {
        'requests_per_minute': 1000,
        'requests_per_day': 100000,
        'features': [
            'real_time_weather',
            'physics_calculations',
            'multi_unit_support',
            'historical_data',
            'forecasts',
            'analytics_dashboard',
            'priority_support'
        ]
    },
    'enterprise': {
        'requests_per_minute': 20000,
        'requests_per_day': None,  # Unlimited
        'features': 'all'
    }
}
```

### Middleware Update

```python
# app/middleware/rate_limiting.py

async def check_rate_limit(api_key: str, redis_client):
    """Check if request is within rate limits"""
    
    # Get tier from database
    tier = await get_tier_for_api_key(api_key)
    
    # Get limits for tier
    limits = RATE_LIMITS[tier]
    
    # Check per-minute limit
    minute_key = f"rate_limit:{api_key}:minute:{current_minute}"
    minute_count = await redis_client.incr(minute_key)
    await redis_client.expire(minute_key, 60)
    
    if minute_count > limits['requests_per_minute']:
        raise RateLimitExceeded(
            f"Rate limit exceeded: {limits['requests_per_minute']} requests per minute"
        )
    
    # Check per-day limit (if not unlimited)
    if limits['requests_per_day'] is not None:
        day_key = f"rate_limit:{api_key}:day:{current_day}"
        day_count = await redis_client.incr(day_key)
        await redis_client.expire(day_key, 86400)
        
        if day_count > limits['requests_per_day']:
            raise RateLimitExceeded(
                f"Daily limit exceeded: {limits['requests_per_day']} requests per day. "
                f"Upgrade to Standard tier for 100K/day: https://golfphysics.io/pricing"
            )
    
    return True
```

---

## CHANGE 3: Website Updates

### Update Pricing Page

```javascript
// pricing.jsx

const tiers = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for testing and development',
    limits: {
      requestsPerMin: '60',
      requestsPerDay: '1,000',  // Changed from 10,000
      requestsPerMonth: '~30,000'
    },
    features: [
      'Real-time weather data',
      'Physics calculations',
      'Multi-unit support (imperial + metric)',
      'API documentation',
      'Community support'
    ],
    excluded: [
      'Historical data',
      'Forecasts',
      'Analytics dashboard'
    ],
    cta: 'Request API Key',
    ctaAction: 'openApiKeyForm',  // Changed from auto-generate
    highlighted: false
  },
  {
    name: 'Standard',
    price: '$49',
    period: '/month',
    description: 'Perfect for production applications',
    limits: {
      requestsPerMin: '1,000',
      requestsPerDay: '100,000',
      requestsPerMonth: '~3M'
    },
    features: [
      'Everything in Free',
      'Historical data (30 days)',
      '7-day forecasts',
      'Analytics dashboard',
      'Priority support',
      'Bulk operations',
      'Webhooks'
    ],
    cta: 'Get Started',
    ctaAction: 'checkout',
    highlighted: true
  },
  // ... Enterprise tier
];
```

### Update Home Page CTAs

```javascript
// Hero section - Update CTA
<button 
  onClick={openApiKeyRequestModal}
  className="bg-golf-green text-white px-8 py-3 rounded-lg"
>
  Request Free API Key
</button>

// Modal component
function ApiKeyRequestModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    useCase: '',
    description: '',
    expectedVolume: '',
    agreedToTerms: false
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Submit to backend
    const response = await fetch('/api/request-api-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      // Show success message
      showSuccessMessage();
    }
  };
  
  return (
    // ... form JSX with all fields
  );
}
```

### Success Message After Form Submit

```javascript
function SuccessMessage() {
  return (
    <div className="text-center py-8">
      <h2>✅ Check Your Email!</h2>
      <p>We've sent your API key to {email}</p>
      
      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h3>What's Next?</h3>
        <ul>
          <li>Check your email for your API key</li>
          <li>Read the Quick Start guide</li>
          <li>Make your first API request</li>
          <li>View our code examples</li>
        </ul>
      </div>
      
      <div className="mt-6">
        <a href="/docs" className="btn-primary">
          View Documentation
        </a>
      </div>
    </div>
  );
}
```

---

## CHANGE 4: Backend API Endpoint

### New Endpoint: Request API Key

```python
# app/routers/auth.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import secrets
import hashlib

router = APIRouter()

class ApiKeyRequest(BaseModel):
    name: str
    email: EmailStr
    company: str | None = None
    use_case: str
    description: str | None = None
    expected_volume: str
    agreed_to_terms: bool

@router.post("/api/request-api-key")
async def request_api_key(request: ApiKeyRequest):
    """Generate and email a new API key"""
    
    # Validate
    if not request.agreed_to_terms:
        raise HTTPException(400, "Must agree to terms")
    
    # Check if email already has an API key
    existing_key = await db.fetch_one(
        "SELECT id FROM api_keys WHERE email = $1 AND status = 'active'",
        request.email
    )
    
    if existing_key:
        # Send existing key instead
        await send_existing_key_email(request.email)
        return {"message": "API key sent to email"}
    
    # Generate new API key
    raw_key = f"golf_{secrets.token_urlsafe(32)}"
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    
    # Store in database
    await db.execute(
        """
        INSERT INTO api_keys 
        (key_hash, email, name, company, use_case, description, 
         expected_volume, tier, status, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'free', 'active', NOW())
        """,
        key_hash, request.email, request.name, request.company,
        request.use_case, request.description, request.expected_volume
    )
    
    # Send welcome email with API key
    await send_welcome_email(
        email=request.email,
        name=request.name,
        api_key=raw_key
    )
    
    # Check if high-value prospect
    if is_high_value_prospect(request):
        await notify_sales_team(request)
    
    # Add to email list
    await add_to_email_list(request.email, request.name)
    
    return {
        "message": "API key sent to email",
        "email": request.email
    }

def is_high_value_prospect(request: ApiKeyRequest) -> bool:
    """Identify prospects worth sales follow-up"""
    
    high_value_indicators = [
        # Has company name
        request.company is not None,
        
        # High-value use cases
        request.use_case in ['Launch Monitor Integration', 'Tournament Software'],
        
        # High volume expectation
        request.expected_volume in ['10K-100K', '100K+'],
        
        # Known golf tech domains
        any(domain in request.email for domain in [
            'trackman', 'inrange', 'foresight', 'arccos', 'garmin'
        ])
    ]
    
    # If 2+ indicators, flag as high-value
    return sum(high_value_indicators) >= 2
```

---

## CHANGE 5: Email Service Integration

### Setup Email Service (Choose One)

**Option A: SendGrid**
```python
# pip install sendgrid

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

async def send_welcome_email(email: str, name: str, api_key: str):
    """Send welcome email with API key"""
    
    message = Mail(
        from_email='noreply@golfphysics.io',
        to_emails=email,
        subject='Your Golf Physics API Key is Ready',
        html_content=get_welcome_email_html(name, api_key)
    )
    
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        return response.status_code == 202
    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        return False
```

**Option B: AWS SES**
```python
import boto3

async def send_welcome_email(email: str, name: str, api_key: str):
    """Send via AWS SES"""
    
    ses = boto3.client('ses', region_name='us-east-1')
    
    response = ses.send_email(
        Source='Golf Physics API <noreply@golfphysics.io>',
        Destination={'ToAddresses': [email]},
        Message={
            'Subject': {'Data': 'Your Golf Physics API Key is Ready'},
            'Body': {'Html': {'Data': get_welcome_email_html(name, api_key)}}
        }
    )
    
    return response['ResponseMetadata']['HTTPStatusCode'] == 200
```

---

## CHANGE 6: Admin Dashboard Updates

### Update API Keys Table

```javascript
// Show more info about key requests

const ApiKeysTable = () => {
  return (
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Name</th>
          <th>Company</th>
          <th>Use Case</th>
          <th>Expected Volume</th>
          <th>Tier</th>
          <th>Status</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {apiKeys.map(key => (
          <tr key={key.id}>
            <td>{key.email}</td>
            <td>{key.name}</td>
            <td>{key.company || '-'}</td>
            <td>{key.use_case}</td>
            <td>{key.expected_volume}</td>
            <td>
              <span className={`badge badge-${key.tier}`}>
                {key.tier}
              </span>
            </td>
            <td>{key.status}</td>
            <td>{formatDate(key.created_at)}</td>
            <td>
              {/* Upgrade to Standard button */}
              {key.tier === 'free' && (
                <button onClick={() => upgradeTier(key.id)}>
                  Upgrade
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

---

## IMPLEMENTATION CHECKLIST

### Backend
- [ ] Update RATE_LIMITS config (1K/day for free)
- [ ] Create /api/request-api-key endpoint
- [ ] Setup email service (SendGrid or AWS SES)
- [ ] Create welcome email template
- [ ] Add high-value prospect detection
- [ ] Update database schema (add columns for name, company, etc.)
- [ ] Update rate limiting middleware

### Frontend (Website)
- [ ] Create API Key Request modal/form
- [ ] Update all "Get Free API Key" CTAs
- [ ] Update pricing page (1K/day for free)
- [ ] Add success message after form submit
- [ ] Update documentation with new limits

### Admin Dashboard
- [ ] Update API keys table to show new fields
- [ ] Add ability to manually upgrade tiers
- [ ] Show usage vs limits more prominently

### Email & CRM
- [ ] Setup SendGrid or AWS SES account
- [ ] Configure DNS (SPF, DKIM)
- [ ] Test welcome email
- [ ] Setup email list (Mailchimp, etc.)
- [ ] Configure sales team notifications

### Documentation
- [ ] Update API docs with new free tier limits
- [ ] Update pricing page
- [ ] Update FAQ

---

## TIMELINE

- Backend changes: 2-3 hours
- Frontend changes: 2-3 hours
- Email setup: 1-2 hours
- Testing: 1 hour
- **Total: 6-9 hours**

---

## ROLLOUT STRATEGY

### Phase 1: Update Rate Limits (Immediate)
- Deploy new 1K/day limit
- Existing free users keep current limits (grandfather)
- New signups get 1K/day

### Phase 2: Email-Based Flow (1 week)
- Deploy new API key request system
- Update website CTAs
- Test email delivery

### Phase 3: Monitor & Adjust (Ongoing)
- Track conversion rates
- Monitor upgrade requests
- Adjust limits if needed

---

END OF SPECIFICATION
