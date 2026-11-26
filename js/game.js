/* ========================================
   INDEX 目錄
   01. 設定與狀態 (遊戲參數、評級、遊戲狀態與共用常數)
   02. 共用功能 (DOM 工具、文字處理、音訊與計時功能)
   03. 答題與計分 (分數計算、選項作答、答對與逾時處理)
   04. 遊戲流程 (開始遊戲、切換題目、歌詞接唱與題目載入)
   05. 畫面呈現與初始化 (進度、動畫、答案揭曉、結算、測試與裝置初始化)
======================================== */

/* ==========================================
   01. 設定與狀態
   遊戲參數、評級、遊戲狀態與共用常數
========================================== */

const CFG = {
  BASE: 60,
  SPEED: 50,
  FULL_AT: 20,
  COMBO_STEP: 11,
  COMBO_MAX: 99,
  CHOICE_SPEED_RATE: .5,
  CHOICE_COMBO_RATE: .5,
  CHOICE_BASE_RATE: .75,
  PAUSE_MAX: 1,
  CHOICE_COST: 0,
  MAX_TIME: 20,
  TEXT_BUFFER: 10,
  REVEAL_MS: 5000,
  LYRIC_PLAY_SEC: 8,   // 接歌詞：題庫沒填 playUntil 時的預設秒數
  TYPING_GRACE: 3   // 20 秒前幾秒內有動作，視為還在作答
};

const GRADES = [
  {k:'SSS', min:.90, title:'傳奇鐵粉猜歌王', desc:'前奏一下就秒殺全場，猜歌王非你莫屬！'},
  {k:'SS',  min:.80, title:'骨灰級粉絲',     desc:'你是電你是光你是唯一的神話。'},
  {k:'S',   min:.65, title:'後援會團長',       desc:'如果舞台會說話，他一定喊得出你的名字。'},
  {k:'A+',  min:.55, title:'行走的音樂資料庫',     desc:'主打歌、B 面歌都難不倒你！'},
  {k:'A',   min:.40, title:'副歌哼唱專家',       desc:'旋律一響就知道，歌名永遠卡在嘴邊：「欸就那首啊～」'},
  {k:'B',   min:.22, title:'入坑潛力股',     desc:'一隻腳已經踏進坑裡，再聽幾張專輯就回不去囉！'},
  {k:'C',   min:.125, title:'全場應援王',    desc:'歌可以不認識，選項可不能冷落任何一個。'},
  {k:'D',   min:1e-9, title:'路人粉',    desc:'本命歌還在路上，先把歌單從頭循環一遍吧！'},
  {k:'F',   min:0,    title:'佛系聽眾',  desc:'享受音樂才是終身大事。'}
];

// 遊戲進度
let theme = 'drama',
    queue = [],
    qPtr = 0,
    qDone = 0,
    total = 10,
    cur = null;

// 模式與答題狀態
let active = false,
    isDemo = false,
    choiceUsed = false,
    choiceMiss = false,
    usedChoice = false,
    usedHint = false,
    lyricsItemCount = 0;

// 分數與連擊
let score = 0,
    shown = 0,
    combo = 0,
    maxCombo = 0,
    cds = [],
    scoreRAF = null;

// 本題答題次數（計分用）
let questionAttempts = 0;
let recordQuestionStartedAt = 0;
let recordCorrectCount = 0;
let recordQuestionsCompleted = 0;

// 計時與暫停
let reqId = 0,
    audioPlayId = 0,
    startAt = 0,
    totalAnswerTime = 0,
    questionStartAt = 0,
    questionElapsed = 0,
    timeLeft = CFG.MAX_TIME,
    endAt = 0,
    tick = null,
    isPaused = false,
    nextT = null,
    hintLeft = 1,
    wasRunning = false;

let choiceItemsLeft = 5;
let hintItemsLeft = 5;
let lyricsEliminateItemsLeft = 3;
let lyricsHintItemsLeft = 3;
let lyricsEliminateUsed = false;

// 選擇題選項
let opts = [];

// 打字題 +10s：20 秒那一刻是否已判斷過（輸入框有字才給 +10s）
let bufferDecided = false;
let lastInputAt = 0;   // 最近一次作答動作的時間

// 接歌詞：片段播放
let clipTimer = null,
    pendingClip = null,
    replayLeft = 1,
    lsTick = null,
    fadeT = null,
    clip = { url: '', start: 0, dur: 8 };

// 靜音音訊：協助瀏覽器解鎖播放權限
const SILENT = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

const audio = new Audio();

audio.preload = 'auto';

/* 出題前的預告時機（秒，指「距離音樂停止還剩幾秒」） */
const LY_WARN_SEC = 3;

// 唱片變紅、燈號轉紅「出題預備」
const LY_Q_SEC    = 0;

/* 轉場節奏設定（毫秒） */
const LY_FADE_MS  = 100;

// 音樂淡出
const LY_LEAVE_MS = 300;

// 聽歌畫面退場
const LY_ENTER_MS = 500;

// 題目與選項依序進場（結束後才開始作答倒數）
// 答案揭曉前的停留時間
const TITLE_HOLD_MS = 1000;
const LY_HOLD_MS    = 2000;

const HISTORY_KEY = 'song_king_solo_history';

// 輸入法選字的 Enter 不能當成送出
// iOS Safari 的 compositionend 會比 keydown 先觸發，所以 isComposing 已經是 false，
// 要靠 keyCode 229 與「剛結束組字」的時間差一起擋
let composing = false,
    compEndAt = 0;

// 依裝置切換輸入提示
const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;


/* ==========================================
   02. 共用功能
   DOM 工具、文字處理、音訊與計時功能
========================================== */

const $ = id => document.getElementById(id);

const show = id => $(id).style.display = 'flex';

const hide = id => $(id).style.display = 'none';

// 隱藏歌單入口：主畫面 Logo 最後一個 s 連點 5 次
(() => {
  const trigger = $('secret-trigger');
  let clicks = 0;
  let timer = null;

  trigger.addEventListener('click', () => {
    clicks++;

    clearTimeout(timer);
    timer = setTimeout(() => {
      clicks = 0;
    }, 1500);

    if (clicks >= 5) {
      clearTimeout(timer);
      clicks = 0;
      hide('m-start');
      show('m-secret');
    }
  });
})();

const uniq = a => [...new Set(a)];

const shuffle = a => a.sort(() => Math.random() - .5);

// 桌面版自動聚焦輸入框
function focusInput() {
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $('inp').focus({ preventScroll: true });
  }
}

