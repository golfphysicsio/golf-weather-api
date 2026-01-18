# Deployment Checklist

## Pre-Deployment Verification

### Code Quality
- [ ] All environment variables documented in `.env.example`
- [ ] No hardcoded production URLs in source code
- [ ] All API calls use environment variables or `window.location.origin`
- [ ] Run verification script: `bash scripts/verify_environments.sh`

### Environment Variables
- [ ] Backend: `BACKEND_URL`, `FRONTEND_URL`, `CORS_ORIGINS` are set
- [ ] Admin Dashboard: `VITE_GOOGLE_CLIENT_ID` is set
- [ ] Website: `VITE_RECAPTCHA_SITE_KEY` is set
- [ ] All secrets (API keys, database URLs) are configured

---

## Staging Deployment

### 1. Set Railway Staging Variables

```
ENVIRONMENT=staging
BACKEND_URL=https://golf-weather-api-staging.up.railway.app
FRONTEND_URL=https://golf-weather-api-staging.up.railway.app
CORS_ORIGINS=https://golf-weather-api-staging.up.railway.app
```

### 2. Deploy Backend
- [ ] Push code to trigger Railway deployment
- [ ] Wait for deployment to complete
- [ ] Verify health check: `curl https://golf-weather-api-staging.up.railway.app/api/v1/health`

### 3. Build & Deploy Admin Dashboard
```bash
cd golf-admin/admin-dashboard
npm run build
cp -r dist/* ../../admin-dashboard-dist/
git add admin-dashboard-dist/
git commit -m "Rebuild admin dashboard for staging"
git push
```

### 4. Staging Verification Tests

#### Backend API
- [ ] Health endpoint returns `{"status": "healthy"}`
- [ ] CORS headers present for staging origin
- [ ] Environment shows as "staging"

#### Admin Dashboard
- [ ] Login page loads at `/admin`
- [ ] Google OAuth login works
- [ ] Dashboard displays data
- [ ] Leads page loads and shows test data

#### API Endpoints
- [ ] API key request works: `POST /api/request-api-key`
- [ ] Contact form works: `POST /api/contact`
- [ ] Leads API returns data: `GET /admin-api/leads`

#### Email
- [ ] API key welcome email sends correctly
- [ ] Contact confirmation email sends
- [ ] Admin notification email sends
- [ ] Email links point to correct URLs

### 5. Staging Sign-off
- [ ] All tests pass
- [ ] No console errors in browser
- [ ] No errors in Railway logs
- [ ] User approves staging deployment

---

## Production Deployment

**ONLY PROCEED AFTER STAGING IS FULLY VERIFIED**

### 1. Set Railway Production Variables

```
ENVIRONMENT=production
BACKEND_URL=https://api.golfphysics.io
FRONTEND_URL=https://golfphysics.io
CORS_ORIGINS=https://golfphysics.io,https://www.golfphysics.io,https://api.golfphysics.io
```

### 2. Google OAuth Configuration
- [ ] Add production URLs to Google Cloud Console:
  - `https://api.golfphysics.io`
  - `https://golfphysics.io`

### 3. Deploy Backend
- [ ] Deploy to production Railway service
- [ ] Verify health check
- [ ] Monitor logs for errors

### 4. Production Verification (Smoke Tests)

- [ ] Health endpoint: `curl https://api.golfphysics.io/api/v1/health`
- [ ] Admin login works at `https://api.golfphysics.io/admin`
- [ ] API key request form works (test with throwaway email)
- [ ] Email links go to production URLs

### 5. Post-Deployment Monitoring
- [ ] Watch Railway logs for 30 minutes
- [ ] Check error tracking (Sentry) for new issues
- [ ] Verify external monitoring (UptimeRobot) shows green

---

## Rollback Plan

If production deployment fails:

1. **Immediate:** Revert to previous Railway deployment
   - Railway Dashboard > Deployments > Select previous > Rollback

2. **Verify rollback:**
   ```bash
   curl https://api.golfphysics.io/api/v1/health
   ```

3. **Investigate:**
   - Check Railway logs
   - Check Sentry for errors
   - Review recent commits

4. **Communicate:**
   - Update status page (if applicable)
   - Notify stakeholders

---

## Environment Verification Script

Save as `scripts/verify_environments.sh`:

```bash
#!/bin/bash

echo "=== Environment Audit ==="
echo ""

echo "Checking for hardcoded api.golfphysics.io..."
FOUND=$(grep -r "api\.golfphysics\.io" \
  --include="*.py" --include="*.js" --include="*.jsx" \
  --exclude-dir=node_modules --exclude-dir=dist \
  --exclude-dir=admin-dashboard-dist --exclude-dir=.git \
  --exclude="*.md" . 2>/dev/null | grep -v "# " | wc -l)
echo "Found: $FOUND occurrences"

echo ""
echo "Checking for Vercel references..."
VERCEL=$(grep -r "vercel" \
  --include="*.py" --include="*.js" --include="*.jsx" \
  --exclude-dir=node_modules --exclude-dir=.git \
  --exclude="*.md" . 2>/dev/null | wc -l)
echo "Found: $VERCEL occurrences"

echo ""
echo "=== Results ==="
if [ "$FOUND" -eq 0 ] && [ "$VERCEL" -eq 0 ]; then
  echo "✅ No hardcoded URLs found - ready for deployment"
else
  echo "❌ Issues found - review before deployment"
fi
```

---

## Quick Reference

### Railway Commands (if using CLI)

```bash
# Login
railway login

# Link to project
railway link

# Set environment variable
railway variables set KEY=value

# View logs
railway logs

# Deploy
railway up
```

### Useful URLs

| Environment | Backend | Admin |
|-------------|---------|-------|
| Development | http://localhost:8000 | http://localhost:8000/admin |
| Staging | https://golf-weather-api-staging.up.railway.app | .../admin |
| Production | https://api.golfphysics.io | .../admin |
