# Golf Physics API - Operational Runbook

## Quick Reference

| Resource | URL |
|----------|-----|
| API Base | https://api.golfphysics.io |
| Admin Dashboard | https://api.golfphysics.io/admin |
| Client Docs | https://api.golfphysics.io/docs/client |
| Health Check | https://api.golfphysics.io/api/v1/health |
| Railway Dashboard | https://railway.app/dashboard |

---

## Daily Operations

### Morning Checklist

1. **Check API Health**
   ```bash
   curl https://api.golfphysics.io/api/v1/health
   ```
   Expected: `{"status": "healthy", ...}`

2. **Review Error Rate**
   - Go to https://api.golfphysics.io/admin
   - Click "System" tab
   - Check error rate < 5%

3. **Check UptimeRobot** (if configured)
   - Verify no incidents overnight
   - Review response time trends

### What to Look For

- Error rate > 5% → Investigate immediately
- Avg latency > 500ms → Check database performance
- Database size growing rapidly → Run cleanup
- Failed login attempts → Check for attacks

---

## Common Tasks

### Create API Key for New Client

1. Go to https://api.golfphysics.io/admin
2. Click "API Keys" tab
3. Click "+ Create New Key"
4. Fill in:
   - Client Name: Company name
   - Tier: Free/Standard/Enterprise
   - Notes: Contact info, use case
5. Click "Create Key"
6. **IMPORTANT:** Copy the key immediately (shown only once)
7. Send key to client securely

### Upgrade Client Tier

1. Go to Admin Dashboard → API Keys
2. Find the client in the list
3. Use the Tier dropdown to change tier
4. Change takes effect immediately

### Disable/Enable API Key

1. Go to Admin Dashboard → API Keys
2. Find the client
3. Click "Disable" to temporarily suspend
4. Click "Enable" to reactivate

### Revoke API Key (Permanent)

1. Go to Admin Dashboard → API Keys
2. Find the client
3. Click "Revoke"
4. Confirm the action
5. Create new key if client needs access

### View Client Usage

1. Go to Admin Dashboard → Usage
2. Select time period (7/30/60/90 days)
3. Filter by client if needed
4. Click "Export CSV" for detailed data

### Investigate Error Spikes

1. Go to Admin Dashboard → System
2. Check "Recent Errors" section
3. Note the endpoints and error codes
4. Go to Logs tab for detailed view
5. Filter by status code (4xx or 5xx)
6. Check Railway logs for application errors:
   ```bash
   railway logs
   ```

---

## Troubleshooting Guide

### Client: "API key not working"

**Symptoms:** 401 INVALID_API_KEY error

**Resolution:**
1. Ask client to confirm the exact key they're using
2. Check Admin Dashboard → API Keys
3. Verify the key exists and status is "active"
4. If key is missing, it may have been revoked
5. Create new key if needed

### Client: "Getting rate limited"

**Symptoms:** 429 RATE_LIMITED error

**Resolution:**
1. Check client's current tier in API Keys
2. View their usage in Usage tab
3. Options:
   - Upgrade their tier
   - Ask them to implement backoff
   - Optimize their integration

### Client: "Slow API responses"

**Symptoms:** Response time > 1 second

**Resolution:**
1. Check System tab for avg latency
2. Check Railway dashboard for resource usage
3. Check database size and performance
4. If database issue:
   ```bash
   railway run psql -c "VACUUM ANALYZE;"
   ```

### Admin: "Can't log in to dashboard"

**Symptoms:** Google login fails

**Resolution:**
1. Clear browser cookies for the domain
2. Try incognito/private window
3. Verify Google OAuth is configured:
   - Check Google Cloud Console
   - Verify authorized origins include api.golfphysics.io
4. Check Railway logs for auth errors

### System: "Database connection errors"

**Symptoms:** 503 errors, "Database not available"

**Resolution:**
1. Check Railway dashboard for PostgreSQL status
2. Check for Railway platform incidents
3. Try restarting the service:
   ```bash
   railway up
   ```
4. If persistent, contact Railway support

### System: "High error rate"

