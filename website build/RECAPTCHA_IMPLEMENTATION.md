# reCAPTCHA Implementation Guide

**Prevent spam on API key request and contact forms**

---

## OVERVIEW

Add Google reCAPTCHA v3 to all public forms:
- API Key Request form
- Contact form
- Newsletter signup (if any)

**Why reCAPTCHA v3:**
- ✅ Invisible (no checkbox/puzzles)
- ✅ Scores requests 0.0-1.0 (spam vs. human)
- ✅ Better UX than v2
- ✅ Free for most use cases

---

## SETUP PROCESS

### Step 1: Get reCAPTCHA Keys

1. Go to: https://www.google.com/recaptcha/admin
2. Click "+" to register a new site
3. Fill in:
   - **Label:** Golf Physics API
   - **reCAPTCHA type:** reCAPTCHA v3
   - **Domains:** 
     - `golfphysics.io`
     - `www.golfphysics.io`
     - `localhost` (for testing)
   - **Owners:** Your Google account email
   - Accept terms

4. Click "Submit"

5. You'll get two keys:
   - **Site Key** (public) - Used in frontend
   - **Secret Key** (private) - Used in backend

**Save these keys securely!**

---

## FRONTEND IMPLEMENTATION

### Step 1: Install reCAPTCHA Package

```bash
cd golfphysics-website
npm install react-google-recaptcha-v3
```

---

### Step 2: Add reCAPTCHA Provider

**File: `src/main.jsx`**

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleReCaptchaProvider
      reCaptchaKey="YOUR_RECAPTCHA_SITE_KEY_HERE"
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
    >
      <App />
    </GoogleReCaptchaProvider>
  </React.StrictMode>
);
```

**Environment Variable Approach (Better):**

**File: `.env`**
```
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
```

**File: `src/main.jsx`**
```jsx
<GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
  <App />
</GoogleReCaptchaProvider>
```

---

### Step 3: Update API Key Request Form

**File: `src/components/ApiKeyRequestModal.jsx`**

```jsx
import { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { X } from 'lucide-react';

export function ApiKeyRequestModal({ isOpen, onClose }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    useCase: '',
    description: '',
    expectedVolume: '',
    agreedToTerms: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!executeRecaptcha) {
      setError('reCAPTCHA not loaded. Please refresh and try again.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Get reCAPTCHA token
      const recaptchaToken = await executeRecaptcha('api_key_request');
      
      // Submit form with reCAPTCHA token
      const response = await fetch('https://api.golfphysics.io/api/request-api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          recaptcha_token: recaptchaToken
        })
      });
      
      if (response.ok) {
        setShowSuccess(true);
      } else {
        const errorData = await response.json();
        if (response.status === 429) {
          setError('Too many requests. Please try again later.');
        } else if (errorData.detail?.includes('spam')) {
          setError('Request flagged as potential spam. Please contact support if you believe this is an error.');
        } else {
          setError(errorData.detail || 'Failed to request API key. Please try again.');
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // ... rest of component
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* ... form content ... */}
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* ... form fields ... */}
          
          <button
            type="submit"
            disabled={isSubmitting || !executeRecaptcha}
            className="w-full bg-golf-green text-white py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Requesting...' : 'Request API Key'}
          </button>
          
          <p className="text-xs text-gray-500 mt-2">
            This site is protected by reCAPTCHA and the Google{' '}
            <a href="https://policies.google.com/privacy" className="underline">Privacy Policy</a> and{' '}
            <a href="https://policies.google.com/terms" className="underline">Terms of Service</a> apply.
          </p>
        </form>
      </div>
    </div>
  );
}
```

---

### Step 4: Update Contact Form

**File: `src/pages/Contact.jsx` (or wherever contact form is)**

```jsx
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

function ContactForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!executeRecaptcha) {
      alert('reCAPTCHA not loaded');
      return;
    }
    
    // Get reCAPTCHA token
    const recaptchaToken = await executeRecaptcha('contact_form');
    
    // Submit with token
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        recaptcha_token: recaptchaToken
      })
    });
    
    // ... handle response
  };
  
  // ... rest of component
}
```

---

## BACKEND IMPLEMENTATION

### Step 1: Install reCAPTCHA Package

```bash
pip install requests --break-system-packages
```

---

### Step 2: Create Verification Function

**File: `app/utils/recaptcha.py`**

```python
import os
import requests
from fastapi import HTTPException

