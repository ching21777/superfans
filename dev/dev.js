
/* ========================================
   Super Fans｜開發測試工具
   只在網址帶有 ?dev 時啟用
======================================== */

if (new URLSearchParams(location.search).has('dev')) {

  // ========================================
  // 01. 開發測試面板
  // ========================================

  const devPanel = document.createElement('section');

  devPanel.id = 'dev-panel';
  devPanel.innerHTML = `
    <div class="dev-heading">🛠 開發測試工具</div>

  <button class="bevel btn-sm" id="dev-mute-btn">
  🔊 音量：開啟
</button>

    <div class="dev-section">介面快速預覽</div>

<div class="dev-preview-buttons">
  <button class="bevel btn-sm" id="dev-result-btn">
    成績頁
  </button>

  <button class="bevel btn-sm" id="dev-lyrics-btn">
    歌詞接唱
  </button>
</div>

    <div class="dev-section">指定歌曲測試</div>

    <input
      type="text"
      id="dev-song-search"
      placeholder="輸入歌名或編號"
      autocomplete="off"
    >

    <div id="dev-song-results"></div>

    <div class="dev-section">自動模擬答題</div>

    <label for="dev-mode">模擬答題情境</label>
    <select id="dev-mode">
      <option value="correct">全部答對</option>
      <option value="mixed">答對與答錯混合</option>
      <option value="wrong">全部答錯</option>
    </select>

    <button class="bevel go" id="dev-auto-btn">
      開始自動模擬答題
    </button>
  `;


  // ========================================
  // 02. 開發測試面板樣式
  // ========================================

  const devStyle = document.createElement('style');

  devStyle.textContent = `
    #dev-dock {
      position: fixed;
      right: 12px;
      bottom: 12px;
      z-index: 10000;
    }

    #dev-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      padding: 0;
      border: 1px solid rgba(240,214,164,.4);
      border-radius: 50%;
      background: #252525;
      color: #F0D6A4;
      font-size: 17px;
      letter-spacing: 2px;
      cursor: pointer;
      box-shadow: 0 3px 12px rgba(0,0,0,.35);
    }

    #dev-panel {
      display: none;
      flex-direction: column;
      gap: 7px;
      position: absolute;
      right: 0;
      bottom: 46px;
      width: 210px;
      max-width: calc(100vw - 24px);
      margin: 0;
      padding: 12px;
      border: 1px solid rgba(240,214,164,.4);
      border-radius: 10px;
      background: #171717;
      box-shadow: 0 4px 20px rgba(0,0,0,.45);
    }

    .dev-heading {
      color: #F0D6A4;
      font-size: 13px;
      font-weight: 900;
      text-align: left;
    }

    #dev-panel label {
      color: rgba(255,255,255,.7);
      font-size: 11px;
      text-align: left;
    }

    .dev-section {
      color: #F0D6A4;
      font-size: 11px;
      font-weight: 800;
      text-align: left;
      margin-top: 5px;
    }

    #dev-mode {
      width: 100%;
      padding: 7px;
      border: 0;
      border-radius: 6px;
      font-size: 12px;
    }

    #dev-panel button {
      width: 100%;
      padding-top: 7px;
      padding-bottom: 7px;
      font-size: 12px;
    }

    /* 指定歌曲搜尋 */

    #dev-song-search {
      width: 100%;
      box-sizing: border-box;
      padding: 8px;
      border: 1px solid rgba(240,214,164,.3);
      border-radius: 6px;
      background: #252525;
      color: white;
      font-size: 12px;
    }

    #dev-song-search::placeholder {
      color: rgba(255,255,255,.4);
    }

    #dev-song-results {
      display: flex;
      flex-direction: column;
      gap: 5px;
      max-height: 180px;
      overflow-y: auto;
    }

    .dev-song-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .dev-song-name {
      flex: 1;
      min-width: 0;
      color: white;
      font-size: 11px;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dev-song-no {
      color: #F0D6A4;
      font-size: 10px;
      font-weight: 800;
      flex-shrink: 0;
    }

    .dev-song-item button {
  width: 28px !important;
  min-width: 28px;
  padding: 5px 0 !important;
  flex-shrink: 0;
}

    .dev-song-empty {
      color: rgba(255,255,255,.45);
      font-size: 11px;
      text-align: center;
      padding: 8px 0;
    }

    /* 介面快速預覽按鈕 */

.dev-preview-buttons {
  display: flex;
  gap: 6px;
}

.dev-preview-buttons button {
  flex: 1;
  min-width: 0;
  width: 0;
}
  `;

  document.head.appendChild(devStyle);


  // ========================================
  // 03. 建立浮動工具區
  // ========================================

  const devDock = document.createElement('div');
  devDock.id = 'dev-dock';

  const devToggle = document.createElement('button');
  devToggle.id = 'dev-toggle';
  devToggle.type = 'button';
  devToggle.textContent = '•••';
  devToggle.title = '開發測試工具';

  devDock.appendChild(devToggle);
  devDock.appendChild(devPanel);
  document.body.appendChild(devDock);

  // ========================================
// 測試環境音量開關
// ========================================

// ========================================
// 測試環境音量開關
// ========================================

const devMuteBtn = $('dev-mute-btn');

function updateDevMuteButton() {
  devMuteBtn.textContent = audio.muted
    ? '🔇 音量：關閉'
    : '🔊 音量：開啟';
}

devMuteBtn.addEventListener('click', () => {
  audio.muted = !audio.muted;
  updateDevMuteButton();
});

updateDevMuteButton();

  // 手機：點擊展開 / 收合

  devToggle.addEventListener('click', () => {
  devPanel.style.display =
    devPanel.style.display === 'flex' ? 'none' : 'flex';
});

  // 移除舊的測試按鈕

  document.getElementById('test-btn')?.remove();


  // ========================================
  // 04. 歌詞接唱題目預覽
  // ========================================

  function previewLyricsItem(item) {

    stopAll();

    const LETTERS = ['A', 'B', 'C', 'D'];

    // 設定預覽題目

    theme = 'lyrics';
    isDemo = false;
    active = false;
    total = 10;
    qDone = 0;
    qPtr = 1;
    cur = item;
    opts = shuffle([item.answer, ...item.distractors]);
    cds = [];

    // 更新遊戲資訊

    $('mode').textContent = '歌詞接唱';
    $('mode').style.display = 'block';
    $('quit-btn').style.display = 'block';

    $('score').textContent = '0';
    combo = 0;
    updCombo();
    renderProg();

    // 設定歌詞題目

    renderLyricPrompt(item);
updateLyricStars(item.answer);
    $('lyric-prev').closest('.lyric-card')
      .classList.remove('lyric-revealed');

    // 建立選項

    $('ogrid').style.gridTemplateColumns = '1fr';
    $('ogrid').style.gap = '6px';
    $('ogrid').classList.remove('held');

    $('ogrid').innerHTML = opts.map((opt, i) => `
      <button class="opt lyric-opt" data-i="${i}" style="--i:${i}">
        <span class="lo-key">${LETTERS[i]}</span>
        <span class="lo-text">${opt}</span>
      </button>
    `).join('');

    // 切換至歌詞選擇題畫面

    document.querySelectorAll('.ov').forEach(m => {
      m.style.display = 'none';
    });

    $('stage').classList.remove(
      'rev', 'ly-listen', 'ly-leave', 'ly-enter'
    );
    $('stage').classList.add('lyrics-q');

    $('lyric-prompt').style.display = 'block';
    $('ls-wait').style.display = 'none';
    $('tap').style.display = 'none';

    $('type-sec').style.display = 'none';
    $('choice-sec').style.display = 'block';
    $('items').style.display = '';

    $('trow').style.display = '';
    $('trow').style.visibility = '';
    $('trow').classList.remove('done', 'danger');
    $('tbar').style.width = '100%';
    $('tnum').textContent = CFG.MAX_TIME + 's';

    $('timeout-overlay').style.display = 'none';
    $('banner').classList.remove('show');
    $('next-sec').style.display = 'none';

    applyItemMode();
  }


  // 預覽第一首歌曲

  document.getElementById('dev-lyrics-btn')
    .addEventListener('click', () => {
      previewLyricsItem(HELLO_NICO_DATABASE[0]);
    });


  // ========================================
  // 05. 指定歌曲搜尋測試
  // ========================================

  const devSongSearch = $('dev-song-search');
  const devSongResults = $('dev-song-results');

  // 搜尋並顯示歌曲清單

function renderDevSongList(keyword = '') {

  devSongResults.innerHTML = '';

  const searchText = keyword.trim().toLowerCase();

  const songs = HELLO_NICO_DATABASE.filter(item => {

    const titleMatch =
      item.title.toLowerCase().includes(searchText);

    const idText = String(item.id).padStart(3, '0');

    const idMatch =
      idText.includes(searchText) ||
      (
        /^\d+$/.test(searchText) &&
        Number(searchText) === item.id
      );

    return !searchText || titleMatch || idMatch;
  });

  if (!songs.length) {
    const empty = document.createElement('div');
    empty.className = 'dev-song-empty';
    empty.textContent = '找不到歌曲';

    devSongResults.appendChild(empty);
    return;
  }

  songs.forEach(item => {

    const row = document.createElement('div');
    row.className = 'dev-song-item';

    const no = document.createElement('span');
    no.className = 'dev-song-no';
    no.textContent = String(item.id).padStart(3, '0');

    const name = document.createElement('span');
    name.className = 'dev-song-name';
    name.textContent = item.title;

    // 完整測試
    const fullBtn = document.createElement('button');
    fullBtn.className = 'bevel btn-sm';
    fullBtn.textContent = '全';
    fullBtn.dataset.songId = item.id;
    fullBtn.dataset.testMode = 'full';

    // 快速測試
    const quickBtn = document.createElement('button');
    quickBtn.className = 'bevel btn-sm';
    quickBtn.textContent = '快';
    quickBtn.dataset.songId = item.id;
    quickBtn.dataset.testMode = 'quick';

    row.append(no, name, fullBtn, quickBtn);

    // 將歌曲項目加入清單
    devSongResults.appendChild(row);

  });

}

  // 輸入時即時搜尋

  devSongSearch.addEventListener('input', () => {
    renderDevSongList(devSongSearch.value);
  });


  // ========================================
  // 05-1. 指定歌曲單題測試
  // ========================================

  let devSingleSong = false;
let devSingleSongItem = null;
let devQuickSong = false;

  // 保留原本的 loadQuestion

  const oldLoadQuestion = loadQuestion;

  // 單曲測試時，將題庫暫時限制為指定歌曲

  loadQuestion = async function () {

    if (devSingleSong && devSingleSongItem) {

      total = 1;
      queue = [devSingleSongItem];
      qPtr = 0;
      qDone = 0;
    }

    return oldLoadQuestion();
  };


  // 保留原本的 finish

  const oldFinish = finish;

  // 單曲測試結束後清除測試狀態

  finish = function () {

    const wasSingleSongTest = devSingleSong;

    oldFinish();

    if (wasSingleSongTest) {
  devSingleSong = false;
  devSingleSongItem = null;
  devQuickSong = false;
  devSession = false;
}
  };


  // 啟動指定歌曲測試

  function startDevSingleSong(item, quick = false) {

  // 停止目前遊戲

  stopAll();

  // 設定單曲測試狀態

  devSingleSong = true;
  devSingleSongItem = item;
  devQuickSong = quick;

  // 不寫入正式戰績，但保留真實音檔播放

  devSession = true;
  devRunning = false;

  // 指定使用歌詞接唱模式

  theme = 'lyrics';

  // 沿用原本遊戲初始化與倒數流程

  begin(false);
}

  // 點擊歌曲開始測試

  devSongResults.addEventListener('click', event => {

  const btn = event.target.closest('[data-song-id]');
  if (!btn) return;

  const songId = Number(btn.dataset.songId);

  const item = HELLO_NICO_DATABASE.find(song => song.id === songId);

  if (!item) return;

  const quick = btn.dataset.testMode === 'quick';

  startDevSingleSong(item, quick);
});


  // 初始顯示全部歌曲

  renderDevSongList();


  // ========================================
  // 06. 預覽結算畫面
  // ========================================

  document.getElementById('dev-result-btn').addEventListener('click', () => {

    const backup = {
      score,
      maxCombo,
      startAt,
      cds,
      total,
      usedChoice
    };

    const cover = hue => 'data:image/svg+xml,' + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="hsl(${hue},45%,45%)"/></svg>`
    );

    const conds = [
      'gem-mint', 'near-mint', 'good',
      'gem-mint', 'near-mint', 'good',
      'poor', 'gem-mint', 'near-mint', 'gem-mint'
    ];

    score = 1280;
    maxCombo = 12;
    startAt = Date.now() - 102000;
    usedChoice = false;
    total = 10;
    cds = conds.map((cond, i) => ({
      art: cover(i * 36),
      cond
    }));

    stopAll();

    document.querySelectorAll('.ov').forEach(m => {
      m.style.display = 'none';
    });

    showResult();

    ({
      score,
      maxCombo,
      startAt,
      cds,
      total,
      usedChoice
    } = backup);
  });


  // ========================================
  // 07. 自動模擬答題
  // ========================================

  let devPending = false;
  let devRunning = false;
  let devSession = false;
  let devMode = 'correct';

  const waitDev = async (check, limit = 30000) => {

    const start = Date.now();

    while (Date.now() - start < limit) {
      if (check()) return true;

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    throw new Error('模擬等待逾時');
  };


  // 模擬時略過實際音檔播放

  const oldPlayNow = playNow;

  playNow = function () {

    if (!devRunning) return oldPlayNow();

    $('tap').style.display = 'none';
    $('disc').classList.add('spin');
    $('cd').classList.add('on');

    questionStartAt = Date.now();
    runTimer();

    return Promise.resolve();
  };


  // 接歌詞模式：縮短音檔播放階段

const oldPlayClip = playClip;

playClip = function (my, done, leaveEarly = false) {

  // 自動模擬答題：沿用原本的快速流程

  if (devRunning) {

    clip.url = '';
    setLyricStage(true);

    clipTimer = setTimeout(() => {

      if (my !== reqId) return;

      setLyricStage(false);
      done();

    }, 700);

    return;
  }

  // 指定歌曲快速測試：只播放結尾前 3 秒

  if (devSingleSong && devQuickSong && clip.url) {

    const originalClip = clip;

    const end = originalClip.start + originalClip.dur;
    const quickStart = Math.max(
      originalClip.start,
      end - 3
    );

    // 建立新的播放設定，不修改原始設定

    clip = {
      ...originalClip,
      start: quickStart,
      dur: end - quickStart
    };

    return oldPlayClip(my, () => {

      // 播放完成後還原原始設定

      clip = originalClip;
      done();

    }, leaveEarly);
  }

  // 完整測試：照原本方式播放

  return oldPlayClip(my, done, leaveEarly);
};


  // 測試成績不寫入玩家歷史紀錄

  const oldSaveHistory = saveHistory;

  saveHistory = function () {

    if (devSession) return;

    oldSaveHistory();
  };


  // 按下自動模擬後，先選擇歌單

  $('dev-auto-btn').addEventListener('click', () => {

    devMode = $('dev-mode').value;
    devPending = true;

    toTheme();
  });


  // 選擇歌單後，自動開始模擬

  const oldPickTheme = pickTheme;

  pickTheme = function (k) {


    const shouldRun = devPending;

    if (shouldRun) {
      devPending = false;
      devSession = true;
      devRunning = true;
      CFG.REVEAL_MS = 900;
    }

    oldPickTheme(k);

    if (shouldRun) runDevSimulation();
  };

  
// 測試環境：跳過開始前的倒數

const oldCountdown = countdown;

countdown = function (callback) {
  if (devSession || devSingleSong) {
    callback();
    return;
  }

  return oldCountdown(callback);
};

  // 逐題模擬

  async function runDevSimulation() {

    try {

      for (let i = 0; i < 10; i++) {

        await waitDev(() =>
          (active && cur && qDone === i) ||
          $('m-result').style.display === 'flex'
        );

        if ($('m-result').style.display === 'flex') break;

        // 混合模式：每三題有一題答錯

        const isCorrect =
          devMode === 'correct' ||
          (devMode === 'mixed' && i % 3 !== 2);

        if (isCorrect) {

          if (isLyricsMode()) {

            const right = [...$('ogrid').querySelectorAll('.opt')]
              .find(b => opts[+b.dataset.i] === cur.correctNext);

            right?.click();

          } else {

            $('inp').value = cur.title;
            submitAnswer();
          }

        } else {

          // 先送出一次錯誤答案

          if (isLyricsMode()) {

            const wrong = [...$('ogrid').querySelectorAll('.opt')]
              .find(b => opts[+b.dataset.i] !== cur.correctNext);

            wrong?.click();

          } else {

            $('inp').value = '錯誤答案';
            submitAnswer();
          }

          await new Promise(resolve => setTimeout(resolve, 350));

          if (active) timeout();
        }

        // 等待揭曉並切換下一題

        await waitDev(() =>
          qDone > i ||
          $('m-result').style.display === 'flex'
        );

        if ($('m-result').style.display === 'flex') break;
      }

      await waitDev(
        () => $('m-result').style.display === 'flex',
        60000
      );

    } catch (error) {

      alert('自動模擬發生問題：' + error.message);

    } finally {

      devRunning = false;
      devSession = false;
      CFG.REVEAL_MS = 5000;
    }
  }

}
