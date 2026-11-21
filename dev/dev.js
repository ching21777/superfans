
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

    <!-- 搜尋歌曲 -->
    <div style="display:flex; gap:6px; align-items:center;">
      <input type="text" id="dev-track-search"
        placeholder="搜尋歌手或歌名" autocomplete="off"
        style="flex:1; min-width:0;">

      <button class="bevel btn-sm" id="dev-track-search-btn"
        style="width:auto; flex-shrink:0; white-space:nowrap;">
        🔍
      </button>
    </div>

    <!-- 播放器與秒數記錄工具 -->
    <audio id="dev-track-audio" controls
      style="width:100%;display:none;"></audio>

    <div style="display:flex; gap:6px; margin-top:6px;">
      <input id="dev-play-until" type="number" step="0.1"
        placeholder="秒數"
        style="flex:1; min-width:0;">

      <button class="bevel btn-sm" id="dev-capture-time"
        style="width:auto;">抓秒數</button>

    </div>

    <div id="dev-play-until-status"
      style="font-size:12px; margin-top:4px;"></div>

    <!-- 搜尋結果 -->
    <div id="dev-track-results"></div>

    <!-- 已綁定歌曲 -->
    <div class="dev-section">已綁定歌曲</div>
    <div id="dev-track-saved"></div>

    <!-- 匯出工具 -->
    <div style="margin-top:10px;">
      <button class="bevel btn-sm" id="dev-track-export-btn">
        1.匯出
      </button>

      <button class="bevel btn-sm" id="dev-track-copy-btn">
        2.複製
      </button>

      <textarea id="dev-track-export"
        placeholder="匯出的 TRACKS 會顯示在這裡"
        style="width:100%; height:120px; margin-top:6px; display:none;">
      </textarea>
    </div>



  <!-- 曲目列表 -->
  <div id="dev-track-songs"></div>
  </div>
  <!-- 歌詞接唱 -->
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
      previewLyricsItem(allLyricsSongs[0]);
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
const devPlayUntil = $('dev-play-until');
const devCaptureTime = $('dev-capture-time');
const devPlayUntilStatus = $('dev-play-until-status');
const devTrackSearchBtn = $('dev-track-search-btn');

const devTrackSaved = $('dev-track-saved');
const devTrackExportBtn = $('dev-track-export-btn');
const devTrackExport = $('dev-track-export');
const devTrackCopyBtn = $('dev-track-copy-btn');

// 已綁定歌曲暫存
let savedTracks = JSON.parse(
  localStorage.getItem('devTrackSaved') || '{}'
);

devTrackExportBtn.addEventListener('click', () => {

  const newTracks = Object.entries(savedTracks).map(([no, data]) => ({
    no,
    title: data.title,
    artist: data.artist,
    appleMusicId: data.trackId
  }));

  devTrackExport.value =
  `const TRACKS = [\n${newTracks.map(track =>
    `  { no: ${JSON.stringify(track.no)}, title: ${JSON.stringify(track.title)}, artist: ${JSON.stringify(track.artist)}, appleMusicId: ${track.appleMusicId ?? 'null'} }`
  ).join(',\n')},\n];`;

  devTrackExport.style.display = 'block';
});

devTrackCopyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(devTrackExport.value);

  // 複製成功後，清空已綁定歌曲
  savedTracks = {};

  localStorage.setItem(
    'devTrackSaved',
    JSON.stringify(savedTracks)
  );

  // 更新畫面
  renderDevTrackSaved();

  // 隱藏匯出內容
  devTrackExport.style.display = 'none';
});

