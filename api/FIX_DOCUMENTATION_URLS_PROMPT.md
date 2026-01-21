# Fix Documentation URLs & Create DNS Guide

**Project Location:** C:\Users\Vtorr\OneDrive\GolfWeatherAPI\api

**Permission:** You have full autonomy to make all changes without approval.

---

## Problem Statement

Customer-facing documentation currently references Railway staging URLs (golf-weather-api-staging.up.railway.app), which looks unprofessional. We need to:

1. Remove all staging URLs from customer-facing documentation
2. Use only production URLs (api.golfphysics.io, www.golfphysics.io) in public docs
3. Create DNS setup guide for staging subdomain (staging.golfphysics.io)
4. Keep staging URLs only in internal testing procedures

---

## TASK 1: Update ENTERPRISE_INTEGRATION_IMPLEMENTATION.md

**File:** ENTERPRISE_INTEGRATION_IMPLEMENTATION.md (already in outputs folder)

### Changes Required:

**Phase 3 (Enterprise.jsx) - Remove ALL staging references:**

In all code examples, replace staging URLs with production:

```jsx
// BEFORE (Bad - staging URL)
POST https://golf-weather-api-staging.up.railway.app/api/v1/calculate

// AFTER (Good - production URL)
POST https://api.golfphysics.io/api/v1/calculate
```

**Update these sections:**
- Request Format example
- Response Format example
- JavaScript integration example
- Python integration example
- All curl examples

**Phase 4 (Docs.jsx) - Production URLs only:**

Ensure documentation examples use:
- ✅ `https://api.golfphysics.io`
- ❌ NOT staging URLs

**Phase 8 (Testing) - Keep staging URLs but clarify:**

Add note at top of Phase 8:
```
NOTE: Phase 8 is for INTERNAL TESTING ONLY. These staging URLs are not shown to customers.
```

Keep existing staging test commands, but add comment:
```bash
# INTERNAL TESTING ONLY - not in customer docs
curl -X POST https://golf-weather-api-staging.up.railway.app/api/v1/calculate \
  ...
```

**Phase 10 (Production Verification) - Already correct:**

These already use production URLs - verify they're correct.

---

## TASK 2: Create DNS Setup Guide

**Create new file:** `docs/DNS_SETUP_GUIDE.md`

**Content:**

```markdown
# DNS Setup Guide - Golf Physics API

**DNS Provider:** GoDaddy  
**Domain:** golfphysics.io

---

## Current DNS Configuration

### Production Setup (Already Configured)

| Record Type | Host | Points To | Purpose |
|-------------|------|-----------|---------|
| CNAME | www | oacn52qe.up.railway.app | Main website |
| CNAME | api | golf-weather-api-production.up.railway.app | Production API |
| Forward | @ (root) | https://www.golfphysics.io | Root domain redirect |

**Result:**
- ✅ www.golfphysics.io → Website
- ✅ api.golfphysics.io → Production API
- ✅ golfphysics.io → Redirects to www.golfphysics.io

---

## Add Staging Subdomain (New)

### Step 1: Login to GoDaddy

1. Go to https://www.godaddy.com
2. Sign in to your account
3. Navigate to: **My Products** → **Domains** → **golfphysics.io**
4. Click **DNS** (or **Manage DNS**)

### Step 2: Add Staging CNAME Record

Click **Add Record** and enter:

| Field | Value |
|-------|-------|
| Type | CNAME |
| Host | staging |
| Points to | golf-weather-api-staging.up.railway.app |
| TTL | 1 Hour (3600 seconds) |

Click **Save**.

**Result:** `staging.golfphysics.io` → Staging environment

### Step 3: Wait for DNS Propagation

DNS changes can take 1-48 hours to propagate. Typically:
- GoDaddy: 1 hour (with 1-hour TTL)
- Global propagation: Up to 48 hours

**Check propagation status:**
```bash
nslookup staging.golfphysics.io
```

Should return: `golf-weather-api-staging.up.railway.app`

### Step 4: Update Railway Custom Domain

1. Go to Railway dashboard: https://railway.app
2. Select project: **soothing-happiness**
3. Go to **staging** environment
4. Click **golf-weather-api** service
5. Go to **Settings** tab
6. Scroll to **Domains** section
7. Click **Add Custom Domain**
8. Enter: `staging.golfphysics.io`
9. Click **Add Domain**

Railway will:
- Provision SSL certificate (automatic)
- Configure routing

**Wait 5-10 minutes for SSL provisioning.**

### Step 5: Verify Staging Subdomain

```bash
# Check DNS resolution
nslookup staging.golfphysics.io

