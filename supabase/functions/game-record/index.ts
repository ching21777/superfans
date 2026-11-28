import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "npm:@supabase/server@1";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ---- 上限（超過一律視為不合理資料）----
const MAX_BODY_BYTES = 1024 * 1024;
const MAX_EVENTS_PER_QUESTION = 500;
const INT_MAX = 2_000_000_000; // PostgreSQL integer 上限約 21 億
const MAX_QUESTION_TIME_MS = 3_600_000; // 單題最長 1 小時
const MAX_GAME_TIME_MS = 86_400_000; // 單局最長 24 小時
const MAX_QUESTION_NO = 1000;
const MAX_COUNT = 1000; // 題數、答題次數、連擊
const MAX_QUESTION_SCORE = 100_000;
const MAX_TOTAL_SCORE = 10_000_000;
const MAX_SNAPSHOT_CHARS = 8000;
const MAX_EVENT_DATA_CHARS = 4000;
const MAX_GAMES_PER_HOUR = 60; // 每位匿名使用者每小時最多開幾局

/**
 * 回應格式：
 * - 4xx（429 除外）代表「這筆資料永遠不會成功」，回應會帶 permanent: true，
 *   前端看到後會把該筆搬到失敗區，不再重試、也不擋住後面的資料。
 * - 429 與 5xx 代表暫時性問題，前端會保留並稍後重試。
 */
function json(data: unknown, status = 200) {
  const permanent = status >= 400 && status < 500 && status !== 429;
  const payload = permanent && isObject(data)
    ? { ...data, permanent: true }
    : data;
  return Response.json(payload, { status });
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null &&
    typeof value === "object" &&
    !Array.isArray(value);
}

function validText(value: unknown, max = 200): value is string {
  return typeof value === "string" &&
    value.length > 0 &&
    value.length <= max;
}

function validInt(value: unknown, max = INT_MAX): value is number {
  return typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= max;
}

function validNullableInt(value: unknown, max = INT_MAX): boolean {
  return value === null || value === undefined || validInt(value, max);
}

function validNullableText(value: unknown, max = 200): boolean {
  return value === null || value === undefined ||
    (typeof value === "string" && value.length <= max);
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  if (isObject(value)) {
    const keys = Object.keys(value).sort();
    return `{${keys.map((key) =>
      `${JSON.stringify(key)}:${stableStringify(value[key])}`
    ).join(",")}}`;
  }

  return JSON.stringify(value) ?? "null";
}

async function readBody(req: Request) {
  const raw = await req.text();

  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    throw new Error("REQUEST_TOO_LARGE");
  }

  const parsed = JSON.parse(raw);

  if (!isObject(parsed)) {
    throw new Error("INVALID_BODY");
  }

  return parsed;
}

function validDate(value: unknown): value is string {
  return typeof value === "string" &&
    Number.isFinite(Date.parse(value));
}

