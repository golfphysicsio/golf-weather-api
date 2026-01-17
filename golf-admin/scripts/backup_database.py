#!/usr/bin/env python3
"""
Golf Physics API - Database Backup Script

This script creates a backup of the PostgreSQL database including:
- Schema (tables, indexes, functions, views)
- Data (all rows from all tables)

Usage:
    python backup_database.py

Environment Variables Required:
    DATABASE_URL - PostgreSQL connection string

Output:
    Creates a timestamped SQL file in the backups/ directory
"""

import os
import sys
import asyncio
from datetime import datetime
from pathlib import Path
import asyncpg

# Backup directory
BACKUP_DIR = Path(__file__).parent / "backups"
BACKUP_DIR.mkdir(exist_ok=True)


async def get_table_schema(conn, table_name: str) -> str:
    """Get CREATE TABLE statement for a table."""
    # Get column definitions
    columns = await conn.fetch("""
        SELECT
            column_name,
            data_type,
            character_maximum_length,
            is_nullable,
            column_default
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position
    """, table_name)

    # Get primary key
    pk = await conn.fetch("""
        SELECT a.attname
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE i.indrelid = $1::regclass AND i.indisprimary
    """, table_name)
    pk_columns = [row['attname'] for row in pk]

    # Build CREATE TABLE
    col_defs = []
    for col in columns:
        col_def = f"    {col['column_name']} {col['data_type']}"
        if col['character_maximum_length']:
            col_def += f"({col['character_maximum_length']})"
        if col['column_default']:
            col_def += f" DEFAULT {col['column_default']}"
        if col['is_nullable'] == 'NO':
            col_def += " NOT NULL"
        col_defs.append(col_def)

    if pk_columns:
        col_defs.append(f"    PRIMARY KEY ({', '.join(pk_columns)})")

    return f"CREATE TABLE IF NOT EXISTS {table_name} (\n" + ",\n".join(col_defs) + "\n);"


async def get_table_data(conn, table_name: str) -> list:
    """Get all rows from a table as INSERT statements."""
    rows = await conn.fetch(f"SELECT * FROM {table_name}")
    if not rows:
        return []

    columns = list(rows[0].keys())
    inserts = []

    for row in rows:
        values = []
        for col in columns:
            val = row[col]
            if val is None:
                values.append("NULL")
            elif isinstance(val, str):
                escaped = val.replace("'", "''")
                values.append(f"'{escaped}'")
            elif isinstance(val, datetime):
                values.append(f"'{val.isoformat()}'")
            elif isinstance(val, bool):
                values.append("TRUE" if val else "FALSE")
            else:
                values.append(str(val))

        insert = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({', '.join(values)});"
        inserts.append(insert)

    return inserts


async def get_indexes(conn, table_name: str) -> list:
    """Get CREATE INDEX statements for a table."""
    indexes = await conn.fetch("""
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = $1
        AND indexname NOT LIKE '%_pkey'
    """, table_name)
    return [f"{row['indexdef']};" for row in indexes]


async def get_functions(conn) -> list:
    """Get CREATE FUNCTION statements."""
    functions = await conn.fetch("""
        SELECT pg_get_functiondef(oid) as def
        FROM pg_proc
        WHERE pronamespace = 'public'::regnamespace
        AND prokind = 'f'
    """)
    return [row['def'] + ";" for row in functions if row['def']]


async def get_views(conn) -> list:
    """Get CREATE VIEW statements."""
    views = await conn.fetch("""
        SELECT viewname, definition
        FROM pg_views
        WHERE schemaname = 'public'
    """)
    return [f"CREATE OR REPLACE VIEW {row['viewname']} AS {row['definition']}" for row in views]


async def backup_database():
    """Create a full database backup."""
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        print("ERROR: DATABASE_URL environment variable not set")
        sys.exit(1)

    # Fix URL format if needed
    if database_url.startswith("postgresql+asyncpg://"):
        database_url = database_url.replace("postgresql+asyncpg://", "postgresql://")

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = BACKUP_DIR / f"golf_physics_backup_{timestamp}.sql"

    print(f"Starting database backup at {datetime.now().isoformat()}")
    print(f"Backup file: {backup_file}")

    try:
        conn = await asyncpg.connect(database_url)

        # Get list of tables
        tables = await conn.fetch("""
            SELECT tablename FROM pg_tables
            WHERE schemaname = 'public'
            ORDER BY tablename
        """)
        table_names = [t['tablename'] for t in tables]

        print(f"Found {len(table_names)} tables: {', '.join(table_names)}")

        backup_content = []
        backup_content.append("-- Golf Physics API Database Backup")
        backup_content.append(f"-- Created: {datetime.now().isoformat()}")
        backup_content.append("-- ")
        backup_content.append("")

        # Schema section
        backup_content.append("-- ==========================================")
        backup_content.append("-- SCHEMA")
        backup_content.append("-- ==========================================")
        backup_content.append("")

        for table_name in table_names:
            print(f"  Backing up schema: {table_name}")
            backup_content.append(f"-- Table: {table_name}")
            schema = await get_table_schema(conn, table_name)
            backup_content.append(schema)
            backup_content.append("")

        # Indexes section
        backup_content.append("-- ==========================================")
        backup_content.append("-- INDEXES")
        backup_content.append("-- ==========================================")
        backup_content.append("")

        for table_name in table_names:
            indexes = await get_indexes(conn, table_name)
            if indexes:
                backup_content.append(f"-- Indexes for {table_name}")
                backup_content.extend(indexes)
                backup_content.append("")

        # Functions section
        backup_content.append("-- ==========================================")
        backup_content.append("-- FUNCTIONS")
        backup_content.append("-- ==========================================")
        backup_content.append("")

        try:
            functions = await get_functions(conn)
            for func in functions:
                backup_content.append(func)
                backup_content.append("")
        except Exception as e:
            backup_content.append(f"-- Could not export functions: {e}")

        # Views section
        backup_content.append("-- ==========================================")
        backup_content.append("-- VIEWS")
        backup_content.append("-- ==========================================")
        backup_content.append("")

        try:
            views = await get_views(conn)
            for view in views:
                backup_content.append(view)
                backup_content.append("")
        except Exception as e:
            backup_content.append(f"-- Could not export views: {e}")

        # Data section
        backup_content.append("-- ==========================================")
        backup_content.append("-- DATA")
        backup_content.append("-- ==========================================")
        backup_content.append("")

        for table_name in table_names:
            print(f"  Backing up data: {table_name}")
            inserts = await get_table_data(conn, table_name)
            if inserts:
                backup_content.append(f"-- Data for {table_name} ({len(inserts)} rows)")
                backup_content.extend(inserts)
                backup_content.append("")
            else:
                backup_content.append(f"-- No data in {table_name}")
                backup_content.append("")

        await conn.close()

        # Write backup file
        with open(backup_file, "w", encoding="utf-8") as f:
            f.write("\n".join(backup_content))

        file_size = backup_file.stat().st_size
        print(f"\nBackup completed successfully!")
        print(f"File: {backup_file}")
        print(f"Size: {file_size:,} bytes")

        return str(backup_file)

    except Exception as e:
        print(f"ERROR: Backup failed - {e}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(backup_database())