// 統一文字格式，方便比對歌名
function sanitize(s) {
  return (s || '').toLowerCase()
    .replace(/\([^)]*\)|（[^）]*）|\[[^\]]*\]|【[^】]*】/g, '')
    .replace(/[\s\-_()（）\[\]【】.,?!'"]/g, '');
}

// 歌曲比對：保留 Live、Remix 等版本資訊
function normalizeMatchText(s) {
  return (s || '').toLowerCase()
    .replace(/[()[\]{}（）【】]/g, '')
    .replace(/[\s\-_.,?!'"]/g, '');
}

// 依 Apple Music ID 取得歌曲；失敗時退回歌名搜尋
async function getAppleMusicTrack(song) {
  // 有 appleMusicId：優先查指定歌曲
  if (song?.appleMusicId) {
    try {
      const response = await fetch(
        `https://itunes.apple.com/lookup?id=${encodeURIComponent(song.appleMusicId)}&country=TW`
      );
      const data = await response.json();

      const track = (data.results || []).find(x => x.previewUrl);

      if (track) return track;
    } catch (error) {
      console.warn('Apple Music ID 查詢失敗，改用歌名搜尋：', song.title);
    }
  }

  // 沒有 ID，或 ID 查不到可播放音訊：使用原本搜尋方式
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(song.artist + ' ' + song.title)}&entity=song&limit=10&country=TW`
    );
    const data = await response.json();

    const results = (data.results || []).filter(x => x.previewUrl);

    return results.find(x =>
      normalizeMatchText(x.artistName).includes(normalizeMatchText(song.artist)) &&
      normalizeMatchText(x.trackName) === normalizeMatchText(song.title)
    ) || null;

  } catch (error) {
    return null;
  }
}

// 歌名模式：提前查詢並預載歌曲，避免切題後才開始等待
const songPreloadCache = new Map();

function prepareSong(term) {
  if (!term) return Promise.resolve(null);
  if (songPreloadCache.has(term)) return songPreloadCache.get(term);

  const task = (async () => {
    const sp = term.indexOf(' ');
    const artist = term.slice(0, sp);
    const title = term.slice(sp + 1);
    const song = TRACKS.find(track =>
      normalizeMatchText(track.artist) === normalizeMatchText(artist) &&
      normalizeMatchText(track.title) === normalizeMatchText(title)
    );

    const track = await getAppleMusicTrack({
      artist,
      title,
      appleMusicId: song?.appleMusicId
    });

    if (!track?.previewUrl) return null;

    // 獨立音訊物件在背景載入；正式播放時由共用 audio 接手
    const preloadAudio = new Audio();
    preloadAudio.preload = 'auto';
    preloadAudio.src = track.previewUrl;
    preloadAudio.load();

    return { track, preloadAudio };
  })().catch(() => null);

  songPreloadCache.set(term, task);
  return task;
}

// 歌詞字數轉換成星星（中文逐字、英文逐詞、數字逐字）
function updateLyricStars(text) {
  const units = text.match(/[\p{Script=Han}\p{N}]|[\p{L}]+(?:['’][\p{L}]+)?/gu) || [];

  const stars = Array(units.length).fill('✦').join(' ');

  $('lyric-prompt').style.setProperty(
    '--lyric-stars',
    JSON.stringify(stars)
  );
}

// 歌詞題型共用：所有題型統一從 answer 取得正解
function getLyricAnswer() {
  return cur?.answer || '';
}

function startRecordQuestion() {
  if (!window.GameRecord || !cur || recordQuestionStartedAt) return;
  recordQuestionStartedAt = Date.now();
  let songNo = cur.id || null;
  if (!songNo && cur.artist && cur.title) {
    const track = TRACKS.find(item =>
      normalizeMatchText(item.artist) === normalizeMatchText(cur.artist) &&
      normalizeMatchText(item.title) === normalizeMatchText(cur.title)
    );
    songNo = track?.no || null;
  }
  window.GameRecord.startQuestion({
    question_no: qDone + 1,
    song_no: songNo,
    question_type: isLyricsMode() ? cur.type : (usedChoice ? 'choice' : 'text')
  });
}

function recordAnswerEvent(answer, isCorrect, inputType) {
  if (!window.GameRecord || !recordQuestionStartedAt) return;
  window.GameRecord.recordEvent('answer_submitted', {
    answer,
    is_correct: !!isCorrect,
    input_type: inputType,
    attempt_no: questionAttempts
  });
}

function completeRecordQuestion(isCorrect, reason, points = 0) {
  if (!window.GameRecord || !recordQuestionStartedAt) return;
  const elapsed = Math.max(0, Date.now() - recordQuestionStartedAt);
  window.GameRecord.completeQuestion({
    is_correct: isCorrect,
    reason,
    attempt_count: questionAttempts,
    used_hint: usedHint,
    is_skipped: false,
    time: elapsed,
    score: Math.max(0, points)
  });
  recordQuestionsCompleted++;
  if (isCorrect) recordCorrectCount++;
  recordQuestionStartedAt = 0;
}

// 歌詞呈現：prompt 與 answer 統一欄位，依 type 決定遮蔽位置
function renderLyricPrompt(item) {
  const root = $('lyric-prev');
  root.replaceChildren();

  const addGap = text => {
    const gap = document.createElement('span');
    gap.className = 'gap';
    gap.textContent = text || '';
    return gap;
  };

  const prompt = item.prompt || '';
  const answer = item.answer || '';

  if (item.type === 'fill') {
    const parts = prompt.split('{{blank}}');
    root.classList.add('is-fill');

    const fill = document.createElement('div');
    fill.className = 'lc-fill';

    fill.append(document.createTextNode(parts[0] || ''));
    fill.append(addGap(answer));

    if (parts.length > 1) {
      fill.append(document.createTextNode(parts.slice(1).join('{{blank}}')));
    }

    root.append(fill);
    return;
  }

  root.classList.remove('is-fill');

  const context = document.createElement('div');
  context.className = 'lc-context';
  context.textContent = prompt;

  const answerLine = document.createElement('div');
  answerLine.className = 'lc-answer';
  answerLine.append(addGap(answer));

  if (item.type === 'previous') {
    root.append(answerLine, context);
  } else {
    root.append(context, answerLine);
  }
}

// 秒數 → mm:ss
function fmtTime(sec) {
  return String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
}

// 目前可用的歌曲清單（試玩模式混合三個歌單）
function songPool() {
  const pool = isDemo
    ? [...playlists.drama, ...playlists.she, ...playlists.fish]
    : playlists[theme];

  // 歌單若使用歌曲編號，從 TRACKS 取得完整歌曲資料
  const resolvedPool = pool
    .map(item => {
      if (!/^\d+$/.test(item)) return item;

      const song = TRACKS.find(track => track.no === item);
      return song ? `${song.artist} ${song.title}` : null;
    })
    .filter(Boolean);

  // TEST 中的歌曲保留資料，但不參與任何一般歌名模式或試玩模式
  const inactiveSongs = typeof TEST !== 'undefined' ? TEST : [];

  return resolvedPool.filter(term =>
    !inactiveSongs.some(song =>
      normalizeMatchText(term) ===
      normalizeMatchText(`${song.artist} ${song.title}`)
    )
  );
}

function isLyricsMode() {
  return !isDemo && ['lyrics', 'helloNico'].includes(theme);
}

function unlockAudio() {
  audio.src = SILENT;
  const p = audio.play();
  if (p) p.then(() => audio.pause()).catch(() => {});

  // 預熱歌詞接唱的錯誤音效
  const wrongSound = $('wrong-sound');
  wrongSound.muted = true;

  wrongSound.play().then(() => {
    wrongSound.pause();
    wrongSound.currentTime = 0;
    wrongSound.muted = false;
  }).catch(() => {
    wrongSound.muted = false;
  });
}

// 累計目前這一段作答時間
function accumulateQuestionTime() {
  if (questionStartAt) {
    questionElapsed += (Date.now() - questionStartAt) / 1000;
    questionStartAt = 0;
  }
}

// 結束本題計時，加入整局總時間
function finishQuestionTime() {
  accumulateQuestionTime();
  totalAnswerTime += questionElapsed;
  questionElapsed = 0;
}

// 隱藏 +10s 標籤（只淡出，不移除 urgent，避免淡出時閃回原色）
function clearBufferUI() {
  $('buffer-hint').classList.remove('show');
}

// 結束時凍結輸入框：保留文字，沒答對且有字就顯示紅框
function freezeInput(markWrong) {
  if (isLyricsMode() || usedChoice) return;
  const inp = $('inp');
  inp.readOnly = true;
  inp.blur();   // 同時收起手機鍵盤
  inp.classList.toggle('final-wrong', markWrong && inp.value.trim().length > 0);
}

// 顯示答錯扣秒動畫
function showTimePenalty(oldWidth, newWidth) {
  const el = $('tpenalty');

  el.classList.remove('play');

  // 紅色區段位於扣秒前後的尾端差距
  el.style.left = newWidth + '%';
  el.style.width = (oldWidth - newWidth) + '%';

  // 重新觸發動畫
  void el.offsetWidth;
  el.classList.add('play');
}

function runTimer(resetDeadline = true) {
  clearInterval(tick);
  if (resetDeadline) endAt = Date.now() + timeLeft * 1000;

  tick = setInterval(() => {
    timeLeft = Math.max(0, (endAt - Date.now()) / 1000);

    const elapsed = questionStartAt
      ? Math.max(0, (Date.now() - questionStartAt) / 1000)
      : 0;
    const isTypingQuestion = !isLyricsMode() && !usedChoice;

    let danger = timeLeft <= 3;

    if (isTypingQuestion) {
      const inBuffer = elapsed >= CFG.MAX_TIME;

      // 20 秒那一刻：輸入框有字才給 +10s，空的就直接逾時
      if (inBuffer && !bufferDecided) {
        bufferDecided = true;

        const recentlyActive = Date.now() - lastInputAt <= CFG.TYPING_GRACE * 1000;
    if (!recentlyActive && $('inp').value.trim().length < 1) {
          clearInterval(tick);
          timeout();
          return;
        }
      }

      const normalRemaining = Math.max(0, CFG.MAX_TIME - elapsed);
      const bufferRemaining = Math.max(
        0,
        CFG.MAX_TIME + CFG.TEXT_BUFFER - Math.max(elapsed, CFG.MAX_TIME)
      );

      // 只有「正常作答的最後 3 秒」才亮 danger；+10s 階段交給左上角標籤
      danger = !inBuffer && normalRemaining <= 3;

      // 計時條只顯示正常作答的 20 秒
      $('tbar').style.width = (normalRemaining / CFG.MAX_TIME * 100) + '%';
      $('tbuffer').style.width = '0%';
      $('choice-btn').disabled =
  usedHint || choiceUsed || choiceItemsLeft <= 0 || inBuffer;

      if (inBuffer) {
        // 音樂停止
        if (!audio.paused) {
          audio.pause();
          $('disc').classList.remove('spin');
          $('cd').classList.remove('on');
        }

        // 輸入框左上角：完成作答 10s、9s...
        const hint = $('buffer-hint');
        hint.textContent = '完成作答 ' + Math.ceil(bufferRemaining) + 's';
        hint.classList.add('show');
        hint.classList.toggle('urgent', bufferRemaining <= 3);

        $('tnum').textContent = '完成作答';
      } else {
        $('tnum').textContent = '剩餘 ' + Math.ceil(normalRemaining) + 's';
      }

      $('tbuffer-label').textContent = '';
    } else {
      clearBufferUI();
      $('tbar').style.width = (timeLeft / CFG.MAX_TIME * 100) + '%';
      $('tbuffer').style.width = '0%';
      $('tnum').textContent = '剩餘 ' + Math.ceil(timeLeft) + 's';
      $('tbuffer-label').textContent = '';
    }

    // 紅色扣秒標記跟隨黑色時間軸尾端
        const penalty = $('tpenalty');

        if (penalty.classList.contains('play')) {
          penalty.style.left = $('tbar').style.width;
        }

    $('trow').classList.toggle('danger', danger);

    if (timeLeft <= 0) {
      clearInterval(tick);
      timeout();
    }
  }, 50);
}

function stopAll() {
  audioPlayId++; // 讓尚未完成的舊音訊回呼失效
  clearInterval(tick);
  clearTimeout(clipTimer);
  clearInterval(lsTick);
  clearInterval(fadeT);
  pendingClip = null;
  audio.pause();
  audio.volume = 1;
  $('disc').classList.remove('spin');
  $('cd').classList.remove('on');
  $('trow').classList.remove('danger');
  clearBufferUI();
}

function playNow() {
  const myReq = reqId;
  const myPlay = ++audioPlayId;

  return audio.play()
    .then(() => {
      // 題目或播放流程已更新：忽略舊回呼，避免重啟計時器
      if (myReq !== reqId || myPlay !== audioPlayId || !active) return;

      $('tap').style.display = 'none';
      $('disc').classList.add('spin');
      $('cd').classList.add('on');

      $('choice-btn').disabled =
  choiceUsed || usedHint || choiceItemsLeft <= 0;
      $('choice-sub').textContent = usedHint
  ? '不可併用'
  : choiceUsed
    ? '已使用'
    : choiceItemsLeft <= 0
      ? '已用完'
      : `剩 ${choiceItemsLeft} 次`;

      questionStartAt = Date.now();
      startRecordQuestion();

      runTimer();
    })
    .catch(() => {
      if (myReq !== reqId || myPlay !== audioPlayId || !active) return;
      $('tap').style.display = 'flex';
    });
}

// 一字提示
function doHint() {
  if (isLyricsMode()) return;
  if (!active || isPaused || hintLeft <= 0 || hintItemsLeft <= 0 || !cur) return;
  if (usedChoice) return;

  hintLeft--;
  hintItemsLeft--;
  usedHint = true;
  if (window.GameRecord) window.GameRecord.recordEvent('hint_used', { type: 'first_letter' });
  updHintBtn();

  // 首字提示與切換選擇題不可併用
  $('choice-btn').disabled =
  usedHint || choiceUsed || choiceItemsLeft <= 0 || inBuffer;
  $('choice-sub').textContent = '不可併用';

  $('inp').value = cur.title.trim().charAt(0);
  lastInputAt = Date.now();
}

// 更新提示按鈕
function updHintBtn() {
  const disabled = hintLeft <= 0 || hintItemsLeft <= 0;

  $('pause-btn').disabled = disabled;
  $('pause-sub').textContent = hintItemsLeft <= 0
    ? '已用完'
    : `剩 ${hintItemsLeft} 次`;
}


/* ==========================================
   03. 答題與計分
   分數計算、選項作答、答對與逾時處理
========================================== */

function calcScore(isChoice, tLeft, comboNow, lostCombo, attempts, usedHint = false) {
  // 依答題次數降低基本分
  const rates = [1, 0.79, 0.57, 0.36, 0.14];
  const attemptRate = rates[Math.min(attempts, 5) - 1] || 0.14;

  const base = Math.round(CFG.BASE * attemptRate * (isChoice ? 0.4 : 1));

  // 速度分數
  let speed = Math.round(
    CFG.SPEED *
    Math.min(1, tLeft / CFG.FULL_AT) *
    (isChoice ? CFG.CHOICE_SPEED_RATE : 1)
  );

  // 選擇題答錯後，不給速度分數
  if (isChoice && attempts > 1) {
    speed = 0;
  }

  // 自由輸入答錯後，速度分數最多一半
  if (!isChoice && attempts > 1) {
    speed = Math.min(speed, Math.round(CFG.SPEED * 0.5));
  }

  // 連擊分數
  const bonus = lostCombo ? 0 : Math.round(
    Math.min(CFG.COMBO_MAX, Math.max(0, comboNow - 1) * CFG.COMBO_STEP) *
    (isChoice ? CFG.CHOICE_COMBO_RATE : 1)
  );

  // 提示折扣：首字提示 + 選擇題，額外降至 20%
  const hintRate = isLyricsMode()
    ? Math.pow(0.5, lyricsItemCount)
    : usedHint && isChoice
      ? 0.2
      : usedHint
        ? 0.8
        : 1;

  const totalScore = base + speed + bonus;

  return {
    speed,
    bonus,
    total: Math.round(totalScore * hintRate)
  };
}

// 本局理論最高分
function maxScore(n = total) {
  let m = n * (CFG.BASE + CFG.SPEED);
  for (let i = 0; i < n; i++) m += Math.min(CFG.COMBO_MAX, i * CFG.COMBO_STEP);
  return m;
}

// 依得分比例判斷評級
function grade(s) {
  const mx = maxScore(),
        r = mx > 0 ? s / mx : 0;
  return GRADES.find(g => r >= g.min);
}

/* 接歌詞道具：隨機刪掉一個錯誤選項（分數 ×0.8，不影響連擊） */
function useEliminate() {
  if (!active || isPaused || !isLyricsMode() || lyricsEliminateItemsLeft <= 0) return;

  const remaining = [...$('ogrid').querySelectorAll('.opt:not(:disabled)')];

  const wrongs = remaining
    .filter(b => opts[+b.dataset.i] !== getLyricAnswer());

  // 次數已用完時，優先維持「已用完」
if (lyricsEliminateItemsLeft <= 0) {
  $('choice-btn').disabled = true;
  $('choice-sub').textContent = '已用完';
  return;
}

// 剩餘選項不足時，暫時無法使用
if (remaining.length <= 2 || wrongs.length < 2) {
  $('choice-btn').disabled = true;
  $('choice-sub').textContent = '選項不足';
  return;
}

  const b = wrongs[Math.floor(Math.random() * wrongs.length)];
  b.disabled = true;
  b.classList.add('removed');
  lyricsEliminateUsed = true;

  usedHint = true;
if (window.GameRecord) window.GameRecord.recordEvent('hint_used', { type: 'eliminate' });
lyricsItemCount++;
lyricsEliminateItemsLeft--;

$('choice-btn').disabled = true;
$('choice-sub').textContent = lyricsEliminateItemsLeft <= 0
  ? '已用完'
  : `剩 ${lyricsEliminateItemsLeft} 次`;
}

function submitAnswer() {
  if (!active || isPaused) return;

  const v = $('inp').value.trim();
  if (!v) return;

  questionAttempts++;
  const isCorrect = sanitize(v) === sanitize(cur.title);
  recordAnswerEvent(v, isCorrect, 'text');

  if (isCorrect) {
    correct(false);
    return;
  }

  // 答錯立即中斷連擊
  choiceMiss = true;
  combo = 0;
  updCombo();

  lastInputAt = Date.now();   // 答錯後輸入框被清空，但仍算有在作答

  $('inp').value = '';
  $('inp').readOnly = false;
  $('inp').classList.remove('final-wrong');

  const b = $('inp');
  b.classList.remove('shake');
  void b.offsetWidth;
  b.classList.add('shake');
  setTimeout(() => b.classList.remove('shake'), 400);

  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    b.focus({ preventScroll: true });
  }
}

// 改選擇題
function toChoice() {
  if (isLyricsMode()) return;
  if (!active || isPaused || choiceUsed || usedHint || choiceItemsLeft <= 0) return;

  const hasStarted = !!questionStartAt;

  if (hasStarted) {
    const elapsed = (Date.now() - questionStartAt) / 1000;
    if (elapsed >= CFG.MAX_TIME) {
      $('choice-btn').disabled = true;
      return;
    }

    timeLeft = Math.max(0, CFG.MAX_TIME - elapsed);
    endAt = questionStartAt + CFG.MAX_TIME * 1000;
    audioPlayId++; // 已開始播放時，保留舊回呼防護
  } else {
    // 音訊播放回呼尚未完成：先切換介面，等播放成功再開始倒數
    timeLeft = CFG.MAX_TIME;
  }

  clearInterval(tick);

  choiceUsed = true;
  usedChoice = true;
  choiceItemsLeft--;
  $('choice-btn').disabled = choiceItemsLeft <= 0;
  $('choice-sub').textContent = choiceItemsLeft <= 0
  ? '已用完'
  : `剩 ${choiceItemsLeft} 次`;
  if (window.GameRecord) window.GameRecord.recordEvent('choice_mode_selected');
  $('choice-btn').disabled = true;
  $('pause-btn').disabled = true;
  $('pause-sub').textContent = '不可併用';

  if (CFG.CHOICE_COST) {
    setScore(Math.max(0, score - CFG.CHOICE_COST));
    tag('l', '使用錦囊 🪙' + CFG.CHOICE_COST, '#ffc857');
  }

  const pool = uniq(songPool().map(s => s.slice(s.indexOf(' ') + 1)))
    .filter(t => sanitize(t) !== sanitize(cur.title));

  opts = shuffle([...shuffle(pool).slice(0, 3), cur.title]);

  $('ogrid').innerHTML = opts.map((o, i) => `<button class="opt" data-i="${i}"></button>`).join('');
  $('ogrid').querySelectorAll('.opt').forEach((b, i) => { b.textContent = opts[i]; });

  $('type-sec').style.display = 'none';
  $('choice-sec').style.display = 'block';

  $('trow').classList.add('single-mode');
  $('tbuffer').style.width = '0%';
  $('tbar').style.width = (timeLeft / CFG.MAX_TIME * 100) + '%';
  $('tnum').textContent = '剩餘 ' + Math.ceil(timeLeft) + 's';
  $('tbuffer-label').textContent = '';

  // 若播放尚未成功，playNow() 成功後才會啟動計時
  if (hasStarted) runTimer(false);
}

$('ogrid').onclick = e => {
  const b = e.target.closest('.opt');
  if (!b || !active || isPaused || b.disabled) return;

  questionAttempts++;
  const selectedAnswer = opts[+b.dataset.i];
  const isCorrect = selectedAnswer === (isLyricsMode() ? getLyricAnswer() : cur.title);
  recordAnswerEvent(selectedAnswer, isCorrect, 'choice');

  if (isCorrect) {
    correct(isLyricsMode() ? false : true);
    return;
  }

// 兩種模式：選擇題答錯都扣除 3 秒
const oldWidth = timeLeft / CFG.MAX_TIME * 100;

endAt -= 5000;

timeLeft = Math.max(0, (endAt - Date.now()) / 1000);

const newWidth = timeLeft / CFG.MAX_TIME * 100;

showTimePenalty(oldWidth, newWidth);

if (timeLeft <= 0) {
  timeLeft = 0;
  $('tnum').textContent = '剩餘 0s';

  clearInterval(tick);

  clipTimer = setTimeout(() => {
    $('tbar').style.width = '0%';
    timeout();
  }, 250);

  return;
}

  b.disabled = true;

  // 兩種模式共用同一個答錯狀態：按下後立即進入深灰內縮
  b.classList.add('wrong');

  if (!isLyricsMode()) {
    // 歌名快答：叉叉獨立成為可上色的元素
    const mark = document.createElement('span');
    mark.className = 'wrong-mark';
    mark.textContent = '✖';
    b.append(document.createTextNode(' '), mark);
  }

  // 答錯立即中斷連擊
  choiceMiss = true;
  combo = 0;
  updCombo();

  const remaining = [...$('ogrid').querySelectorAll('.opt:not(:disabled)')];

  if (isLyricsMode() && remaining.length <= 2) {
  $('choice-btn').disabled = true;

  $('choice-sub').textContent =
    lyricsEliminateItemsLeft <= 0
      ? '已用完'
      : lyricsEliminateUsed
        ? `剩 ${lyricsEliminateItemsLeft} 次`
        : '選項不足';
}

  if (remaining.length <= 1) {
    // 歌詞接唱才播放錯誤音效
    if (isLyricsMode()) {
      const wrongSound = $('wrong-sound');
      wrongSound.currentTime = 0;
      wrongSound.play().catch(() => {});
    }

    active = false;
    finishQuestionTime();
    completeRecordQuestion(false, 'wrong', 0);

    cds.push({ art: cur.art, cond: 'poor' });

    // 保留 0.3 秒答錯回饋時間，但顏色不再延遲切換
    setTimeout(holdCorrectChoice, 300);
  }
};


function correct(isChoice) {
  if (!isChoice) freezeInput(false);

  timeLeft = Math.max(0, (endAt - Date.now()) / 1000);
  finishQuestionTime();
  clearBufferUI();

  combo++;
  maxCombo = Math.max(maxCombo, combo);

  const scoreTimeLeft = isLyricsMode() || isChoice
    ? timeLeft
    : Math.max(0, timeLeft - CFG.TEXT_BUFFER);
  const s = calcScore(isChoice, scoreTimeLeft, combo, choiceMiss || (usedHint && isChoice), questionAttempts, usedHint);

  // 首字提示 + 選擇題：中斷連擊
  if (usedHint && isChoice) {
    combo = 0;
    updCombo();
  }

  // 專輯品質：剩餘時間越多越好
  let cond = 'near-mint';
  if (scoreTimeLeft >= 10) cond = 'gem-mint';
  else if (scoreTimeLeft < 5) cond = 'good';

  cds.push({art: cur.art, cond});

  completeRecordQuestion(true, 'correct', s.total);
  setScore(score + s.total);
  updCombo(true);

  if (s.speed) tag('r', `⚡ 速度 +${s.speed}`, '#4fd6ff', 0);
  if (s.bonus) tag('r', `🔥 連擊 +${s.bonus}`, '#ff5ca8', 100);

  holdCorrectChoice();
}

function holdCorrectChoice() {
  active = false;
  clearInterval(tick);
  $('trow').classList.remove('danger');
  clearBufferUI();

  if (isLyricsMode()) revealLyricCard();

  const answer = isLyricsMode() ? getLyricAnswer() : cur.title;

  const right = [...$('ogrid').querySelectorAll('.opt')]
    .find(b => opts[+b.dataset.i] === answer);

  if (right) right.classList.add('correct');

  $('ogrid').classList.add('held');

  if (isLyricsMode() && clip.url) {
    audio.volume = 1;
    audio.play().catch(() => {});
  }

  clearTimeout(clipTimer);
  const holdMs = isLyricsMode() ? LY_HOLD_MS : TITLE_HOLD_MS;
  clipTimer = setTimeout(reveal, holdMs);
}


function timeout() {
  finishQuestionTime();
  completeRecordQuestion(false, 'timeout', 0);
  clearBufferUI();
  combo = 0;
  updCombo();

  cds.push({art: cur.art, cond: 'poor'});

  active = false;
  freezeInput(true);
  $('timeout-overlay').style.display = 'flex';

  // 逾時後也要讓玩家看見正解，流程與答對時一致。
  // 使用共用計時器，切換題目時 stopAll() 可以一併清除。
  clearTimeout(clipTimer);
  clipTimer = setTimeout(() => {
    $('timeout-overlay').style.display = 'none';

    if (isLyricsMode()) {
      // 逾時也沿用答對時的正解揭曉流程
      holdCorrectChoice();
    } else {
      reveal();
    }
  }, 1200);
}


/* ==========================================
   04. 遊戲流程
   開始遊戲、切換題目、歌詞接唱與題目載入
========================================== */

let playlistIntroTimer = null;
let playlistIntroArtworkRequest = 0;
const playlistIntroArtworkCache = new Map();

// 取得歌單封面，背景預載時不影響目前選中的歌單
async function fetchPlaylistIntroArtwork(k) {
  const previousTheme = theme;
  theme = k;
  const pool = songPool();
  theme = previousTheme;

  if (!pool?.length) return null;

  const term = pool[Math.floor(Math.random() * pool.length)];
  const splitAt = term.indexOf(' ');
  if (splitAt < 1) return null;

  const song = {
    artist: term.slice(0, splitAt),
    title: term.slice(splitAt + 1)
  };

  const track = await getAppleMusicTrack(song);
  if (!track?.artworkUrl100) return null;

  const url = track.artworkUrl100.replace('100x100', '600x600');
  const preloadImage = new Image();

  return new Promise(resolve => {
    preloadImage.onload = () => resolve(url);
    preloadImage.onerror = () => resolve(null);
    preloadImage.src = url;
  });
}

// 點歌目錄打開時，先在背景預載可玩的歌單封面
function preloadPlaylistIntroArtworks(keys) {
  keys.forEach(k => {
    if (!playlistIntroArtworkCache.has(k)) {
      playlistIntroArtworkCache.set(k, fetchPlaylistIntroArtwork(k).catch(() => null));
    }
  });
}
window.preloadPlaylistIntroArtworks = preloadPlaylistIntroArtworks;

function loadPlaylistIntroArtwork(k) {
  const image = $('playlist-intro-art');
  const requestId = ++playlistIntroArtworkRequest;
  const deadline = Date.now() + 3000;

  image.style.opacity = '0';
  image.style.display = 'none';
  image.removeAttribute('src');

  if (!playlistIntroArtworkCache.has(k)) {
    playlistIntroArtworkCache.set(k, fetchPlaylistIntroArtwork(k).catch(() => null));
  }

  playlistIntroArtworkCache.get(k).then(url => {
    if (requestId !== playlistIntroArtworkRequest || !url || Date.now() >= deadline) return;

    const revealArtwork = () => {
      // 等瀏覽器先繪製透明狀態，再開始淡入；避免手機跳過 transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (requestId !== playlistIntroArtworkRequest) return;

          // 開場時間已結束就不補顯示，絕不影響遊戲開始
          if (Date.now() >= deadline) {
            image.style.display = 'none';
            return;
          }

          image.style.opacity = '1';
        });
      });
    };

    image.onload = revealArtwork;
    image.onerror = () => {
      if (requestId === playlistIntroArtworkRequest) image.style.display = 'none';
    };

    image.src = url;
    image.style.display = 'block';

    // 圖片已在背景載入完成時，也沿用淡入效果
    if (image.complete && image.naturalWidth > 0) revealArtwork();
  });
}

function pickTheme(k) {
  theme = k;

  // 先在使用者點擊時解鎖音訊，避免延遲開始後被瀏覽器擋下播放
  unlockAudio();

  $('playlist-intro-name').textContent =
    (typeof names !== 'undefined' && names[k]) || k;
  loadPlaylistIntroArtwork(k);

  clearTimeout(playlistIntroTimer);

  const intro = $('playlist-intro');
  intro.classList.remove('is-active');
  show('playlist-intro');

  // 每次顯示時重新啟動圓環動畫，避免它在隱藏畫面時就先跑完
  void intro.offsetWidth;
  intro.classList.add('is-active');

  playlistIntroTimer = setTimeout(() => {
    playlistIntroTimer = null;
    hide('playlist-intro');
    startGame();
  }, 3000);
}

function cancelPlaylistIntro() {
  clearTimeout(playlistIntroTimer);
  playlistIntroTimer = null;
  hide('playlist-intro');
  openCatalog();
}

function begin(demo) {
  unlockAudio();

  isDemo = demo;
  total = demo ? 3 : 10;

  // 歌詞題目只使用目前仍在 TRACKS 的歌曲，TEST 中的歌曲不會進入遊戲
  const availableTrackNos = new Set(TRACKS.map(song => song.no));

  queue = isLyricsMode()
    ? shuffle([
        ...(theme === 'helloNico' ? HELLO_NICO_DATABASE : SONG_DATABASE)
      ].filter(item => availableTrackNos.has(item.no))).slice(0, total)
    : shuffle(uniq(songPool())).slice(0, total);

  // 沒有可用題目時，留在原畫面，不進入遊戲或倒數
  if (!queue.length) {
    alert('目前沒有可遊玩的歌曲，請先確認歌單內容。');
    return;
  }

  document.querySelectorAll('.ov').forEach(m => m.style.display = 'none');

  $('mode').textContent = demo
    ? '試玩模式'
    : (isLyricsMode()
        ? (theme === 'helloNico' ? '歌詞接唱' : '歌詞接唱')
        : '歌名搶答');
  $('mode').style.display = 'block';
  $('quit-btn').style.display = 'block';

  hintLeft = 1;
choiceItemsLeft = 5;
hintItemsLeft = 5;
lyricsEliminateItemsLeft = 3;
lyricsHintItemsLeft = 3;
usedChoice = false;

$('choice-btn').disabled = false;
$('choice-sub').textContent = '剩 5 次';
updHintBtn();

  score = 0;
  shown = 0;
  combo = 0;
  maxCombo = 0;

  // 重置答題次數
  questionAttempts = 0;
  qDone = 0;
  qPtr = 0;
  cds = [];

  $('score').textContent = '0';
  updCombo();
  renderProg();

  startAt = Date.now();
  recordCorrectCount = 0;
  recordQuestionsCompleted = 0;
  if (window.GameRecord) {
    window.GameRecord.startGame({
      game_mode: isLyricsMode() ? 'lyrics' : 'song',
      playlist_key: demo ? null : theme,
      is_demo: demo,
      scoring_version: 'v1',
      scoring_snapshot: { CFG: { ...CFG }, GRADES: GRADES.map(g => ({ ...g })) }
    });
  }
  totalAnswerTime = 0;
  questionElapsed = 0;
  questionStartAt = 0;

  // 倒數期間先查詢並預載第一首歌；試玩模式也同步背景準備
  if (!isLyricsMode()) prepareSong(queue[qPtr]);

  // 正式遊戲已在選歌單畫面等待 2 秒，這裡直接進入第一題
  loadQuestion();
}
const startGame = () => begin(false);

const startDemo = () => begin(true);

function toTheme() {
  ['m-start', 'm-demo', 'm-result', 'm-confirm'].forEach(hide);
  openCatalog();
  $('quit-btn').style.display = 'none';
}

function confirmQuit() {
  show('m-confirm');
}

function cancelQuit() {
  hide('m-confirm');
}

function doQuit() {
  if (recordQuestionStartedAt) {
    finishQuestionTime();
    completeRecordQuestion(null, 'abandoned', 0);
  }
  if (window.GameRecord) window.GameRecord.finishGame({
    status: 'abandoned', total_questions: recordQuestionsCompleted,
    correct_count: recordCorrectCount, total_score: score, max_combo: maxCombo
  });
  stopAll();
  hide('m-confirm');
  $('quit-btn').style.display = 'none';
  show('m-start');
  loadHistory();
}

function next() {
  if (!$('banner').classList.contains('show')) return;

  clearTimeout(nextT);
  $('banner').classList.remove('show');

  qDone++;

  if (qDone >= total) return finish();

  // 載入下一題
  loadQuestion();
}

function finish() {
  $('inp').blur();
  if (window.GameRecord) window.GameRecord.finishGame({
    status: 'completed', total_questions: recordQuestionsCompleted,
    correct_count: recordCorrectCount, total_score: score, max_combo: maxCombo
  });

  stopAll();
  renderProg();

  $('quit-btn').style.display = 'none';

  if (isDemo) {
    show('m-demo');
    return;
  }

  saveHistory();
  showResult();
}

/* 依模式切換道具列 */
function applyItemMode() {
  const c = $('choice-btn'), h = $('pause-btn');

  if (isLyricsMode()) {
  c.querySelector('.ic').textContent = '✂️';
  c.querySelector('b').textContent = '刪去一項';
  $('choice-sub').textContent = lyricsEliminateItemsLeft <= 0
    ? '已用完'
    : `剩 ${lyricsEliminateItemsLeft} 次`;
  c.disabled = lyricsEliminateItemsLeft <= 0;
  c.onclick = useEliminate;

  h.querySelector('.ic').textContent = '💡';
  h.querySelector('b').textContent = '看前後歌詞';
  $('pause-sub').textContent = lyricsHintItemsLeft <= 0
    ? '已用完'
    : `剩 ${lyricsHintItemsLeft} 次`;
  h.disabled = lyricsHintItemsLeft <= 0;
  h.onclick = revealLyricHint;
} else {
    c.querySelector('.ic').textContent = '🆘';
    c.querySelector('b').textContent = '改選擇題';
    c.onclick = toChoice;

    h.querySelector('.ic').textContent = '💡';
    h.querySelector('b').textContent = '首字提示';
    h.onclick = doHint;
  }
}

/* 接歌詞：舞台狀態（唱片轉動 / 停止） */
function setLyricStage(playing) {
  document.querySelectorAll('.ls-vinyl').forEach(v => v.classList.toggle('spin', playing));
  $('ls-ring').classList.toggle('on', playing);
  $('ls-text').textContent = '';
  $('ls-text').classList.remove('beat');
}

/* 接歌詞：播放期間不卡片 */
function showLyricText() {
  $('ls-wait').style.display = 'flex';
  $('ls-wait').style.visibility = 'hidden';
  $('lyric-prompt').style.display = 'none';
}

// 歌詞出現

/* 接歌詞：三段式狀態
   播放中（黃燈）→ 出題預備（紅燈、唱片變紅）→ 歌詞出現 */
function startLsTick() {
  clearInterval(lsTick);
  const t0 = Date.now();

  const stars = $('ls-stars').children;
  [...stars].forEach(star => star.classList.remove('off'));

  const upd = () => {
    const remain = Math.max(0, clip.dur - (Date.now() - t0) / 1000);
    const ready = remain > 0 && remain <= LY_WARN_SEC;

    const offCount = Math.min(3, Math.max(0, Math.floor(LY_WARN_SEC - remain)));

    [...stars].forEach((star, i) => {
      star.classList.toggle('off', i >= stars.length - offCount);
    });

    $('ls-ring').classList.toggle('warn', ready);
    $('ls-wait').classList.toggle('ready', ready);

    if (remain <= LY_Q_SEC) {
      showLyricText();
    } else if (ready) {
      $('ls-wait-text').textContent = '出題預備';
    }
  };

  upd();
  lsTick = setInterval(upd, 100);
}

// 答對後停留在選項畫面（音樂續播）的時間

/* 音量漸漸降到 0 再暫停（iOS Safari 不支援調音量，會直接停） */
function fadeOutAudio(ms, cb) {
  clearInterval(fadeT);
  const v0 = audio.volume, t0 = Date.now();

  fadeT = setInterval(() => {
    const p = ms > 0 ? Math.min(1, (Date.now() - t0) / ms) : 1;
    audio.volume = Math.max(0, v0 * (1 - p));

    if (p >= 1) {
      clearInterval(fadeT);
      audio.pause();
      audio.volume = 1;
      cb();
    }
  }, 40);
}

/* 接歌詞：播放指定秒數的片段（結尾淡出），停止後呼叫 done
   leaveEarly = true：音樂開始淡出時，唱片就同步慢慢退場，停止時直接接出題，不會突然跳畫面 */
function playClip(my, done, leaveEarly = false) {
  clearTimeout(clipTimer);

  const go = () => {
    if (my !== reqId) return;

    try { audio.currentTime = clip.start; } catch (e) {}
    audio.volume = 1;

    audio.play().then(() => {
      if (my !== reqId) return;

      $('tap').style.display = 'none';
      setLyricStage(true);
      startLsTick();

      // 在結束前 LY_FADE_MS 開始淡出，剛好在 playUntil 那一秒靜音
      clipTimer = setTimeout(() => {
        if (leaveEarly) $('stage').classList.add('ly-leave');

        fadeOutAudio(LY_FADE_MS, () => {
          clearInterval(lsTick);
          setLyricStage(false);
          if (my === reqId) done();
        });
      }, Math.max(0, clip.dur * 1000 - LY_FADE_MS));
    }).catch(() => {
      if (my !== reqId) return;
      pendingClip = go;
      $('tap').style.display = 'flex';
    });
  };

  go();
}

// 答案不換行：太寬就縮小字級，直到放得進卡片
function fitLyricLine() {
  const line = $('lyric-prompt').querySelector('.lc-answer')
            || $('lyric-prompt').querySelector('.lc-prev');
  const gap = line?.querySelector('.gap');
  if (!gap) return;

  line.style.fontSize = '';                       // 先還原成 CSS 設定的大小
  const maxW = line.parentElement.clientWidth;    // 卡片內可用寬度
  let size = parseFloat(getComputedStyle(line).fontSize);

  while (gap.getBoundingClientRect().width > maxW && size > 12) {
    size -= 1;
    line.style.fontSize = size + 'px';
  }
}

/* 接歌詞：轉場到出題（唱片縮小 → 面板滑上 → 題目與選項依序出現 → 才開始作答倒數） */
function showLyricQuestion() {
  const my = reqId, st = $('stage');

  const wait = st.classList.contains('ly-leave') ? 0 : LY_LEAVE_MS;   // 已在淡出時退場就不用再等
  st.classList.add('ly-leave');

  clipTimer = setTimeout(() => {
    if (my !== reqId) return;

    st.classList.remove('ly-leave', 'ly-listen');
    st.classList.add('ly-enter');

    $('ls-wait').style.display = 'none';

    $('trow').style.display = '';
    $('trow').style.visibility = '';
    $('trow').classList.add('tin');

    $('choice-sec').style.display = 'block';
    $('items').style.display = '';
    $('lyric-prompt').style.display = 'flex';
    fitLyricLine();

    clipTimer = setTimeout(() => {
      if (my !== reqId) return;

      active = true;
      questionStartAt = Date.now();
      startRecordQuestion();
      runTimer();
    }, LY_ENTER_MS);
  }, wait);
}

/* 歌詞提示：顯示上一句歌詞 */
function revealLyricHint() {
  if (lyricsHintItemsLeft <= 0) return;

  const card = $('lyric-prev').closest('.lyric-card');
  if (card) card.classList.add('lyric-cover-open');

  usedHint = true;
  if (window.GameRecord) window.GameRecord.recordEvent('hint_used', { type: 'lyric_hint' });
  lyricsItemCount++;
  lyricsHintItemsLeft--;

  $('pause-btn').disabled = true;
  $('pause-sub').textContent = lyricsHintItemsLeft <= 0
    ? '已用完'
    : `剩 ${lyricsHintItemsLeft} 次`;
}

/* 答對答錯：顯示上一句歌詞 */
function revealLyricCard() {
  const card = $('lyric-prev').closest('.lyric-card');
  if (!card) return;

  card.classList.add('lyric-revealed', 'lyric-cover-open');
}

async function loadQuestion() {
  const my = ++reqId;

  stopAll();
  clearTimeout(nextT);

  active = false;
  cur = null;
  choiceUsed = false;
  choiceMiss = false;
  lyricsEliminateUsed = false;
  isPaused = false;
  usedChoice = false;
  usedHint = false;
  lyricsItemCount = 0;
  questionAttempts = 0;

  // +10s 狀態重置
  bufferDecided = false;
  lastInputAt = 0;
$('buffer-hint').classList.remove('show', 'urgent');   // 新的一題才重置紅色狀態

  // 每首新歌重新開放一次提示
  hintLeft = 1;
  updHintBtn();

  $('trow').classList.remove('done');
  $('trow').style.display = '';
  $('trow').style.visibility = '';
  $('trow').classList.remove('tin');
  $('banner').classList.remove('show');
  $('timeout-overlay').style.display = 'none';
  $('case').classList.remove('rev');
  $('art').removeAttribute('src');

  $('type-sec').style.display = '';
  $('choice-sec').style.display = 'none';
  $('lyric-prompt').style.display = 'none';
  $('ls-wait').style.visibility = 'hidden';
  $('ogrid').classList.remove('held');
  $('ogrid').style.gridTemplateColumns = '';
  $('ogrid').style.maxHeight = '';
  $('ogrid').style.overflowY = '';
  $('ogrid').style.gap = '';

  $('next-sec').style.display = 'none';

  // 歌詞模式：切換整個遊戲畫面的顯示狀態
  document.querySelector('.app').classList.toggle('lyrics-mode', isLyricsMode());
  $('trow').style.visibility = isLyricsMode() ? 'hidden' : '';

  $('stage').classList.remove('rev', 'lyrics-q', 'ly-listen', 'ly-leave', 'ly-enter');
  $('inp').value = '';
$('inp').readOnly = false;
$('inp').classList.remove('shake', 'final-wrong');

  $('tap').style.display = 'none';

  $('choice-btn').disabled = isLyricsMode();
  $('choice-sub').textContent = isLyricsMode()
    ? '可用一次'
    : CFG.CHOICE_COST
      ? `花 ${CFG.CHOICE_COST} 金幣`
      : '分數打折';
  $('items').style.display = '';
  applyItemMode();

  // 打字題內部仍是 30 秒（20 + 10），但計時條一律只顯示單段 20 秒
  timeLeft = isLyricsMode()
    ? CFG.MAX_TIME
    : CFG.MAX_TIME + CFG.TEXT_BUFFER;
  $('trow').classList.remove('buffer-only', 'danger');
  $('trow').classList.add('single-mode');
  $('tbar').style.width = '100%';
  $('tbuffer').style.width = '0%';
  $('tnum').textContent = '剩餘 ' + CFG.MAX_TIME + 's';
  $('tbuffer-label').textContent = '';

  renderProg();

  if (isLyricsMode()) {
    await loadLyricsQuestion(my);
    return;
  }

  while (qPtr < queue.length) {
    const term = queue[qPtr++],
          sp = term.indexOf(' '),
          artist = term.slice(0, sp),
          title = term.slice(sp + 1);

    const song = TRACKS.find(track =>
      normalizeMatchText(track.artist) === normalizeMatchText(artist) &&
      normalizeMatchText(track.title) === normalizeMatchText(title)
    );

    try {
      const prepared = await prepareSong(term);
      if (my !== reqId) return;

      const t = prepared?.track || null;

      if (t) {
        cur = {
          artist,
          title,
          art: t.artworkUrl100.replace('100x100', '600x600'),
          album: t.collectionName || '',
          year: (t.releaseDate || '').slice(0, 4)
        };

        audio.src = t.previewUrl;
        audio.currentTime = 0;

        active = true;

        focusInput();

        // 玩家聽目前歌曲時，背景準備下一首
        prepareSong(queue[qPtr]);
        playNow();
        return;
      }
    } catch (e) {
      if (my !== reqId) return;
    }
  } // 結束 while

  // 歌單找不到足夠的歌：至少完成一題才結算
  if (qDone === 0) {
    alert('目前無法載入題目，請稍後再試。');
    toTheme();
    return;
  }

  total = qDone;
  finish();
} // 結束 loadQuestion

/*
  歌詞接唱題庫：
  - 歌曲基本資料：由 tracks.js 依 no 取得
  - 題目設定：genre、playUntil
  - 題目內容：type（previous / next / fill）、prompt、answer、distractors
  - fill 題型的 prompt 使用 {{blank}} 標記挖空位置
*/
async function loadLyricsQuestion(my) {
  const item = queue[qPtr++];

  if (!item) {
    if (qDone === 0) {
      alert('目前沒有可載入的歌詞題目，請確認題庫設定。');
      toTheme();
      return;
    }

    total = qDone;
    finish();
    return;
  }

  const song = TRACKS.find(track => track.no === item.no);

  if (!song) {
    console.error(`找不到歌曲資料：${item.no}`);

    if (qDone === 0) {
      alert('目前無法載入歌曲資料，請稍後再試。');
      toTheme();
      return;
    }

    total = qDone;
    finish();
    return;
  }

  // 先切換成歌詞模式，避免等待 iTunes 時閃出猜歌畫面
  $('stage').classList.add('lyrics-q', 'ly-listen');

  const track = await getAppleMusicTrack(song);

  if (my !== reqId) return;

  const type = item.type;
  const prompt = item.prompt;
  const answer = item.answer;

  cur = {
    id: song.no,
    title: song.title,
    artist: song.artist,
    genre: item.genre,
    type,
    prompt,
    answer,
    art: track?.artworkUrl100
      ? track.artworkUrl100.replace('100x100', '600x600')
      : '',
    album: track?.collectionName || '',
    year: (track?.releaseDate || '').slice(0, 4)
  };

  renderLyricPrompt(cur);
  updateLyricStars(getLyricAnswer());

  $('lyric-prev').closest('.lyric-card').classList.remove(
    'lyric-revealed',
    'lyric-cover-open'
  );

  opts = shuffle([getLyricAnswer(), ...item.distractors]);
  const LETTERS = ['A', 'B', 'C', 'D'];

  $('ogrid').style.gridTemplateColumns = '1fr';
  $('ogrid').style.gap = '6px';
  $('ogrid').innerHTML = opts.map((_, i) =>
    `<button class="opt lyric-opt" data-i="${i}" style="--i:${i}">
       <span class="lo-key">${LETTERS[i]}</span><span class="lo-text"></span>
     </button>`
  ).join('');
  $('ogrid').querySelectorAll('.lo-text').forEach((el, i) => { el.textContent = opts[i]; });

  // 聽歌階段：題目（上句歌詞）立刻顯示，選項與道具先隱藏
  $('type-sec').style.display = 'none';
  $('choice-sec').style.display = 'none';
  $('items').style.display = 'none';
  $('tap').style.display = 'none';
  $('trow').style.display = '';
  $('ls-wait').style.visibility = '';
  $('trow').style.visibility = 'hidden';

  const previewUrl = track?.previewUrl || '';
  clip = {
    url: previewUrl,
    start: 0,                                          // 一律從頭播放
    dur: item.playUntil || CFG.LYRIC_PLAY_SEC          // 播到第幾秒（題庫的 playUntil）
  };
  replayLeft = previewUrl ? 1 : 0;

  $('ls-genre').textContent = item.genre ? item.genre : '';
  $('ls-ring').classList.remove('warn');
  $('ls-wait').classList.remove('ready');      // 重設回黃燈
  $('ls-wait-text').textContent = '歌手演唱中';
  $('ls-wait').style.display = 'flex';
  $('lyric-prompt').style.display = 'none';
  $('ls-text').classList.remove('beat');

  if (previewUrl) {
    audio.src = previewUrl;
    setLyricStage(true);
    playClip(my, showLyricQuestion, true);
  } else {
    // 沒有試聽音檔：直接出題，重播道具停用
    showLyricQuestion();
    $('pause-btn').disabled = true;
    $('pause-sub').textContent = '無音檔';
  }
}


/* ==========================================
   05. 畫面呈現與初始化
   進度、動畫、答案揭曉、結算、測試與裝置初始化
========================================== */

$('tap').onclick = () => {
  if (pendingClip) {
    const f = pendingClip;
    pendingClip = null;
    $('tap').style.display = 'none';
    f();
    return;
  }
  if (active && !isPaused) playNow();
};

// 更新題目進度
function renderProg() {
  $('pgrid').innerHTML = Array.from({length: total}, (_, i) => {
    const c = cds[i];

    return c
      ? `<div class="progress-slot ${c.cond}"><img src="${c.art}" alt=""></div>`
      : `<div class="progress-slot ${i === qDone ? 'now' : ''}"></div>`;
  }).join('');

  $('qno').textContent = `第 ${Math.min(qDone + 1, total)} / ${total} 題`;
}

// 更新分數（加分有跑數字動畫，扣分直接跳轉）
function setScore(v) {
  const from = shown,
        el = $('score');

  if (scoreRAF !== null) {
    cancelAnimationFrame(scoreRAF);
    scoreRAF = null;
  }

  score = v;

  el.classList.remove('bump', 'penalty');
  void el.offsetWidth;

  if (v > from) el.classList.add('bump');

  if (v < from || (v === 0 && from === 0)) {
    shown = v;
    el.textContent = v;
    el.classList.add('penalty');
    setTimeout(() => el.classList.remove('penalty'), 500);
    return;
  }

  const t0 = performance.now();

  function f(t) {
    const p = Math.min(1, (t - t0) / 500);

    shown = Math.round(from + (v - from) * p);
    el.textContent = shown;

    scoreRAF = p < 1 ? requestAnimationFrame(f) : null;
  }

  scoreRAF = requestAnimationFrame(f);
}

// 更新連擊
function updCombo(pop) {
  const c = $('combo');

  c.textContent = `🔥 ${combo} COMBO`;
  c.classList.toggle('on', combo > 0);

  if (pop) {
    c.classList.remove('pop');
    void c.offsetWidth;
    c.classList.add('pop');
  }
}

// 加分標籤
function tag(side, t, c, delay = 0) {
  setTimeout(() => {
    const e = document.createElement('div');

    e.className = 'feedback-tag';
    e.textContent = t;
    e.style.setProperty('--c', c);

    $('tags-' + side).appendChild(e);
    setTimeout(() => e.remove(), 1500);
  }, delay);
}

// 揭曉答案
function reveal() {
  active = false;
  clearInterval(tick);

  $('trow').classList.remove('danger');
  $('trow').classList.add('done');
  clearBufferUI();

  $('art').src = cur.art;
  $('case').classList.add('rev');
  $('stage').classList.add('rev');
  $('stage').classList.remove('lyrics-q', 'ly-listen', 'ly-leave', 'ly-enter');
  clearTimeout(clipTimer);
  clearInterval(fadeT);
  audio.volume = 1;
  clearInterval(lsTick);

  // 接歌詞：揭曉時從停止的位置繼續播放
  if (isLyricsMode() && clip.url) {
    audio.play().then(() => {
      $('disc').classList.add('spin');
      $('cd').classList.add('on');
    }).catch(() => {});
  }

  // 一般猜歌：答案揭曉時恢復播放
  if (!isLyricsMode()) {
    audio.play().then(() => {
      $('disc').classList.add('spin');
      $('cd').classList.add('on');
    }).catch(() => {});
  }

  $('b-title').textContent = cur.title;
  $('b-artist').textContent = cur.artist;
  $('b-meta').textContent = [cur.album, cur.year].filter(Boolean).join(' · ');
  $('banner').classList.add('show');

  // 打字題：輸入框留在畫面上，直到下一題才重置
  $('type-sec').style.display = 'none';
  $('choice-sec').style.display = 'none';

  if (isLyricsMode()) {
    $('lyric-prompt').style.display = 'flex';
    revealLyricCard();
  } else {
    $('lyric-prompt').style.display = 'none';
  }
  $('ls-wait').style.display = 'none';
  $('items').style.display = 'none';

  const n = $('next-sec');
  n.style.display = 'block';
  n.innerHTML = `
    <button class="bevel go big nbtn" style="width:100%" onclick="next()">
      <i style="animation-duration:${CFG.REVEAL_MS}ms"></i>
      <span>${qDone + 1 >= total ? '看結算' : '下一題'} ➔</span>
    </button>
  `;

  clearTimeout(nextT);
  nextT = setTimeout(next, CFG.REVEAL_MS);
}


function showResult() {
  const g = grade(score),
        b = g.k,
        ratio = maxScore(total) > 0 ? Math.round(score / maxScore(total) * 100) : 0;

  show('m-result');

  $('r-score').textContent = score;
  $('r-combo').textContent = maxCombo;
  $('r-time').textContent = fmtTime(Math.floor(totalAnswerTime));
  $('r-badge').textContent = b;
  $('r-title').textContent = g.title;
  $('rocket-pr-val').textContent = ratio;

  // PR 圓環：先歸零再填滿，才有動畫
  $('pr-gauge').style.setProperty('--pr', '0%');
  setTimeout(() => $('pr-gauge').style.setProperty('--pr', ratio + '%'), 100);

  // 專輯牆
  $('gal').innerHTML = cds.map(c => `<div class="gp ${c.cond}"><img src="${c.art}" alt=""></div>`).join('');

  // 評語
  $('r-desc').textContent = g.desc;

  // 金光與紙花
  $('res-card').classList.toggle('gold', b === 'SS' || b === 'SSS');

  const cf = $('conf');
  cf.innerHTML = '';

  if (['SSS', 'SS', 'S', 'A+', 'A'].includes(b)) {
    const cs = ['#d6246e', '#f5c518', '#19a7d8', '#4caf7d', '#fff'];

    for (let i = 0; i < 35; i++) {
      const c = document.createElement('div');

      c.className = 'cf';
      c.style.setProperty('--c', cs[i % 5]);
      c.style.left = Math.random() * 100 + '%';
      c.style.animationDuration = 1.2 + Math.random() * 1.5 + 's';
      c.style.animationDelay = Math.random() * .6 + 's';

      cf.appendChild(c);
    }
  }
}

$('inp').addEventListener('compositionstart', () => { composing = true; });

$('inp').addEventListener('compositionend', () => {
  composing = false;
  compEndAt = Date.now();
});

$('inp').addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;

  if (e.isComposing || e.keyCode === 229 || composing || Date.now() - compEndAt < 80) return;

  e.preventDefault();
  submitAnswer();
});

$('inp').addEventListener('input', () => {
  if (active) lastInputAt = Date.now();   // 打字或刪除都算
});

$('inp').placeholder = isMobile
  ? '輸入完整歌名'
  : '輸入完整歌名（不分大小寫、空格）';

loadHistory();

(() => {
  const root = document.documentElement;
  const vv = window.visualViewport;
  const app = document.querySelector('.app');
  const inp = $('inp');

  function updateKeyboard() {
    if (!vv) return;

    // 鍵盤高度 = 版面視窗高 − 可視視窗高 − 可視視窗上方位移
    const inset = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));

    // 使用者雙指縮放時 vv.height 也會變小，不能當成鍵盤
    const zoomed = vv.scale > 1.01;

    // 只有輸入框有焦點時，才算鍵盤開啟
    const open = !zoomed && inset > 120 && document.activeElement === inp;

    root.style.setProperty('--keyboard-inset', open ? inset + 'px' : '0px');
    app?.classList.toggle('keyboard-open', open);
  }

  updateKeyboard();

  if (vv) {
    vv.addEventListener('resize', updateKeyboard);
    vv.addEventListener('scroll', updateKeyboard);
  }
  inp.addEventListener('focus', updateKeyboard);
  inp.addEventListener('blur', updateKeyboard);
})();