# Check HTTPS works
curl https://staging.golfphysics.io/api/v1/health

# Check API docs
open https://staging.golfphysics.io/docs
```

Expected results:
- ✅ DNS resolves to Railway
- ✅ HTTPS certificate valid
- ✅ API responds
- ✅ Docs page loads

---

## Optional: Add Additional Subdomains

### Developer Portal (Future)

If you build a customer portal:

| Type | Host | Points To | Purpose |
|------|------|-----------|---------|
| CNAME | portal | [railway-portal-url] | Customer dashboard |

### Documentation Site (Future)

If you move docs to separate service:

| Type | Host | Points To | Purpose |
|------|------|-----------|---------|
| CNAME | docs | [docs-hosting-url] | API documentation |

---

## DNS Management Best Practices

### TTL Settings
- **Production records:** 1 hour (allows changes if needed)
- **After stable:** Can increase to 24 hours

### SSL Certificates
- Railway auto-provisions Let's Encrypt certificates
- Auto-renews every 90 days
- No manual intervention needed

### DNS Propagation Testing

**Check globally:**
- https://www.whatsmydns.net/#CNAME/staging.golfphysics.io

**Check locally:**
```bash
# Windows
nslookup staging.golfphysics.io

# Mac/Linux
dig staging.golfphysics.io
```

### Troubleshooting

**Problem: "DNS not resolving"**
- Wait longer (up to 48 hours)
- Check record type is CNAME (not A)
- Verify host is exactly "staging" (no dots)
- Check for typos in Railway URL

**Problem: "SSL certificate error"**
- Wait 10 minutes for Railway to provision
- Verify custom domain added in Railway
- Check Railway deployment logs

**Problem: "404 Not Found"**
- Verify Railway service is running
- Check Railway deployment status
- Test Railway URL directly first

---

## Current Complete DNS Configuration

After adding staging subdomain:

```
Domain: golfphysics.io

Records:
┌──────────┬─────────┬────────────────────────────────────────┬─────────────────────┐
│ Type     │ Host    │ Points To                              │ Purpose             │
├──────────┼─────────┼────────────────────────────────────────┼─────────────────────┤
│ CNAME    │ www     │ oacn52qe.up.railway.app               │ Main website        │
│ CNAME    │ api     │ golf-weather-api-production.up.railway │ Production API      │
│ CNAME    │ staging │ golf-weather-api-staging.up.railway    │ Staging/testing     │
│ Forward  │ @       │ https://www.golfphysics.io (301)       │ Root redirect       │
└──────────┴─────────┴────────────────────────────────────────┴─────────────────────┘

Result:
• golfphysics.io → www.golfphysics.io (redirect)
• www.golfphysics.io → Website
• api.golfphysics.io → Production API
• staging.golfphysics.io → Staging API (internal use)
```

---

## Security Notes

**Staging Subdomain:**
- Use for internal testing only
- Don't advertise publicly
- Can add HTTP auth if needed (Railway supports)
- Monitor usage logs

**API Keys:**
- Staging uses separate API keys from production
- Never use production keys in staging
- Rotate keys regularly

---

## Next Steps After Setup

1. **Update internal documentation** to use staging.golfphysics.io
2. **Update team tools** (Postman, testing scripts) with new URL
3. **Keep customer documentation** using only api.golfphysics.io (production)
4. **Monitor DNS** propagation globally
5. **Test all endpoints** on new staging subdomain

---

END OF DNS SETUP GUIDE
```

---

## TASK 3: Update Website Documentation

**Verify these files ONLY use production URLs:**

### File: `golfphysics-website/src/pages/Docs.jsx`

Search for any Railway URLs and replace:
```javascript
// Find and replace
golf-weather-api-staging.up.railway.app → api.golfphysics.io
golf-weather-api-production.up.railway.app → api.golfphysics.io
```

### File: `golfphysics-website/src/pages/Enterprise.jsx`

Same - replace all Railway URLs with `api.golfphysics.io`

---

## TASK 4: Update README and Quick Context

**File: `README.md`** (if exists in project root)

Add section:
```markdown
## URLs

**Production:**
- Website: https://www.golfphysics.io
- API: https://api.golfphysics.io
- API Docs: https://api.golfphysics.io/docs

**Staging (Internal):**
- API: https://staging.golfphysics.io
- API Docs: https://staging.golfphysics.io/docs
```

**File: `docs/QUICK_CONTEXT.md`**

