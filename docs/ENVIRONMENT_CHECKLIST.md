# Environment Deployment Checklist

Use this checklist when deploying changes.

## URLs Reference

### Production (Customer-Facing)
- Website: https://www.golfphysics.io
- API: https://api.golfphysics.io
- Docs: https://api.golfphysics.io/docs
- **Never show Railway URLs to customers**

### Staging (Internal Only)
- API: https://staging.golfphysics.io
- Docs: https://staging.golfphysics.io/docs
- Railway: golf-weather-api-staging.up.railway.app (if DNS not set up)

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
- [ ] All examples use production URLs

## Rollback Plan

If production has issues:
1. Check Railway deployment logs
2. Rollback via Railway dashboard
3. Notify users if needed
4. Fix in staging first, then redeploy
