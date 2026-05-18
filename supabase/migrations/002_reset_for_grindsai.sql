-- Applied to project wlotlyialknuevlcjmzm (formerly costGuard).
-- Drops legacy app tables and creates GrindsAI schema.

drop table if exists public.anomalies cascade;
drop table if exists public.invoices cascade;
drop table if exists public.vendors cascade;
drop table if exists public.documents cascade;
drop table if exists public.items cascade;
drop table if exists public.users cascade;
drop table if exists public.alembic_version cascade;

drop type if exists public.anomaly_type cascade;
drop type if exists public.anomaly_severity cascade;
drop type if exists public.anomaly_status cascade;

-- See 001_initial.sql for GrindsAI table definitions (also applied in this migration via MCP).