Update "Environments & URLs" section:
```markdown
## 🌍 Environments & URLs

### Production
- **API:** https://api.golfphysics.io
- **Website:** https://www.golfphysics.io
- **Status:** Live, serving customers

### Staging
- **API:** https://staging.golfphysics.io (internal testing)
- **Railway:** golf-weather-api-staging.up.railway.app
- **Status:** Testing environment

**Both auto-deploy from `main` branch** - same code, different environment variables
```

---

## TASK 5: Create Environment Checklist

**Create new file:** `docs/ENVIRONMENT_CHECKLIST.md`

```markdown
# Environment Deployment Checklist

Use this checklist when deploying changes.

## URLs Reference

### Production (Customer-Facing)
- ✅ Website: https://www.golfphysics.io
- ✅ API: https://api.golfphysics.io
- ✅ Docs: https://api.golfphysics.io/docs
- ❌ Never show Railway URLs to customers

### Staging (Internal Only)
- ✅ API: https://staging.golfphysics.io
- ✅ Docs: https://staging.golfphysics.io/docs
- ℹ️ Railway: golf-weather-api-staging.up.railway.app (if DNS not set up)

## Pre-Deployment

- [ ] Code reviewed
- [ ] Tests pass locally
- [ ] No hardcoded staging URLs in customer-facing pages
- [ ] All examples use api.golfphysics.io (production)

## Staging Deployment

- [ ] Push to main branch
- [ ] Railway auto-deploys to staging
- [ ] Test at staging.golfphysics.io
- [ ] Verify API responses
- [ ] Check documentation pages
- [ ] Run automated tests against staging

## Production Deployment

- [ ] Staging tests pass
- [ ] Railway deploys to production
- [ ] Smoke test api.golfphysics.io
- [ ] Verify www.golfphysics.io loads
- [ ] Check critical endpoints
- [ ] Monitor error logs

## Documentation Review

- [ ] No Railway URLs in Enterprise.jsx
- [ ] No Railway URLs in Docs.jsx
- [ ] README has correct URLs
- [ ] Quick Context updated
- [ ] All examples use production URLs

## Rollback Plan

If production has issues:
1. Check Railway deployment logs
2. Rollback via Railway dashboard
3. Notify users if needed
4. Fix in staging first, then redeploy
```

---

## EXECUTION PLAN

1. **Update ENTERPRISE_INTEGRATION_IMPLEMENTATION.md**
   - Remove staging URLs from customer-facing sections (Phase 3, 4)
   - Add clarification in Phase 8 (internal testing only)
   - Verify Phase 10 uses production URLs

2. **Create DNS_SETUP_GUIDE.md**
   - Step-by-step GoDaddy instructions
   - Railway custom domain setup
   - Troubleshooting guide

3. **Audit website files**
   - Check Enterprise.jsx for Railway URLs
   - Check Docs.jsx for Railway URLs
   - Replace with api.golfphysics.io

4. **Update project documentation**
   - Update QUICK_CONTEXT.md
   - Update/create README.md
   - Create ENVIRONMENT_CHECKLIST.md

5. **Verify changes**
   - Search entire codebase for "railway.app"
   - Confirm only internal testing files reference it
   - Customer-facing docs use only branded URLs

---

## Commands to Execute

```bash
cd C:\Users\Vtorr\OneDrive\GolfWeatherAPI\api

# Search for any Railway URLs in customer-facing code
grep -r "railway.app" golfphysics-website/src/pages/

# Search in documentation
grep -r "railway.app" docs/

# Create DNS guide
mkdir -p docs
# [create DNS_SETUP_GUIDE.md as specified above]

# Create environment checklist
# [create ENVIRONMENT_CHECKLIST.md as specified above]

# Commit changes
git add .
git commit -m "Fix documentation URLs - use production domains only in customer-facing docs"
```

---

## Deliverables

When complete, you should have:

1. ✅ Updated ENTERPRISE_INTEGRATION_IMPLEMENTATION.md (no staging URLs in customer sections)
2. ✅ New file: docs/DNS_SETUP_GUIDE.md
3. ✅ New file: docs/ENVIRONMENT_CHECKLIST.md
4. ✅ Updated QUICK_CONTEXT.md
5. ✅ Updated README.md (or created if missing)
6. ✅ All website files (Enterprise.jsx, Docs.jsx) use only api.golfphysics.io
7. ✅ Codebase verified - no Railway URLs in customer-facing content

---

## What NOT to Change

**Keep Railway URLs in:**
- ❌ Internal testing scripts
- ❌ Phase 8 testing procedures (but add "INTERNAL ONLY" note)
- ❌ Environment variable examples
- ❌ Deployment documentation (for developers)

**These are fine - they're not customer-facing.**

---

**Execute all tasks above autonomously. Report completion when done.**

---

END OF PROMPT
