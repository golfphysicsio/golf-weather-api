# Monitoring & Alerts Setup Guide

## Overview

This guide covers how to set up monitoring and alerting for the Golf Physics API.

## Built-in Monitoring

The admin dashboard includes a **System Health** tab that provides:

- Real-time error rate monitoring
- Database statistics
- Request metrics (24h and 1h)
- Table sizes and row counts
- Recent errors list
- Maintenance actions (cleanup, aggregation)

Access it at: https://api.golfphysics.io/admin → System tab

## External Monitoring Setup

### Option 1: UptimeRobot (Recommended - Free)

UptimeRobot provides free uptime monitoring with email/SMS alerts.

**Setup Steps:**

1. Go to https://uptimerobot.com and create a free account
2. Click "Add New Monitor"
3. Create two monitors:

**Monitor 1: API Health**
- Monitor Type: HTTP(s)
- Friendly Name: Golf Physics API
- URL: `https://api.golfphysics.io/api/v1/health`
- Monitoring Interval: 5 minutes
- Alert Contacts: Add your email

**Monitor 2: Admin Dashboard**
- Monitor Type: HTTP(s)
- Friendly Name: Golf Physics Admin
- URL: `https://api.golfphysics.io/admin`
- Monitoring Interval: 5 minutes
- Alert Contacts: Add your email

4. Configure alert contacts:
   - Email: golfphysicsio@gmail.com
   - Optional: Add SMS alerts (paid feature)

### Option 2: Better Uptime (Alternative)

Better Uptime offers a generous free tier with more features.

1. Go to https://betteruptime.com
2. Create monitors for the same endpoints
3. Set up incident management and status page

### Option 3: Cronitor (For Cron Jobs)

If you set up scheduled backups or maintenance tasks:

1. Go to https://cronitor.io
2. Create monitors for your cron jobs
3. Get alerts if scheduled tasks fail

## Email Alerts Configuration

### Using SendGrid (Recommended)

1. Sign up at https://sendgrid.com (free tier: 100 emails/day)
2. Create an API key
3. Add to Railway environment variables:
   ```
   SENDGRID_API_KEY=your-api-key
   ALERT_EMAIL=golfphysicsio@gmail.com
   ```

### Using Mailgun (Alternative)

1. Sign up at https://mailgun.com
2. Verify your domain or use sandbox
3. Add to Railway environment variables:
   ```
   MAILGUN_API_KEY=your-api-key
   MAILGUN_DOMAIN=your-domain
   ALERT_EMAIL=golfphysicsio@gmail.com
   ```

## Alert Thresholds

The system monitors these thresholds:

| Metric | Warning | Critical |
|--------|---------|----------|
| Error Rate (1h) | > 5% | > 10% |
| Avg Latency | > 500ms | > 1000ms |
| Database Size | > 500MB | > 1GB |

## Checking System Health

### Via Admin Dashboard

1. Go to https://api.golfphysics.io/admin
2. Click on "System" tab
3. Review:
   - Error rate (should be < 5%)
   - Avg latency (should be < 200ms)
   - Recent errors
   - Database size

### Via API

```bash
# Health check
curl https://api.golfphysics.io/api/v1/health

# System stats (requires auth)
curl https://api.golfphysics.io/admin-api/system/stats \
  -H "Authorization: Bearer <google-token>"

# Error rate details
curl https://api.golfphysics.io/admin-api/system/error-rate?hours=1 \
  -H "Authorization: Bearer <google-token>"
```

## Incident Response

### High Error Rate Alert

1. Check the System tab for recent errors
2. Look at the Logs tab for patterns
3. Check Railway logs for application errors
4. If database-related, check PostgreSQL metrics

### API Down Alert

1. Check Railway dashboard for deployment status
2. Check PostgreSQL and Redis status
3. Look at recent deployments for breaking changes
4. Check for Railway platform incidents

### Slow Response Alert

1. Check database query performance
2. Look for traffic spikes
3. Review recent code changes
4. Consider scaling if needed

## Status Page (Optional)

Consider setting up a public status page:

1. **Atlassian Statuspage** (paid)
2. **Instatus** (free tier available)
3. **Better Uptime Status Page** (free)

This allows customers to check API status without contacting support.

## Recommended Monitoring Schedule

| Check | Frequency | Tool |
|-------|-----------|------|
| Uptime | Every 5 min | UptimeRobot |
| Error Rate | Hourly | Admin Dashboard |
| Database Size | Daily | Admin Dashboard |
| Backups | Daily | GitHub Actions |
| Security Audit | Monthly | Manual review |
