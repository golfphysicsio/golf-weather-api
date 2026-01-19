# Production Deployment - Quick Reference

**Date:** January 18, 2026  
**Status:** Multiple items pending production push  
**Action Required:** Give prompt to Claude Code

---

## 📁 Files to Move

Move these files to: `C:\Users\Vtorr\OneDrive\GolfWeatherAPI\website build`

1. **professional_api_physics_validation_v2.md** (NEW)
   - Refined validation table
   - All reviewer feedback incorporated
   - Technically precise language
   - Model limitations clearly stated

2. **production_deployment_prompt.txt**
   - Comprehensive deployment instructions
   - Full authority to execute
   - Logging requirements
   - Give this to Claude Code

---

## ⏳ What's Pending Production

### 1. API Physics Fix
**Status:** ✅ Committed locally, ❌ NOT pushed to Railway

**Commit:** e0607a9 "Fix physics calculation: add Lift Paradox handling and API type split"

**Changes:**
- Professional API: Pure physics, 40mph wind cap
- Gaming API: Smart capping, 9 game modes
- 9 files changed (+614/-145 lines)

**Needs:**
- Push to Railway: `git push origin main`
- Railway will auto-deploy
- Verify in production

---

### 2. Website Rebuild
**Status:** ❓ Unknown (Claude Code working on it)

**Expected:**
- 8 pages total (Homepage, Professional, Gaming, Pricing, Science, About, Docs, Contact)
- Dual-market positioning
- 9 game modes shown
- Lift Paradox explained

**Needs:**
- Build: `npm run build`
- Deploy to Vercel/Netlify
- Verify all pages live

---

### 3. Documentation Updates
**Status:** ⚠️ Partially done, needs refinement

**What's updated:**
- golf-weather-api-spec.md (Physics Engine Updates section)
- Some website content

**Still needs:**
- Integrate validation table v2
- Update API docs with model limitations
- Create CHANGELOG.md
- Update README files

---

## 🎯 What Claude Code Will Do

### Part 1: Verify Status
- Check what commits are unpushed
- Check what's uncommitted
- Determine website rebuild status

### Part 2: Update Documentation
- Integrate refined validation table (v2)
- Update Science page language
- Update API spec
- Add model limitations sections
- Commit all doc changes

### Part 3: Deploy API
- Verify tests pass
- Push to Railway: `git push origin main`
- Monitor deployment
- Test production:
  - 50mph wind → 422 error ✓
  - Wind Surfer → ~450 yards ✓

### Part 4: Deploy Website
- Build if needed
- Deploy to Vercel/Netlify/Railway
- Verify all 8 pages live
- Check Science page has refined language

### Part 5: Logging
- Create DEPLOYMENT_LOG_2026-01-18.md
- Create PRODUCTION_CHANGES_SUMMARY.md
- Document everything done
- Report any issues

---

## 📋 Expected Deliverables

When Claude Code finishes:

**1. Deployment Log**
- What was deployed
- Test results
- Any issues encountered

**2. Production URLs**
- API: https://[your-app].railway.app
- Website: https://[your-site].[platform].app

**3. Verification Results**
- Professional API rejects 50mph wind ✓
- Gaming API Wind Surfer = ~450 yards ✓
- All website pages live ✓

**4. Change Summary**
- What changed from previous production
- Breaking changes (if any)
- Migration guide

---

## 🚨 Critical Changes in Production

### API Breaking Change

**Professional API now REJECTS winds >40mph:**

```json
// This will now fail:
POST /api/v1/calculate
{
  "conditions_override": {
    "wind_speed": 50  // ERROR: exceeds 40mph cap
  }
}

// Response: 422 Validation Error
```

**Migration:** Use Gaming API for extreme winds

### Website Major Updates

**Before:** Single-market site (Professional only)  
**After:** Dual-market site (Professional + Gaming)

**Changes:**
- Homepage: Dual paths
- New pages: Professional API, Gaming API, Science
- Game modes: 9 (was 10)
- Pricing: Dual tiers

---

## ✅ Validation Table Improvements

### What Changed (v1 → v2)

