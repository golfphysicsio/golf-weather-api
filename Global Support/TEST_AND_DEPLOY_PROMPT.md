# PROMPT FOR CLAUDE CODE - Test and Deploy Global Support

**Give this to Claude Code after they finish implementing global support**

---

```
Great work on implementing global market support! Now let's test everything thoroughly before deploying to production.

---

## TASK: COMPREHENSIVE TESTING & DEPLOYMENT

Please run through these tests in order. If ALL tests pass, commit and deploy. If ANY test fails, fix it first.

---

## TEST SUITE 1: Automated Tests (REQUIRED)

### 1.1 Run Conversion Tests

```bash
cd /path/to/backend
pytest tests/test_conversions.py -v
```

**Expected:** All 36 tests passing

**If fails:** Debug and fix, then re-run

---

### 1.2 Run Full Test Suite

```bash
pytest -v
```

**Expected:** All tests passing

**If fails:** Report which tests failed and why

---

## TEST SUITE 2: API Endpoint Testing (REQUIRED)

### 2.1 Test Default Behavior (No Units Parameter)

```bash
# Test that existing API calls still work
curl "http://localhost:8000/api/weather?lat=33.7&lon=-84.4" \
  -H "X-API-Key: test_key_here"
```

**Verify:**
- [ ] Request succeeds (200 OK)
- [ ] Response includes both `fahrenheit` and `celsius`
- [ ] Response includes both `mph` and `kmh`
- [ ] Response includes both `yards` and `meters`

**Show me:** The JSON response

---

### 2.2 Test Explicit Imperial

```bash
curl "http://localhost:8000/api/weather?lat=33.7&lon=-84.4&units=imperial" \
  -H "X-API-Key: test_key_here"
```

**Verify:**
- [ ] Request succeeds (200 OK)
- [ ] Response identical to default (dual units)

---

### 2.3 Test Explicit Metric

```bash
curl "http://localhost:8000/api/weather?lat=33.7&lon=-84.4&units=metric" \
  -H "X-API-Key: test_key_here"
```

**Verify:**
- [ ] Request succeeds (200 OK)
- [ ] Response includes dual units

---

### 2.4 Test Invalid Units Parameter

```bash
curl "http://localhost:8000/api/weather?lat=33.7&lon=-84.4&units=invalid" \
  -H "X-API-Key: test_key_here"
```

**Verify:**
- [ ] Request fails (400 Bad Request)
- [ ] Error message mentions invalid units parameter
- [ ] Error is clear and helpful

**Show me:** The error response

---

### 2.5 Test Trajectory Endpoint

```bash
curl -X POST "http://localhost:8000/api/trajectory/calculate?units=metric" \
  -H "X-API-Key: test_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "location": {"lat": 33.7, "lon": -84.4},
    "shot": {
      "club": "7-iron",
      "ball_speed_mph": 95,
      "launch_angle": 18,
      "spin_rate": 6200
    },
    "baseline_carry_yards": 165
  }'
```

**Verify:**
- [ ] Request succeeds
- [ ] Response includes dual-unit distances
- [ ] Adjusted carry has both `yards` and `meters`

**Show me:** The response (at least the carry distances part)

---

## TEST SUITE 3: Admin Dashboard Testing (REQUIRED)

### 3.1 Start Development Server

```bash
cd golf-admin/admin-dashboard
npm run dev
```

**Verify:** Server starts on http://localhost:3000

---

### 3.2 Manual UI Testing

Open http://localhost:3000 in a browser and verify:

**Unit Toggle:**
- [ ] Unit toggle is visible in the header/navigation
- [ ] Toggle shows current preference (°F/yards or °C/meters)
- [ ] Clicking toggle switches display
- [ ] All temperature values update (Dashboard, Usage, Logs)
- [ ] All distance values update
- [ ] Preference persists after page refresh (check localStorage)

**Language Selector:**
- [ ] Language selector visible in header
- [ ] Shows "EN English" or similar
- [ ] Clicking shows dropdown (only English available)
- [ ] No missing translation keys (no "common.xyz" text visible)

**Functionality:**
- [ ] Dashboard loads without errors
- [ ] API Keys page works
- [ ] Usage page works
- [ ] Logs page works
- [ ] No console errors (check browser dev tools)

**Report:** Any issues you see

---

### 3.3 Check localStorage Persistence

In browser console:

```javascript
// Switch to metric, then run:
localStorage.getItem('preferred_units')
// Should return: "metric"

// Refresh page
// Verify display still shows metric

// Switch back to imperial
localStorage.getItem('preferred_units')
// Should return: "imperial"
```

**Verify:** Preference persists correctly

---

### 3.4 Check Translation Files

```bash
# Verify all translation files exist
ls -la golf-admin/admin-dashboard/src/locales/en/
```

**Expected files:**
- common.json
- dashboard.json
- api-keys.json
- usage.json
- logs.json
- system.json

**Verify:** All files exist and contain valid JSON

---

## TEST SUITE 4: Documentation Testing (REQUIRED)

### 4.1 Check Client Documentation

Open: http://localhost:8000/docs/client

**Verify:**
- [ ] "Units" section exists
- [ ] Documents the `units` parameter
- [ ] Shows dual-unit response examples
- [ ] Examples include both imperial and metric
- [ ] FAQ mentions metric support

**Report:** Any missing sections

---

### 4.2 Check Version Number

**Verify:**
- [ ] Version is 1.1.0 (or similar)
- [ ] Mentioned in documentation
- [ ] Updated in relevant files (package.json, etc.)

---

## TEST SUITE 5: Backwards Compatibility (CRITICAL)

### 5.1 Simulate Old Client

```bash
# Old client call (no units parameter)
curl "http://localhost:8000/api/weather?lat=33.7&lon=-84.4" \
  -H "X-API-Key: test_key_here"
