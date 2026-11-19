
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

<div class="dev-preview-buttons">
  <button class="bevel btn-sm" id="dev-result-btn">
    👀成績頁
  </button>
  <button class="bevel btn-sm" id="dev-lyrics-btn">
    👀選歌詞
  </button>
</div>

<div class="dev-tabs">
  <button class="bevel btn-sm active" data-tab="guess">猜歌</button>
  <button class="bevel btn-sm" data-tab="lyrics">歌詞接唱</button>
</div>

<div id="dev-tab-guess">

  
  <div class="dev-section">歌曲 ID 綁定</div>

  <input type="text" id="dev-track-search"
    placeholder="搜尋歌手或歌名" autocomplete="off">

  <button class="bevel btn-sm" id="dev-track-search-btn">
    搜尋 iTunes
  </button>

  <div id="dev-track-results"></div>
  <div id="dev-track-songs"></div>

  <audio id="dev-track-audio" controls
    style="width:100%;display:none;"></audio>

</div>

<div id="dev-tab-lyrics" style="display:none;">

    <div class="dev-section">指定歌曲測試</div>

  <input type="text" id="dev-song-search"
    placeholder="輸入歌名或編號" autocomplete="off">

  <div id="dev-song-results"></div>

</div>
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

    .dev-track-id {
  color: #F0D6A4;
  font-size: 10px;
  font-weight: 700;
  margin-top: 3px;
  overflow-wrap: anywhere;
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
      height: 800px;
max-height: calc(100dvh - 90px);
overflow: auto;
overscroll-behavior: contain;
      width: 300px;
min-width: 210px;
max-width: calc(100vw - 24px);
resize: horizontal;
overflow-x: auto;
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
      font-size: 12px;
    }

    /* 指定歌曲搜尋 */

    #dev-song-search,
#dev-track-search {
  width: 100%;
  box-sizing: border-box;
  padding: 8px;
  border: 1px solid rgba(240,214,164,.3);
  border-radius: 6px;
  background: #252525;
  color: white;
  font-size: 12px;
}

#dev-song-search::placeholder,
#dev-track-search::placeholder {
  color: #999;
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



/* iTunes 歌曲搜尋結果 */

#dev-track-results {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 300px;
  overflow-y: auto;
}

.dev-track-heading {
  color: #F0D6A4;
  font-size: 11px;
  font-weight: 800;
  padding: 5px 0;
}

.dev-track-result {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px;
  border-radius: 6px;
  background: #252525;
}

.dev-track-result.playing {
  background: #343126;
  outline: 1px solid rgba(240,214,164,.6);
}

.dev-track-no {
  color: #F0D6A4;
  font-size: 13px;
  font-weight: 900;
  min-width: 22px;
  text-align: center;
}

.dev-track-info {
  flex: 1;
  min-width: 0;
}

.dev-track-name {
  color: white;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.dev-track-album {
  color: rgba(255,255,255,.5);
  font-size: 10px;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.dev-track-result button {
  width: 58px !important;
  min-width: 58px;
  flex-shrink: 0;
}

    /* 介面切換按鈕 */
.dev-tabs {
  display: flex;
  gap: 6px;
}

.dev-tabs button {
  flex: 1;
  opacity: 0.55;
}

.dev-tabs button.active {
  opacity: 1;
  background: #9C789D;
  color: white;
}


    /* 「全」「快」按鈕 */
.dev-song-action {
  background: none;
  border: none;
  color: #F0D6A4;
  padding: 2px 5px;
  font-size: 12px;
  cursor: pointer;
}

.dev-song-action:hover {
  color: white;
  text-decoration: underline;
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
      previewLyricsItem(SONG_DATABASE[0]);
    });

  // 切換分頁
    document.querySelectorAll('.dev-tabs button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.dev-tabs button').forEach(b => {
      b.classList.toggle('active', b === btn);
    });

    document.getElementById('dev-tab-guess').style.display =
      btn.dataset.tab === 'guess' ? '' : 'none';

    document.getElementById('dev-tab-lyrics').style.display =
      btn.dataset.tab === 'lyrics' ? '' : 'none';
  });
});


  // ========================================
  // 05. 指定歌曲搜尋測試
  // ========================================

  // ========================================
// 歌曲 ID 綁定｜整理待確認歌曲
// ========================================

const devTrackSearch = $('dev-track-search');
const devTrackSongs = $('dev-track-songs');
const devTrackResults = $('dev-track-results');
const devTrackAudio = $('dev-track-audio');
const devTrackSearchBtn = $('dev-track-search-btn');