**Symptoms:** Error rate > 10%

**Resolution:**
1. Check System tab for recent errors
2. Identify pattern (specific endpoint? specific client?)
3. Check Logs tab for error messages
4. Check Railway logs:
   ```bash
   railway logs --tail 100
   ```
5. If code issue, rollback deployment

---

## Emergency Procedures

### API is Down

**Immediate Actions:**
1. Check https://api.golfphysics.io/api/v1/health
2. Check Railway dashboard for service status
3. Check Railway status page: https://status.railway.app
4. Check recent deployments for breaking changes

**If Railway Issue:**
- Wait for platform recovery
- Contact Railway support if prolonged

**If Code Issue:**
1. Identify the breaking commit:
   ```bash
   git log --oneline -10
   ```
2. Rollback to previous commit:
   ```bash
   git revert HEAD
   git push origin main
   ```
3. Railway will auto-deploy

### Database Unresponsive

**Immediate Actions:**
1. Check Railway PostgreSQL status
2. Check for connection limit issues:
   ```bash
   railway run psql -c "SELECT count(*) FROM pg_stat_activity;"
   ```
3. If too many connections, restart service

**Recovery:**
1. If data is corrupted, restore from backup:
   ```bash
   python golf-admin/scripts/restore_database.py --list
   python golf-admin/scripts/restore_database.py <backup-file>
   ```

### Security Incident

**If API Key Compromised:**
1. Immediately disable the key in Admin Dashboard
2. Create new key for legitimate client
3. Review logs for unauthorized usage
4. Document the incident

**If Admin Account Compromised:**
1. Change Google account password immediately
2. Enable 2FA if not enabled
3. Review recent admin actions in logs
4. Revoke any suspicious API keys

**If Data Breach Suspected:**
1. Document what you know
2. Preserve logs (don't delete anything)
3. Contact legal/compliance if applicable
4. Consider rotating all API keys

### Rollback Deployment

**Method 1: Git Revert (Recommended)**
```bash
# Revert last commit
git revert HEAD --no-edit
git push origin main
# Railway auto-deploys
```

**Method 2: Deploy Previous Commit**
```bash
# Find previous good commit
git log --oneline -10

# Reset to that commit
git reset --hard <commit-hash>
git push --force origin main
# WARNING: This rewrites history
```

**Method 3: Railway Rollback**
1. Go to Railway dashboard
2. Click on Deployments
3. Find previous successful deployment
4. Click "Rollback to this deployment"

---

## Generating Monthly Reports

### Usage Report

1. Go to Admin Dashboard → Usage
2. Set date range to last month
3. Click "Export CSV"
4. Open in Excel/Google Sheets
5. Create summary:
   - Total requests per client
   - Error rate per client
   - Peak usage times

### Invoice Generation

Based on usage data:
1. Export usage CSV for the month
2. Calculate requests per client
3. Apply pricing tier rates
4. Generate invoice in your accounting system

---

## Contact Information

### Internal

| Contact | Purpose |
|---------|---------|
| golfphysicsio@gmail.com | Admin notifications |

### External Support

| Service | Contact |
|---------|---------|
| Railway | https://railway.app/help |
| Google Cloud | https://console.cloud.google.com/support |
| Domain (if applicable) | Your registrar support |

---

## Appendix: Useful Commands

### Railway CLI

```bash
# View logs
railway logs

# Run command in production environment
railway run <command>

# Connect to database
railway run psql

# Deploy current code
railway up

# View environment variables
railway variables
```

### Git Commands

```bash
# View recent commits
git log --oneline -10

# Revert last commit
git revert HEAD

# View changes since last deploy
git diff HEAD~1
```

### Database Commands

```bash
# Connect to database
railway run psql

# Check table sizes
SELECT relname, pg_size_pretty(pg_total_relation_size(relid))
FROM pg_stat_user_tables ORDER BY pg_total_relation_size(relid) DESC;

# Run cleanup
SELECT cleanup_old_request_logs();

# Check active connections
SELECT count(*) FROM pg_stat_activity;
```

---

## Document History

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-17 | Claude | Initial creation |