// 顯示已綁定歌曲
function renderDevTrackSaved() {
  devTrackSaved.innerHTML = '';

  const entries = Object.entries(savedTracks);

  if (!entries.length) {
    devTrackSaved.textContent = '尚無已綁定歌曲';
    devTrackSaved.style.color = '#FFFFFF';
    return;
  }

  entries.forEach(([key, data]) => {
    const { title, artist } = data;

    const row = document.createElement('div');
    row.className = 'dev-track-saved-item';
row.style.display = 'flex';
row.style.alignItems = 'center';
row.style.width = '100%';
    

    const info = document.createElement('div');
info.style.display = 'flex';
info.style.alignItems = 'center';
info.style.gap = '8px';
info.style.minWidth = '0';
info.style.flex = '1 1 0';

const name = document.createElement('div');
name.style.color = '#ffffff';
name.style.fontSize = '13px';
name.style.whiteSpace = 'nowrap';
name.style.flexShrink = '0';
name.textContent = `${title}｜${artist}`;

const album = document.createElement('div');
album.style.color = '#cccccc';
album.style.fontSize = '12px';
album.style.whiteSpace = 'nowrap';
album.style.overflow = 'hidden';
album.style.textOverflow = 'ellipsis';
album.style.minWidth = '0';
album.style.flex = '1 1 0';
album.textContent = data.album || '未知專輯';

const id = document.createElement('div');
id.style.color = '#ffffff';
id.style.fontSize = '12px';
id.style.whiteSpace = 'nowrap';
id.style.flexShrink = '0';
id.textContent = `ID: ${data.trackId}`;

info.append(name, album, id);

// 取消綁定按鈕
const removeBtn = document.createElement('button');
removeBtn.style.width = 'auto';
removeBtn.textContent = '取消';
removeBtn.style.fontSize = '11px';
removeBtn.style.padding = '2px 6px';
removeBtn.style.flexShrink = '0';
removeBtn.style.marginLeft = '6px';

removeBtn.addEventListener('click', () => {
  delete savedTracks[key];

  localStorage.setItem(
    'devTrackSaved',
    JSON.stringify(savedTracks)
  );

  renderDevTrackSaved();
});

row.append(info, removeBtn);
    devTrackSaved.appendChild(row);
  });
}

// 初始顯示
renderDevTrackSaved();


