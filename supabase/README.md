# Supabase project files

This directory keeps the Supabase backend configuration and source under version control.

## Contents

- `migrations/`: project-owned database schema and scheduled database behavior.
- `functions/game-record/`: Edge Function source.
- `schema_dump.sql`: raw schema-only snapshot exported from the current hosted database for reference.

## Important notes

- `schema_dump.sql` is an archival reference, not a migration to execute directly.
- The initial migration preserves the current three public tables, constraints, indexes, foreign keys, RLS state, functions, and project-specific grants.
- No RLS policies are created. The current database has RLS enabled on all three tables and no policies.
- The second migration recreates the project-owned `ensure_rls` event trigger and the `expire-stale-games` pg_cron job.
- The current hosted project already has pg_cron enabled. The cron migration assumes the Supabase pg_cron extension is available.
- Applying migrations to a database that already contains these objects requires baseline reconciliation first; do not blindly replay the initial migration against the existing hosted database.
- No credentials or service-role keys belong in this repository.
