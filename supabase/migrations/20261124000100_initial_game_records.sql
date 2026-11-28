-- pg_dump disables body validation because these PL/pgSQL functions reference tables created later in this migration.
SET check_function_bodies = false;

--
--

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';

--
-- Name: expire_stale_games(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.expire_stale_games(p_hours integer DEFAULT 24) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'pg_temp'
    AS $$
declare
  v_count integer;
begin
  with stale as (
    select
      g.id,
      (select count(*) from public.question_records q where q.game_id = g.id) as qn,
      (select count(*) from public.question_records q
         where q.game_id = g.id and q.is_correct is true) as cc,
      (select coalesce(sum(q.score), 0) from public.question_records q
         where q.game_id = g.id) as sc,
      (select max(e.occurred_at) from public.game_events e
         where e.game_id = g.id) as last_at
    from public.game_records g
    where g.status = 'started'
      and g.started_at < now() - make_interval(hours => p_hours)
  ),
  upd as (
    update public.game_records g
    set status = 'timed_out',
        ended_at = greatest(g.started_at,
                            least(coalesce(s.last_at, g.started_at), now())),
        total_time = round(extract(epoch from (
          greatest(g.started_at, least(coalesce(s.last_at, g.started_at), now()))
          - g.started_at)) * 1000)::integer,
        total_questions = s.qn::integer,
        correct_count = s.cc::integer,
        total_score = s.sc::integer
    from stale s
    where g.id = s.id and g.status = 'started'
    returning 1
  )
  select count(*) into v_count from upd;

  return v_count;
end;
$$;

--
-- Name: rls_auto_enable(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.rls_auto_enable() RETURNS event_trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
  tbl name;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        SELECT c.relname INTO tbl FROM pg_catalog.pg_class c WHERE c.oid = cmd.objid;
        EXECUTE format('alter table if exists %I.%I enable row level security', cmd.schema_name, tbl);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;

--
-- Name: save_question_batch(uuid, jsonb, jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.save_question_batch(p_game_id uuid, p_question jsonb, p_events jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'pg_temp'
    AS $$
DECLARE
  v_question_id UUID;
  v_question_no INTEGER;
  v_song_no TEXT;
  v_question_type TEXT;
  v_attempt_count INTEGER;
  v_is_correct BOOLEAN;
  v_used_hint BOOLEAN;
  v_is_skipped BOOLEAN;
  v_time INTEGER;
  v_score INTEGER;

  v_existing public.question_records%ROWTYPE;
  v_event JSONB;
  v_sequence_no INTEGER;
  v_event_type TEXT;
  v_event_data JSONB;
  v_occurred_at TIMESTAMPTZ;
  v_existing_event public.game_events%ROWTYPE;
  v_event_count INTEGER;
  v_duplicate BOOLEAN := FALSE;
BEGIN
  -- 基本格式檢查
  IF p_question IS NULL OR jsonb_typeof(p_question) <> 'object' THEN
    RAISE EXCEPTION 'Invalid question payload';
  END IF;

  IF p_events IS NULL OR jsonb_typeof(p_events) <> 'array' THEN
    RAISE EXCEPTION 'Events must be a JSON array';
  END IF;

  -- 解析題目資料
  v_question_id := (p_question->>'id')::UUID;
  v_question_no := (p_question->>'question_no')::INTEGER;
  v_song_no := p_question->>'song_no';
  v_question_type := p_question->>'question_type';
  v_attempt_count := COALESCE((p_question->>'attempt_count')::INTEGER, 0);
  v_is_correct := (p_question->>'is_correct')::BOOLEAN;
  v_used_hint := COALESCE((p_question->>'used_hint')::BOOLEAN, FALSE);
  v_is_skipped := COALESCE((p_question->>'is_skipped')::BOOLEAN, FALSE);
  v_time := (p_question->>'time')::INTEGER;
  v_score := (p_question->>'score')::INTEGER;

  IF v_question_id IS NULL OR v_question_no IS NULL THEN
    RAISE EXCEPTION 'Question ID and question number are required';
  END IF;

  IF v_attempt_count < 0 OR (v_time IS NOT NULL AND v_time < 0) THEN
    RAISE EXCEPTION 'Invalid question values';
  END IF;

  -- 鎖定遊戲紀錄，避免同一場遊戲同時寫入造成競爭
  PERFORM 1
  FROM public.game_records
  WHERE id = p_game_id
    AND status = 'started'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Game not found or not started';
  END IF;

  -- 檢查題目 ID 是否已經存在
  SELECT *
  INTO v_existing
  FROM public.question_records
  WHERE id = v_question_id;

  IF FOUND THEN
    v_duplicate := TRUE;

    -- 已存在的題目必須完全一致
    IF v_existing.game_id IS DISTINCT FROM p_game_id
      OR v_existing.question_no IS DISTINCT FROM v_question_no
      OR v_existing.song_no IS DISTINCT FROM v_song_no
      OR v_existing.question_type IS DISTINCT FROM v_question_type
      OR v_existing.attempt_count IS DISTINCT FROM v_attempt_count
      OR v_existing.is_correct IS DISTINCT FROM v_is_correct
      OR v_existing.used_hint IS DISTINCT FROM v_used_hint
      OR v_existing.is_skipped IS DISTINCT FROM v_is_skipped
      OR v_existing.time IS DISTINCT FROM v_time
      OR v_existing.score IS DISTINCT FROM v_score
    THEN
      RAISE EXCEPTION 'Question ID already exists with different content';
    END IF;

    -- 事件數量必須一致
    SELECT COUNT(*)
    INTO v_event_count
    FROM public.game_events
    WHERE game_id = p_game_id
      AND question_id = v_question_id;

    IF v_event_count <> jsonb_array_length(p_events) THEN
      RAISE EXCEPTION 'Existing event count does not match';
    END IF;
  ELSE
    -- 建立題目紀錄
    INSERT INTO public.question_records (
      id, game_id, question_no, song_no, question_type,
      attempt_count, is_correct, used_hint, is_skipped, time, score
    )
    VALUES (
      v_question_id, p_game_id, v_question_no, v_song_no, v_question_type,
      v_attempt_count, v_is_correct, v_used_hint, v_is_skipped, v_time, v_score
    );
  END IF;
  
  -- 同一批事件不可有重複序號
  IF (
    SELECT COUNT(DISTINCT (value->>'sequence_no')::INTEGER)
    FROM jsonb_array_elements(p_events)
  ) <> jsonb_array_length(p_events) THEN
    RAISE EXCEPTION 'Duplicate sequence number in event batch';
  END IF;

  -- 逐筆檢查或寫入事件
  FOR v_event IN
    SELECT value FROM jsonb_array_elements(p_events)
  LOOP
    IF jsonb_typeof(v_event) <> 'object'
      OR v_event->>'sequence_no' IS NULL
      OR v_event->>'event_type' IS NULL
      OR v_event->>'occurred_at' IS NULL
    THEN
      RAISE EXCEPTION 'Invalid event payload';
    END IF;

    v_sequence_no := (v_event->>'sequence_no')::INTEGER;
    v_event_type := v_event->>'event_type';
    v_event_data := COALESCE(v_event->'event_data', '{}'::JSONB);
    v_occurred_at := (v_event->>'occurred_at')::TIMESTAMPTZ;

    IF v_sequence_no < 1 OR jsonb_typeof(v_event_data) <> 'object' THEN
      RAISE EXCEPTION 'Invalid event values';
    END IF;

    IF v_duplicate THEN
      SELECT *
      INTO v_existing_event
      FROM public.game_events
      WHERE game_id = p_game_id
        AND sequence_no = v_sequence_no;

      IF NOT FOUND
        OR v_existing_event.question_id IS DISTINCT FROM v_question_id
        OR v_existing_event.event_type IS DISTINCT FROM v_event_type
        OR v_existing_event.event_data IS DISTINCT FROM v_event_data
        OR v_existing_event.occurred_at IS DISTINCT FROM v_occurred_at
      THEN
        RAISE EXCEPTION 'Existing event does not match incoming event';
      END IF;
    ELSE
      INSERT INTO public.game_events (
        game_id, question_id, sequence_no,
        event_type, event_data, occurred_at
      )
      VALUES (
        p_game_id, v_question_id, v_sequence_no,
        v_event_type, v_event_data, v_occurred_at
      );
    END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'success', TRUE,
    'duplicate', v_duplicate,
    'question_id', v_question_id
  );
END;
$$;

--
-- Name: game_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.game_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    game_id uuid NOT NULL,
    question_id uuid,
    sequence_no integer NOT NULL,
    event_type text NOT NULL,
    event_data jsonb DEFAULT '{}'::jsonb NOT NULL,
    occurred_at timestamp with time zone DEFAULT now() NOT NULL
);

--
-- Name: game_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.game_records (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    player_id text NOT NULL,
    game_mode text NOT NULL,
    playlist_key text,
    is_demo boolean DEFAULT false NOT NULL,
    status text DEFAULT 'started'::text NOT NULL,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    ended_at timestamp with time zone,
    total_time integer,
    total_questions integer,
    correct_count integer,
    total_score integer,
    max_combo integer,
    scoring_version text NOT NULL,
    scoring_snapshot jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    auth_user_id uuid,
    CONSTRAINT game_records_status_check CHECK ((status = ANY (ARRAY['started'::text, 'completed'::text, 'abandoned'::text, 'timed_out'::text])))
);

--
-- Name: question_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.question_records (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    game_id uuid NOT NULL,
    question_no integer NOT NULL,
    song_no text,
    question_type text,
    attempt_count integer DEFAULT 0 NOT NULL,
    is_correct boolean,
    used_hint boolean DEFAULT false NOT NULL,
    is_skipped boolean DEFAULT false NOT NULL,
    "time" integer,
    score integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

--
-- Name: game_events game_events_game_id_sequence_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_events
    ADD CONSTRAINT game_events_game_id_sequence_no_key UNIQUE (game_id, sequence_no);

--
-- Name: game_events game_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_events
    ADD CONSTRAINT game_events_pkey PRIMARY KEY (id);

--
-- Name: game_records game_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_records
    ADD CONSTRAINT game_records_pkey PRIMARY KEY (id);

--
-- Name: game_records game_records_summary_check; Type: CHECK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE public.game_records
    ADD CONSTRAINT game_records_summary_check CHECK (((total_time >= 0) AND (total_questions >= 0) AND (correct_count >= 0) AND (total_score >= 0) AND (max_combo >= 0) AND (correct_count <= total_questions))) NOT VALID;

--
-- Name: question_records question_records_game_id_question_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.question_records
    ADD CONSTRAINT question_records_game_id_question_no_key UNIQUE (game_id, question_no);

--
-- Name: question_records question_records_nonneg_check; Type: CHECK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE public.question_records
    ADD CONSTRAINT question_records_nonneg_check CHECK (((question_no >= 1) AND (attempt_count >= 0) AND ("time" >= 0) AND (score >= 0))) NOT VALID;

--
-- Name: question_records question_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.question_records
    ADD CONSTRAINT question_records_pkey PRIMARY KEY (id);

--
-- Name: idx_game_events_question_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_game_events_question_id ON public.game_events USING btree (question_id);

--
-- Name: idx_game_records_auth_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_game_records_auth_user_id ON public.game_records USING btree (auth_user_id);

--
-- Name: idx_game_records_stale; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_game_records_stale ON public.game_records USING btree (started_at) WHERE (status = 'started'::text);

--
-- Name: game_events game_events_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_events
    ADD CONSTRAINT game_events_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.game_records(id) ON DELETE CASCADE;

--
-- Name: game_events game_events_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_events
    ADD CONSTRAINT game_events_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.question_records(id) ON DELETE SET NULL;

--
-- Name: game_records game_records_auth_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_records
    ADD CONSTRAINT game_records_auth_user_id_fkey FOREIGN KEY (auth_user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

--
-- Name: question_records question_records_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.question_records
    ADD CONSTRAINT question_records_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.game_records(id) ON DELETE CASCADE;

--
-- Name: game_events; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.game_events ENABLE ROW LEVEL SECURITY;

--
-- Name: game_records; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.game_records ENABLE ROW LEVEL SECURITY;

--
-- Name: question_records; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.question_records ENABLE ROW LEVEL SECURITY;

--
--

--
--

--
--

--
--

--
--

--
--

--
--

--
--

--
--

--
--

--
--

--
--

--
--

--
--

-- Project-specific grants captured from the current Supabase database.
REVOKE ALL ON FUNCTION public.expire_stale_games(integer) FROM PUBLIC;
GRANT ALL ON FUNCTION public.expire_stale_games(integer) TO service_role;

GRANT ALL ON FUNCTION public.rls_auto_enable() TO anon;
GRANT ALL ON FUNCTION public.rls_auto_enable() TO authenticated;
GRANT ALL ON FUNCTION public.rls_auto_enable() TO service_role;

REVOKE ALL ON FUNCTION public.save_question_batch(uuid, jsonb, jsonb) FROM PUBLIC;
GRANT ALL ON FUNCTION public.save_question_batch(uuid, jsonb, jsonb) TO service_role;

GRANT ALL ON TABLE public.game_events TO service_role;
GRANT ALL ON TABLE public.game_records TO service_role;
GRANT ALL ON TABLE public.question_records TO service_role;
