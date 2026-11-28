-- Recreate the project-owned RLS event trigger and stale-game cleanup job.
-- pg_cron is already enabled in the current Supabase project.
CREATE EVENT TRIGGER ensure_rls
ON ddl_command_end
WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
EXECUTE FUNCTION public.rls_auto_enable();

-- Replace an existing job with the same name so this setup is safe to re-run.
DO $$
DECLARE
  v_job_id bigint;
BEGIN
  SELECT jobid
  INTO v_job_id
  FROM cron.job
  WHERE jobname = 'expire-stale-games';

  IF v_job_id IS NOT NULL THEN
    PERFORM cron.unschedule(v_job_id);
  END IF;

  PERFORM cron.schedule(
    'expire-stale-games',
    '17 * * * *',
    'select public.expire_stale_games(24)'
  );
END;
$$;