// 搜尋 iTunes 歌曲
async function searchDevTracks() {

  const keyword = devTrackSearch.value.trim();

  if (!keyword) {
  devTrackResults.textContent = '請先輸入或選擇歌曲';
  devTrackResults.style.color = '#ffffff';
  return;
}

  devTrackResults.textContent = '搜尋中…';

  // 停止上一首試聽
  devTrackAudio.pause();
  devTrackAudio.removeAttribute('src');
  devTrackAudio.style.display = 'none';

  try {

    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(keyword)}&entity=song&limit=20&country=TW`
    );

    const data = await response.json();

    devTrackResults.innerHTML = '';

    const results = data.results || [];

    if (!results.length) {
      devTrackResults.textContent = '找不到搜尋結果';
      return;
    }

    // 搜尋結果標題
    const heading = document.createElement('div');
    heading.className = 'dev-track-heading';
    heading.textContent = `搜尋結果｜共 ${results.length} 首`;
    devTrackResults.appendChild(heading);

    // 目前播放中的歌曲編號
    let playingIndex = null;

    results.forEach((track, index) => {

      const row = document.createElement('div');
      row.className = 'dev-track-result';

      // 編號
      const no = document.createElement('div');
      no.className = 'dev-track-no';
      no.textContent = String(index + 1).padStart(2, '0');

      // 歌曲資訊
      const info = document.createElement('div');
      info.className = 'dev-track-info';

      const name = document.createElement('div');
      name.className = 'dev-track-name';
      name.textContent = `${track.artistName}｜${track.trackName}`;

      const album = document.createElement('div');
      album.className = 'dev-track-album';
      album.textContent =
        `${track.collectionName || '未知專輯'}${track.trackTimeMillis ? '｜' + Math.floor(track.trackTimeMillis / 1000 / 60) + ':' + String(Math.floor(track.trackTimeMillis / 1000) % 60).padStart(2, '0') : ''}`;

      // iTunes Track ID
const trackId = document.createElement('div');
trackId.className = 'dev-track-id';
trackId.textContent = `Track ID：${track.trackId}`;
      
        // 試聽按鈕
      const playBtn = document.createElement('button');
      playBtn.className = 'bevel btn-sm';
      playBtn.textContent = '▶';

      playBtn.addEventListener('click', async () => {

        if (!track.previewUrl) {
          alert('這首歌曲沒有提供試聽音檔');
          return;
        }

        // 再點同一首：暫停
        if (playingIndex === index && !devTrackAudio.paused) {
          devTrackAudio.pause();
          playBtn.textContent = '▶';
          row.classList.remove('playing');
          playingIndex = null;
          return;
        }

        // 停止其他播放狀態
        devTrackResults.querySelectorAll('.dev-track-result').forEach(item => {
          item.classList.remove('playing');
          item.querySelector('button').textContent = '▶';
        });

        playingIndex = index;

        devTrackAudio.src = track.previewUrl;
        devTrackAudio.style.display = 'block';

        try {
          await devTrackAudio.play();

          row.classList.add('playing');
          playBtn.textContent = '⏸';

        } catch (error) {
          playingIndex = null;
          alert('音檔播放失敗，請再試一次');
        }

      });

      info.append(name, album, trackId);

row.append(no, info, playBtn);
      devTrackResults.appendChild(row);

    });

    // 播放結束時，恢復按鈕狀態
    devTrackAudio.onended = () => {
      devTrackResults.querySelectorAll('.dev-track-result').forEach(item => {
        item.classList.remove('playing');
        item.querySelector('button').textContent = '▶';
      });
    };

  } catch (error) {

    devTrackResults.textContent = '搜尋失敗，請稍後再試';
    console.error('iTunes 搜尋錯誤：', error);

  }
}


// 點擊按鈕才開始搜尋
devTrackSearchBtn.addEventListener('click', searchDevTracks);

// 按 Enter 也能搜尋
devTrackSearch.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchDevTracks();
  }
});

// 從所有一般猜歌歌單整理歌曲
const allPlaylistSongs = [
  ...new Set(
    Object.values(playlists)
      .flat()
      .filter(song => typeof song === 'string')
  )
];

// 只保留尚未綁定 ID 的歌曲
const unboundSongs = allPlaylistSongs.filter(song => {
  const [artist, ...titleParts] = song.split(' ');
  const title = titleParts.join(' ');

  return !TRACK_MAP[`${artist}|${title}`];
});

// 顯示尚未綁定的歌曲
function renderDevTrackSongs(keyword = '') {

  devTrackSongs.innerHTML = '';

  const songs = unboundSongs.filter(song =>
    song.toLowerCase().includes(keyword.trim().toLowerCase())
  );

  if (!songs.length) {
    devTrackSongs.textContent = '沒有待確認的歌曲';
    devTrackSongs.style.color = '#ffffff';
    return;
  }

  songs.forEach(song => {

    const btn = document.createElement('button');

    btn.type = 'button';
    btn.className = 'dev-song-action';
    btn.textContent = song;
    btn.style.textAlign = 'left';

    btn.addEventListener('click', () => {
      devTrackSearch.value = song;
      devTrackResults.innerHTML = '';
    });

    devTrackSongs.appendChild(btn);
  });
}

// 輸入時篩選歌曲
devTrackSearch.addEventListener('input', () => {
  renderDevTrackSongs(devTrackSearch.value);
});

// 初始顯示
renderDevTrackSongs();
  
  const devSongSearch = $('dev-song-search');
  const devSongResults = $('dev-song-results');

  // 搜尋並顯示歌曲清單

function renderDevSongList(keyword = '') {

  devSongResults.innerHTML = '';

  const searchText = keyword.trim().toLowerCase();

  const songs = SONG_DATABASE.filter(item => {

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
    fullBtn.className = 'dev-song-action';
    fullBtn.textContent = '全';
    fullBtn.dataset.songId = item.id;
    fullBtn.dataset.testMode = 'full';

    // 快速測試
    const quickBtn = document.createElement('button');
    quickBtn.className = 'dev-song-action';
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

  const item = SONG_DATABASE.find(song => song.id === songId);

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
