#!/usr/bin/env python3
"""
Golf Physics API - Database Restore Script

This script restores the PostgreSQL database from a backup file.

WARNING: This will DELETE existing data before restoring!

Usage:
    python restore_database.py <backup_file.sql>
    python restore_database.py --list  # List available backups

Environment Variables Required:
    DATABASE_URL - PostgreSQL connection string
"""

import os
import sys
import asyncio
from datetime import datetime
from pathlib import Path
import asyncpg

# Backup directory
BACKUP_DIR = Path(__file__).parent / "backups"


def list_backups():
    """List all available backup files."""
    if not BACKUP_DIR.exists():
        print("No backups directory found.")
        return

    backups = sorted(BACKUP_DIR.glob("*.sql"), reverse=True)
    if not backups:
        print("No backup files found.")
        return

    print("Available backups:")
    print("-" * 60)
    for backup in backups:
        size = backup.stat().st_size
        mtime = datetime.fromtimestamp(backup.stat().st_mtime)
        print(f"  {backup.name}")
        print(f"    Size: {size:,} bytes")
        print(f"    Date: {mtime.strftime('%Y-%m-%d %H:%M:%S')}")
        print()


async def restore_database(backup_file: str):
    """Restore database from a backup file."""
    backup_path = Path(backup_file)
    if not backup_path.exists():
        # Try looking in backups directory
        backup_path = BACKUP_DIR / backup_file
        if not backup_path.exists():
            print(f"ERROR: Backup file not found: {backup_file}")
            sys.exit(1)

    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        print("ERROR: DATABASE_URL environment variable not set")
        sys.exit(1)

    # Fix URL format if needed
    if database_url.startswith("postgresql+asyncpg://"):
        database_url = database_url.replace("postgresql+asyncpg://", "postgresql://")

    print(f"Restore from: {backup_path}")
    print(f"Started at: {datetime.now().isoformat()}")
    print()

    # Confirm restore
    print("WARNING: This will modify the database!")
    print("Press Ctrl+C to cancel, or wait 5 seconds to continue...")
    try:
        await asyncio.sleep(5)
    except KeyboardInterrupt:
        print("\nRestore cancelled.")
        sys.exit(0)

    try:
        conn = await asyncpg.connect(database_url)

        # Read backup file
        with open(backup_path, "r", encoding="utf-8") as f:
            sql_content = f.read()

        # Split into statements (simple approach)
        statements = []
        current_stmt = []
        in_function = False

        for line in sql_content.split("\n"):
            stripped = line.strip()

            # Skip comments and empty lines
            if stripped.startswith("--") or not stripped:
                continue

            # Track function blocks
            if "CREATE OR REPLACE FUNCTION" in line or "CREATE FUNCTION" in line:
                in_function = True
            if in_function and "$$ LANGUAGE" in line:
                in_function = False

            current_stmt.append(line)

            # End of statement (but not inside function)
            if stripped.endswith(";") and not in_function:
                stmt = "\n".join(current_stmt).strip()
                if stmt and not stmt.startswith("--"):
                    statements.append(stmt)
                current_stmt = []

        print(f"Found {len(statements)} SQL statements to execute")
        print()

        # Execute statements
        success_count = 0
        error_count = 0

        for i, stmt in enumerate(statements):
            try:
                # Skip if it's just a comment
                if stmt.strip().startswith("--"):
                    continue

                await conn.execute(stmt)
                success_count += 1

                # Progress indicator
                if (i + 1) % 100 == 0:
                    print(f"  Processed {i + 1}/{len(statements)} statements...")

            except Exception as e:
                error_count += 1
                # Only show first few errors
                if error_count <= 5:
                    print(f"  Warning: {str(e)[:100]}")

        await conn.close()

        print()
        print("Restore completed!")
        print(f"  Successful: {success_count}")
        print(f"  Errors: {error_count} (may be expected for existing objects)")
        print(f"  Completed at: {datetime.now().isoformat()}")

    except Exception as e:
        print(f"ERROR: Restore failed - {e}")
        sys.exit(1)


def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python restore_database.py <backup_file.sql>")
        print("  python restore_database.py --list")
        sys.exit(1)

    if sys.argv[1] == "--list":
        list_backups()
    else:
        asyncio.run(restore_database(sys.argv[1]))


if __name__ == "__main__":
    main()
