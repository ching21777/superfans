
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
  <div class="dev-heading"><span>🛠 開發測試工具</span><button class="dev-check-mode-btn" id="dev-check-mode-btn" type="button" title="切換歌曲資料健檢" aria-label="切換歌曲資料健檢">⌕</button></div>

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
    <button class="bevel btn-sm active" data-tab="guess">歌名</button>
    <button class="bevel btn-sm" data-tab="lyrics">歌詞</button>
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

    <div class="dev-section">Apple Music 批次配對</div>
    <div class="dev-check-intro">先選歌單與每批數量，再抓取候選歌曲；請逐首試聽確認。結果只暫存於本機，不會直接修改 TRACKS。</div>
    <div style="display:flex;gap:6px;align-items:center;margin:8px 0;">
      <select id="dev-apple-batch-playlist" style="flex:1;min-width:0;">
        <option value="all">全部未綁定歌曲</option>
      </select>
      <input id="dev-apple-batch-limit" type="number" min="1" max="200" value="20" aria-label="每批檢查數量" style="width:76px;">
    </div>
    <button class="bevel go" id="dev-apple-batch-start" type="button">預抓本批歌曲（20 首）</button>
    <div id="dev-apple-batch-status" aria-live="polite">尚未執行</div>
    <div id="dev-apple-batch-results"></div>
    <div style="display:flex;gap:6px;margin-top:6px;">
      <button class="bevel btn-sm" id="dev-apple-batch-export" type="button">匯出所選歌單已確認歌曲</button>
      <button class="bevel btn-sm" id="dev-apple-batch-clear" type="button">清除所選歌單紀錄</button>
    </div>
    <textarea id="dev-apple-batch-output" placeholder="已確認的歌曲物件會整理在這裡" style="width:100%;height:160px;margin-top:6px;display:none;"></textarea>

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
  <div id="dev-tab-check" style="display:none;">
    <div class="dev-check-placeholder">歌曲資料健檢</div>
  <div class="dev-check-tab-content">
    <div class="dev-section">歌曲資料健檢</div>
    <div class="dev-check-intro">更新歌曲後先跑完整健檢；只讀資料，不會修改歌單或題庫。</div>
    <div class="dev-check-actions">
      <button class="bevel go" id="dev-check-all">一鍵完整健檢</button>
      <button class="bevel btn-sm" id="dev-check-apple-live">曲庫可播放性健檢</button>
    </div>
    <div class="dev-check-actions dev-check-categories">
      <button class="bevel btn-sm" data-check="tracks">歌曲資料</button>
      <button class="bevel btn-sm" data-check="playlists">歌單</button>
      <button class="bevel btn-sm" data-check="lyrics">歌詞題庫</button>
      <button class="bevel btn-sm" data-check="apple">ID 綁定</button>
      <button class="bevel btn-sm" data-check="flow">遊戲流程</button>
    </div>
    <div id="dev-check-status" aria-live="polite">尚未執行健檢</div>
    <div id="dev-check-summary"></div>
    <div id="dev-check-results"></div>
  </div>
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

    .dev-heading { display:flex; align-items:center; justify-content:space-between; color:#F0D6A4; font-size:13px; font-weight:900; text-align:left; }
    .dev-check-mode-btn { width:26px !important; height:24px; min-width:26px; padding:0 !important; border:1px solid rgba(240,214,164,.35); border-radius:6px; background:rgba(240,214,164,.08); color:#F0D6A4; font-size:17px !important; line-height:1; cursor:pointer; }
    #dev-panel.dev-check-mode > :not(.dev-heading):not(#dev-tab-check) { display:none !important; }
    #dev-panel.dev-check-mode #dev-tab-check { display:block !important; }

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

    /* 歌曲資料健檢 */
.dev-check-intro { color:rgba(255,255,255,.72); font-size:11px; line-height:1.6; margin:4px 0 8px; }
.dev-check-actions { display:flex; gap:6px; margin:6px 0; }
.dev-check-actions button { flex:1; min-width:0; width:0; font-size:11px; }
.dev-check-categories { flex-wrap:wrap; }
.dev-check-categories button { flex:1 1 28%; }
#dev-check-status { color:#F0D6A4; font-size:11px; margin:8px 0 5px; line-height:1.5; }
.dev-check-summary { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:5px; margin:6px 0 9px; }
.dev-check-stat { background:rgba(255,255,255,.08); border:1px solid transparent; border-radius:6px; padding:6px 4px; text-align:center; font-size:10px; color:#fff; }
.dev-check-stat.has-error { background:rgba(239,83,80,.2); border-color:#EF5350; }
.dev-check-stat.has-warning { background:rgba(255,193,7,.18); border-color:#FFC107; }
.dev-check-stat strong { display:block; font-size:16px; margin-bottom:2px; }
.dev-check-group { border-top:1px solid rgba(255,255,255,.14); padding:7px 0; }
.dev-check-group-title { color:#F0D6A4; font-size:12px; font-weight:700; margin-bottom:5px; }
.dev-check-item { display:flex; gap:6px; align-items:flex-start; color:rgba(255,255,255,.88); font-size:11px; line-height:1.5; padding:6px 7px; margin:4px 0; border-radius:6px; overflow-wrap:anywhere; }
.dev-check-item.level-error { background:rgba(239,83,80,.13); border-left:3px solid #EF5350; }
.dev-check-item.level-warning { background:rgba(255,193,7,.12); border-left:3px solid #FFC107; }
.dev-check-mark { flex:0 0 15px; }
.dev-check-item.level-error .dev-check-mark { color:#FF7773; }
.dev-check-item.level-warning .dev-check-mark { color:#FFD45C; }
.dev-check-item small { color:rgba(255,255,255,.58); display:block; font-size:10px; margin-top:2px; }
.dev-check-suggestion { display:block; margin-top:4px; color:#B8E8D8; font-size:10px; }
.dev-check-suggestion strong { color:#D3D1DA; font-weight:700; }
.dev-check-empty { color:#B8E8D8; font-size:11px; padding:3px 0; }
.dev-check-placeholder { display:none; }
#dev-check-all { flex:1.4; }
#dev-check-apple-live { flex:1; }
    
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
  devPanel.style.display = devPanel.style.display === 'flex' ? 'none' : 'flex';
});
  const devCheckModeBtn = $('dev-check-mode-btn');
  devCheckModeBtn.addEventListener('click', () => {
    const active = devPanel.classList.toggle('dev-check-mode');
    devCheckModeBtn.textContent = active ? '↩' : '⌕';
    devCheckModeBtn.title = active ? '返回開發測試工具' : '切換歌曲資料健檢';
    devCheckModeBtn.setAttribute('aria-label', devCheckModeBtn.title);
    $('dev-tab-check').style.display = active ? 'block' : 'none';
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
      ['guess', 'lyrics'].forEach(tab => {
        const panel = document.getElementById('dev-tab-' + tab);
        if (panel) panel.style.display = btn.dataset.tab === tab ? '' : 'none';
      });
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

// ========================================
// Apple Music 批次預抓與人工確認
// ========================================
const appleBatchStart = $('dev-apple-batch-start');
const appleBatchStatus = $('dev-apple-batch-status');
const appleBatchResults = $('dev-apple-batch-results');
const appleBatchExport = $('dev-apple-batch-export');
const appleBatchClear = $('dev-apple-batch-clear');
const appleBatchOutput = $('dev-apple-batch-output');
const appleBatchPlaylist = $('dev-apple-batch-playlist');
const appleBatchLimit = $('dev-apple-batch-limit');
const APPLE_BATCH_KEY = 'devAppleBatchResults';
let appleBatchRunning = false;
let appleBatchItems = {};

try {
  appleBatchItems = JSON.parse(localStorage.getItem(APPLE_BATCH_KEY) || '{}') || {};
} catch (error) {
  appleBatchItems = {};
}

// 以歌曲編號＋歌手＋歌名核對舊紀錄，避免同編號換歌後沿用錯誤 ID。
function removeStaleAppleBatchItems() {
  const currentSongs = new Map(
    getAppleBatchTracks().map(song => [String(song.no), song])
  );

  Object.entries(appleBatchItems).forEach(([no, item]) => {
    const song = currentSongs.get(no);
    if (
      !song ||
      normalizeAppleBatchText(item.artist) !== normalizeAppleBatchText(song.artist) ||
      normalizeAppleBatchText(item.title) !== normalizeAppleBatchText(song.title)
    ) {
      delete appleBatchItems[no];
    }
  });
}

function saveAppleBatchItems() {
  localStorage.setItem(APPLE_BATCH_KEY, JSON.stringify(appleBatchItems));
}

function normalizeAppleBatchText(value) {
  return String(value || '').toLowerCase()
    .replace(/[()[\]{}（）【】「」『』]/g, '')
    .replace(/[\s\-_.,?!'":：，。！？」、]/g, '');
}

function getAppleBatchTracks() {
  const all = [
    ...(Array.isArray(TRACKS) ? TRACKS : []),
    ...(typeof TEST !== 'undefined' && Array.isArray(TEST) ? TEST : [])
  ];
  const seen = new Set();
  return all.filter(song => {
    if (!song || !song.no || !song.artist || !song.title) return false;
    const key = String(song.no);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getAppleBatchPlaylistKeys() {
  return typeof playlists === 'object' && playlists
    ? Object.keys(playlists).filter(key =>
        Array.isArray(playlists[key]) &&
        key !== 'male2000s' &&
        key !== 'female2000s'
      )
    : [];
}

function getAppleBatchPlaylistSongs() {
  const key = appleBatchPlaylist.value;
  const all = getAppleBatchTracks();
  if (key === 'all') return all;
  if (key === 'maleTest') return all.filter(song => /^91\d{2}$/.test(String(song.no)));
  if (key === 'femaleTest') return all.filter(song => /^92\d{2}$/.test(String(song.no)));
  const entries = playlists?.[key];
  if (!Array.isArray(entries)) return [];
  const wanted = new Set(entries.map(value => normalizeAppleBatchText(value)));
  return all.filter(song => wanted.has(normalizeAppleBatchText(song.artist + ' ' + song.title)));
}

function initAppleBatchPlaylistOptions() {
  const labels = typeof names === 'object' && names ? names : {};
  [
    { value: 'maleTest', label: '901 男歌手精選' },
    { value: 'femaleTest', label: '902 女歌手精選' }
  ].forEach(item => {
    const option = document.createElement('option');
    option.value = item.value;
    option.textContent = item.label;
    appleBatchPlaylist.appendChild(option);
  });
  getAppleBatchPlaylistKeys().forEach(key => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = labels[key] || key;
    appleBatchPlaylist.appendChild(option);
  });
  updateAppleBatchControls();
}

function updateAppleBatchControls() {
  const limit = Math.max(1, Math.min(200, Number.parseInt(appleBatchLimit.value, 10) || 20));
  appleBatchLimit.value = String(limit);
  const songs = getAppleBatchPlaylistSongs();
  const pending = songs.filter(song =>
    !song.appleMusicId && !appleBatchItems[String(song.no)]?.confirmed
  );
  appleBatchStart.textContent = '預抓本批歌曲（' + limit + ' 首）';
  appleBatchStatus.textContent = '所選歌單共 ' + songs.length + ' 首｜尚有 ' + pending.length + ' 首未確認';
  renderAppleBatchItems();
}

function getAppleBatchStatus(item) {
  if (item.confirmed && item.trackId) return { text: '已人工確認｜Apple Music ID：' + item.trackId, color: '#63c985', background: 'rgba(42,145,75,.14)' };
  if (item.error) return { text: item.error === '沒有搜尋結果' ? '尚無候選結果' : '查詢失敗｜' + item.error, color: '#ff7777', background: 'rgba(190,45,45,.14)' };
  if (!item.candidate) return { text: item.searched ? '尚無候選結果' : '尚未檢查', color: item.searched ? '#ff7777' : '#aaa', background: item.searched ? 'rgba(190,45,45,.14)' : 'rgba(130,130,130,.10)' };
  if (!item.candidate.previewUrl) return { text: (item.matchStatus || '找到候選') + '｜無試聽音檔，暫不可確認', color: '#ffbd59', background: 'rgba(190,130,35,.14)' };
  if (item.matchStatus === '歌手歌名吻合，需試聽') return { text: '歌手歌名吻合｜待人工試聽', color: '#76baff', background: 'rgba(45,115,190,.14)' };
  return { text: (item.matchStatus || '候選需核對') + '｜請人工核對', color: '#ffbd59', background: 'rgba(190,130,35,.14)' };
}

function renderAppleBatchItems() {
  appleBatchResults.innerHTML = '';
  const selectedSongs = getAppleBatchPlaylistSongs();
  const selectedNos = new Set(selectedSongs.map(song => String(song.no)));
  const items = Object.values(appleBatchItems).filter(item => selectedNos.has(String(item.no)));
  if (!items.length) {
    appleBatchResults.textContent = '所選歌單目前沒有批次配對紀錄';
    return;
  }

  items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'dev-track-result';
    row.style.display = 'block';

    const title = document.createElement('div');
    title.className = 'dev-track-name';
    title.textContent = item.no + '｜' + item.artist + ' - ' + item.title;

    const statusInfo = getAppleBatchStatus(item);
    const status = document.createElement('div');
    status.className = 'dev-track-album';
    status.textContent = statusInfo.text;
    status.style.cssText = 'display:inline-block;margin-top:5px;padding:3px 7px;border-radius:4px;color:' + statusInfo.color + ';background:' + statusInfo.background + ';';

    row.append(title, status);

    if (item.candidates?.length) {
      const controls = document.createElement('div');
      controls.style.cssText = 'display:flex;gap:6px;align-items:center;margin-top:6px;';

      const select = document.createElement('select');
      select.style.cssText = 'flex:1;min-width:0;';
      item.candidates.forEach((candidate, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = (index + 1) + '. ' + candidate.trackName + '｜' + candidate.artistName + (candidate.previewUrl ? '' : '（無試聽）');
        select.appendChild(option);
      });
      const currentIndex = item.candidates.findIndex(candidate => String(candidate.trackId) === String(item.candidate?.trackId));
      select.value = String(Math.max(0, currentIndex));

      const play = document.createElement('button');
      play.className = 'bevel btn-sm';
      play.type = 'button';
      play.textContent = '試聽';
      play.addEventListener('click', async () => {
        const candidate = item.candidates[Number(select.value)];
        if (!candidate?.previewUrl) {
          alert('這個候選版本沒有試聽音檔');
          return;
        }
        devTrackAudio.pause();
        devTrackAudio.src = candidate.previewUrl;
        devTrackAudio.style.display = 'block';
        try { await devTrackAudio.play(); }
        catch (error) { alert('音檔播放失敗，請再試一次'); }
      });

      const confirm = document.createElement('button');
      confirm.className = 'bevel btn-sm';
      confirm.type = 'button';
      confirm.textContent = item.confirmed ? '已確認' : '確認採用';
      confirm.disabled = !!item.confirmed;
      confirm.addEventListener('click', () => {
        const candidate = item.candidates[Number(select.value)];
        if (!candidate?.previewUrl) {
          alert('請先選擇有試聽音檔的版本，並人工試聽確認');
          return;
        }
        item.candidate = candidate;
        item.trackId = candidate.trackId;
        item.confirmed = true;
        item.confirmedAt = new Date().toISOString();
        saveAppleBatchItems();
        updateAppleBatchControls();
      });

      controls.append(select, play, confirm);
      row.appendChild(controls);
    }

    appleBatchResults.appendChild(row);
  });
}

async function runAppleMusicBatchPrefetch() {
  if (appleBatchRunning) return;
  appleBatchRunning = true;
  appleBatchStart.disabled = true;
  try {
    const allSongs = getAppleBatchPlaylistSongs();
    const pending = allSongs.filter(song =>
      !song.appleMusicId && !appleBatchItems[String(song.no)]?.confirmed
    );
    const limit = Math.max(1, Math.min(200, Number.parseInt(appleBatchLimit.value, 10) || 20));
    const songs = pending.slice(0, limit);
    if (!songs.length) {
      appleBatchStatus.textContent = '所選歌單已沒有待配對歌曲。';
      return;
    }
    let checked = 0;
    appleBatchStatus.textContent = '準備搜尋 ' + songs.length + ' 首（本批上限 ' + limit + '）…';

    for (const song of songs) {
      const key = String(song.no);
      const item = appleBatchItems[key] || {
        no: key, artist: song.artist, title: song.title, confirmed: false
      };
      item.searched = true;
      try {
        const response = await fetch(
          'https://itunes.apple.com/search?term=' +
          encodeURIComponent(song.artist + ' ' + song.title) +
          '&entity=song&limit=10&country=TW'
        );
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const data = await response.json();
        const candidates = Array.isArray(data.results) ? data.results : [];
        item.candidates = candidates;
        item.candidate = candidates[0] || null;
        item.confirmed = false;
        item.error = candidates.length ? '' : '沒有搜尋結果';

        if (item.candidate) {
          const artistMatch = normalizeAppleBatchText(item.candidate.artistName).includes(normalizeAppleBatchText(song.artist));
          const titleMatch = normalizeAppleBatchText(item.candidate.trackName) === normalizeAppleBatchText(song.title);
          item.matchStatus = artistMatch && titleMatch
            ? (item.candidate.previewUrl ? '歌手歌名吻合，需試聽' : '歌手歌名吻合，但無試聽')
            : '歌手或歌名需人工核對';
        }
        appleBatchItems[key] = item;
      } catch (error) {
        item.error = error.message || '查詢失敗';
        appleBatchItems[key] = item;
      }

      checked++;
      renderAppleBatchItems();
      appleBatchStatus.textContent = '批次搜尋中（' + checked + '／' + songs.length + '）…';
      if (checked % 5 === 0) saveAppleBatchItems();
      if (checked < songs.length) await waitForAppleCheck(250);
    }

    saveAppleBatchItems();
    updateAppleBatchControls();
    appleBatchStatus.textContent = '本批預抓完成：' + songs.length + ' 首；請逐首試聽並確認。';
  } finally {
    appleBatchRunning = false;
    appleBatchStart.disabled = false;
  }
}

appleBatchPlaylist.addEventListener('change', updateAppleBatchControls);
appleBatchLimit.addEventListener('change', updateAppleBatchControls);
appleBatchStart.addEventListener('click', runAppleMusicBatchPrefetch);
appleBatchClear.addEventListener('click', () => {
  const selectedKey = appleBatchPlaylist.value;
  const selectedSongs = getAppleBatchPlaylistSongs();
  if (!selectedSongs.length) {
    alert('所選歌單沒有歌曲紀錄可清除');
    return;
  }

  const label = appleBatchPlaylist.selectedOptions[0]?.textContent || '所選歌單';
  if (!confirm('確定清除「' + label + '」的 Apple Music 批次配對紀錄？此操作不會修改 TRACKS。')) return;

  if (selectedKey === 'all') {
    appleBatchItems = {};
  } else {
    selectedSongs.forEach(song => {
      delete appleBatchItems[String(song.no)];
    });
  }

  saveAppleBatchItems();
  appleBatchOutput.value = '';
  appleBatchOutput.style.display = 'none';
  updateAppleBatchControls();
  appleBatchStatus.textContent = '已清除「' + label + '」的批次配對紀錄。';
});
appleBatchExport.addEventListener('click', () => {
  const selectedNos = new Set(getAppleBatchPlaylistSongs().map(song => String(song.no)));
  const confirmed = Object.values(appleBatchItems).filter(item =>
    selectedNos.has(String(item.no)) && item.confirmed && item.trackId
  );
  const output = confirmed.map(item => {
    const no = "'" + String(item.no).replace(/'/g, "\\'") + "'";
    const title = JSON.stringify(String(item.title));
    const artist = JSON.stringify(String(item.artist));
    const rawId = String(item.trackId);
    const appleMusicId = Number.isFinite(Number(rawId)) && rawId.trim() !== '' ? String(Number(rawId)) : JSON.stringify(rawId);
    return "  { no: " + no + ", title: " + title + ", artist: " + artist + ", appleMusicId: " + appleMusicId + " },";
  }).join('\n');
  appleBatchOutput.value = output || '// 所選歌單尚無人工確認的歌曲';
  appleBatchOutput.style.display = 'block';
  appleBatchOutput.focus();
  appleBatchOutput.select();
});
removeStaleAppleBatchItems();
saveAppleBatchItems();
initAppleBatchPlaylistOptions();
updateAppleBatchControls();

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


  // ========================================
  // 08. 歌曲資料健檢（只讀，不修改來源資料）
  // ========================================

  const devCheckStatus = $('dev-check-status');
  const devCheckSummary = $('dev-check-summary');
  const devCheckResults = $('dev-check-results');

  const devCheckNames = {
    tracks: '歌曲資料',
    playlists: '歌單',
    lyrics: '歌詞題庫',
    apple: 'Apple Music ID',
    flow: '遊戲流程',
    appleLive: 'Apple Music 實際查詢'
  };

  const devCheckNormalize = value => String(value ?? '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[()[\]{}（）【】]/g, '')
    .replace(/[\s\-_.,?!'"’「」『』]/g, '');

  function runDevDataChecks(scope = 'all') {
    const results = [];
    const add = (group, level, message, detail = '') =>
      results.push({ group, level, message, detail });

    const tracks = Array.isArray(TRACKS) ? TRACKS : [];
    const testTracks = typeof TEST !== 'undefined' && Array.isArray(TEST) ? TEST : [];
    const allTracks = [...tracks, ...testTracks];
    const allLyrics = [
      ...(Array.isArray(HELLO_NICO_DATABASE) ? HELLO_NICO_DATABASE : []),
      ...(Array.isArray(SONG_DATABASE) ? SONG_DATABASE : [])
    ];

    const checkTracks = scope === 'all' || scope === 'tracks';
    const checkPlaylists = scope === 'all' || scope === 'playlists';
    const checkLyrics = scope === 'all' || scope === 'lyrics';
    const checkApple = scope === 'all' || scope === 'apple';
    const checkFlow = scope === 'all' || scope === 'flow';

    if (checkTracks) {
      if (!tracks.length) add('歌曲資料', 'error', 'TRACKS 是空的');
      if (!testTracks.length) add('歌曲資料', 'info', 'TEST 目前沒有暫存歌曲');

      const seenNos = new Map();
      const seenSongs = new Map();
      allTracks.forEach((song, index) => {
        const label = `${song?.no || '無編號'}｜${song?.artist || '未知歌手'} - ${song?.title || '未知歌名'}`;
        if (!song || typeof song !== 'object') {
          add('歌曲資料', 'error', `第 ${index + 1} 筆不是有效歌曲物件`);
          return;
        }
        if (!String(song.no ?? '').trim()) add('歌曲資料', 'error', '歌曲缺少編號', label);
        if (!String(song.title ?? '').trim()) add('歌曲資料', 'error', '歌曲缺少歌名', label);
        if (!String(song.artist ?? '').trim()) add('歌曲資料', 'error', '歌曲缺少歌手', label);

        const no = String(song.no ?? '').trim();
        if (no && seenNos.has(no)) {
          add('歌曲資料', 'error', '歌曲編號重複', `${label}；也出現在 ${seenNos.get(no)}`);
        } else if (no) seenNos.set(no, label);

        const identity = devCheckNormalize(`${song.artist} ${song.title}`);
        if (identity && seenSongs.has(identity)) {
          add('歌曲資料', 'error', '歌手與歌名重複', `${label}；也出現在 ${seenSongs.get(identity)}`);
        } else if (identity) seenSongs.set(identity, label);
      });

      const activeNo = new Set(tracks.map(song => String(song?.no ?? '')));
      const testNo = new Set(testTracks.map(song => String(song?.no ?? '')));
      testNo.forEach(no => {
        if (activeNo.has(no)) add('歌曲資料', 'error', 'TEST 與 TRACKS 使用相同編號', no);
      });

      const activeIdentity = new Set(tracks.map(song =>
        devCheckNormalize(`${song?.artist} ${song?.title}`)
      ));
      testTracks.forEach(song => {
        const key = devCheckNormalize(`${song?.artist} ${song?.title}`);
        if (key && activeIdentity.has(key)) {
          add('歌曲資料', 'error', 'TEST 與 TRACKS 有相同歌曲', `${song.no}｜${song.artist} - ${song.title}`);
        }
      });

      add('歌曲資料', 'info', `已檢查 ${tracks.length} 首正式歌曲、${testTracks.length} 首 TEST 歌曲`);
    }

    if (checkPlaylists) {
      if (typeof playlists !== 'object' || !playlists) {
        add('歌單', 'error', '找不到 playlists 資料');
      } else {

        Object.entries(playlists).forEach(([key, list]) => {
          if (!Array.isArray(list)) {
            add('歌單', 'error', `${key} 不是陣列`);
            return;
          }
          if (!list.length) add('歌單', 'error', `${key} 歌單是空的`);

          const seen = new Set();
          const missingTracks = [];
          const inactiveTracks = [];
          list.forEach((term, index) => {
            if (typeof term !== 'string' || !term.trim()) {
              add('歌單', 'error', `${key} 第 ${index + 1} 筆不是有效歌曲文字`);
              return;
            }
            const normalized = devCheckNormalize(term);
            if (seen.has(normalized)) add('歌單', 'error', `${key} 有重複歌曲`, term);
            seen.add(normalized);

            const match = allTracks.find(song =>
              devCheckNormalize(`${song?.artist} ${song?.title}`) === normalized
            );
            if (!match) {
              missingTracks.push(term);
            } else if (testNoForCheck(match.no)) {
              inactiveTracks.push(term);
            }
          });
          if (missingTracks.length || inactiveTracks.length) {
            const matchedCount = list.length - missingTracks.length - inactiveTracks.length;
            const summary = `${key}：${list.length} 首（${matchedCount} 首已建立、${missingTracks.length} 首尚未建立、${inactiveTracks.length} 首屬於 TEST）`;
            const details = [];
            if (missingTracks.length) details.push('尚未建立：' + missingTracks.slice(0, 5).join('、') + (missingTracks.length > 5 ? '…' : ''));
            if (inactiveTracks.length) details.push('TEST 歌曲：' + inactiveTracks.slice(0, 5).join('、') + (inactiveTracks.length > 5 ? '…' : ''));
            add('歌單', 'warning', summary, details.join('；'));
          } else {
            add('歌單', 'info', `${key}：${list.length} 首，全部已建立`);
          }
        });

        const demoCount = ['drama', 'she', 'fish']
          .reduce((sum, key) => sum + (Array.isArray(playlists[key]) ? playlists[key].length : 0), 0);
        if (!demoCount) add('歌單', 'error', '試玩模式合併歌單沒有可用歌曲');
        else add('歌單', 'info', `試玩模式合併歌單共 ${demoCount} 首（尚未扣除 TEST）`);
      }
    }

    function testNoForCheck(no) {
      return testTracks.some(song => String(song?.no) === String(no));
    }

    if (checkLyrics) {
      if (!allLyrics.length) add('歌詞題庫', 'error', '歌詞題庫是空的');
      const trackMap = new Map(allTracks.map(song => [String(song?.no), song]));
      const seenQuestion = new Set();
      const validTypes = ['previous', 'next', 'fill'];

      allLyrics.forEach((item, index) => {
        const label = `${item?.no || '無編號'}｜${item?.title || '未命名題目'}`;
        if (!item || typeof item !== 'object') {
          add('歌詞題庫', 'error', `第 ${index + 1} 題不是有效物件`);
          return;
        }
        const no = String(item.no ?? '');
        if (!no) add('歌詞題庫', 'error', '題目缺少歌曲編號', label);
        if (!String(item.title ?? '').trim()) add('歌詞題庫', 'error', '題目缺少歌名', label);
        if (!trackMap.has(no)) {
          add('歌詞題庫', 'error', '題目編號找不到 TRACKS／TEST 歌曲', label);
        } else if (testNoForCheck(no)) {
          add('歌詞題庫', 'warning', '題目對應 TEST 歌曲，目前不會進入正式遊戲', label);
        }
        if (!validTypes.includes(item.type)) add('歌詞題庫', 'error', '題型不正確', `${label}；type=${item.type}`);
        if (!String(item.prompt ?? '').trim()) add('歌詞題庫', 'error', '題目提示是空的', label);
        if (!String(item.answer ?? '').trim()) add('歌詞題庫', 'error', '正確答案是空的', label);

        const key = `${no}:${item.type}`;
        if (seenQuestion.has(key)) add('歌詞題庫', 'warning', '同一首歌有重複題型', label);
        seenQuestion.add(key);

        if (!Array.isArray(item.distractors) || item.distractors.length !== 3) {
          add('歌詞題庫', 'error', '干擾選項應該剛好有 3 個', label);
        } else {
          const options = [item.answer, ...item.distractors].map(devCheckNormalize);
          if (new Set(options).size !== options.length) add('歌詞題庫', 'error', '正確答案與干擾選項不可重複', label);
          if (item.distractors.some(value => !String(value ?? '').trim())) add('歌詞題庫', 'error', '干擾選項有空白', label);
        }
        if (item.type === 'fill') {
          const blanks = (String(item.prompt ?? '').match(/\{\{blank\}\}/g) || []).length;
          if (blanks !== 1) add('歌詞題庫', 'error', 'fill 題型的 {{blank}} 必須剛好出現一次', `${label}；目前 ${blanks} 次`);
        }
        if (item.playUntil == null || item.playUntil === '') {
          add('歌詞題庫', 'warning', '未設定播放秒數，遊戲會使用預設秒數', label);
        } else if (!Number.isFinite(Number(item.playUntil)) || Number(item.playUntil) <= 0) {
          add('歌詞題庫', 'error', '播放秒數必須是大於 0 的數字', label);
        } else if (Number(item.playUntil) > 30) {
          add('歌詞題庫', 'warning', '播放秒數超過 30 秒，建議確認設定', `${label}；${item.playUntil} 秒`);
        }
        const linkedTrack = trackMap.get(no);
        if (linkedTrack && devCheckNormalize(item.title) !== devCheckNormalize(linkedTrack.title)) {
          add('歌詞題庫', 'warning', '題庫歌名與歌曲基本資料不一致', `${label}；TRACKS：${linkedTrack.title}`);
        }
      });

      const activeLyricCount = allLyrics.filter(item =>
        tracks.some(song => String(song?.no) === String(item?.no))
      ).length;
      if (!activeLyricCount) add('歌詞題庫', 'error', '目前沒有任何題目能對應正式 TRACKS');
      add('歌詞題庫', 'info', `共檢查 ${allLyrics.length} 題，其中 ${activeLyricCount} 題對應正式歌曲`);
    }

    if (checkApple) {
      const idOwners = new Map();
      let bound = 0;
      allTracks.forEach(song => {
        const id = song?.appleMusicId;
        if (id == null || id === '') return;
        bound++;
        const idText = String(id).trim();
        const label = `${song.no}｜${song.artist} - ${song.title}`;
        if (!/^\d+$/.test(idText)) add('Apple Music ID', 'error', 'Apple Music ID 格式錯誤', `${label}；ID=${idText}`);
        if (idOwners.has(idText)) add('Apple Music ID', 'error', 'Apple Music ID 重複使用', `${label}；也用於 ${idOwners.get(idText)}`);
        else idOwners.set(idText, label);
      });
      const missing = allTracks.length - bound;
      if (missing) add('Apple Music ID', 'warning', `${missing} 首歌曲尚未綁定 Apple Music ID`);
      add('Apple Music ID', 'info', `${bound} 首已綁定／共 ${allTracks.length} 首歌曲`);
      add('Apple Music ID', 'info', '本項只檢查格式與重複；實際可查詢、可播放請使用上方「Apple Music 實際查詢」');
    }

    if (checkFlow) {
      const requiredGlobals = [
        ['begin', typeof begin === 'function'],
        ['songPool', typeof songPool === 'function'],
        ['loadQuestion', typeof loadQuestion === 'function'],
        ['loadLyricsQuestion', typeof loadLyricsQuestion === 'function'],
        ['finish', typeof finish === 'function']
      ];
      requiredGlobals.forEach(([name, exists]) => {
        if (!exists) add('遊戲流程', 'error', `找不到遊戲流程函式：${name}`);
      });
      const activeLyrics = allLyrics.filter(item =>
        tracks.some(song => String(song?.no) === String(item?.no))
      );
      if (!tracks.length) add('遊戲流程', 'error', '一般歌曲模式沒有正式歌曲資料');
      if (!activeLyrics.length) add('遊戲流程', 'error', '歌詞接唱沒有可用題目');
      if (typeof playlists === 'object' && playlists) {
        ['drama', 'she', 'fish'].forEach(key => {
          if (!Array.isArray(playlists[key]) || !playlists[key].length) {
            add('遊戲流程', 'error', `試玩模式缺少 ${key} 歌單`);
          }
        });
      }
      if (requiredGlobals.every(([, exists]) => exists)) {
        add('遊戲流程', 'info', '主要遊戲流程函式皆已載入');
      }
      add('遊戲流程', 'info', '此項為資料與函式入口檢查；實際答題、播放與結算仍需搭配自動模擬及人工驗收');
    }

    return results;
  }

  function getDevCheckSuggestion(item) {
    const message = item.message || '';
    const group = item.group || '';

    if (item.level === 'error') {
      if (/缺少編號|缺少歌名|缺少歌手|缺少歌曲編號|缺少歌名/.test(message)) return '補上缺少的歌曲／題目基本資料，再重新健檢。';
      if (/不是有效/.test(message)) return '檢查這筆資料格式，確認它是正確的歌曲或題目物件。';
      if (/重複/.test(message)) return '比對列出的資料，保留正確的一筆，修正或移除重複項目。';
      if (/空的|空白/.test(message)) return '補上必要內容；若是正式遊戲資料，不能留空。';
      if (/編號找不到|找不到 TRACKS/.test(message)) return '確認歌曲編號是否正確，並確認歌曲已加入 TRACKS 或 TEST。';
      if (/題型不正確/.test(message)) return '將題型改為支援的 previous、next 或 fill。';
      if (/干擾選項/.test(message)) return '確認每題有 3 個不重複且非空白的干擾選項。';
      if (/\{\{blank\}\}/.test(message)) return '調整 fill 題目的提示文字，讓 {{blank}} 剛好出現一次。';
      if (/播放秒數/.test(message)) return '將播放秒數改成大於 0 的有效數字。';
      if (/Apple Music ID 格式/.test(message)) return '重新確認 Apple Music ID，只填入純數字 ID。';
      if (/找不到遊戲流程函式/.test(message)) return '確認對應遊戲函式是否被刪除、改名，或未成功載入。';
      if (/歌單/.test(message) || /playlists/.test(message)) return '檢查歌單資料是否存在、格式正確，且至少包含一首有效歌曲。';
      return '依錯誤內容修正資料或程式，再重新執行這項健檢。';
    }

    if (item.level === 'warning') {
      if (/尚未建立 TRACKS 資料/.test(message)) return '若這些歌要加入遊戲，請先新增到 TRACKS；只是預先規劃的歌單可暫時保留。';
      if (/TEST 歌曲/.test(message) || /對應 TEST 歌曲/.test(message)) return '確認是否刻意放在 TEST；正式啟用前需移入 TRACKS。';
      if (/尚未綁定 Apple Music ID/.test(message)) return '需要播放這首歌時再補綁 ID；暫時不使用可先保留。';
      if (/未設定播放秒數/.test(message)) return '可先使用預設秒數；若想控制播放片段，再補上 playUntil。';
      if (/超過 30 秒/.test(message)) return '確認是否刻意播放較長片段；不是預期值再調整 playUntil。';
      if (/歌名與歌曲基本資料不一致/.test(message)) return '比對題庫與 TRACKS 的歌名，確認只是版本／別名差異，或修正成一致。';
      if (/重複題型/.test(message)) return '確認是否刻意為同一首歌建立相同題型；若不是，請調整或移除重複題目。';
      if (/查詢結果與歌曲資料不完全相符/.test(message)) return '確認 Apple Music 查到的是正確版本；若選錯，重新綁定正確歌曲。';
      if (/查詢失敗|查詢異常/.test(message)) return '先確認網路或稍後重試；不要只因暫時查詢失敗就急著更換 ID。';
      if (/previewUrl/.test(message)) return '確認 Apple Music 是否有提供這首歌的試聽音檔，或改找有試聽的正確版本。';
      if (/找不到符合|沒有搜尋結果/.test(message)) return '檢查歌手／歌名資料，並確認 Apple Music 台灣區是否有符合且可試聽的版本。'
      if (/沒有已綁定 ID/.test(message)) return '先替需要測試播放的歌曲綁定 ID，再執行實際查詢。';
      return '確認這是否符合目前的歌曲規劃；若是預期狀況，可以暫時不處理。';
    }

    if (group === 'Apple Music 實際查詢') return '目前檢查通過，無須處理。';
    return '目前檢查通過，無須處理。';
  }

  function decodeDevCheckEntities(value) {
    const decoder = document.createElement('textarea');
    decoder.innerHTML = String(value ?? '');
    return decoder.value;
  }

  function renderDevCheckResults(results, title = '完整健檢') {
    const counts = results.reduce((acc, item) => {
      acc[item.level] = (acc[item.level] || 0) + 1;
      return acc;
    }, {});
    const errors = counts.error || 0;
    const warnings = counts.warning || 0;
    const passed = results.filter(item => item.level === 'info').length;
    devCheckStatus.textContent = `${title}完成｜${errors ? '有錯誤需要修正' : warnings ? '有提醒需要確認' : '沒有發現問題'}`;

    devCheckSummary.className = 'dev-check-summary';
    devCheckSummary.innerHTML = '';
    [
      ['錯誤', errors],
      ['提醒', warnings],
      ['通過／資訊', passed]
    ].forEach(([label, count]) => {
      const card = document.createElement('div');
      card.className = 'dev-check-stat';
      if (label === '錯誤' && count > 0) card.classList.add('has-error');
      if (label === '提醒' && count > 0) card.classList.add('has-warning');
      const number = document.createElement('strong');
      number.textContent = count;
      const caption = document.createElement('span');
      caption.textContent = label;
      card.append(number, caption);
      devCheckSummary.appendChild(card);
    });

    devCheckResults.innerHTML = '';
    const groups = [...new Set(results.map(item => item.group))];
    if (!groups.length) {
      devCheckResults.textContent = '沒有檢查結果';
      return;
    }
    groups.forEach(group => {
      const section = document.createElement('div');
      section.className = 'dev-check-group';
      const heading = document.createElement('div');
      heading.className = 'dev-check-group-title';
      heading.textContent = group;
      section.appendChild(heading);
      results.filter(item => item.group === group).forEach(item => {
        const row = document.createElement('div');
        row.className = `dev-check-item level-${item.level}`;
        const mark = document.createElement('span');
        mark.className = 'dev-check-mark';
        mark.textContent = item.level === 'error' ? '❌' : item.level === 'warning' ? '⚠️' : '✓';
        const text = document.createElement('span');
        text.textContent = decodeDevCheckEntities(item.message);
        if (item.detail) {
          const detail = document.createElement('small');
          detail.textContent = decodeDevCheckEntities(item.detail);
          text.appendChild(detail);
        }
        const suggestion = document.createElement('small');
        suggestion.className = 'dev-check-suggestion';
        const suggestionLabel = document.createElement('strong');
        suggestionLabel.textContent = '建議處理方式：';
        suggestion.append(suggestionLabel, document.createTextNode(decodeDevCheckEntities(getDevCheckSuggestion(item))));
        text.appendChild(suggestion);
        row.append(mark, text);
        section.appendChild(row);
      });
      devCheckResults.appendChild(section);
    });
  }

  function normalizeGameMatchText(value) {
    return (value || '').toLowerCase()
      .replace(/[()[\]{}（）【】]/g, '')
      .replace(/[\s\-_.,?!'"]/g, '');
  }

  function waitForAppleCheck(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function runDevAppleLiveCheck() {
    const sourceTracks = [
      ...(Array.isArray(TRACKS) ? TRACKS : []),
      ...(typeof TEST !== 'undefined' && Array.isArray(TEST) ? TEST : [])
    ];
    const candidates = [];
    const results = [];

    sourceTracks.forEach((song, index) => {
      if (!song || typeof song !== 'object' ||
          !String(song.artist ?? '').trim() || !String(song.title ?? '').trim()) {
        results.push({
          group: '曲庫資料',
          level: 'error',
          message: '歌曲資料缺少歌手或歌名，無法查詢',
          detail: '曲庫第 ' + (index + 1) + ' 筆'
        });
        return;
      }
      candidates.push(song);
    });

    const total = candidates.length;
    let checked = 0;
    let playable = 0;
    devCheckStatus.textContent = '曲庫可播放性健檢中（0／' + total + '）…';

    for (const song of candidates) {
      const label = (song.no ?? '無編號') + '｜' + song.artist + ' - ' + song.title;
      const artistKey = normalizeGameMatchText(song.artist);
      const titleKey = normalizeGameMatchText(song.title);
      let outcome = null;

      try {
        // 與遊戲一致：有 ID 時先 lookup；有 previewUrl 就直接採用，不再比對歌名／歌手。
        if (song.appleMusicId != null && song.appleMusicId !== '') {
          try {
            const response = await fetch(
              'https://itunes.apple.com/lookup?id=' + encodeURIComponent(song.appleMusicId) + '&country=TW'
            );
            const data = await response.json();
            const idTrack = (data.results || []).find(item => item.previewUrl);
            if (idTrack) {
              outcome = {
                level: 'info',
                message: '可播放（使用已綁定 ID）',
                detail: label + '；Apple Music：' + (idTrack.artistName || '未知歌手') + ' - ' + (idTrack.trackName || '未知歌名')
              };
            }
          } catch (error) {
            // 遊戲在 ID lookup 失敗時也會退回歌名搜尋。
          }
        }

        // 沒有 ID，或 ID 沒有可播放音檔：依遊戲規則搜尋歌名。
        if (!outcome) {
          const response = await fetch(
            'https://itunes.apple.com/search?term=' + encodeURIComponent(song.artist + ' ' + song.title) + '&entity=song&limit=10&country=TW'
          );
          if (!response.ok) throw new Error('HTTP ' + response.status);
          const data = await response.json();
          const tracks = Array.isArray(data.results) ? data.results : [];
          const playableMatches = tracks.filter(item =>
            item.previewUrl &&
            normalizeGameMatchText(item.artistName).includes(artistKey) &&
            normalizeGameMatchText(item.trackName) === titleKey
          );

          if (playableMatches.length) {
            const match = playableMatches[0];
            outcome = {
              level: 'info',
              message: '可播放（歌名搜尋成功）',
              detail: label + '；Apple Music：' + match.artistName + ' - ' + match.trackName
            };
          } else {
            const titleArtistMatches = tracks.filter(item =>
              normalizeGameMatchText(item.artistName).includes(artistKey) &&
              normalizeGameMatchText(item.trackName) === titleKey
            );
            if (titleArtistMatches.length) {
              const match = titleArtistMatches[0];
              outcome = {
                level: 'warning',
                message: '找到符合歌曲，但沒有可播放的 previewUrl',
                detail: label + '；候選：' + match.artistName + ' - ' + match.trackName
              };
            } else if (tracks.length) {
              const previews = tracks.filter(item => item.previewUrl).slice(0, 3);
              const candidatesText = (previews.length ? previews : tracks.slice(0, 3))
                .map(item => (item.artistName || '未知歌手') + ' - ' + (item.trackName || '未知歌名') + (item.previewUrl ? '（有試聽）' : '（無試聽）'))
                .join('；');
              outcome = {
                level: 'error',
                message: '找不到符合歌手與歌名的歌曲',
                detail: label + '；搜尋候選：' + (candidatesText || '無可辨識候選')
              };
            } else {
              outcome = {
                level: 'error',
                message: 'Apple Music 沒有搜尋結果',
                detail: label
              };
            }
          }
        }
      } catch (error) {
        outcome = {
          level: 'warning',
          message: '查詢異常，可能是網路或 Apple Music 暫時無回應',
          detail: label + '；' + (error.message || error)
        };
      }

      if (outcome.level === 'info') {
        playable++;
      } else {
        results.push({
          group: outcome.message.includes('previewUrl') ? '找到歌曲但無試聽音檔' :
            outcome.message.includes('查詢異常') ? '查詢異常' : '無法找到符合歌曲',
          ...outcome
        });
      }

      checked++;
      devCheckStatus.textContent = '曲庫可播放性健檢中（' + checked + '／' + total + '）…';
      if (checked < total) await waitForAppleCheck(250);
    }

    const failed = results.length;
    results.unshift({
      group: '健檢摘要',
      level: failed ? 'warning' : 'info',
      message: '共檢查 ' + total + ' 首有效歌曲：' + playable + ' 首可播放、' + failed + ' 首需確認',
      detail: '本次只讀取 TRACKS／TEST 與 Apple Music 查詢結果，不會修改歌曲或歌單資料。'
    });

    renderDevCheckResults(results, '曲庫可播放性健檢');
  }
  $('dev-check-all').addEventListener('click', () => {
    renderDevCheckResults(runDevDataChecks('all'));
  });

  document.querySelectorAll('[data-check]').forEach(button => {
    button.addEventListener('click', () => {
      renderDevCheckResults(runDevDataChecks(button.dataset.check), devCheckNames[button.dataset.check]);
    });
  });

  $('dev-check-apple-live').addEventListener('click', runDevAppleLiveCheck);

}
