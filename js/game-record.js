(() => {
  const SUPABASE_URL = 'https://uxyigjfgxagtvdoyjhkq.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_XObXgkUfWibailjzU_Qtlw_UhYEvHgi';
  const PLAYER_KEY = 'sf_player_id';
  const DB_NAME = 'super-fans-records';
  const STORE_NAME = 'operations';

  let client = null;
  let dbPromise = null;
  let currentGame = null;
  let currentQuestion = null;
  let sequenceNo = 0;
  let queueChain = Promise.resolve();
  let flushing = false;

  const uuid = () => {
    if (crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 3 | 8)).toString(16);
    });
  };

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

  async function getOperations() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).getAll();
      request.onsuccess = () => resolve(request.result.sort((a, b) => a.createdAt - b.createdAt));
      request.onerror = () => reject(request.error);
    });
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
    const operation = { id: uuid(), action, body, createdAt: Date.now() };
    queueChain = queueChain.then(async () => {
      await putOperation(operation);
      flushPending();
    }).catch(error => {
      console.warn('[GameRecord] 暫存失敗：', error);
    });
    return queueChain;
  }

  async function flushPending() {
    if (flushing || !navigator.onLine) return;
    flushing = true;
    try {
      await ensureAnonymousSession();
      const supabase = getClient();
      const operations = await getOperations();

      for (const operation of operations) {
        if (!navigator.onLine) break;
        const { error } = await supabase.functions.invoke('game-record', {
          body: operation.body
        });
        if (error) {
          console.warn('[GameRecord] 上傳暫時失敗，保留待補傳資料：', error);
          break;
        }
        await deleteOperation(operation.id);
      }
    } catch (error) {
      console.warn('[GameRecord] 尚未能連線，資料會保留待補傳：', error);
    } finally {
      flushing = false;
    }
  }

  function addEvent(type, data = {}) {
    if (!currentQuestion) return;
    currentQuestion.events.push({
      sequence_no: ++sequenceNo,
      event_type: type,
      event_data: data,
      occurred_at: new Date().toISOString()
    });
  }

  function startGame(options) {
    currentGame = {
      id: uuid(),
      player_id: getPlayerId(),
      startedAt: Date.now()
    };
    currentQuestion = null;
    sequenceNo = 0;

    enqueue('start', {
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
    });
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
    flushPending
  };

  window.addEventListener('online', flushPending);
  window.addEventListener('load', flushPending);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') flushPending();
  });
})();
