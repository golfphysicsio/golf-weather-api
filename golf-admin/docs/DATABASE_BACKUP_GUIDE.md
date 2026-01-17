# Database Backup & Restore Guide

## Overview

This guide covers how to backup and restore the Golf Physics API PostgreSQL database hosted on Railway.

## Quick Start

### Create a Backup

```bash
# Set your database URL
export DATABASE_URL="postgresql://user:password@host:port/database"

# Run backup
python scripts/backup_database.py
```

Backup files are saved to `scripts/backups/` with timestamp filenames like:
- `golf_physics_backup_20260117_153000.sql`

### Restore from Backup

```bash
# List available backups
python scripts/restore_database.py --list

# Restore from a specific backup
python scripts/restore_database.py golf_physics_backup_20260117_153000.sql
```

## Backup Contents

Each backup includes:
- **Schema**: Table definitions, column types, constraints
- **Indexes**: All custom indexes
- **Functions**: Stored procedures (cleanup, aggregation)
- **Views**: Database views
- **Data**: All rows from all tables

## Scheduling Automated Backups

### Option 1: GitHub Actions (Recommended - Free)

Create `.github/workflows/backup.yml`:

```yaml
name: Database Backup

on:
  schedule:
    # Run daily at 3 AM UTC
    - cron: '0 3 * * *'
  workflow_dispatch:  # Allow manual trigger

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: pip install asyncpg

      - name: Run backup
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: python golf-admin/scripts/backup_database.py

      - name: Upload backup artifact
        uses: actions/upload-artifact@v4
        with:
          name: database-backup-${{ github.run_number }}
          path: golf-admin/scripts/backups/*.sql
          retention-days: 30
```

**Setup Steps:**
1. Go to your GitHub repository Settings > Secrets and variables > Actions
2. Add a new secret: `DATABASE_URL` = your Railway PostgreSQL connection string
3. The backup will run daily and store backups as GitHub artifacts

### Option 2: Cron-job.org (Free External Scheduler)

1. Sign up at https://cron-job.org (free tier: 1 cron job)
2. Create a new cron job:
   - URL: `https://api.golfphysics.io/admin-api/trigger-backup`
   - Schedule: Daily at 3 AM
   - Method: POST
   - Headers: `Authorization: Bearer <your-backup-secret>`

3. Add the backup trigger endpoint to your FastAPI app (see below)

### Option 3: Railway Cron (If Available)

Railway may offer cron functionality in their Pro plan:
1. Check Railway dashboard for "Cron" or "Scheduled Tasks"
2. Configure to run: `python golf-admin/scripts/backup_database.py`
3. Schedule: `0 3 * * *` (daily at 3 AM)

## Manual Backup via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Connect to your project
railway link

# Run backup command
railway run python golf-admin/scripts/backup_database.py
```

## Backup Storage Recommendations

1. **Local backups**: Keep in `scripts/backups/` (gitignored)
2. **Cloud storage**: Upload to S3, Google Cloud Storage, or similar
3. **Retention**: Keep last 7 daily backups, 4 weekly, 12 monthly

## Restore Procedure

### Full Restore (Destructive)

```bash
# 1. Stop the application (optional but recommended)
# 2. Restore from backup
python scripts/restore_database.py golf_physics_backup_20260117_153000.sql
# 3. Restart the application
```

### Partial Restore (Specific Tables)

1. Open the backup SQL file
2. Find the relevant INSERT statements
3. Execute them manually via:
   ```bash
   railway run psql -c "INSERT INTO..."
   ```

## Troubleshooting

### "DATABASE_URL not set"
Ensure the environment variable is exported:
```bash
export DATABASE_URL="your-connection-string"
```

### "Connection refused"
- Check if database is running
- Verify connection string format
- Check Railway dashboard for database status

### "Permission denied"
- Ensure database user has SELECT privileges on all tables
- For restore: user needs INSERT, UPDATE, DELETE privileges

## Security Notes

- Never commit backup files to git (they contain sensitive data)
- Store DATABASE_URL in environment variables or secrets
- Encrypt backups if storing in cloud storage
- Limit access to backup files

## Backup File Locations

| Location | Purpose |
|----------|---------|
| `scripts/backups/` | Local backup storage |
| GitHub Artifacts | Cloud backup storage (30 days) |
| Manual download | Long-term archival |
