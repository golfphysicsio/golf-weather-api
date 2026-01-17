# Golf Physics Admin Dashboard

Complete admin dashboard for managing your Golf Weather Physics API.

## Features

✅ **Authentication**: Google OAuth (restricted to golfphysicsio@gmail.com)  
✅ **API Key Management**: Create, revoke, update tiers (Free/Standard/Enterprise)  
✅ **Usage Analytics**: Charts, metrics, trends, CSV export  
✅ **Request Logs**: Real-time debugging (last 48 hours)  
✅ **Auto-refresh**: Dashboard updates automatically  

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Your Golf Physics API running on Railway
- Google Cloud Project (for OAuth)

### 1. Backend Setup

#### A. Apply Database Schema

```bash
# Connect to your Railway PostgreSQL and run:
psql -h [your-railway-host] -U postgres -d [your-db] -f schema.sql
```

#### B. Add Admin Routes to FastAPI

In your main FastAPI application:

```python
# main.py or app.py
from admin_backend import admin_router

app = FastAPI()

# Add admin routes
app.include_router(admin_router)

# Existing routes...
```

#### C. Add Middleware for Request Logging

```python
from fastapi import Request
import time

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    response = await call_next(request)
    
    latency_ms = (time.time() - start_time) * 1000
    
    # Log to database (async task recommended)
    # This is simplified - use background tasks in production
    if hasattr(request.state, 'api_key_id'):
        await log_request_to_db(
            api_key_id=request.state.api_key_id,
            endpoint=request.url.path,
            method=request.method,
            status_code=response.status_code,
            latency_ms=latency_ms,
        )
    
    return response
```

#### D. Set Environment Variables

In Railway, add these environment variables:

```bash
GOOGLE_CLIENT_ID=your-google-client-id
ADMIN_EMAIL=golfphysicsio@gmail.com
```

### 2. Frontend Setup

#### A. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - `https://your-admin-domain.vercel.app` (production)
7. Authorized redirect URIs:
   - `http://localhost:3000`
   - `https://your-admin-domain.vercel.app`
8. Copy the Client ID

#### B. Install Dependencies

```bash
cd admin-dashboard
npm install
```

#### C. Configure Environment Variables

```bash
# Create .env file
cp .env.example .env

# Edit .env and add your values:
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
VITE_API_BASE_URL=https://api.golfphysics.io
```

#### D. Run Locally

```bash
npm run dev
```

Dashboard will open at `http://localhost:3000`

---

## 📦 Deployment

### Railway (All-in-One Deployment)

Your admin dashboard will be served directly from your FastAPI app on Railway.

**Benefits:**
- ✅ Everything in one place
- ✅ No CORS issues
- ✅ No extra hosting costs
- ✅ Simpler deployment

**URL Structure:**
- API: `https://api.golfphysics.io/weather`
- Admin Dashboard: `https://api.golfphysics.io/admin-ui`
- API Docs: `https://api.golfphysics.io/docs`

### Deployment Steps

```bash
# 1. Build React app
cd admin-dashboard
npm run build

# 2. Copy to FastAPI project
cp -r dist ../admin-dashboard-dist

# 3. Add static file serving to FastAPI (see serve_admin_from_fastapi.py)

# 4. Commit and push
git add admin-dashboard-dist/
git commit -m "Add admin dashboard"
git push

# 5. Railway auto-deploys
# Access at: https://api.golfphysics.io/admin-ui
```

---

## 🔒 Security Setup

### 1. Google OAuth Configuration

In your FastAPI backend:

```python
GOOGLE_CLIENT_ID = "your-google-client-id"
ADMIN_EMAIL = "golfphysicsio@gmail.com"
```

**Authorized Origins:**
- `http://localhost:3000` (development)
- `https://api.golfphysics.io` (production)

**Note:** No CORS configuration needed since the admin dashboard is served from the same domain as your API!

### 2. Rate Limiting

