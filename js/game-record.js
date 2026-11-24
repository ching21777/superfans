(() => {
  const SUPABASE_URL = 'https://uxyigjfgxagtvdoyjhkq.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_XObXgkUfWibailjzU_Qtlw_UhYEvHgi';
  const PLAYER_KEY = 'sf_player_id';
  const DB_NAME = 'super-fans-records';
  const STORE_NAME = 'operations';
  const DRAFT_PREFIX = 'sf_game_draft:';   // 每一局各存一份草稿，不會互相覆蓋
  const MAX_SERVER_RETRIES = 10;          // 伺服器連續 5xx 超過這個次數，就把該筆搬到失敗區
  const RETRY_DELAY_MS = 30000;           // 暫時失敗後，隔多久自動再試一次
  const FAILED_KEEP_MS = 14 * 24 * 3600 * 1000;  // 失敗區保留 14 天
  const STALE_DRAFT_MS = 30000;           // 草稿閒置超過這個時間，才視為「上一局已中斷」
  const STALE_DRAFT_VISIBLE_MS = 10 * 60 * 1000; // 沒有隱藏紀錄的草稿，要閒置更久才補記

  let client = null;
  let dbPromise = null;
  let currentGame = null;
  let currentQuestion = null;
  let sequenceNo = 0;
  let queueChain = Promise.resolve();
  let flushing = false;
  let flushRequested = false;
  let retryTimer = null;
  let opCounter = 0;
  let progress = { questions: 0, correct: 0, score: 0, streak: 0, maxStreak: 0 };
  let startBody = null;

  const uuid = () => {
    if (crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 3 | 8)).toString(16);
    });
  };

  // 分頁識別碼：同一分頁重新整理後不變，新開分頁則不同
  function getTabId() {
    try {
      let id = sessionStorage.getItem('sf_tab_id');
      if (!id) {
        id = uuid();
        sessionStorage.setItem('sf_tab_id', id);
      }
      return id;
    } catch (_) {
      return null;
    }
  }

  const tabId = getTabId();

  function getPlayerId() {
    let id = localStorage.getItem(PLAYER_KEY);
    if (!id) {
      id = uuid();
      localStorage.setItem(PLAYER_KEY, id);
    }
    return id;
  }

  function getClient() {
    if (client) return client;
    if (!window.supabase?.createClient) {
      throw new Error('Supabase SDK 尚未載入');
    }
    client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
      }
    });
    return client;
  }

  async function ensureAnonymousSession() {
    const supabase = getClient();
    let { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;

    if (!session) {
      const result = await supabase.auth.signInAnonymously();
      if (result.error) throw result.error;
      session = result.data.session;
    }

    if (!session?.access_token) {
      throw new Error('無法取得匿名登入憑證');
    }
    return session;
  }

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return dbPromise;
  }

  async function putOperation(operation) {
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(operation);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  async function getAllOperations() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).getAll();
      request.onsuccess = () => resolve(request.result.sort((a, b) => orderOf(a) - orderOf(b)));
      request.onerror = () => reject(request.error);
    });
  }

  // 同一毫秒內入列的資料，靠 order 的遞增計數維持先後順序（避免 finish 比 event 先送出）
  const orderOf = op => op.order ?? (op.createdAt || 0) * 1000;

  // 只回傳「還要送」的資料；已放棄的（failed）留在失敗區，不會擋住後面的資料
  async function getOperations() {
    return (await getAllOperations()).filter(op => !op.failed);
  }

  async function markFailed(operation, failure) {
    await putOperation({
      ...operation,
      failed: true,
      failedAt: Date.now(),
      failReason: `${failure.status || 'network'}: ${failure.message || ''}`.slice(0, 300)
    });
  }

  async function pruneFailed() {
    const all = await getAllOperations();
    const cutoff = Date.now() - FAILED_KEEP_MS;
    for (const op of all) {
      if (op.failed && (op.failedAt || 0) < cutoff) await deleteOperation(op.id);
    }
  }

  async function deleteOperation(id) {
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(id);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  function enqueue(action, body) {
    const operation = {
      id: uuid(), action, body,
      createdAt: Date.now(),
      order: Date.now() * 1000 + (opCounter++ % 1000)
    };
    queueChain = queueChain.then(async () => {
      await putOperation(operation);
      flushPending();
    }).catch(error => {
      console.warn('[GameRecord] 暫存失敗：', error);
    });
    return queueChain;
  }

  // 解析失敗原因：permanent = 伺服器明確表示「這筆永遠不會成功」
  async function readFailure(error) {
    const res = error && error.context;
    if (res && typeof res.status === 'number') {
      let body = null;
      try { body = await res.clone().json(); } catch (_) {}
      return {
        status: res.status,
        permanent: body && body.permanent === true,
        message: (body && body.error) || error.message || ''
      };
    }
    // 沒有 HTTP 狀態：網路中斷或連不上，一律視為暫時
    return { status: 0, permanent: false, message: (error && error.message) || '' };
  }

  async function sendOnce(supabase, operation) {
    const { error } = await supabase.functions.invoke('game-record', { body: operation.body });
    return error ? readFailure(error) : null;
  }

  // 憑證失效（例如匿名帳號被清掉）：重新取得匿名身分
  async function recoverSession(supabase) {
    const refreshed = await supabase.auth.refreshSession();
    if (!refreshed.error && refreshed.data && refreshed.data.session) return;
    await supabase.auth.signOut({ scope: 'local' });
    const result = await supabase.auth.signInAnonymously();
    if (result.error) throw result.error;
  }

  function scheduleRetry() {
    if (retryTimer) return;
    retryTimer = setTimeout(() => {
      retryTimer = null;
      flushPending();
    }, RETRY_DELAY_MS);
  }

  async function flushPending() {
    if (flushing) {
      flushRequested = true;
      return;
    }
    if (!navigator.onLine) return;
    flushing = true;
    flushRequested = false;
    try {
      await ensureAnonymousSession();
      const supabase = getClient();
      await pruneFailed();
      let keepGoing = true;

      while (keepGoing && navigator.onLine) {
        const operations = await getOperations();
        if (!operations.length) break;

        for (const operation of operations) {
          if (!navigator.onLine) {
            keepGoing = false;
            break;
          }

          let failure = await sendOnce(supabase, operation);
          if (failure && failure.status === 401) {
            await recoverSession(supabase);
            failure = await sendOnce(supabase, operation);
          }

          if (!failure) {
            await deleteOperation(operation.id);
            continue;
          }

          // 永久失敗：搬到失敗區，繼續處理下一筆
          if (failure.permanent) {
            console.warn('[GameRecord] 這筆資料被伺服器拒絕，已移到失敗區：', failure.message, operation.body && operation.body.action);
            await markFailed(operation, failure);
            continue;
          }

          // 伺服器內部錯誤：累計次數，太多次就放棄這筆
          if (failure.status >= 500) {
            const attempts = (operation.attempts || 0) + 1;
            if (attempts >= MAX_SERVER_RETRIES) {
              console.warn('[GameRecord] 重試多次仍失敗，已移到失敗區：', failure.message);
              await markFailed(operation, failure);
              continue;
            }
            await putOperation({ ...operation, attempts });
          }

          console.warn('[GameRecord] 上傳暫時失敗，保留待補傳資料：', failure.status, failure.message);
          keepGoing = false;
          scheduleRetry();
          break;
        }
      }
    } catch (error) {
      console.warn('[GameRecord] 尚未能連線，資料會保留待補傳：', error);
      scheduleRetry();
    } finally {
      flushing = false;
      if (flushRequested && navigator.onLine) {
        flushRequested = false;
        flushPending();
      }
    }
  }

  // ---- 離開頁面時的草稿（同步寫入 localStorage，關頁面前一定來得及）----
  function saveDraft(extra = {}) {
    try {
      if (!currentGame) return;
      localStorage.setItem(DRAFT_PREFIX + currentGame.id, JSON.stringify({
        game: currentGame,
        startBody,
        progress,
        question: currentQuestion,
        sequenceNo,
        updatedAt: Date.now(),
        tabId,
        ...extra
      }));
    } catch (_) {}
  }

  function clearDraft(gameId) {
    try { localStorage.removeItem(DRAFT_PREFIX + gameId); } catch (_) {}
  }

  // 找出所有「已中斷」的草稿，補記成 abandoned
  function recoverDrafts() {
    const keys = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(DRAFT_PREFIX)) keys.push(key);
      }
    } catch (_) { return; }

    for (const key of keys) {
      let draft = null;
      try { draft = JSON.parse(localStorage.getItem(key) || 'null'); } catch (_) {}
      if (!draft || !draft.game || !draft.startBody) {
        try { localStorage.removeItem(key); } catch (_) {}
        continue;
      }
      if (currentGame && currentGame.id === draft.game.id) continue;   // 正在玩的這局

      const lastAt = draft.hiddenAt || draft.updatedAt || Date.now();
      const idle = Date.now() - lastAt;
      // 同一個分頁重新整理：頁面已重新載入，舊的那局一定已經中斷，立即補記
      const sameTab = !!tabId && draft.tabId === tabId;
      if (!sameTab) {
        // 其他分頁的草稿：避免誤判（對方可能還在玩），所以要等一段時間
        if (idle < STALE_DRAFT_MS) continue;
        if (!draft.hidden && idle < STALE_DRAFT_VISIBLE_MS) continue;
      }

      try { localStorage.removeItem(key); } catch (_) {}
      enqueueAbandoned(draft, lastAt);
    }
  }

  function enqueueAbandoned(draft, lastAt) {
    const gameId = draft.game.id;
    const prog = draft.progress || { questions: 0, correct: 0, score: 0, maxStreak: 0 };
    let questions = prog.questions;
    let seq = draft.sequenceNo || 0;

    enqueue('start', draft.startBody);   // start 具冪等性，重複送不會出錯

    const q = draft.question;
    if (q) {
      const events = (q.events || []).slice();
      events.push({
        sequence_no: ++seq,
        event_type: 'question_completed',
        event_data: { result: 'abandoned' },
        occurred_at: new Date(lastAt).toISOString()
      });
      enqueue('event', {
        action: 'event',
        game_id: gameId,
        question: {
          id: q.id,
          question_no: q.question_no,
          song_no: q.song_no,
          question_type: q.question_type,
          attempt_count: Math.max(0, Number(q.attempt_count) || 0),
          is_correct: null,
          used_hint: !!q.used_hint,
          is_skipped: false,
          time: Math.max(0, Math.round(lastAt - (q.startedAt || lastAt))),
          score: 0
        },
        events
      });
      questions += 1;
    }

    enqueue('finish', {
      action: 'finish',
      game_id: gameId,
      status: 'abandoned',
      total_time: Math.max(0, lastAt - (draft.game.startedAt || lastAt)),
      total_questions: questions,
      correct_count: prog.correct || 0,
      total_score: prog.score || 0,
      max_combo: prog.maxStreak || 0,
      ended_at: new Date(lastAt).toISOString()
    });
  }

  function addEvent(type, data = {}) {
    if (!currentQuestion) return;
    currentQuestion.events.push({
      sequence_no: ++sequenceNo,
      event_type: type,
      event_data: data,
      occurred_at: new Date().toISOString()
    });
    saveDraft();
  }

  function startGame(options) {
    recoverDrafts();   // 開新局前，先把之前中斷的遊戲補記起來
    currentGame = {
      id: uuid(),
      player_id: getPlayerId(),
      startedAt: Date.now()
    };
    currentQuestion = null;
    sequenceNo = 0;
    progress = { questions: 0, correct: 0, score: 0, streak: 0, maxStreak: 0 };

    startBody = {
      action: 'start',
      game: {
        id: currentGame.id,
        player_id: currentGame.player_id,
        game_mode: options.game_mode,
        playlist_key: options.playlist_key,
        is_demo: !!options.is_demo,
        scoring_version: options.scoring_version,
        scoring_snapshot: options.scoring_snapshot
      }
    };
    enqueue('start', startBody);
    saveDraft();
    return currentGame.id;
  }

  function startQuestion(options) {
    if (!currentGame) return;
    currentQuestion = {
      id: uuid(),
      question_no: options.question_no,
      song_no: options.song_no || null,
      question_type: options.question_type || null,
      attempt_count: 0,
      used_hint: false,
      is_skipped: false,
      startedAt: Date.now(),
      events: []
    };
    addEvent('question_started', {
      question_no: options.question_no,
      song_no: options.song_no || null,
      question_type: options.question_type || null
    });
  }

  function recordEvent(type, data = {}) {
    addEvent(type, data);
  }

  function completeQuestion(result) {
    if (!currentGame || !currentQuestion) return;
    addEvent('question_completed', {
      result: result.is_correct === true ? 'correct' :
        result.is_correct === false ? (result.reason || 'wrong') : 'abandoned'
    });

    const question = {
      id: currentQuestion.id,
      question_no: currentQuestion.question_no,
      song_no: currentQuestion.song_no,
      question_type: currentQuestion.question_type,
      attempt_count: Math.max(0, Number(result.attempt_count) || 0),
      is_correct: result.is_correct,
      used_hint: !!result.used_hint,
      is_skipped: !!result.is_skipped,
      time: Math.max(0, Math.round(Number(result.time) || 0)),
      score: Math.max(0, Math.round(Number(result.score) || 0))
    };
    const events = currentQuestion.events;
    const gameId = currentGame.id;
    currentQuestion = null;

    progress.questions += 1;
    progress.score += question.score;
    if (question.is_correct === true) {
      progress.correct += 1;
      progress.streak += 1;
      progress.maxStreak = Math.max(progress.maxStreak, progress.streak);
    } else {
      progress.streak = 0;
    }
    saveDraft();

    enqueue('event', {
      action: 'event',
      game_id: gameId,
      question,
      events
    });
  }

  function finishGame(result) {
    if (!currentGame) return;
    const gameId = currentGame.id;
    const totalTime = Math.max(0, Date.now() - currentGame.startedAt);
    currentGame = null;
    currentQuestion = null;
    startBody = null;
    clearDraft(gameId);

    enqueue('finish', {
      action: 'finish',
      game_id: gameId,
      status: result.status,
      total_time: totalTime,
      total_questions: Math.max(0, Number(result.total_questions) || 0),
      correct_count: Math.max(0, Number(result.correct_count) || 0),
      total_score: Math.max(0, Number(result.total_score) || 0),
      max_combo: Math.max(0, Number(result.max_combo) || 0),
      ended_at: new Date().toISOString()
    });
  }

  window.GameRecord = {
    startGame,
    startQuestion,
    recordEvent,
    completeQuestion,
    finishGame,
    flushPending,
    // 除錯用：在主控台執行 await GameRecord.getFailed() 可查看被拒絕的資料
    getFailed: async () => (await getAllOperations()).filter(op => op.failed)
  };

  function onHidden() {
    saveDraft({ hidden: true, hiddenAt: Date.now() });
  }

  window.addEventListener('pagehide', onHidden);
  window.addEventListener('online', flushPending);
  window.addEventListener('load', () => {
    recoverDrafts();
    flushPending();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      onHidden();
    } else {
      saveDraft({ hidden: false, hiddenAt: null });
      recoverDrafts();
      flushPending();
    }
  });
})();
