# PROMPT FOR CLAUDE CODE - Complete Staging/Production Environment Audit

**Critical: Fix all hardcoded URLs and ensure proper staging/production separation**

---

```
We have a serious issue: hardcoded production URLs are appearing in staging environment.

This is unacceptable for production deployment. I need a COMPLETE audit and fix of all environments.

DO NOT push anything to production until this is 100% clean.

---

## THE PROBLEM

**What happened:**
- Staging environment has hardcoded URLs pointing to: api.golfphysics.io (production)
- This caused login failures and other issues
- We've been working on staging for over an hour with production URLs mixed in
- This is a critical blocker for production deployment

**What we need:**
- Clean separation between staging and production
- ALL URLs/endpoints must use environment variables
- Zero hardcoded URLs anywhere
- Proper configuration for each environment

---

## PROJECT STRUCTURE

We have 3 main codebases:

1. **Backend API** (FastAPI)
   - Location: `golf-weather-api/`
   - Staging: staging-api.golfphysics.io (or Railway staging URL)
   - Production: api.golfphysics.io

2. **Admin Dashboard** (React)
   - Location: `golf-admin/admin-dashboard/`
   - Makes API calls to backend
   - Has login system

3. **Marketing Website** (React/Vite)
   - Location: `golfphysics-website/`
   - Has API key request form
   - Has contact form
   - Makes API calls to backend

---

## AUDIT REQUIREMENTS

### PHASE 1: Find ALL Hardcoded URLs

**Search the ENTIRE codebase for:**

1. **Hardcoded production domains:**
   - `api.golfphysics.io`
   - `golfphysics.io`
   - Any other production domains

2. **Hardcoded URLs in:**
   - Backend code (Python files)
   - Admin dashboard (JSX/JS files)
   - Marketing website (JSX/JS files)
   - Configuration files (.env.example, config files)
   - Docker files
   - Scripts

3. **Common locations to check:**
   ```bash
   # Search entire project
   grep -r "api.golfphysics.io" .
   grep -r "golfphysics.io" .
   grep -r "http://" .
   grep -r "https://" .
   ```

**For each hardcoded URL found, document:**
- File path
- Line number
- Current hardcoded value
- What it should be (environment variable)

---

### PHASE 2: Backend API Audit

**File: `golf-weather-api/`**

**Check these locations:**

1. **Configuration files:**
   - `app/config.py`
   - `app/main.py`
   - Any `settings.py` or `config.py` files

2. **CORS settings:**
   ```python
   # Bad (hardcoded):
   allow_origins=["https://api.golfphysics.io"]
   
   # Good (environment variable):
   allow_origins=[os.getenv("FRONTEND_URL")]
   ```

3. **Email templates:**
   - `app/services/email.py`
   - Check for hardcoded links in email HTML

4. **API responses:**
   - Any responses that return URLs
   - Redirect URLs
   - Callback URLs

5. **Database connection:**
   - Should use environment variable: `DATABASE_URL`
   - Not hardcoded connection strings

**Create/Update: `app/config.py`**

```python
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    
    # SendGrid
    SENDGRID_API_KEY: str = os.getenv("SENDGRID_API_KEY", "")
    FROM_EMAIL: str = os.getenv("FROM_EMAIL", "noreply@golfphysics.io")
    REPLY_TO_EMAIL: str = os.getenv("REPLY_TO_EMAIL", "")
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "")
    
    # URLs
    BACKEND_URL: str = os.getenv("BACKEND_URL", "http://localhost:8000")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    ADMIN_URL: str = os.getenv("ADMIN_URL", "http://localhost:5173")
    
    # CORS Origins
    @property
    def ALLOWED_ORIGINS(self) -> list[str]:
        if self.ENVIRONMENT == "production":
            return [
                "https://golfphysics.io",
                "https://www.golfphysics.io",
                "https://api.golfphysics.io"
            ]
        elif self.ENVIRONMENT == "staging":
            return [
                os.getenv("STAGING_FRONTEND_URL", ""),
                os.getenv("STAGING_API_URL", ""),
                "http://localhost:3000",
                "http://localhost:5173",
                "http://localhost:5174"
            ]
        else:  # development
            return [
                "http://localhost:3000",
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:8000"
            ]
    
    class Config:
        env_file = ".env"