**Added:**
- Model Simplifications section
- Distance Definitions (carry vs total)
- Model Domain justification
- "What We Can Claim" guidelines

**Improved Language:**
```
OLD: "Tailwinds reduce both drag and lift"
NEW: "Tailwinds reduce relative airflow, which reduces dynamic 
      pressure and therefore reduces both drag and lift terms 
      (subject to CD/CL variation)"

OLD: "Expected Carry: 295-310 yards"
NEW: "Expected carry output (model, launch-approx validation): ~295-310 yd"

OLD: "Validated against TrackMan within ±5 yards"
NEW: "Benchmarked against published reference ranges"
```

**Widened Ranges:**
- Allow ±3-5 yards for coefficient variations
- More conservative precision claims
- Honest about model limitations

---

## 🎓 Key Refinements Based on Reviewer Feedback

### What We Fixed

1. **Tone:** Changed "confirmed" → "consistent with"
2. **Precision:** Changed exact numbers → model outputs
3. **Definitions:** Added carry vs total distance
4. **Domain:** Explained 40mph cap justification
5. **Claims:** Softened "validated" → "benchmarked"
6. **Ranges:** Widened to allow coefficient variation

### Why This Matters

**Before:**
- Could be challenged on precision claims
- Overstated validation status
- Didn't acknowledge limitations

**After:**
- Technically defensible
- Honest about simplifications
- Appropriate claims for MVP
- Can upgrade to stronger claims after calibration

---

## 🚀 Deployment Timeline

**Claude Code will work continuously through all tasks.**

**Estimated breakdown:**
1. Status check: Check git, builds
2. Documentation: Integrate v2, update specs
3. API deployment: Push, monitor, test
4. Website deployment: Deploy, verify
5. Logging: Create logs, summaries

**Total: Depends on what's already done**

**Claude Code has FULL AUTHORITY:**
- Won't wait for approval between steps
- Will push all commits
- Will deploy everything
- Only stops for actual blockers

---

## 📞 What to Do

### Step 1: Move Files
```
Copy to: C:\Users\Vtorr\OneDrive\GolfWeatherAPI\website build

Files:
1. professional_api_physics_validation_v2.md
2. production_deployment_prompt.txt
```

### Step 2: Give Prompt to Claude Code
```
Open Claude Code
Paste: production_deployment_prompt.txt
Let it run
```

### Step 3: Review Deliverables
```
Check:
- DEPLOYMENT_LOG_2026-01-18.md (shows what happened)
- Production URLs (API + Website)
- Test results (all passing)
```

---

## ⚠️ If Something Goes Wrong

**Claude Code will report:**
- What failed
- Error messages
- What needs manual intervention

**Common issues:**
- Railway deployment timeout → Check Railway dashboard
- Vercel build fails → Check build logs
- Tests fail in production → Review error details

**Claude Code will:**
- Stop at the failure
- Show you the error
- Wait for instructions

---

## ✨ After Production Deploy

**Immediate verification:**
1. Test Professional API: `curl -X POST [prod-url]/api/v1/calculate`
2. Test Gaming API: `curl -X POST [prod-url]/api/v1/gaming/trajectory`
3. Visit website: All 8 pages load correctly
4. Check Science page: Lift Paradox section present

**Monitor:**
1. Railway logs: No errors
2. Website analytics: Pages loading
3. API usage: Requests succeeding

**Next steps:**
1. Share with inRange (Professional API)
2. Share with Topgolf (Gaming API)
3. Schedule TrackMan calibration (v2.0)
4. Monitor real-world usage

---

## 📊 Summary of Changes

**API v2.0:**
- Professional: Pure physics, realistic caps
- Gaming: Extended ranges, smart capping
- 9 game modes (removed 2, added 1, renamed 1)

**Website v2.0:**
- Dual-market positioning
- 8 comprehensive pages
- Refined physics explanations

**Documentation v2.0:**
- Validation table with model limitations
- Technically precise language
- Honest about simplifications

**Status:**
- ✅ Physics correct
- ✅ Code ready
- ⏳ Pending push to production
- 🎯 Ready to ship

---

**Give the prompt to Claude Code and let it handle everything!**
