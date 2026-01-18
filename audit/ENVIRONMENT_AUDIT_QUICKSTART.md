# Environment Audit - Quick Start Guide

**Fixing the hardcoded URL problem before production**

---

## 🚨 THE PROBLEM

**What happened:**
- Staging admin dashboard had hardcoded production URLs (api.golfphysics.io)
- This caused login failures and wasted time
- We can't deploy to production like this - it's a critical blocker

**What we need:**
- Complete audit of ALL hardcoded URLs
- Proper environment variable usage everywhere
- Clean separation of staging and production
- Zero chance of environments getting mixed

---

## 📋 WHAT THE AUDIT WILL DO

### Phase 1: Find All Hardcoded URLs (30 min)
Searches entire codebase for:
- api.golfphysics.io
- golfphysics.io  
- Any hardcoded https:// URLs
- Reports every instance found

### Phase 2: Fix Backend (1 hour)
- Creates centralized config.py
- Moves all URLs to environment variables
- Updates CORS settings
- Fixes email templates

### Phase 3: Fix Admin Dashboard (1 hour)
- Creates config.js
- Updates all API calls to use env vars
- Creates .env.staging and .env.production
- Tests locally

### Phase 4: Fix Website (30 min)
- Creates config.js
- Updates API key request form
- Updates contact form
- Creates .env files

### Phase 5: Documentation (30 min)
- ENVIRONMENT_SETUP.md (complete guide)
- DEPLOYMENT_CHECKLIST.md (step-by-step)
- Verification script (detect hardcoded URLs)

### Phase 6: Staging Test (1 hour)
- Deploy everything to staging
- Full test suite
- Verify all URLs correct
- Fix any issues

### Phase 7: Report (15 min)
- ENVIRONMENT_AUDIT_REPORT.md
- Lists all issues found
- Lists all fixes made
- Confirms production readiness

**Total Time: ~4-5 hours**

---

## 🎯 WHAT YOU'LL GET

### Audit Report
Complete list of:
- Every hardcoded URL found
- Every file that was fixed
- All environment variables added
- Test results

### Clean Configuration
- Backend: config.py with Settings class
- Admin Dashboard: config.js + .env files
- Website: config.js + .env files
- Zero hardcoded URLs anywhere

### Documentation
- ENVIRONMENT_SETUP.md - How to set up each environment
- DEPLOYMENT_CHECKLIST.md - How to deploy safely
- Verification script - Detects hardcoded URLs

### Working Staging
- Fully functional staging environment
- All URLs point to staging
- No production URLs mixed in
- Ready for testing

---

## 🚀 HOW TO USE IT

### Give Claude Code This:

```
We have a critical issue with hardcoded production URLs in staging.

This is blocking production deployment.

Read and execute: ENVIRONMENT_AUDIT_PROMPT.md

Requirements:
1. Find ALL hardcoded URLs in the entire codebase
2. Fix them using environment variables
3. Create proper staging/production separation
4. Document everything
5. Test in staging thoroughly
6. Provide audit report

DO NOT deploy to production until I approve the audit.

Working directory: C:\Users\Vtorr\OneDrive\GolfWeatherAPI\

Report findings after each phase (1-7).

Begin with Phase 1: Search for hardcoded URLs and report what you find.
```

---

## 📊 WHAT CLAUDE CODE WILL REPORT

### After Phase 1 (Audit):
```
Found 15 hardcoded URLs:
1. admin-dashboard/src/components/Login.jsx:45 - "https://api.golfphysics.io/admin/login"
2. admin-dashboard/src/pages/Leads.jsx:102 - "https://api.golfphysics.io/admin-api/leads"
3. website/src/components/ApiKeyForm.jsx:78 - "https://api.golfphysics.io/api/request-api-key"
...
```

### After Phase 2-4 (Fixes):
```
Fixed all hardcoded URLs:
- Created app/config.py with Settings class
- Updated 8 files in backend
- Created admin-dashboard/src/config.js
- Updated 12 files in admin dashboard
- Created website/src/config.js
- Updated 3 files in website
```

### After Phase 5 (Documentation):
```
Created documentation:
- ENVIRONMENT_SETUP.md (complete guide)
- DEPLOYMENT_CHECKLIST.md (safe deployment steps)
- scripts/verify_environments.sh (detection script)
```

### After Phase 6 (Staging Test):
```
Staging Test Results:
✅ Backend deployed - no errors
✅ Admin dashboard deployed - login works
✅ Website deployed - forms work
✅ All API calls go to staging URLs
✅ No CORS errors
✅ Emails sent successfully
✅ Verification script: CLEAN (0 hardcoded URLs)
```

### After Phase 7 (Report):
```
Audit Complete!

Issues Found: 15
Issues Fixed: 15
Files Modified: 23
Environment Variables Added: 12

Staging Status: ✅ PASSING ALL TESTS
Production Readiness: ✅ READY FOR DEPLOYMENT

See ENVIRONMENT_AUDIT_REPORT.md for full details.
```

---

## ⏱️ TIMELINE

- **Start:** Now (when your usage resets)
- **Audit Duration:** 4-5 hours
- **Your Involvement:** Review audit report, approve for production
- **Production Deploy:** Only after you approve

---

## ✅ SUCCESS CRITERIA

Audit passes when:
- ✅ Zero hardcoded URLs found by verification script
- ✅ All staging tests pass
- ✅ Documentation complete
- ✅ You review and approve the audit report

**Only then do we deploy to production.**

---

## 📁 WHAT TO GIVE CLAUDE CODE

**Required:**
1. ENVIRONMENT_AUDIT_PROMPT.md (I created this)
2. Your project directory: C:\Users\Vtorr\OneDrive\GolfWeatherAPI\

**That's it!** Claude Code will do the rest.

---

## 🎯 NEXT STEPS

1. **Wait for usage to reset**
2. **Give Claude Code the audit prompt**
3. **Let them work through all 7 phases** (~4-5 hours)
4. **Review the audit report**
5. **Approve or request changes**
6. **Then and only then:** Deploy to production

---

## 💡 KEY PRINCIPLE

**No hardcoded URLs. Period.**

Everything must use environment variables:
- Backend URLs
- Frontend URLs
- API endpoints
- Email links
- Redirect URLs
- CORS origins

**If it's a URL, it's an environment variable.**

---

**This audit will take time, but it's essential for a professional, maintainable production deployment.** 

**Better to spend 5 hours now than deal with production incidents later.** ✅