settings = Settings()
```

**Update CORS in main.py:**

```python
from app.config import settings

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### PHASE 3: Admin Dashboard Audit

**File: `golf-admin/admin-dashboard/`**

**Check these locations:**

1. **API calls:**
   - All fetch() calls
   - All axios calls
   - Any HTTP requests

2. **Common files to check:**
   - `src/services/api.js` or similar
   - `src/config.js` or similar
   - `src/components/*.jsx`
   - `src/pages/*.jsx`

3. **Look for patterns like:**
   ```javascript
   // Bad (hardcoded):
   fetch("https://api.golfphysics.io/admin/login")
   
   // Good (environment variable):
   fetch(`${import.meta.env.VITE_API_URL}/admin/login`)
   ```

**Create: `src/config.js`**

```javascript
// Centralized configuration
const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
};

export default config;
```

**Update all API calls to use config:**

```javascript
import config from './config';

// Instead of:
fetch("https://api.golfphysics.io/admin/login")

// Use:
fetch(`${config.apiUrl}/admin/login`)
```

**Update `.env.example`:**

```env
# Admin Dashboard Environment Variables

# API Backend URL
VITE_API_URL=http://localhost:8000

# Environment (development, staging, production)
VITE_ENVIRONMENT=development

# reCAPTCHA (if used)
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
```

**Create `.env.staging`:**

```env
VITE_API_URL=https://staging-api.golfphysics.io
VITE_ENVIRONMENT=staging
VITE_RECAPTCHA_SITE_KEY=your_staging_key
```

**Create `.env.production`:**

```env
VITE_API_URL=https://api.golfphysics.io
VITE_ENVIRONMENT=production
VITE_RECAPTCHA_SITE_KEY=your_production_key
```

---

### PHASE 4: Marketing Website Audit

**File: `golfphysics-website/`**

**Check these locations:**

1. **API key request form:**
   - Where does it POST to?
   - Is the URL hardcoded?

2. **Contact form:**
   - Where does it POST to?
   - Is the URL hardcoded?

3. **Any other API calls:**
   - Newsletter signups
   - Any fetch/axios calls

**Same pattern as Admin Dashboard:**

**Create: `src/config.js`**

```javascript
const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
};

export default config;
```

**Update forms:**

```javascript
import config from './config';

// API Key Request Form
const response = await fetch(`${config.apiUrl}/api/request-api-key`, {
  method: 'POST',
  // ...
});

// Contact Form
const response = await fetch(`${config.apiUrl}/api/contact`, {
  method: 'POST',
  // ...
});
```

---

### PHASE 5: Environment Variable Documentation

**Create: `ENVIRONMENT_SETUP.md`**

Document ALL environment variables needed for each environment:

```markdown
# Environment Variables Guide

## Backend API

### Development (.env)
```
DATABASE_URL=postgresql://localhost/golf_dev
SENDGRID_API_KEY=test_key
FROM_EMAIL=noreply@localhost
ADMIN_EMAIL=admin@localhost
ENVIRONMENT=development
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
```

### Staging (Railway)
```
DATABASE_URL=[Railway PostgreSQL]
SENDGRID_API_KEY=[SendGrid staging key]
FROM_EMAIL=noreply@golfphysics.io
REPLY_TO_EMAIL=[your email]
ADMIN_EMAIL=[your email]
ENVIRONMENT=staging
BACKEND_URL=https://staging-api.golfphysics.io
FRONTEND_URL=https://staging.golfphysics.io
STAGING_FRONTEND_URL=https://staging.golfphysics.io
STAGING_API_URL=https://staging-api.golfphysics.io
```

### Production (Railway)
```
DATABASE_URL=[Railway PostgreSQL Production]
SENDGRID_API_KEY=[SendGrid production key]
FROM_EMAIL=noreply@golfphysics.io
REPLY_TO_EMAIL=[your email]
ADMIN_EMAIL=[your email]
ENVIRONMENT=production
BACKEND_URL=https://api.golfphysics.io
FRONTEND_URL=https://golfphysics.io
```

## Admin Dashboard

### Development
```
VITE_API_URL=http://localhost:8000
VITE_ENVIRONMENT=development
```

### Staging
```
VITE_API_URL=https://staging-api.golfphysics.io
VITE_ENVIRONMENT=staging
```

### Production
```
VITE_API_URL=https://api.golfphysics.io
VITE_ENVIRONMENT=production
```

## Marketing Website

### Development
```
VITE_API_URL=http://localhost:8000
```

### Staging
```
VITE_API_URL=https://staging-api.golfphysics.io
```

### Production
```
VITE_API_URL=https://api.golfphysics.io
```
```