```

**Verify:**
- [ ] Works without error
- [ ] Response structure unchanged (no breaking changes)
- [ ] Old clients get bonus dual-unit data
- [ ] No migration required for existing clients

---

## DECISION POINT: DEPLOY OR FIX

### If ALL Tests Above Pass ✅

Proceed to deployment (instructions below)

### If ANY Test Fails ❌

**STOP - Do Not Deploy**

Instead:
1. Report which test failed and why
2. Fix the issue
3. Re-run ALL tests
4. Only deploy when everything passes

---

## DEPLOYMENT PROCESS (Only if all tests pass)

### Step 1: Build Admin Dashboard for Production

```bash
cd golf-admin/admin-dashboard
npm run build
```

**Verify:** Build completes without errors

---

### Step 2: Copy Built Files

```bash
# Copy dist to the location Railway serves from
# (Adjust path based on your FastAPI static file setup)
cp -r dist /path/to/admin-dashboard-dist
```

---

### Step 3: Commit Changes

```bash
cd /path/to/project/root

# Check what changed
git status

# Add all changes
git add .

# Commit with descriptive message
git commit -m "feat: Add global market support v1.1.0

- Add dual-unit support (returns both imperial and metric)
- Add units query parameter (imperial/metric/invalid validation)
- Create comprehensive conversion utilities (temp, distance, speed, pressure)
- Add unit toggle to admin dashboard with localStorage persistence
- Setup i18n infrastructure with react-i18next (English only)
- Add 36 conversion tests (all passing)
- Update client documentation with units examples
- Maintain backwards compatibility (defaults to imperial)

Breaking changes: None
New features: Multi-unit API responses, admin unit toggle, i18n framework
Tests: 36/36 passing"
```

**Verify:** Commit succeeds

---

### Step 4: Push to GitHub

```bash
git push origin main
```

**Verify:** Push succeeds

---

### Step 5: Verify Railway Auto-Deploy

1. Check Railway dashboard
2. Verify new deployment started
3. Wait for deployment to complete
4. Check deployment logs for errors

**If deployment fails:** Report the error

---

### Step 6: Test Production Endpoints

After Railway deployment completes:

```bash
# Test production API
curl "https://api.golfphysics.io/weather?lat=33.7&lon=-84.4" \
  -H "X-API-Key: real_api_key_here"
```

**Verify:**
- [ ] Production endpoint works
- [ ] Returns dual-unit response
- [ ] No errors in Railway logs

---

### Step 7: Test Production Admin Dashboard

1. Open: https://api.golfphysics.io/admin
2. Login with Google
3. Verify unit toggle works
4. Verify language selector shows
5. Test all pages (Dashboard, API Keys, Usage, Logs)

**Verify:** Everything works in production

---

### Step 8: Monitor for 15 Minutes

After deployment:

1. Watch Railway logs for errors
2. Check error rates in monitoring
3. Verify no spike in failed requests
4. Test a few more API calls

**If issues arise:** Report immediately

---

## FINAL REPORT

When complete, provide me with:

### Test Results Summary

```
AUTOMATED TESTS:
✅ Conversion tests: 36/36 passing
✅ Full test suite: X/X passing

API ENDPOINT TESTS:
✅ Default behavior (no units param)
✅ Explicit imperial
✅ Explicit metric
✅ Invalid units (proper error)
✅ Trajectory endpoint

ADMIN DASHBOARD TESTS:
✅ Unit toggle visible and functional
✅ Preference persists
✅ Language selector visible
✅ No console errors
✅ All pages working

DOCUMENTATION:
✅ Units section present
✅ Examples include dual units
✅ Version updated to 1.1.0

BACKWARDS COMPATIBILITY:
✅ Old API calls work unchanged
✅ No breaking changes

DEPLOYMENT:
✅ Built successfully
✅ Committed and pushed
✅ Railway deployed
✅ Production tested
✅ No errors in logs
```

### Production URLs

- API: https://api.golfphysics.io/weather?lat=33.7&lon=-84.4
- Admin: https://api.golfphysics.io/admin
- Docs: https://api.golfphysics.io/docs/client

### Issues Found (if any)

[Report any issues or unexpected behavior]

### Recommendation

[Ready for Phase 3 (Website Build) / Needs fixes before proceeding]

---

## IMPORTANT NOTES

- **Don't deploy if tests fail** - Fix issues first
- **Take your time** - Thorough testing prevents production issues  
- **Document any issues** - Even if you fix them, tell me what happened
- **Test production thoroughly** - Don't assume Railway deployment worked
- **Monitor logs** - Watch for errors after deployment

---

## IF SOMETHING GOES WRONG

If you encounter issues during testing or deployment:

1. **Stop immediately**
2. **Don't push broken code**
3. **Report the issue** with:
   - What test failed
   - Error messages
   - Relevant logs
   - What you tried
4. **Wait for guidance** before proceeding

---

Start testing now. Take your time and be thorough. Report results after each major section.

Good luck! 🚀
```