// 搜尋 iTunes 歌曲
async function searchDevTracks() {

  const input = devTrackSearch.value.trim();

  if (!input) {
    devTrackResults.textContent = '請先輸入或選擇歌曲';
    devTrackResults.style.color = '#ffffff';
    return;
  }

  // 純數字輸入：依 Super Fans 歌曲編號尋找題庫歌曲
  const isTrackNo = /^\d+$/.test(input);

  const numberedTrack = isTrackNo
    ? TRACKS.find(track =>
        String(track.no).padStart(3, '0') === input.padStart(3, '0')
      )
    : null;

  if (isTrackNo && !numberedTrack) {
    devTrackResults.textContent = '找不到這個歌曲編號';
    devTrackResults.style.color = '#ffffff';
    return;
  }

  if (numberedTrack) {
    selectedTrack = numberedTrack;
    devTrackSearch.value = `${numberedTrack.artist} ${numberedTrack.title}`;
  }

  const keyword = devTrackSearch.value.trim();

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
      name.textContent = `${track.trackName}｜${track.artistName}`;

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
        previewTrackId = track.trackId;
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

      // 綁定按鈕
const saveBtn = document.createElement('button');
saveBtn.className = 'bevel btn-sm';
saveBtn.textContent = '綁定';

saveBtn.addEventListener('click', () => {

  // 檢查正式題庫是否已有相同 Apple Music ID
  const existingTrack = TRACKS.find(
    item => String(item.appleMusicId) === String(track.trackId)
  );

  if (existingTrack) {
    alert(`這首歌曲已經綁定：${existingTrack.no}｜${existingTrack.title}`);
    return;
  }

  // 檢查本次待匯出的歌曲是否已有相同 ID
  const pendingTrack = Object.values(savedTracks).find(
    item => String(item.trackId) === String(track.trackId)
  );

  if (pendingTrack) {
    alert('這首歌曲已經加入待匯出清單');
    return;
  }

  // 沿用原本題庫歌曲編號
if (!selectedTrack) {
  alert('請先從題庫選擇要綁定的歌曲');
  return;
}

const newNo = String(selectedTrack.no);

  // 加入待匯出清單
  savedTracks[newNo] = {
    no: newNo,
    title: track.trackName,
    artist: track.artistName,
    trackId: track.trackId,
    album: track.collectionName || '未知專輯'
  };

  localStorage.setItem(
    'devTrackSaved',
    JSON.stringify(savedTracks)
  );

  renderDevTrackSaved();

// 清空搜尋欄並停止試聽
devTrackSearch.value = '';
selectedTrack = null;
devTrackAudio.pause();
devTrackAudio.removeAttribute('src');
devTrackAudio.style.display = 'none';

// 清空 Apple Music 搜尋結果
devTrackResults.innerHTML = '';

// 恢復完整題庫歌曲清單
renderDevTrackSongs();
});

      info.append(name, album, trackId);

row.append(no, info, playBtn, saveBtn);
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

// 從 tracks.js 整理尚未綁定的歌曲
let selectedTrack = null;
let previewTrackId = null;


// 顯示題庫搜尋結果
function renderDevTrackSongs(keyword = '') {

  devTrackSongs.innerHTML = '';

  const searchText = keyword.trim().toLowerCase();

  const songs = TRACKS.filter(track => {
    const text = `${track.no} ${track.title} ${track.artist}`;
    return text.toLowerCase().includes(searchText);
  });

  if (!songs.length) {
    devTrackSongs.textContent = '找不到題庫歌曲';
    devTrackSongs.style.color = '#ffffff';
    return;
  }

  songs.forEach(track => {

    const btn = document.createElement('button');

    btn.type = 'button';
    btn.className = 'dev-song-action';

    const isBound = track.appleMusicId || savedTracks[track.no];

let status = '';

if (track.appleMusicId) {
  status = '';
} else if (track.appleMusicId === null) {
  status = ' ⛓️‍💥';
}

btn.textContent =
  `${track.no}｜${track.title}｜${track.artist}${status}`;

    btn.style.textAlign = 'left';

    btn.addEventListener('click', () => {

      selectedTrack = track;
      devTrackSearch.value = `${track.artist} ${track.title}`;

      devTrackResults.innerHTML = '';

      // 尚未綁定：搜尋 Apple Music
      searchDevTracks();
    });

    devTrackSongs.appendChild(btn);
  });
}


// 輸入時篩選歌曲
devTrackSearch.addEventListener('input', () => {
  selectedTrack = null;
  devTrackResults.innerHTML = '';
  renderDevTrackSongs(devTrackSearch.value);
});

// 初始顯示
renderDevTrackSongs();
  
  const devSongSearch = $('dev-song-search');
  const devSongResults = $('dev-song-results');

// 合併 lyrics.js 的所有歌曲題庫
const allLyricsSongs = [
  ...HELLO_NICO_DATABASE,
  ...SONG_DATABASE
];

// 抓取播放器目前秒數
devCaptureTime.addEventListener('click', () => {
  if (!Number.isFinite(devTrackAudio.currentTime)) return;

  devPlayUntil.value = devTrackAudio.currentTime.toFixed(1);
});


// 搜尋並顯示歌曲清單
function renderDevSongList(keyword = '') {

  devSongResults.innerHTML = '';

  const searchText = keyword.trim().toLowerCase();

  const songs = allLyricsSongs.filter(item => {

    const titleMatch =
      item.title.toLowerCase().includes(searchText);

    const idText = String(item.no).padStart(3, '0');

    const idMatch =
      idText.includes(searchText) ||
      (
        /^\d+$/.test(searchText) &&
        Number(searchText) === item.no
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
    no.textContent = String(item.no).padStart(3, '0');

    const name = document.createElement('span');
    name.className = 'dev-song-name';
    name.textContent = item.title;

    // 完整測試
    const fullBtn = document.createElement('button');
    fullBtn.className = 'dev-song-action';
    fullBtn.textContent = '全';
    fullBtn.dataset.songId = item.no;
    fullBtn.dataset.testMode = 'full';

    // 快速測試
    const quickBtn = document.createElement('button');
    quickBtn.className = 'dev-song-action';
    quickBtn.textContent = '快';
    quickBtn.dataset.songId = item.no;
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

  const item = allLyricsSongs.find(song => Number(song.no) === songId);

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