RECAPTCHA_SECRET_KEY = os.getenv('RECAPTCHA_SECRET_KEY')
RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'

async def verify_recaptcha(token: str, action: str, min_score: float = 0.5) -> bool:
    """
    Verify reCAPTCHA token
    
    Args:
        token: reCAPTCHA token from frontend
        action: Expected action (e.g., 'api_key_request', 'contact_form')
        min_score: Minimum acceptable score (0.0-1.0)
    
    Returns:
        True if verification passes, raises HTTPException if fails
    """
    
    if not RECAPTCHA_SECRET_KEY:
        # In development, you might want to skip verification
        if os.getenv('ENVIRONMENT') == 'development':
            return True
        raise HTTPException(500, "reCAPTCHA not configured")
    
    # Verify token with Google
    response = requests.post(RECAPTCHA_VERIFY_URL, data={
        'secret': RECAPTCHA_SECRET_KEY,
        'response': token
    })
    
    result = response.json()
    
    # Check if verification was successful
    if not result.get('success'):
        error_codes = result.get('error-codes', [])
        raise HTTPException(400, f"reCAPTCHA verification failed: {error_codes}")
    
    # Check action matches
    if result.get('action') != action:
        raise HTTPException(400, "reCAPTCHA action mismatch")
    
    # Check score
    score = result.get('score', 0.0)
    if score < min_score:
        # Log this for monitoring
        print(f"Low reCAPTCHA score: {score} for action: {action}")
        raise HTTPException(429, "Request flagged as potential spam")
    
    return True
```

---

### Step 3: Update API Endpoints

**File: `app/routers/api_key_requests.py`**

```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.utils.recaptcha import verify_recaptcha

router = APIRouter()

class ApiKeyRequest(BaseModel):
    name: str
    email: EmailStr
    company: str | None = None
    use_case: str
    description: str | None = None
    expected_volume: str
    agreed_to_terms: bool
    recaptcha_token: str  # NEW

@router.post("/api/request-api-key")
async def request_api_key(request: ApiKeyRequest):
    """Generate and email API key to user"""
    
    # Verify reCAPTCHA first
    await verify_recaptcha(
        token=request.recaptcha_token,
        action='api_key_request',
        min_score=0.5  # Adjust based on spam levels
    )
    
    # Validate terms agreement
    if not request.agreed_to_terms:
        raise HTTPException(400, "Must agree to terms of service")
    
    # ... rest of endpoint logic
```

**File: `app/routers/contact.py`**

```python
from fastapi import APIRouter
from pydantic import BaseModel, EmailStr
from app.utils.recaptcha import verify_recaptcha

router = APIRouter()

class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str
    recaptcha_token: str

@router.post("/api/contact")
async def contact_form(request: ContactRequest):
    """Handle contact form submissions"""
    
    # Verify reCAPTCHA
    await verify_recaptcha(
        token=request.recaptcha_token,
        action='contact_form',
        min_score=0.5
    )
    
    # ... rest of logic
```

---

### Step 4: Add Environment Variable

**File: `.env` (backend)**

```env
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

**For Railway Deployment:**

In Railway dashboard:
1. Go to your project
2. Click "Variables"
3. Add: `RECAPTCHA_SECRET_KEY` = `your_secret_key_here`
4. Redeploy

---

## RECAPTCHA SCORE THRESHOLDS

### Score Ranges:
- **1.0:** Definitely a human
- **0.9-1.0:** Very likely human
- **0.7-0.9:** Likely human
- **0.5-0.7:** Neutral
- **0.3-0.5:** Suspicious
- **0.0-0.3:** Likely bot

### Recommended Thresholds:

**API Key Request Form:**
- `min_score = 0.5` (Start here)
- If lots of spam: Increase to 0.6-0.7
- If blocking real users: Decrease to 0.4

**Contact Form:**
- `min_score = 0.4` (More lenient)
- Less critical than API key requests