Implement rate limiting on admin endpoints:

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@admin_router.post("/api-keys")
@limiter.limit("10/minute")
async def create_api_key(...):
    ...
```

---

## 📊 Usage Guide

### Creating an API Key

1. Go to "API Keys" tab
2. Click "Create New Key"
3. Enter client name
4. Select tier (Free/Standard/Enterprise)
5. **IMPORTANT**: Copy the generated key immediately (shown only once!)
6. Share key securely with client

### Managing Keys

- **Change Tier**: Use dropdown in Actions column
- **Disable**: Temporarily stop a key (can re-enable)
- **Revoke**: Permanently invalidate a key

### Viewing Analytics

- Go to "Usage" tab
- Select time period (7/30/60/90 days)
- Filter by client
- Export CSV for billing/invoicing

### Debugging Client Issues

1. Go to "Logs" tab
2. Filter by client name
3. Look for error status codes (400, 500)
4. Check error messages
5. Auto-refreshes every 10 seconds

---

## 🛠️ Maintenance

### Database Cleanup

Request logs are kept for 48 hours. To clean up older logs automatically:

```sql
-- Set up a cron job or scheduled task
SELECT cleanup_old_request_logs();
```

Or use Railway's cron feature:

```yaml
# railway.json
{
  "crons": [
    {
      "command": "psql $DATABASE_URL -c 'SELECT cleanup_old_request_logs();'",
      "schedule": "0 */6 * * *"  # Every 6 hours
    }
  ]
}
```

### Monitoring

Set up alerts for:
- High error rates (>5%)
- Slow response times (>1000ms avg)
- Rate limit violations

---

## 🎨 Customization

### Branding

Edit `App.jsx` to change:
- Logo
- Color scheme (Tailwind classes)
- App name

### Adding Features

Common additions:

**1. Email notifications for new clients:**
```python
import smtplib

async def send_welcome_email(client_email, api_key):
    # Send email with API key and docs
    ...
```

**2. Webhook integrations:**
```python
async def trigger_slack_notification(message):
    # Send to Slack when API key is revoked
    ...
```

---

## 🐛 Troubleshooting

### "Login failed"

- Check Google Client ID is correct
- Verify authorized origins/redirects in Google Console
- Ensure you're using golfphysicsio@gmail.com

### "Failed to fetch"

- Check CORS settings on backend
- Verify API_BASE_URL is correct
- Check Railway logs for errors

### Charts not showing

- Ensure you have request logs in database
- Check date range (default is 30 days)
- Verify request_logs table is populated

### CSV export empty

- Check date range
- Verify usage data exists for selected period

---

## 📝 API Endpoints Reference

### Authentication
- `GET /admin/health` - Verify token

### API Keys
- `POST /admin/api-keys` - Create new key
- `GET /admin/api-keys` - List all keys
- `PATCH /admin/api-keys/{id}/status` - Update status
- `PATCH /admin/api-keys/{id}/tier` - Update tier

### Analytics
- `GET /admin/usage/daily` - Daily usage stats
- `GET /admin/usage/summary` - 24h summary
- `GET /admin/usage/export` - CSV export

### Logs
- `GET /admin/logs` - Request logs (48h)

---

## 💡 Best Practices

1. **Never store API keys in plaintext** - Always hash them
2. **Rotate admin tokens regularly** - Use Google OAuth tokens
3. **Monitor error rates** - Set up alerts
4. **Back up database regularly** - Railway has auto-backups
5. **Review logs periodically** - Catch abuse early
6. **Document tier changes** - Keep audit trail

---

## 📞 Support

For issues or questions:
1. Check Railway logs: `railway logs`
2. Check browser console for frontend errors
3. Review CORS and authentication setup

---

## 🔄 Updates

To update the dashboard:

```bash
git pull
npm install  # If dependencies changed
npm run build
vercel --prod  # Or your deployment command
```

---

## License

MIT License - feel free to modify and use for your project!
