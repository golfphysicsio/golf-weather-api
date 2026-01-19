# PROMPT FOR CLAUDE CODE - Automated Lead System + Admin Portal

**Complete automated lead capture system with email delivery and admin dashboard**

---

```
We need to implement a complete automated lead capture and management system:

1. Automated API key generation + email delivery (SendGrid)
2. Contact form lead capture to database
3. New "Leads" page in admin dashboard
4. Filters to differentiate lead sources

This replaces all manual processes with full automation.

---

## PHASE 1: DATABASE SCHEMA

We need a unified leads table that captures all types of leads.

### Create New Table: `leads`

```sql
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    
    -- Lead Source
    source VARCHAR(50) NOT NULL, -- 'api_key_request', 'contact_form', 'newsletter'
    
    -- Contact Information
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    
    -- API Key Request Specific
    use_case VARCHAR(255),
    description TEXT,
    expected_volume VARCHAR(50),
    api_key_id INTEGER REFERENCES api_keys(id),
    
    -- Contact Form Specific
    subject VARCHAR(500),
    message TEXT,
    
    -- Lead Quality
    is_high_value BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    
    -- Status Tracking
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'converted', 'lost'
    assigned_to VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    contacted_at TIMESTAMP,
    
    -- Notes
    internal_notes TEXT,
    
    -- Metadata
    ip_address VARCHAR(50),
    user_agent TEXT,
    referrer VARCHAR(500)
);

-- Indexes for performance
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_is_high_value ON leads(is_high_value);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- Composite index for common queries
CREATE INDEX idx_leads_source_status ON leads(source, status);
```

### Migration Script

**Create: `backend/migrations/add_leads_table.sql`**

```sql
-- Add leads table
-- Run this in Railway PostgreSQL console or via migration tool

-- Create leads table (as above)

-- Optional: Migrate existing API key requests to leads table
INSERT INTO leads (source, name, email, company, use_case, description, expected_volume, api_key_id, created_at)
SELECT 
    'api_key_request' as source,
    name,
    email,
    company,
    use_case,
    description,
    expected_volume,
    id as api_key_id,
    created_at
FROM api_keys
WHERE name IS NOT NULL;
```

---

## PHASE 2: SENDGRID EMAIL SERVICE

### Step 1: Get SendGrid Account

**Manual step (user must do this):**

1. Go to: https://sendgrid.com/
2. Sign up (free tier: 100 emails/day)
3. Verify email
4. Settings → API Keys → Create API Key
5. Name: "Golf Physics API"
6. Permissions: Full Access
7. Copy the key (save securely!)
8. Settings → Sender Authentication → Verify Single Sender
9. Use: noreply@golfphysics.io (or your email for now)

### Step 2: Install SendGrid

```bash
pip install sendgrid --break-system-packages
```

### Step 3: Create Email Service

**Create: `backend/app/services/email.py`**

```python
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from typing import Optional

SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')
FROM_EMAIL = os.getenv('FROM_EMAIL', 'noreply@golfphysics.io')
ADMIN_EMAIL = os.getenv('ADMIN_EMAIL', 'admin@golfphysics.io')