---

### PHASE 6: Railway Configuration Audit

**Check Railway setup:**

1. **Verify we have correct services:**
   - [ ] PostgreSQL-Staging (for staging)
   - [ ] PostgreSQL-Production (for production) - or separate project
   - [ ] Backend-Staging
   - [ ] Backend-Production (or separate project)

2. **Verify environment variables in Railway:**
   - [ ] Staging service has staging URLs
   - [ ] Production service has production URLs
   - [ ] No mixing of staging/production values

3. **Best practice: Separate Railway projects:**
   - Project 1: "Golf Physics - Staging"
   - Project 2: "Golf Physics - Production"
   - Zero chance of mixing environments

---

## DELIVERABLES

When audit is complete, provide:

### 1. Audit Report

**Create: `ENVIRONMENT_AUDIT_REPORT.md`**

```markdown
# Environment Audit Report

## Issues Found

### Critical Issues (blocking production):
1. [File path]: Hardcoded production URL on line X
2. [File path]: Hardcoded production URL on line X
...

### Medium Issues (should fix):
1. ...

### Low Issues (nice to have):
1. ...

## Files Modified

1. `app/config.py` - Created centralized configuration
2. `app/main.py` - Updated CORS to use environment variables
3. `admin-dashboard/src/config.js` - Created config file
...

## Total Hardcoded URLs Found: X
## Total Hardcoded URLs Fixed: X

## Environment Variables Added

### Backend:
- BACKEND_URL
- FRONTEND_URL
- ADMIN_URL
- ENVIRONMENT
...

### Admin Dashboard:
- VITE_API_URL
- VITE_ENVIRONMENT
...

### Website:
- VITE_API_URL
...

## Testing Required

1. [ ] Test staging environment (all URLs point to staging)
2. [ ] Test production environment (all URLs point to production)
3. [ ] Test login in staging
4. [ ] Test API calls in staging
5. [ ] Test forms in staging
...
```

### 2. Updated Configuration Files

- ✅ Backend: `app/config.py` with Settings class
- ✅ Admin Dashboard: `src/config.js`
- ✅ Website: `src/config.js`
- ✅ Environment examples: `.env.example`, `.env.staging`, `.env.production`

### 3. Documentation

- ✅ `ENVIRONMENT_SETUP.md` - Complete guide
- ✅ `DEPLOYMENT_CHECKLIST.md` - Step-by-step deployment guide

### 4. Verification Script

**Create: `scripts/verify_environments.sh`**

```bash
#!/bin/bash
# Verify no hardcoded production URLs in code

echo "Scanning for hardcoded URLs..."

echo "Checking for api.golfphysics.io..."
grep -r "api\.golfphysics\.io" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist --exclude="*.md" .

echo "Checking for golfphysics.io (excluding email addresses)..."
grep -r "golfphysics\.io" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist --exclude="*.md" . | grep -v "@golfphysics.io"

echo "Checking for https:// (excluding comments and documentation)..."
grep -r "https://" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist --exclude="*.md" . | grep -v "//"

echo "If any results above, those need to be fixed!"
```

---

## TESTING CHECKLIST

After all fixes are applied:

### Staging Environment Test:

1. **Backend API:**
   - [ ] Logs show: "Environment: staging"
   - [ ] CORS allows staging URLs only
   - [ ] Database connects to staging PostgreSQL
   - [ ] Emails send with staging-appropriate content

