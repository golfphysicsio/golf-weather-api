# Database Maintenance Guide

## Overview

This guide covers database maintenance procedures for the Golf Physics API PostgreSQL database hosted on Railway.

## Database Schema

### Tables

| Table | Purpose | Retention |
|-------|---------|-----------|
| `admin_api_keys` | API key storage and metadata | Permanent |
| `admin_request_logs` | Request logging for analytics | 48 hours |
| `admin_daily_usage` | Aggregated daily statistics | Permanent |

### Indexes

The following indexes are configured for optimal query performance:

```sql
-- API Keys
idx_admin_api_keys_hash      -- Fast key lookup during authentication
idx_admin_api_keys_status    -- Filter by active/disabled/revoked
idx_admin_api_keys_client    -- Search by client name

-- Request Logs
idx_admin_request_logs_created       -- Time-based queries
idx_admin_request_logs_api_key       -- Filter by API key
idx_admin_request_logs_client        -- Filter by client
idx_admin_request_logs_status        -- Filter by status code
idx_admin_request_logs_endpoint      -- Filter by endpoint
idx_admin_request_logs_client_date   -- Composite for common queries

-- Daily Usage
idx_admin_daily_usage_date    -- Time-based queries
idx_admin_daily_usage_client  -- Filter by client
```

## Automatic Maintenance

### Log Cleanup (48-hour retention)

Logs older than 48 hours are automatically cleaned up when:
1. Admin dashboard health check is called (on every login)
2. Manual cleanup is triggered from System tab

**Function:** `cleanup_old_request_logs()`

### Daily Usage Aggregation

Daily statistics are aggregated from request logs.

**Function:** `aggregate_daily_usage(date)`

## Manual Maintenance

### Via Admin Dashboard

1. Go to https://api.golfphysics.io/admin
2. Click on "System" tab
3. Use the maintenance buttons:
   - **Cleanup Old Logs** - Remove logs > 48 hours
   - **Aggregate Daily Usage** - Compile today's stats

### Via API

```bash
# Cleanup old logs (requires Google OAuth token)
curl -X POST https://api.golfphysics.io/admin-api/system/cleanup \
  -H "Authorization: Bearer <google-token>"

# Aggregate daily usage
curl -X POST "https://api.golfphysics.io/admin-api/system/aggregate-usage?date=2026-01-17" \
  -H "Authorization: Bearer <google-token>"
```

### Via Railway Console

```bash
# Connect to database
railway run psql

# Run cleanup manually
SELECT cleanup_old_request_logs();

# Aggregate usage for specific date
SELECT aggregate_daily_usage('2026-01-17');

# Reset daily counters (run at midnight)
SELECT reset_daily_counters();
```

## Monitoring Database Health

### Check Database Size

```sql
-- Total database size
SELECT pg_size_pretty(pg_database_size(current_database()));

-- Table sizes
SELECT
    relname as table_name,
    pg_size_pretty(pg_total_relation_size(relid)) as total_size,
    n_live_tup as row_count
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(relid) DESC;
```

### Check Index Usage

```sql
-- Index usage statistics
SELECT
    indexrelname as index_name,
    idx_scan as times_used,
    pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### Check Slow Queries

```sql
-- Enable query logging (if needed)
ALTER SYSTEM SET log_min_duration_statement = 1000; -- Log queries > 1 second
SELECT pg_reload_conf();

-- Check for long-running queries
SELECT
    pid,
    now() - pg_stat_activity.query_start AS duration,
    query
FROM pg_stat_activity
WHERE state != 'idle'
AND now() - pg_stat_activity.query_start > interval '5 seconds';
```

## Optimization Tips

### When to VACUUM

PostgreSQL auto-vacuums, but you can trigger manually if needed:

```sql
-- Analyze and vacuum all tables
VACUUM ANALYZE;

-- Vacuum specific table
VACUUM ANALYZE admin_request_logs;
```

### When to Reindex

If query performance degrades significantly:

```sql
-- Reindex specific table
REINDEX TABLE admin_request_logs;

-- Reindex entire database (use with caution)
REINDEX DATABASE railway;
```

## Scaling Considerations

### Current Limits

| Metric | Limit | Current |
|--------|-------|---------|
| Database Size | Railway limit | Check dashboard |
| Request Logs | 48 hours | Auto-cleaned |
| API Keys | Unlimited | Check dashboard |

### If Database Grows Too Large

1. **Reduce log retention** (modify cleanup function)
2. **Archive old daily usage** data
3. **Upgrade Railway plan** if needed

### If Queries Are Slow

1. Check index usage (see above)
2. Add missing indexes if needed
3. Optimize slow queries
4. Consider connection pooling

## Backup Schedule

See `DATABASE_BACKUP_GUIDE.md` for backup procedures.

Recommended schedule:
- **Daily:** Automated backup via GitHub Actions
- **Weekly:** Download and archive backup locally
- **Monthly:** Test restore procedure

## Troubleshooting

### "Connection refused"

1. Check Railway dashboard for database status
2. Verify DATABASE_URL is correct
3. Check for Railway platform incidents

### "Too many connections"

1. Check for connection leaks in code
2. Reduce connection pool size
3. Enable connection pooling (PgBouncer)

### "Out of disk space"

1. Run cleanup immediately
2. Delete old backups
3. Upgrade Railway storage

## Maintenance Schedule

| Task | Frequency | Method |
|------|-----------|--------|
| Log cleanup | Automatic | Every admin login |
| Usage aggregation | Daily | Manual or scheduled |
| VACUUM ANALYZE | Weekly | Automatic (PostgreSQL) |
| Backup verification | Monthly | Manual |
| Index review | Quarterly | Manual |
| Full maintenance | Annually | Manual |

## Contact

For database issues: golfphysicsio@gmail.com
Railway support: https://railway.app/help
