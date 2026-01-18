# Environment Audit Report

**Date:** 2026-01-18
**Status:** IN PROGRESS
**Auditor:** Claude Code

---

## Phase 1: Hardcoded URLs and Vercel References Found

### CRITICAL ISSUES (Blocking Production)

#### 1. Marketing Website - Hardcoded Production API URLs

| File | Line | Hardcoded Value | Fix Required |
|------|------|-----------------|--------------|
| `golfphysics-website/src/components/ApiKeyRequestModal.jsx` | 69 | `https://api.golfphysics.io/api/request-api-key` | Use env variable |
| `golfphysics-website/src/pages/Home.jsx` | 262 | `https://api.golfphysics.io/v1/trajectory` | Use env variable |
| `golfphysics-website/src/pages/Docs.jsx` | 99, 225, 249 | Multiple `api.golfphysics.io` URLs | Use env variable |

#### 2. Admin Dashboard - Documentation Examples

| File | Line | Hardcoded Value | Fix Required |
|------|------|-----------------|--------------|
| `golf-admin/admin-dashboard/src/components/SystemHealth.jsx` | 292-293 | `https://api.golfphysics.io/api/v1/health` | Use env variable or make dynamic |

#### 3. Backend - Email Templates with Hardcoded URLs

| File | Line | Hardcoded Value | Fix Required |
|------|------|-----------------|--------------|
| `app/services/email.py` | 80, 184 | `curl "https://api.golfphysics.io/..."` | Use BACKEND_URL env var |
| `app/services/email.py` | 85-86, 121, 132, 152-154, 187, 203, 207, 274-275 | `https://golfphysics.io/docs`, `/pricing` | Use FRONTEND_URL env var |
| `app/services/email.py` | 354 | `https://api.golfphysics.io/admin/leads` | Use BACKEND_URL env var |

---

### MEDIUM ISSUES (Should Fix)

#### 4. Vercel References (We use Railway, not Vercel)

| File | Line | Issue | Action |
|------|------|-------|--------|
| `frontend/app.js` | 2 | `https://golf-weather-api.vercel.app` | DELETE - old code |
| `frontend/.env.local` | 1-2 | Vercel OIDC token | DELETE - old config |
| `random_stress_test.py` | 13 | `https://golf-weather-api.vercel.app` | UPDATE to Railway URL |
| `golf-admin/golf_api_test_suite.py` | 39 | `https://frontend-one-mauve-10.vercel.app` | UPDATE to Railway URL |
| `vercel.json` | - | Vercel config file | DELETE - not needed |
| `.claude/settings.local.json` | 13 | `npx vercel:*` permission | REMOVE |

#### 5. Hardcoded CORS/CSP with Mixed Environments

| File | Line | Issue | Action |
|------|------|-------|--------|
| `app/config.py` | 40 | Hardcoded CORS origins list | Use environment-based config |
| `app/middleware/security.py` | 36 | Hardcoded CSP connect-src | Use environment-based config |

---

### LOW ISSUES (Nice to Have)

#### 6. Documentation with Hardcoded URLs (OK for docs)

| File | Issue |
|------|-------|
| `golf-admin/DEPLOYMENT_GUIDE.md` | Vercel references in docs |
| `golf-admin/CLAUDE_CODE_PROMPTS.md` | Vercel references |
| `golf-admin/README.md` | Vercel references |
| `website build/*.md` | Various Vercel references |
| `claude_code_railway_prompt.md` | "Working MVP on Vercel" |

---

## Summary Statistics

| Category | Count |
|----------|-------|
| **Critical Issues** | 12 hardcoded URLs |
| **Medium Issues** | 8 Vercel references + 2 config issues |
| **Low Issues** | ~10 documentation references |
| **Total Files to Fix** | 8 source files |

---

## Files Requiring Changes

### Must Fix (Source Code):