2. **Admin Dashboard:**
   - [ ] Login works at staging URL
   - [ ] All API calls go to staging backend
   - [ ] No 404 or CORS errors
   - [ ] Leads page loads
   - [ ] Can view/filter/export leads

3. **Marketing Website:**
   - [ ] API key request form submits to staging
   - [ ] Contact form submits to staging
   - [ ] Emails received
   - [ ] Forms don't hit production accidentally

4. **Verification:**
   - [ ] Run verification script - zero results
   - [ ] Check browser network tab - all requests to staging URLs
   - [ ] Check backend logs - all URLs are staging

### Production Environment Test (After Staging Passes):

1. **Backend API:**
   - [ ] Logs show: "Environment: production"
   - [ ] CORS allows production URLs only
   - [ ] Database connects to production PostgreSQL

2. **Admin Dashboard:**
   - [ ] Login works at production URL
   - [ ] All API calls go to production backend

3. **Marketing Website:**
   - [ ] Forms submit to production
   - [ ] Emails received

---

## DEPLOYMENT WORKFLOW

**Create: `DEPLOYMENT_CHECKLIST.md`**

```markdown
# Deployment Checklist

## Pre-Deployment

- [ ] All environment variables documented
- [ ] No hardcoded URLs in code (run verification script)
- [ ] .env.example files up to date
- [ ] ENVIRONMENT_SETUP.md is accurate

## Staging Deployment

1. [ ] Set Railway staging environment variables
2. [ ] Deploy backend to staging
3. [ ] Deploy admin dashboard to staging
4. [ ] Deploy website to staging
5. [ ] Run full test suite
6. [ ] Verify all URLs point to staging
7. [ ] Test login, forms, emails
8. [ ] Check logs for errors

## Production Deployment (Only After Staging Success)

1. [ ] Set Railway production environment variables
2. [ ] Deploy backend to production
3. [ ] Deploy admin dashboard to production
4. [ ] Deploy website to production
5. [ ] Run smoke tests
6. [ ] Monitor logs for 30 minutes
7. [ ] Test critical paths (login, API key request)

## Rollback Plan

If production deployment fails:
1. Revert to previous Railway deployment
2. Clear DNS cache
3. Notify stakeholders
```

---

## EXECUTION PLAN

1. **Phase 1: Audit** (30 min)
   - Search entire codebase
   - Document all hardcoded URLs
   - Create issue list

2. **Phase 2: Fix Backend** (1 hour)
   - Create config.py
   - Update all files
   - Add environment variables
   - Test locally

3. **Phase 3: Fix Admin Dashboard** (1 hour)
   - Create config.js
   - Update all API calls
   - Create .env files
   - Test locally

4. **Phase 4: Fix Website** (30 min)
   - Create config.js
   - Update forms
   - Create .env files
   - Test locally

5. **Phase 5: Documentation** (30 min)
   - Write ENVIRONMENT_SETUP.md
   - Write DEPLOYMENT_CHECKLIST.md
   - Create verification script

6. **Phase 6: Staging Test** (1 hour)
   - Deploy to staging
   - Run full test suite
   - Fix any issues

7. **Phase 7: Report** (15 min)
   - Create ENVIRONMENT_AUDIT_REPORT.md
   - Summarize findings
   - Confirm readiness for production

**Total Time: ~4-5 hours**

---

## CRITICAL REQUIREMENTS

❌ **DO NOT:**
- Deploy to production until audit is 100% complete
- Leave any hardcoded URLs
- Mix staging and production environment variables
- Skip testing in staging

✅ **DO:**
- Use environment variables for ALL URLs
- Test thoroughly in staging first
- Document everything
- Create verification script
- Provide detailed audit report

---

## SUCCESS CRITERIA

The audit is complete when:

1. ✅ Zero hardcoded production URLs in codebase
2. ✅ All URLs use environment variables
3. ✅ Staging environment fully functional
4. ✅ Documentation complete and accurate
5. ✅ Verification script runs clean
6. ✅ All tests pass in staging
7. ✅ Deployment checklist created
8. ✅ I approve the audit report

---

Begin the audit and report findings after each phase.

DO NOT proceed to production deployment until I explicitly approve.
```
