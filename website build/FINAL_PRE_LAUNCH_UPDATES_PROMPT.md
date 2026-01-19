# PROMPT FOR CLAUDE CODE - Final Pre-Launch Updates

**Critical updates before deploying website**

---

```
Before deploying the website, we need to make three important updates based on business model analysis:

1. Update pricing structure (5 tiers instead of 3)
2. Implement email-based API key requests
3. Add reCAPTCHA spam protection

Read these specifications:
1. REVISED_PRICING_STRUCTURE.md
2. API_KEY_EMAIL_AND_TIER_UPDATES.md
3. RECAPTCHA_IMPLEMENTATION.md

---

## PRIORITY ORDER

Do these in sequence, testing each before moving to the next.

---

## UPDATE 1: PRICING STRUCTURE (2-3 hours)

### Current Problem:
- Only 3 tiers: Free, Standard ($49), Enterprise
- Standard ($49) can handle an inRange facility (6K/day needs)
- No tier at the $300-600 price point for commercial facilities
- Gap between $49 and Enterprise is too large

### New 5-Tier Structure:

**Tier 1: Developer (Free)**
- 60 req/min, 1,000 req/day, ~30K/month
- Testing only

**Tier 2: Starter ($99/month)**
- 200 req/min, 10,000 req/day, ~300K/month
- Small production apps

**Tier 3: Professional ($299/month)** ⭐ NEW
- 500 req/min, 25,000 req/day, ~750K/month
- Single commercial facility (single inRange location)

**Tier 4: Business ($599/month)** ⭐ NEW
- 2,000 req/min, 100,000 req/day, ~3M/month
- Multi-location chains (2-5 inRange locations)
- Volume pricing: 6-10 locations = $999, 11-20 = $1,499

**Tier 5: Enterprise ($1,999+/month)**
- Unlimited
- Major platforms, white-label, custom features

### Tasks:

#### Backend Updates:

**File: `app/config.py` or similar**

Update rate limits:
```python
RATE_LIMITS = {
    'developer': {  # Renamed from 'free'
        'price': 0,
        'requests_per_minute': 60,
        'requests_per_day': 1000,
        'features': ['real_time', 'physics', 'multi_unit', 'docs', 'community_support']
    },
    'starter': {  # NEW
        'price': 99,
        'requests_per_minute': 200,
        'requests_per_day': 10000,
        'features': ['real_time', 'physics', 'multi_unit', 'historical_30d', 'forecasts_7d', 'email_support', 'analytics']
    },
    'professional': {  # NEW
        'price': 299,
        'requests_per_minute': 500,
        'requests_per_day': 25000,
        'features': ['all_starter', 'sla_999', 'phone_support', 'historical_90d', 'forecasts_14d', 'webhooks', 'advanced_analytics']
    },
    'business': {  # NEW
        'price': 599,
        'requests_per_minute': 2000,
        'requests_per_day': 100000,
        'features': ['all_professional', 'sla_9995', 'priority_support', 'account_manager', 'custom_integration', 'historical_1y']
    },
    'enterprise': {
        'price': 1999,
        'requests_per_minute': None,  # Unlimited
        'requests_per_day': None,  # Unlimited
        'features': ['all_business', 'sla_9999', 'white_label', 'on_premise', 'dedicated_engineer', 'custom_features']
    }
}
```

**Database Updates:**

If you have tier limits in database:
```sql
-- Clear old tiers
DELETE FROM tier_limits;

-- Insert new tiers
INSERT INTO tier_limits (tier, price_monthly, requests_per_minute, requests_per_day, requests_per_month) VALUES
('developer', 0, 60, 1000, 30000),
('starter', 99, 200, 10000, 300000),
('professional', 299, 500, 25000, 750000),
('business', 599, 2000, 100000, 3000000),
('enterprise', 1999, NULL, NULL, NULL);
```

#### Website Updates:

**File: `src/pages/Pricing.jsx`**

Replace the 3-tier pricing with 5-tier structure (see REVISED_PRICING_STRUCTURE.md for exact copy).

Key changes:
- Developer (not "Free" - more professional)
- Add Starter ($99)
- Add Professional ($299) - highlight this for single facilities
- Add Business ($599) - highlight this for chains
- Update Enterprise pricing and features

**File: `src/pages/Home.jsx`**

Update pricing preview section to show 5 tiers (or focus on top 3: Professional, Business, Enterprise).

**File: `src/pages/Docs.jsx`**

Update rate limit documentation to reflect new tiers.

---

## UPDATE 2: EMAIL-BASED API KEY FLOW (3-4 hours)

### Current Problem:
- "Get Free API Key" auto-generates keys
- No lead capture
- Can't qualify prospects or follow up

### New Flow:
1. User fills form (name, email, company, use case, volume)
2. Backend generates key
3. Stores lead info
4. Shows success message "Check your email"
5. (Email sending to be added later - for now just log the key)

### Tasks:

#### Backend:

**Create: `app/routers/api_key_requests.py`**

```python
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
    recaptcha_token: str  # Will add in UPDATE 3