1. `golfphysics-website/src/components/ApiKeyRequestModal.jsx`
2. `golfphysics-website/src/pages/Home.jsx`
3. `golfphysics-website/src/pages/Docs.jsx`
4. `golf-admin/admin-dashboard/src/components/SystemHealth.jsx`
5. `app/services/email.py`
6. `app/config.py`
7. `app/middleware/security.py`

### Should Delete (Obsolete Vercel Files):

1. `frontend/` directory (old Vercel frontend)
2. `vercel.json`
3. `random_stress_test.py` (or update)
4. `golf-admin/golf_api_test_suite.py` (or update)

---

---

## Phase 2: Backend API Fixes (COMPLETED)

### Files Modified:

| File | Changes |
|------|---------|
| `app/config.py` | Added `BACKEND_URL`, `FRONTEND_URL`, `ADMIN_URL` env vars; simplified default CORS |
| `app/services/email.py` | Replaced 15 hardcoded URLs with `{BACKEND_URL}` and `{FRONTEND_URL}` variables |
| `app/middleware/security.py` | CSP `connect-src` now built dynamically from CORS_ORIGINS |
| `.env.example` | Added URL configuration section with examples for each environment |

### New Environment Variables:

| Variable | Purpose | Default |
|----------|---------|---------|
| `BACKEND_URL` | API's public URL (for emails, etc.) | `http://localhost:8000` |
| `FRONTEND_URL` | Marketing website URL (for email links) | `http://localhost:5173` |
| `ADMIN_URL` | Admin dashboard URL | `http://localhost:8000` |

### Verification:
```
Config loaded successfully
BACKEND_URL: http://localhost:8000
FRONTEND_URL: http://localhost:5173
CORS origins: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8000']
CSP connect-src: 'self' https://accounts.google.com http://localhost:3000 http://localhost:5173 http://localhost:8000
```

---

## Phase 3: Admin Dashboard Fixes (COMPLETED)

### Files Modified:

| File | Changes |
|------|---------|
| `golf-admin/admin-dashboard/src/components/SystemHealth.jsx` | Replaced hardcoded URLs with `{apiBase}` variable |
| `golf-admin/admin-dashboard/.env.example` | Updated with guidance to use window.location.origin |

---

## Phase 4: Marketing Website Fixes (COMPLETED)

### Files Created/Modified:

| File | Changes |
|------|---------|
| `golfphysics-website/src/config.js` | **NEW** - Centralized config with `getApiUrl()` helper |
| `golfphysics-website/src/components/ApiKeyRequestModal.jsx` | Uses `getApiUrl()` instead of hardcoded URL |
| `golfphysics-website/.env.example` | Updated with environment-specific examples |

### Note on Documentation Examples:

The following files contain `api.golfphysics.io` URLs in **documentation/code examples** shown to users:
- `golfphysics-website/src/pages/Home.jsx` - Code example in `<pre>` tag
- `golfphysics-website/src/pages/Docs.jsx` - API documentation examples

These are intentionally kept as production URLs since they show users what to call.

---

## Files Recommended for Deletion (Obsolete Vercel Files):

| File/Directory | Reason |
|----------------|--------|
| `frontend/` | Old Vercel frontend, replaced by golfphysics-website |
| `vercel.json` | Vercel config not needed for Railway |
| `frontend/.vercel/` | Vercel deployment cache |
| `frontend/.env.local` | Contains Vercel OIDC token |

**Action Required:** User should review and delete these manually if no longer needed.

---

## Next Steps

- [x] Phase 1: Find all hardcoded URLs and Vercel references
- [x] Phase 2: Fix Backend API issues
- [x] Phase 3: Fix Admin Dashboard issues
- [x] Phase 4: Fix Marketing Website issues
- [ ] Phase 5: Create documentation
- [ ] Phase 6: Test in staging
- [ ] Phase 7: Final report and approval

---

**DO NOT DEPLOY TO PRODUCTION UNTIL ALL PHASES COMPLETE AND APPROVED**