async def send_api_key_email(
    email: str,
    name: str,
    api_key: str
) -> bool:
    """Send welcome email with API key"""
    
    if not SENDGRID_API_KEY:
        print(f"[EMAIL] SendGrid not configured, would send to {email}: {api_key}")
        return False
    
    subject = "Your Golf Physics API Key is Ready ⛳"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <div style="background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">⛳ Golf Physics API</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Professional Weather Intelligence for Golf Technology</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="font-size: 18px; margin-top: 0;">Hi {name},</p>
            
            <p>Welcome to Golf Physics API! Your free Developer tier API key is ready to use.</p>
            
            <div style="background: #f5f5f5; border-left: 4px solid #2E7D32; padding: 20px; margin: 25px 0; border-radius: 4px;">
                <p style="margin: 0 0 10px 0; font-weight: bold; color: #2E7D32;">Your API Key:</p>
                <code style="background: white; padding: 12px; display: block; font-size: 14px; border: 1px solid #ddd; border-radius: 4px; word-break: break-all; font-family: 'Courier New', monospace;">
                    {api_key}
                </code>
                <p style="color: #d32f2f; font-size: 13px; margin: 10px 0 0 0;">
                    ⚠️ <strong>Keep this key secure</strong> - treat it like a password. It won't be shown again.
                </p>
            </div>
            
            <h2 style="color: #2E7D32; font-size: 20px; margin-top: 30px;">Developer Tier Includes:</h2>
            <ul style="line-height: 1.8;">
                <li>✅ 60 requests per minute</li>
                <li>✅ 1,000 requests per day (~30K/month)</li>
                <li>✅ Real-time weather data with physics calculations</li>
                <li>✅ Multi-unit support (imperial + metric)</li>
                <li>✅ Complete API documentation</li>
                <li>✅ Community support</li>
            </ul>
            
            <div style="background: #e8f5e9; border: 1px solid #a5d6a7; padding: 20px; margin: 25px 0; border-radius: 8px;">
                <h3 style="margin-top: 0; color: #2E7D32;">🚀 Quick Start</h3>
                
                <p style="margin: 15px 0 10px 0;"><strong>1. Make your first request:</strong></p>
                <pre style="background: #f5f5f5; padding: 15px; border-radius: 4px; overflow-x: auto; font-size: 13px; border: 1px solid #ddd;">curl "https://api.golfphysics.io/weather?lat=33.7&lon=-84.4" \\
  -H "X-API-Key: {api_key}"</pre>
                
                <p style="margin: 15px 0 5px 0;"><strong>2. View Documentation:</strong></p>
                <p style="margin: 5px 0;">
                    <a href="https://golfphysics.io/docs" style="color: #2E7D32; text-decoration: none; font-weight: 500;">
                        📚 https://golfphysics.io/docs →
                    </a>
                </p>
                
                <p style="margin: 15px 0 5px 0;"><strong>3. Explore Code Examples:</strong></p>
                <p style="margin: 5px 0;">Python, JavaScript, and Go examples available in our documentation.</p>
            </div>
            
            <h2 style="color: #2E7D32; font-size: 20px; margin-top: 30px;">Ready for Production?</h2>
            <p>The Developer tier is perfect for testing and development. When you're ready to scale:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                    <td style="padding: 15px; border: 1px solid #e0e0e0; background: #fafafa;">
                        <strong style="color: #2E7D32;">Professional</strong><br>
                        <span style="font-size: 24px; font-weight: bold;">$299</span><span style="color: #666;">/month</span>
                        <ul style="margin: 10px 0 0 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                            <li>25K requests/day</li>
                            <li>99.9% uptime SLA</li>
                            <li>Phone support</li>
                        </ul>
                    </td>
                    <td style="padding: 15px; border: 1px solid #e0e0e0; background: #fafafa;">
                        <strong style="color: #2E7D32;">Business</strong><br>
                        <span style="font-size: 24px; font-weight: bold;">$599</span><span style="color: #666;">/month</span>
                        <ul style="margin: 10px 0 0 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                            <li>100K requests/day</li>
                            <li>Account manager</li>
                            <li>Custom integration</li>
                        </ul>
                    </td>
                </tr>
            </table>
            
            <p style="text-align: center; margin: 25px 0;">
                <a href="https://golfphysics.io/pricing" style="display: inline-block; background: #2E7D32; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                    View All Pricing Plans →
                </a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <h3 style="color: #2E7D32;">Need Help?</h3>
            <p>We're here to support you:</p>
            <ul style="line-height: 1.8;">
                <li>📧 Email: <a href="mailto:support@golfphysics.io" style="color: #2E7D32;">support@golfphysics.io</a></li>
                <li>📚 Documentation: <a href="https://golfphysics.io/docs" style="color: #2E7D32;">golfphysics.io/docs</a></li>
                <li>💬 Community: Join our developer community (coming soon)</li>
            </ul>
            
            <p style="margin-top: 30px;">Happy building!</p>
            
            <p style="margin: 5px 0;">
                <strong>The Golf Physics Team</strong><br>
                <span style="color: #666; font-size: 14px;">Professional Weather Intelligence for Golf Technology</span>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="font-size: 13px; color: #666; font-style: italic;">
                P.S. We'd love to hear about your project! Reply to this email and tell us what you're building with Golf Physics API.
            </p>
        </div>
        
        <div style="text-align: center; padding: 20px; font-size: 12px; color: #666;">
            <p>© 2026 Golf Physics API. All rights reserved.</p>
            <p>
                <a href="https://golfphysics.io" style="color: #2E7D32; text-decoration: none;">Website</a> · 
                <a href="https://golfphysics.io/docs" style="color: #2E7D32; text-decoration: none;">Documentation</a> · 
                <a href="https://golfphysics.io/pricing" style="color: #2E7D32; text-decoration: none;">Pricing</a>
            </p>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
    Golf Physics API - Your API Key is Ready

    Hi {name},

    Welcome to Golf Physics API! Your free Developer tier API key is ready to use.

    YOUR API KEY:
    {api_key}

    ⚠️ Keep this key secure - treat it like a password. It won't be shown again.

    DEVELOPER TIER INCLUDES:
    • 60 requests per minute
    • 1,000 requests per day (~30K/month)
    • Real-time weather data with physics calculations
    • Multi-unit support (imperial + metric)
    • Complete API documentation
    • Community support

    QUICK START:

    1. Make your first request:
    curl "https://api.golfphysics.io/weather?lat=33.7&lon=-84.4" \\
      -H "X-API-Key: {api_key}"

    2. View Documentation: https://golfphysics.io/docs

    3. Explore code examples in Python, JavaScript, and Go

    READY FOR PRODUCTION?

    Professional Tier - $299/month
    • 25K requests/day
    • 99.9% uptime SLA
    • Phone support

    Business Tier - $599/month
    • 100K requests/day
    • Account manager
    • Custom integration

    View all pricing: https://golfphysics.io/pricing

    NEED HELP?
    • Email: support@golfphysics.io
    • Docs: https://golfphysics.io/docs

    Happy building!

    The Golf Physics Team
    Professional Weather Intelligence for Golf Technology

    ---

    P.S. We'd love to hear about your project! Reply to this email and tell us what you're building.
    """
    
    try:
        message = Mail(
            from_email=FROM_EMAIL,
            to_emails=email,
            subject=subject,
            plain_text_content=text_content,
            html_content=html_content
        )
        
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        
        print(f"[EMAIL] API key sent to {email}, status: {response.status_code}")
        return response.status_code == 202
        
    except Exception as e:
        print(f"[EMAIL] Failed to send to {email}: {str(e)}")
        return False


async def send_contact_confirmation(
    email: str,
    name: str,
    subject: str
) -> bool:
    """Send confirmation email for contact form submission"""
    
    if not SENDGRID_API_KEY:
        print(f"[EMAIL] Would send contact confirmation to {email}")
        return False
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #2E7D32; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0;">⛳ Golf Physics API</h1>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
            <p>Hi {name},</p>
            
            <p>Thanks for reaching out! We've received your message regarding:</p>
            
            <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #2E7D32; margin: 20px 0;">
                <strong>{subject}</strong>
            </div>
            
            <p>We'll get back to you within 24 hours (usually much faster!).</p>
            
            <p>In the meantime, feel free to explore:</p>
            <ul>
                <li><a href="https://golfphysics.io/docs" style="color: #2E7D32;">API Documentation</a></li>
                <li><a href="https://golfphysics.io/pricing" style="color: #2E7D32;">Pricing Plans</a></li>
            </ul>
            
            <p style="margin-top: 30px;">Best regards,<br><strong>The Golf Physics Team</strong></p>
        </div>
    </body>
    </html>
    """
    
    try:
        message = Mail(
            from_email=FROM_EMAIL,
            to_emails=email,
            subject=f"Thanks for contacting Golf Physics API",
            html_content=html_content
        )
        
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        
        print(f"[EMAIL] Contact confirmation sent to {email}")
        return response.status_code == 202
        
    except Exception as e:
        print(f"[EMAIL] Failed to send contact confirmation: {str(e)}")
        return False


