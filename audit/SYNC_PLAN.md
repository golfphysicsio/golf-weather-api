# Staging - Production Sync Plan

**Railway Project:** soothing-happiness
**Generated:** 2026-01-18

---

## Understanding Your Setup

**Important:** Staging and production use the SAME codebase from git.

```
git main branch
    |
    +---> Railway staging environment
    +---> Railway production environment
```

Both deploy automatically on push to main.

---

## What SHOULD Be Different

**Environment Variables:**
- BACKEND_URL (staging vs production URL)
- FRONTEND_URL (staging vs production URL)
- ENVIRONMENT (staging vs production)
- DATABASE_URL (separate databases)
- REDIS_URL (separate instances)
- LOG_LEVEL (DEBUG vs INFO)
- CORS_ORIGINS (appropriate domains)

**Database Data:**
- Staging: Test data, can be wiped
- Production: Real customer data, protected

---

## What Should Be IDENTICAL

**Code:**
- Same git commit
- Same requirements.txt
- Same website-dist/ files
- Same admin-dashboard-dist/ files

**API Behavior:**
- Same physics results
- Same validation rules
- Same endpoints
- Same error handling

---

## If Environments Are Out of Sync

### Scenario 1: Variables Missing

**Problem:** Production missing an environment variable
**Fix:**
```bash
railway variables set VARIABLE_NAME=value --environment production
```

### Scenario 2: Different Code Versions

**Problem:** Staging has newer commits than production
**Fix:** Railway auto-deploys both on push to main - just wait for deployment

**Or force redeploy:**
```bash
railway up --force --environment production
```

### Scenario 3: API Results Differ

**Problem:** Same request gives different results
**Cause:** Different code OR different environment variables
**Fix:**
1. Check both deployed same commit via health endpoint version
2. Verify DATABASE_URL points to correct database
3. Check ENVIRONMENT variable is set correctly

---

## Your Workflow (Going Forward)

### Development:
```bash
# Work locally
# Test changes

# Commit to main
git add .
git commit -m "Add feature"
git push origin main

# Both environments auto-deploy!
```

### Testing:
```bash
# Test on staging first
curl https://golf-weather-api-staging.up.railway.app/api/v1/health

# If staging works, production should also work
# (same code, just different URLs)
```

### Monitoring:
```bash
# Watch staging logs
railway logs --environment staging

# Watch production logs
railway logs --environment production
```

---

## Quick Sync Check

Create this script: `check_envs.sh`

```bash
#!/bin/bash

STAGING="https://golf-weather-api-staging.up.railway.app"
PROD="https://golf-weather-api-production.up.railway.app"

echo "=== Environment Sync Check ==="
echo ""

# Check versions
STAGING_HEALTH=$(curl -s $STAGING/api/v1/health)
PROD_HEALTH=$(curl -s $PROD/api/v1/health)

STAGING_VER=$(echo $STAGING_HEALTH | jq -r '.checks.version')
PROD_VER=$(echo $PROD_HEALTH | jq -r '.checks.version')

STAGING_ENV=$(echo $STAGING_HEALTH | jq -r '.checks.environment')
PROD_ENV=$(echo $PROD_HEALTH | jq -r '.checks.environment')

echo "Staging:"
echo "  Version: $STAGING_VER"
echo "  Environment: $STAGING_ENV"
echo ""
echo "Production:"
echo "  Version: $PROD_VER"
echo "  Environment: $PROD_ENV"
echo ""

if [ "$STAGING_VER" = "$PROD_VER" ]; then
    echo "VERSIONS MATCH"
else
    echo "WARNING: Version mismatch!"
    echo "  Staging: $STAGING_VER"
    echo "  Production: $PROD_VER"
fi
```

Run before deploying changes to verify environments are aligned.

---

## Environment Variable Reference

### Staging
```
ENVIRONMENT=staging
BACKEND_URL=https://golf-weather-api-staging.up.railway.app
FRONTEND_URL=https://golf-weather-api-staging.up.railway.app
LOG_LEVEL=DEBUG
```

### Production
```
ENVIRONMENT=production
BACKEND_URL=https://golf-weather-api-production.up.railway.app
FRONTEND_URL=https://golfphysics.io
LOG_LEVEL=INFO
```

---

## Files Created by Audit

1. `RAILWAY_ENVIRONMENT_AUDIT_2026-01-18.md` - Complete detailed audit
2. `SYNC_PLAN.md` - This sync guide

---

## Next Steps

1. Review the audit report for any issues
2. Use the quick sync check script regularly
3. Run this audit after major deployments
