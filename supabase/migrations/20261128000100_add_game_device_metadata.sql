-- Store coarse device and browser information for Beta analytics.
-- Existing games remain NULL; no historical values are inferred.
ALTER TABLE public.game_records
  ADD COLUMN IF NOT EXISTS device_type text,
  ADD COLUMN IF NOT EXISTS browser text;

ALTER TABLE public.game_records
  ADD CONSTRAINT game_records_device_type_check
  CHECK (device_type IS NULL OR device_type IN ('mobile', 'tablet', 'desktop'));

COMMENT ON COLUMN public.game_records.device_type IS
  'Coarse device category: mobile, tablet, or desktop. NULL for older records.';
COMMENT ON COLUMN public.game_records.browser IS
  'Browser family name only; no version or device model. NULL for older records.';