async def send_admin_notification(
    lead_type: str,
    lead_data: dict,
    is_high_value: bool = False
) -> bool:
    """Send admin notification about new lead"""
    
    if not SENDGRID_API_KEY:
        print(f"[NOTIFICATION] {lead_type} lead: {lead_data}")
        return False
    
    priority = "🚨 HIGH VALUE" if is_high_value else "📧 New"
    subject = f"{priority} Lead: {lead_type} - {lead_data.get('name', 'Unknown')}"
    
    if lead_type == "API Key Request":
        details = f"""
        <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">{lead_data.get('email')}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Company:</td><td style="padding: 8px;">{lead_data.get('company', 'Not provided')}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Use Case:</td><td style="padding: 8px;">{lead_data.get('use_case')}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Expected Volume:</td><td style="padding: 8px;">{lead_data.get('expected_volume')}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Description:</td><td style="padding: 8px;">{lead_data.get('description', 'Not provided')}</td></tr>
        """
    else:  # Contact Form
        details = f"""
        <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">{lead_data.get('email')}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Subject:</td><td style="padding: 8px;">{lead_data.get('subject')}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Message:</td><td style="padding: 8px;">{lead_data.get('message')}</td></tr>
        """
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif;">
        <div style="background: {'#ff6b6b' if is_high_value else '#2E7D32'}; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">{priority} Lead: {lead_type}</h1>
        </div>
        
        <div style="padding: 20px;">
            <h2>Lead Details:</h2>
            
            <table style="border-collapse: collapse; width: 100%;">
                <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">{lead_data.get('name')}</td></tr>
                {details}
            </table>
            
            <p style="margin-top: 30px;">
                <a href="https://api.golfphysics.io/admin/leads" style="background: #2E7D32; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    View in Admin Dashboard →
                </a>
            </p>
        </div>
    </body>
    </html>
    """
    
    try:
        message = Mail(
            from_email=FROM_EMAIL,
            to_emails=ADMIN_EMAIL,
            subject=subject,
            html_content=html_content
        )
        
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        
        print(f"[NOTIFICATION] Admin notified about {lead_type} lead")
        return response.status_code == 202
        
    except Exception as e:
        print(f"[NOTIFICATION] Failed to notify admin: {str(e)}")
        return False
```

---

## PHASE 3: UPDATE API ENDPOINTS

### Update API Key Request Endpoint

**Update: `backend/app/routers/api_key_requests.py`**

```python
from app.services.email import send_api_key_email, send_admin_notification
from datetime import datetime

@router.post("/api/request-api-key")
async def request_api_key(request: ApiKeyRequest):
    """Generate API key and send via email"""
    
    # Verify reCAPTCHA
    await verify_recaptcha(
        token=request.recaptcha_token,
        action='api_key_request',
        min_score=0.5
    )
    
    # Check terms
    if not request.agreed_to_terms:
        raise HTTPException(400, "Must agree to terms")
    
    # Check if email already has active key
    existing = await db.fetch_one(
        "SELECT id FROM api_keys WHERE email = $1 AND status = 'active'",
        request.email
    )
    
    if existing:
        # Resend existing key
        return {"message": "API key resent to your email", "email": request.email}
    
    # Generate new key
    raw_key = f"golf_{secrets.token_urlsafe(32)}"
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    
    # Store API key
    api_key_id = await db.fetch_val(
        """
        INSERT INTO api_keys 
        (key_hash, email, name, company, use_case, description, 
         expected_volume, tier, status, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'developer', 'active', NOW())
        RETURNING id
        """,
        key_hash, request.email, request.name, request.company,
        request.use_case, request.description, request.expected_volume
    )
    
    # Determine if high-value lead
    is_high_value = is_high_value_prospect(request)
    
    # Store in leads table
    await db.execute(
        """
        INSERT INTO leads 
        (source, name, email, company, use_case, description, expected_volume,
         api_key_id, is_high_value, status, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'new', NOW())
        """,
        'api_key_request', request.name, request.email, request.company,
        request.use_case, request.description, request.expected_volume,
        api_key_id, is_high_value
    )
    
    # Send welcome email with API key
    email_sent = await send_api_key_email(
        email=request.email,
        name=request.name,
        api_key=raw_key
    )
    
    # Notify admin if high-value
    if is_high_value:
        await send_admin_notification(
            lead_type="API Key Request",
            lead_data={
                'name': request.name,
                'email': request.email,
                'company': request.company,
                'use_case': request.use_case,
                'expected_volume': request.expected_volume,
                'description': request.description
            },
            is_high_value=True
        )
    
    return {
        "success": True,
        "message": "API key sent to your email",
        "email": request.email
    }


def is_high_value_prospect(request: ApiKeyRequest) -> bool:
    """Identify high-value leads"""
    
    indicators = [
        request.company is not None and len(request.company) > 0,
        request.use_case in ['Launch Monitor Integration', 'Tournament Software'],
        request.expected_volume in ['10K-100K', '100K+'],
        any(domain in request.email.lower() for domain in [
            'inrange', 'trackman', 'foresight', 'arccos', 'garmin',
            'titleist', 'callaway', 'taylormade', 'topgolf'
        ])
    ]
    
    return sum(indicators) >= 2
```

### Create Contact Form Endpoint

**Create: `backend/app/routers/contact.py`**

```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.utils.recaptcha import verify_recaptcha
from app.services.email import send_contact_confirmation, send_admin_notification

router = APIRouter()

class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    company: str | None = None
    subject: str
    message: str
    recaptcha_token: str

@router.post("/api/contact")
async def submit_contact_form(request: ContactRequest):
    """Handle contact form submissions"""
    
    # Verify reCAPTCHA
    await verify_recaptcha(
        token=request.recaptcha_token,
        action='contact_form',
        min_score=0.4  # More lenient for contact
    )
    
    # Determine if high-value (mentions enterprise, large volume, etc.)
    is_high_value = any(keyword in request.message.lower() for keyword in [
        'enterprise', 'multi-location', 'chain', 'partnership',
        '100k', '1m', 'million', 'large scale', 'trackman', 'inrange'
    ])
    
    # Store in leads table
    await db.execute(
        """
        INSERT INTO leads 
        (source, name, email, company, subject, message, is_high_value, status, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'new', NOW())
        """,
        'contact_form', request.name, request.email, request.company,
        request.subject, request.message, is_high_value
    )
    
    # Send confirmation to user
    await send_contact_confirmation(
        email=request.email,
        name=request.name,
        subject=request.subject
    )
    
    # Notify admin
    await send_admin_notification(
        lead_type="Contact Form",
        lead_data={
            'name': request.name,
            'email': request.email,
            'company': request.company,
            'subject': request.subject,
            'message': request.message
        },
        is_high_value=is_high_value
    )
    
    return {
        "success": True,
        "message": "Thanks for reaching out! We'll be in touch soon."
    }
```

**Register in main.py:**

```python
from app.routers import contact

app.include_router(contact.router)
```

---

## PHASE 4: ADMIN DASHBOARD - LEADS PAGE

### Create Leads API Endpoint

**Create: `backend/app/routers/admin/leads.py`**

```python
from fastapi import APIRouter, Depends, Query
from typing import Optional
from app.dependencies import get_current_user

router = APIRouter(prefix="/admin/leads", tags=["admin"])

@router.get("/")
async def get_leads(
    source: Optional[str] = None,
    status: Optional[str] = None,
    is_high_value: Optional[bool] = None,
    search: Optional[str] = None,
    limit: int = Query(50, le=100),
    offset: int = 0,
    current_user = Depends(get_current_user)
):
    """Get all leads with filters"""
    
    where_clauses = []
    params = []
    param_num = 1
    
    if source:
        where_clauses.append(f"source = ${param_num}")
        params.append(source)
        param_num += 1
    
    if status:
        where_clauses.append(f"status = ${param_num}")
        params.append(status)
        param_num += 1
    
    if is_high_value is not None:
        where_clauses.append(f"is_high_value = ${param_num}")
        params.append(is_high_value)
        param_num += 1
    
    if search:
        where_clauses.append(f"(name ILIKE ${param_num} OR email ILIKE ${param_num} OR company ILIKE ${param_num})")
        params.append(f"%{search}%")
        param_num += 1
    
    where_sql = "WHERE " + " AND ".join(where_clauses) if where_clauses else ""
    
    # Get total count
    count = await db.fetch_val(
        f"SELECT COUNT(*) FROM leads {where_sql}",
        *params
    )
    
    # Get leads
    params.extend([limit, offset])
    leads = await db.fetch_all(
        f"""
        SELECT 
            id, source, name, email, company,
            use_case, subject, expected_volume,
            is_high_value, priority, status,
            created_at, contacted_at, internal_notes
        FROM leads
        {where_sql}
        ORDER BY created_at DESC
        LIMIT ${param_num} OFFSET ${param_num + 1}
        """,
        *params
    )
    
    return {
        "leads": leads,
        "total": count,
        "limit": limit,
        "offset": offset
    }


@router.get("/stats")
async def get_lead_stats(current_user = Depends(get_current_user)):
    """Get lead statistics"""
    
    stats = await db.fetch_one(
        """
        SELECT 
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE status = 'new') as new,
            COUNT(*) FILTER (WHERE is_high_value = true) as high_value,
            COUNT(*) FILTER (WHERE source = 'api_key_request') as api_requests,
            COUNT(*) FILTER (WHERE source = 'contact_form') as contacts,
            COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as this_week,
            COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as this_month
        FROM leads
        """
    )
    
    return stats


@router.patch("/{lead_id}")
async def update_lead(
    lead_id: int,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    assigned_to: Optional[str] = None,
    internal_notes: Optional[str] = None,
    current_user = Depends(get_current_user)
):
    """Update lead"""
    
    updates = []
    params = []
    param_num = 1
    
    if status:
        updates.append(f"status = ${param_num}")
        params.append(status)
        param_num += 1
        
        if status == 'contacted':
            updates.append(f"contacted_at = NOW()")
    
    if priority:
        updates.append(f"priority = ${param_num}")
        params.append(priority)
        param_num += 1
    
    if assigned_to:
        updates.append(f"assigned_to = ${param_num}")
        params.append(assigned_to)
        param_num += 1
    
    if internal_notes:
        updates.append(f"internal_notes = ${param_num}")
        params.append(internal_notes)
        param_num += 1
    
    updates.append("updated_at = NOW()")
    params.append(lead_id)
    
    if not updates:
        raise HTTPException(400, "No updates provided")
    
    await db.execute(
        f"UPDATE leads SET {', '.join(updates)} WHERE id = ${param_num}",
        *params
    )
    
    return {"success": True}


@router.get("/export")
async def export_leads(
    source: Optional[str] = None,
    current_user = Depends(get_current_user)
):
    """Export leads to CSV"""
    
    where_sql = f"WHERE source = $1" if source else ""
    params = [source] if source else []
    
    leads = await db.fetch_all(
        f"""
        SELECT 
            created_at, source, name, email, company,
            use_case, subject, expected_volume,
            is_high_value, priority, status, contacted_at
        FROM leads
        {where_sql}
        ORDER BY created_at DESC
        """,
        *params
    )
    
    # Convert to CSV
    import csv
    from io import StringIO
    
    output = StringIO()
    writer = csv.DictWriter(output, fieldnames=leads[0].keys() if leads else [])
    writer.writeheader()
    writer.writerows([dict(lead) for lead in leads])
    
    return {
        "csv": output.getvalue(),
        "filename": f"leads-{datetime.now().strftime('%Y%m%d')}.csv"
    }
```

**Register in main.py:**

```python
from app.routers.admin import leads as admin_leads

app.include_router(admin_leads.router)
```

---

## PHASE 5: FRONTEND - LEADS PAGE

### Create Leads Page Component

**Create: `golf-admin/admin-dashboard/src/pages/Leads.jsx`**

```jsx
import { useState, useEffect } from 'react';
import { Search, Filter, Download, Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [sourceFilter, setSourceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [highValueFilter, setHighValueFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 50;
  
  useEffect(() => {
    loadLeads();
    loadStats();
  }, [sourceFilter, statusFilter, highValueFilter, searchTerm, page]);
  
  const loadLeads = async () => {
    setLoading(true);
    
    const params = new URLSearchParams({
      limit,
      offset: page * limit
    });
    
    if (sourceFilter) params.append('source', sourceFilter);
    if (statusFilter) params.append('status', statusFilter);
    if (highValueFilter) params.append('is_high_value', highValueFilter);
    if (searchTerm) params.append('search', searchTerm);
    
    const response = await fetch(`/admin/leads?${params}`);
    const data = await response.json();
    
    setLeads(data.leads);
    setTotal(data.total);
    setLoading(false);
  };
  
  const loadStats = async () => {
    const response = await fetch('/admin/leads/stats');
    const data = await response.json();
    setStats(data);
  };
  
  const updateLeadStatus = async (leadId, status) => {
    await fetch(`/admin/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    
    loadLeads();
    loadStats();
  };
  
  const exportLeads = async () => {
    const params = new URLSearchParams();
    if (sourceFilter) params.append('source', sourceFilter);
    
    const response = await fetch(`/admin/leads/export?${params}`);
    const data = await response.json();
    
    // Download CSV
    const blob = new Blob([data.csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = data.filename;
    a.click();
  };
  
  const getSourceBadge = (source) => {
    const badges = {
      'api_key_request': { color: 'bg-blue-100 text-blue-800', label: 'API Key' },
      'contact_form': { color: 'bg-green-100 text-green-800', label: 'Contact' },
      'newsletter': { color: 'bg-purple-100 text-purple-800', label: 'Newsletter' }
    };
    
    const badge = badges[source] || { color: 'bg-gray-100 text-gray-800', label: source };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>
        {badge.label}
      </span>
    );
  };
  
  const getStatusBadge = (status) => {
    const badges = {
      'new': { color: 'bg-yellow-100 text-yellow-800', label: 'New' },
      'contacted': { color: 'bg-blue-100 text-blue-800', label: 'Contacted' },
      'qualified': { color: 'bg-green-100 text-green-800', label: 'Qualified' },
      'converted': { color: 'bg-emerald-100 text-emerald-800', label: 'Converted' },
      'lost': { color: 'bg-red-100 text-red-800', label: 'Lost' }
    };
    
    const badge = badges[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>
        {badge.label}
      </span>
    );
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-600">Manage all leads from API requests and contact forms</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600">Total Leads</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{stats.total || 0}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600">New</div>
          <div className="text-3xl font-bold text-yellow-600 mt-2">{stats.new || 0}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600">High Value</div>
          <div className="text-3xl font-bold text-red-600 mt-2">{stats.high_value || 0}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600">This Week</div>
          <div className="text-3xl font-bold text-green-600 mt-2">{stats.this_week || 0}</div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-golf-green focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-golf-green"
          >
            <option value="">All Sources</option>
            <option value="api_key_request">API Key Requests</option>
            <option value="contact_form">Contact Forms</option>
            <option value="newsletter">Newsletter</option>
          </select>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-golf-green"
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
          
          {/* High Value Filter */}
          <select
            value={highValueFilter}
            onChange={(e) => setHighValueFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-golf-green"
          >
            <option value="">All Leads</option>
            <option value="true">High Value Only</option>
            <option value="false">Regular Only</option>
          </select>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {leads.length} of {total} leads
          </div>
          
          <button
            onClick={exportLeads}
            className="flex items-center gap-2 px-4 py-2 bg-golf-green text-white rounded-lg hover:bg-green-700"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>
      
      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  No leads found
                </td>
              </tr>
            ) : (
              leads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        {lead.name}
                        {lead.is_high_value && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            ⭐ High Value
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                      {lead.company && (
                        <div className="text-sm text-gray-600">{lead.company}</div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getSourceBadge(lead.source)}
                  </td>
                  
                  <td className="px-6 py-4">
                    {lead.source === 'api_key_request' ? (
                      <div className="text-sm">
                        <div className="font-medium">{lead.use_case}</div>
                        <div className="text-gray-500">Volume: {lead.expected_volume}</div>
                      </div>
                    ) : (
                      <div className="text-sm">
                        <div className="font-medium">{lead.subject}</div>
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(lead.status)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      {lead.status === 'new' && (
                        <button
                          onClick={() => updateLeadStatus(lead.id, 'contacted')}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          title="Mark as contacted"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-green-600 hover:text-green-800 flex items-center gap-1"
                        title="Send email"
                      >
                        <Mail size={16} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {total > limit && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          
          <div className="px-4 py-2">
            Page {page + 1} of {Math.ceil(total / limit)}
          </div>
          
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={(page + 1) * limit >= total}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
```

### Add to Navigation

**Update: `golf-admin/admin-dashboard/src/components/Navigation.jsx`**

```jsx
import { Users } from 'lucide-react';

// Add to nav items
<NavLink to="/leads">
  <Users size={20} />
  <span>Leads</span>
</NavLink>
```

### Add Route

**Update: `golf-admin/admin-dashboard/src/App.jsx`**

```jsx
import Leads from './pages/Leads';

// Add route
<Route path="/leads" element={<Leads />} />
```

---

## PHASE 6: ENVIRONMENT VARIABLES

### Backend (.env and Railway)

```bash
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=noreply@golfphysics.io
ADMIN_EMAIL=your-email@example.com
```

### Frontend (.env)

Already has:
```
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
```

---

## TESTING CHECKLIST

### Test Email Functionality:

1. **API Key Request:**
   - [ ] Fill out form on website
   - [ ] Submit
   - [ ] Check email inbox for API key
   - [ ] Verify key works in API call
   - [ ] Check admin email for notification (if high-value)

2. **Contact Form:**
   - [ ] Fill out contact form
   - [ ] Submit
   - [ ] Check email for confirmation
   - [ ] Check admin email for notification

### Test Admin Dashboard:

1. **Leads Page:**
   - [ ] Loads all leads
   - [ ] Stats show correctly
   - [ ] Filter by source (API Key vs Contact)
   - [ ] Filter by status
   - [ ] Filter by high-value
   - [ ] Search works
   - [ ] Mark as contacted works
   - [ ] Export CSV works
   - [ ] Pagination works

---

## DEPLOYMENT

1. **Run Database Migration:**
   - Copy SQL from Phase 1
   - Run in Railway PostgreSQL console

2. **Update Backend:**
   - Code already has changes
   - Add environment variables in Railway
   - Deploy

3. **Update Frontend:**
   - Code already has Leads page
   - Deploy admin dashboard

4. **Test Everything:**
   - Submit test API key request
   - Submit test contact form
   - Check emails received
   - Check admin dashboard shows leads
   - Test filters and export

---

## DELIVERABLES

When complete, you should have:

1. ✅ **Automated API Key Delivery:**
   - User requests key → receives email automatically
   - No manual intervention needed

2. ✅ **Automated Contact Form:**
   - User submits contact → gets confirmation
   - Admin gets notification

3. ✅ **Admin Leads Page:**
   - View all leads in one place
   - Filter by source (API Key / Contact)
   - Filter by status, high-value
   - Search functionality
   - Export to CSV
   - Mark as contacted
   - Quick email links

4. ✅ **Automated Alerts:**
   - High-value leads trigger admin email
   - Know immediately about inRange, TrackMan, etc.

---

This replaces ALL manual processes with full automation!
```