@router.post("/api/request-api-key")
async def request_api_key(request: ApiKeyRequest):
    """Generate and email API key"""
    
    if not request.agreed_to_terms:
        raise HTTPException(400, "Must agree to terms")
    
    # Check existing key
    existing = await db.fetch_one(
        "SELECT id FROM api_keys WHERE email = $1 AND status = 'active'",
        request.email
    )
    
    if existing:
        return {"message": "API key sent to your email"}
    
    # Generate key
    raw_key = f"golf_{secrets.token_urlsafe(32)}"
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    
    # Store with lead info
    await db.execute(
        """
        INSERT INTO api_keys 
        (key_hash, email, name, company, use_case, description, 
         expected_volume, tier, status, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'developer', 'active', NOW())
        """,
        key_hash, request.email, request.name, request.company,
        request.use_case, request.description, request.expected_volume
    )
    
    # TODO: Send email (implement later)
    # For now, just log it
    print(f"[API KEY] {request.email}: {raw_key}")
    
    return {
        "message": "API key sent to your email",
        "email": request.email
    }
```

**Database Schema Update:**

```sql
ALTER TABLE api_keys
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS name VARCHAR(255),
ADD COLUMN IF NOT EXISTS company VARCHAR(255),
ADD COLUMN IF NOT EXISTS use_case VARCHAR(255),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS expected_volume VARCHAR(50);

CREATE INDEX IF NOT EXISTS idx_api_keys_email ON api_keys(email);
```

#### Frontend:

**Create: `src/components/ApiKeyRequestModal.jsx`**

(See API_KEY_EMAIL_AND_TIER_UPDATES.md for complete component code)

Key features:
- Form fields: name, email, company, use case, description, volume
- Terms checkbox
- Submit to /api/request-api-key
- Success state: "Check your email!"
- Error handling

**Update: All pages with "Get Free API Key" button**

Change to:
```jsx
import { ApiKeyRequestModal } from '../components/ApiKeyRequestModal';

function SomePage() {
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowApiKeyModal(true)}>
        Request Free API Key
      </button>
      
      <ApiKeyRequestModal 
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
      />
    </>
  );
}
```

Update on these pages:
- Home.jsx
- Pricing.jsx
- Docs.jsx (if applicable)
- Any other page with CTA

---

## UPDATE 3: reCAPTCHA SPAM PROTECTION (2-3 hours)

### Why:
- Prevent spam bot signups
- Protect API key request form
- Protect contact form

### Tasks:

#### Get reCAPTCHA Keys:

1. Go to: https://www.google.com/recaptcha/admin
2. Register new site:
   - Type: reCAPTCHA v3
   - Domains: golfphysics.io, www.golfphysics.io, localhost
3. Save:
   - Site Key (public)
   - Secret Key (private)

#### Frontend:

**Install package:**
```bash
npm install react-google-recaptcha-v3
```

**Update: `src/main.jsx`**

```jsx
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
      <App />
    </GoogleReCaptchaProvider>
  </React.StrictMode>
);
```

**Create: `.env`**
```
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
```

**Update: `src/components/ApiKeyRequestModal.jsx`**

Add reCAPTCHA token to form submission:
```jsx
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const { executeRecaptcha } = useGoogleReCaptcha();

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const recaptchaToken = await executeRecaptcha('api_key_request');
  
  const response = await fetch('/api/request-api-key', {
    method: 'POST',
    body: JSON.stringify({
      ...formData,
      recaptcha_token: recaptchaToken
    })
  });
  // ...
};
```

Add reCAPTCHA notice to form:
```jsx
<p className="text-xs text-gray-500 mt-2">
  This site is protected by reCAPTCHA and the Google{' '}
  <a href="https://policies.google.com/privacy">Privacy Policy</a> and{' '}
  <a href="https://policies.google.com/terms">Terms of Service</a> apply.
