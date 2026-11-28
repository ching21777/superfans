ALTER TABLE public.game_records
  ADD COLUMN IF NOT EXISTS environment text;

ALTER TABLE public.game_records
  ADD CONSTRAINT game_records_environment_check
  CHECK (environment IS NULL OR environment IN ('production', 'test', 'beta'));

COMMENT ON COLUMN public.game_records.environment IS
  'Deployment environment: production, test, or beta. NULL for older records or legacy queued drafts.';