export default {
  fetch: withSupabase(
    { auth: "user" },
    async (req, ctx) => {
      if (req.method !== "POST") {
        return json({ error: "Method not allowed" }, 405);
      }

      // 只接受 Supabase 匿名使用者
      const userId = ctx.userClaims?.id;
      const claims = ctx.jwtClaims as
        (Record<string, unknown> | null);

      if (!userId || claims?.is_anonymous !== true) {
        return json({ error: "Anonymous user required" }, 403);
      }

      let body: Record<string, unknown>;

      try {
        body = await readBody(req);
      } catch (error) {
        if (error instanceof Error &&
          error.message === "REQUEST_TOO_LARGE") {
          return json({ error: "Request too large" }, 413);
        }

        return json({ error: "Invalid JSON body" }, 400);
      }

      const db = ctx.supabaseAdmin;
      const action = typeof body.action === "string" ? body.action : "";

      try {
        // =====================================
        // 1. 開始遊戲
        // =====================================
        if (action === "start") {
          const game = body.game;

          if (!isObject(game)) {
            return json({ error: "Missing game data" }, 400);
          }

          const id = game.id;
          const playerId = game.player_id;
          const gameMode = game.game_mode;
          const playlistKey = game.playlist_key ?? null;
          const isDemo = game.is_demo;
          const scoringVersion = game.scoring_version;
          const scoringSnapshot = game.scoring_snapshot;
          // 舊版尚未上傳的草稿可能沒有裝置欄位，允許以 NULL 補傳
          const deviceType = game.device_type ?? null;
          const browser = game.browser ?? null;
          // 舊版草稿可能沒有環境欄位，允許以 NULL 補傳
          const environment = game.environment ?? null;

          if (
            typeof id !== "string" ||
            !UUID_RE.test(id) ||
            !validText(playerId, 100) ||
            !validText(gameMode, 100) ||
            typeof isDemo !== "boolean" ||
            !validText(scoringVersion, 100) ||
            !isObject(scoringSnapshot) ||
            JSON.stringify(scoringSnapshot).length > MAX_SNAPSHOT_CHARS ||
            !validNullableText(playlistKey, 100) ||
            !validNullableText(deviceType, 30) ||
            !validNullableText(browser, 50) ||
            (environment !== null && !["production", "test", "beta"].includes(environment)) ||
            (deviceType !== null && !["mobile", "tablet", "desktop"].includes(deviceType)) ||
            (isDemo && playlistKey !== null)
          ) {
            return json({ error: "Invalid game data" }, 400);
          }

          // 頻率限制：避免有人用匿名帳號大量灌資料
          const since = new Date(Date.now() - 3_600_000).toISOString();
          const { count, error: countError } = await db
            .from("game_records")
            .select("id", { count: "exact", head: true })
            .eq("auth_user_id", userId)
            .gte("started_at", since);

          if (countError) throw countError;

          if ((count ?? 0) >= MAX_GAMES_PER_HOUR) {
            return json({ error: "Too many games, retry later" }, 429);
          }

          const row = {
            id,
            auth_user_id: userId,
            player_id: playerId,
            game_mode: gameMode,
            playlist_key: playlistKey,
            is_demo: isDemo,
            scoring_version: scoringVersion,
            scoring_snapshot: scoringSnapshot,
            device_type: deviceType,
            browser,
            environment,
          };

          const { error: insertError } = await db
            .from("game_records")
            .insert(row);

          if (!insertError) {
            return json({
              success: true,
              game_id: id,
              duplicate: false,
            });
          }

          // 只有主鍵重複才進行重送核對
          if (insertError.code !== "23505") {
            throw insertError;
          }

          const { data: existing, error: readError } = await db
            .from("game_records")
            .select(
              "id, auth_user_id, player_id, game_mode, playlist_key, is_demo, scoring_version, scoring_snapshot, device_type, browser, environment",
            )
            .eq("id", id)
            .maybeSingle();

          if (readError) throw readError;

          const same = existing &&
            existing.auth_user_id === userId &&
            existing.player_id === playerId &&
            existing.game_mode === gameMode &&
            existing.playlist_key === playlistKey &&
            existing.is_demo === isDemo &&
            existing.scoring_version === scoringVersion &&
            existing.device_type === deviceType &&
            existing.browser === browser &&
            existing.environment === environment &&
            stableStringify(existing.scoring_snapshot) ===
              stableStringify(scoringSnapshot);

          if (!same) {
            return json({
              error: "Game ID already exists with different content",
            }, 409);
          }

          return json({
            success: true,
            game_id: id,
            duplicate: true,
          });
        }

        // =====================================
        // 2. 儲存單題結果與事件
        // =====================================
        if (action === "event") {
          const gameId = body.game_id;
          const question = body.question;
          const events = body.events;

          if (
            typeof gameId !== "string" ||
            !UUID_RE.test(gameId) ||
            !isObject(question) ||
            !Array.isArray(events) ||
            events.length > MAX_EVENTS_PER_QUESTION
          ) {
            return json({ error: "Invalid event payload" }, 400);
          }

          const questionId = question.id;
          const questionNo = question.question_no;
          const attemptCount = question.attempt_count ?? 0;
          const usedHint = question.used_hint ?? false;
          const isSkipped = question.is_skipped ?? false;
          const isCorrect = question.is_correct ?? null;
          const time = question.time ?? null;
          const score = question.score ?? null;
          const songNo = question.song_no ?? null;
          const questionType = question.question_type ?? null;

          if (
            typeof questionId !== "string" ||
            !UUID_RE.test(questionId) ||
            !validInt(questionNo, MAX_QUESTION_NO) ||
            questionNo < 1 ||
            !validInt(attemptCount, MAX_COUNT) ||
            typeof usedHint !== "boolean" ||
            typeof isSkipped !== "boolean" ||
            (isCorrect !== null && typeof isCorrect !== "boolean") ||
            !validNullableInt(time, MAX_QUESTION_TIME_MS) ||
            !validNullableInt(score, MAX_QUESTION_SCORE) ||
            !validNullableText(songNo, 100) ||
            !validNullableText(questionType, 100)
          ) {
            return json({ error: "Invalid question data" }, 400);
          }

          const normalizedQuestion = {
            id: questionId,
            question_no: questionNo,
            song_no: songNo,
            question_type: questionType,
            attempt_count: attemptCount,
            is_correct: isCorrect,
            used_hint: usedHint,
            is_skipped: isSkipped,
            time,
            score,
          };

          const seenSequences = new Set<number>();
          const normalizedEvents = [];

          for (const event of events) {
            if (
              !isObject(event) ||
              !validInt(event.sequence_no, MAX_EVENTS_PER_QUESTION * 100) ||
              event.sequence_no < 1 ||
              !validText(event.event_type, 100) ||
              !validDate(event.occurred_at) ||
              (
                event.event_data !== undefined &&
                !isObject(event.event_data)
              ) ||
              JSON.stringify(event.event_data ?? {}).length >
                MAX_EVENT_DATA_CHARS
            ) {
              return json({ error: "Invalid event data" }, 400);
            }

            if (seenSequences.has(event.sequence_no)) {
              return json({
                error: "Duplicate event sequence number",
              }, 400);
            }

            seenSequences.add(event.sequence_no);

            normalizedEvents.push({
              sequence_no: event.sequence_no,
              event_type: event.event_type,
              event_data: event.event_data ?? {},
              occurred_at: event.occurred_at,
            });
          }

          // 確認這場遊戲屬於目前登入的玩家
          const { data: game, error: gameError } = await db
            .from("game_records")
            .select("id, status")
            .eq("id", gameId)
            .eq("auth_user_id", userId)
            .maybeSingle();

          if (gameError) throw gameError;

          if (!game) {
            return json({ error: "Game not found" }, 404);
          }

          if (game.status !== "started") {
            return json({ error: "Game is not active" }, 409);
          }

          // 單題結果與事件由資料庫函式在同一交易處理
          const { data, error: saveError } = await db.rpc(
            "save_question_batch",
            {
              p_game_id: gameId,
              p_question: normalizedQuestion,
              p_events: normalizedEvents,
            },
          );

          if (saveError) {
            // P0001 = RPC 內的 RAISE EXCEPTION（內容衝突、遊戲已結束等）
            // 22xxx = 資料格式／範圍錯誤，23xxx = 約束違反
            // 這些都是重送也不會成功的錯誤，回 409 讓前端放棄這一筆
            const code = saveError.code ?? "";
            if (
              code === "P0001" || code.startsWith("22") ||
              code.startsWith("23")
            ) {
              console.warn("game-record rejected:", {
                action,
                gameId,
                code,
                message: saveError.message,
              });
              return json({ error: saveError.message }, 409);
            }
            throw saveError;
          }

          return json(data);
        }

        // =====================================
        // 3. 結束遊戲
        // =====================================
        if (action === "finish") {
          const gameId = body.game_id;
          const status = body.status;
          const totalTime = body.total_time;
          const totalQuestions = body.total_questions;
          const correctCount = body.correct_count;
          const totalScore = body.total_score;
          const maxCombo = body.max_combo;
          const endedAt = body.ended_at;

          if (
            typeof gameId !== "string" ||
            !UUID_RE.test(gameId) ||
            typeof status !== "string" ||
            !["completed", "abandoned"].includes(status) ||
            !validInt(totalTime, MAX_GAME_TIME_MS) ||
            !validInt(totalQuestions, MAX_COUNT) ||
            !validInt(correctCount, MAX_COUNT) ||
            !validInt(totalScore, MAX_TOTAL_SCORE) ||
            !validInt(maxCombo, MAX_COUNT) ||
            correctCount > totalQuestions ||
            !validDate(endedAt)
          ) {
            return json({ error: "Invalid finish payload" }, 400);
          }

          const summary = {
            status,
            ended_at: endedAt,
            total_time: totalTime,
            total_questions: totalQuestions,
            correct_count: correctCount,
            total_score: totalScore,
            max_combo: maxCombo,
          };

          // 只更新目前玩家自己的遊戲
          const { data: updated, error: updateError } = await db
            .from("game_records")
            .update(summary)
            .eq("id", gameId)
            .eq("auth_user_id", userId)
            .eq("status", "started")
            .select("id")
            .maybeSingle();

          if (updateError) throw updateError;

          if (updated) {
            return json({
              success: true,
              game_id: gameId,
              duplicate: false,
            });
          }

          // 重送 finish 時，只有完全一致才視為成功
          const { data: existing, error: readError } = await db
            .from("game_records")
            .select(
              "status, ended_at, total_time, total_questions, correct_count, total_score, max_combo",
            )
            .eq("id", gameId)
            .eq("auth_user_id", userId)
            .maybeSingle();

          if (readError) throw readError;

          const same = existing &&
            existing.status === status &&
            Date.parse(existing.ended_at ?? "") === Date.parse(endedAt) &&
            existing.total_time === totalTime &&
            existing.total_questions === totalQuestions &&
            existing.correct_count === correctCount &&
            existing.total_score === totalScore &&
            existing.max_combo === maxCombo;

          if (!same) {
            return json({
              error: "Game not found or already finished with different data",
            }, 409);
          }

          return json({
            success: true,
            game_id: gameId,
            duplicate: true,
          });
        }

        return json({ error: "Unknown action" }, 400);
      } catch (error) {
        console.error("game-record error:", { action, error });

        return json({
          error: "Internal server error",
        }, 500);
      }
    },
  ),
};