</p>
```

#### Backend:

**Create: `app/utils/recaptcha.py`**

```python
import os
import requests
from fastapi import HTTPException

RECAPTCHA_SECRET_KEY = os.getenv('RECAPTCHA_SECRET_KEY')

async def verify_recaptcha(token: str, action: str, min_score: float = 0.5):
    """Verify reCAPTCHA token"""
    
    if not RECAPTCHA_SECRET_KEY:
        if os.getenv('ENVIRONMENT') == 'development':
            return True
        raise HTTPException(500, "reCAPTCHA not configured")
    
    response = requests.post('https://www.google.com/recaptcha/api/siteverify', data={
        'secret': RECAPTCHA_SECRET_KEY,
        'response': token
    })
    
    result = response.json()
    
    if not result.get('success'):
        raise HTTPException(400, "reCAPTCHA verification failed")
    
    if result.get('action') != action:
        raise HTTPException(400, "reCAPTCHA action mismatch")
    
    score = result.get('score', 0.0)
    if score < min_score:
        raise HTTPException(429, "Request flagged as potential spam")
    
    return True
```

**Update: `app/routers/api_key_requests.py`**

Add verification:
```python
from app.utils.recaptcha import verify_recaptcha

@router.post("/api/request-api-key")
async def request_api_key(request: ApiKeyRequest):
    # Verify reCAPTCHA first
    await verify_recaptcha(
        token=request.recaptcha_token,
        action='api_key_request',
        min_score=0.5
    )
    
    # ... rest of logic
```

**Environment variable:**

Add to Railway:
- Variable: `RECAPTCHA_SECRET_KEY`
- Value: `your_secret_key_here`

---

## TESTING CHECKLIST

### Test Pricing Updates:
- [ ] Backend has 5 tier configs
- [ ] Website pricing page shows 5 tiers
- [ ] Professional tier highlighted for single facility
- [ ] Business tier highlighted for chains
- [ ] All tier features listed correctly

### Test API Key Flow:
- [ ] Form opens when clicking "Request Free API Key"
- [ ] All fields validate
- [ ] Form submits successfully
- [ ] Success message shows
- [ ] Backend logs API key to console
- [ ] Database stores all lead info
- [ ] Error handling works

### Test reCAPTCHA:
- [ ] reCAPTCHA loads (check browser console)
- [ ] Form submission includes token
- [ ] Backend verifies token
- [ ] Low scores blocked (test with automated script)
- [ ] Real users not blocked
- [ ] reCAPTCHA notice visible

---

## DEPLOYMENT ORDER

1. **Update pricing** (backend config + website)
2. **Deploy and test pricing**
3. **Add API key request flow** (backend + frontend)
4. **Deploy and test form**
5. **Add reCAPTCHA** (backend + frontend)
6. **Deploy and test spam protection**
7. **Final full test of everything**
8. **Deploy website to production**

---

## DELIVERABLES

When complete, provide:

1. **Pricing Structure:**
   - [ ] 5 tiers in backend config
   - [ ] 5 tiers on website
   - [ ] Clear positioning for each tier
   - [ ] Professional ($299) for single facilities
   - [ ] Business ($599) for chains

2. **API Key Request:**
   - [ ] Email-based flow working
   - [ ] Lead info captured
   - [ ] Success flow tested
   - [ ] All CTAs updated

3. **reCAPTCHA:**
   - [ ] Forms protected
   - [ ] Spam bots blocked
   - [ ] Real users not affected
   - [ ] Notice on forms

4. **Testing:**
   - [ ] All features tested locally
   - [ ] No console errors
   - [ ] Forms work on mobile
   - [ ] Ready for production deploy

---

## TIMELINE

- Pricing updates: 2-3 hours
- API key flow: 3-4 hours
- reCAPTCHA: 2-3 hours
- Testing: 1-2 hours

**Total: 8-12 hours**

---

Take your time and do these updates thoroughly. They're critical for the business model to work properly.

Report progress after each major update (pricing, API key flow, reCAPTCHA).
```