**Newsletter Signup:**
- `min_score = 0.3` (Very lenient)
- Want to capture as many as possible

---

## MONITORING & ADJUSTMENT

### Log reCAPTCHA Scores

```python
import logging

logger = logging.getLogger(__name__)

async def verify_recaptcha(token: str, action: str, min_score: float = 0.5):
    # ... verification code ...
    
    score = result.get('score', 0.0)
    
    # Log all scores for monitoring
    logger.info(f"reCAPTCHA score: {score}, action: {action}")
    
    if score < min_score:
        logger.warning(f"Blocked low score: {score} for action: {action}")
        raise HTTPException(429, "Request flagged as potential spam")
    
    return True
```

### Admin Dashboard Monitoring

Add to admin dashboard:
- reCAPTCHA score distribution (chart)
- Blocked requests count
- Average score by action
- Adjust thresholds button

---

## TESTING

### Test in Development

**Frontend Test:**
```javascript
// In browser console
window.grecaptcha.ready(() => {
  window.grecaptcha.execute('YOUR_SITE_KEY', {action: 'test'}).then(token => {
    console.log('Token:', token);
  });
});
```

**Backend Test:**
```bash
# Test reCAPTCHA verification
curl -X POST "http://localhost:8000/api/request-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "use_case": "Testing",
    "expected_volume": "< 10K",
    "agreed_to_terms": true,
    "recaptcha_token": "test_token_here"
  }'
```

### Test Score Thresholds

Temporarily add logging to see scores:
```python
print(f"reCAPTCHA score: {score}")
```

Submit forms and check what scores you get:
- Manual submissions: Usually 0.7-1.0
- Automated scripts: Usually 0.0-0.3

Adjust `min_score` based on real data.

---

## DEPLOYMENT CHECKLIST

### Before Deploying:

**Frontend:**
- [ ] reCAPTCHA site key in environment variable
- [ ] GoogleReCaptchaProvider wrapping App
- [ ] All forms using executeRecaptcha
- [ ] reCAPTCHA notice on forms
- [ ] .env file NOT committed to git

**Backend:**
- [ ] reCAPTCHA secret key in environment variable
- [ ] Verification function implemented
- [ ] All public endpoints protected
- [ ] Error handling for failed verification
- [ ] Logging for monitoring

**Google reCAPTCHA Console:**
- [ ] Domains added (golfphysics.io, www.golfphysics.io)
- [ ] reCAPTCHA v3 selected
- [ ] Keys saved securely

**Railway:**
- [ ] RECAPTCHA_SECRET_KEY environment variable set
- [ ] Deployed and tested

---

## FALLBACK PLAN

If reCAPTCHA causes issues (false positives, UX complaints):

### Option 1: Adjust Threshold
Lower `min_score` to 0.3-0.4

### Option 2: Manual Review
- Accept all submissions
- Flag low scores for manual review
- Admin can approve/reject

```python
if score < min_score:
    # Don't reject, but flag for review
    await flag_for_manual_review(request.email, score)
    # Send API key anyway
```

### Option 3: Rate Limiting Only
Remove reCAPTCHA, rely on rate limiting:
- 5 submissions per IP per hour
- Email domain validation
- Disposable email detection

---

## COST

**Google reCAPTCHA:**
- **Free tier:** 1 million assessments/month
- **Beyond 1M:** $1 per 1,000 assessments

**For Golf Physics API:**
- Unlikely to exceed free tier
- Even at 100K forms/month = FREE
- Cost only matters at massive scale

---

## SUMMARY

**What to Implement:**

1. ✅ Get reCAPTCHA keys from Google
2. ✅ Add to frontend (React provider + hooks)
3. ✅ Add to backend (verification function)
4. ✅ Protect API key request form
5. ✅ Protect contact form
6. ✅ Monitor scores and adjust thresholds

**Benefits:**
- ✅ Stops spam bots
- ✅ Invisible to users (no puzzles)
- ✅ Free for your usage level
- ✅ Easy to adjust thresholds
- ✅ Detailed analytics

**Timeline:**
- Frontend: 1-2 hours
- Backend: 1-2 hours
- Testing: 1 hour
- **Total: 3-5 hours**

---

END OF RECAPTCHA GUIDE
