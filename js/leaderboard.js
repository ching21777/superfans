/* ========================================
   排行榜：各模式最佳紀錄、成就區、完整榜單
   載入順序：放在 game.js 之前（本檔只定義函式與常數，載入時不碰 DOM）
   依賴 game.js 的：grade, GRADES, score, maxCombo, totalAnswerTime, theme,
                    fmtTime, isLyricsMode, show, hide, HISTORY_KEY, names（playlists.js）
======================================== */

/* 模式設定：之後新增模式，只要在這裡加一筆（並在 saveHistory 決定 mode）*/
const LB_MODES = [
  {k: 'song',   name: '猜歌名',   desc: '比高分 · 分數越高越好'},
  {k: 'lyrics', name: '歌詞接唱', desc: '接唱歌詞 · 分數越高越好'}
];

const LB_KEY = 'song_king_board_v2';   // { rec:{song:[],lyrics:[]}, plays:{song:0,lyrics:0} }
const LB_KEEP = 3;                     // 每個模式保留幾筆

// 歌單簡稱
const LB_SHORT = {
  '經典偶像劇': '偶像劇金曲',
  'S.H.E 鐵粉爭霸戰': 'S.H.E 精選',
  '梁靜茹特輯': '梁靜茹精選',
  '2026 浪人祭': '浪人祭合輯'
};

const lbEl = id => document.getElementById(id);
const lbGradeCls = g => 'lb-g-' + String(g).replace('+', 'p').toLowerCase();


/* ---- 資料 ---- */

function readBoard() {
  try {
    const b = JSON.parse(localStorage.getItem(LB_KEY) || 'null');
    if (b && b.rec) return b;
  } catch (e) {}

  // 第一次：把舊版紀錄搬進來（舊資料不會被刪除，方便回復）
  let old = [];
  try { old = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch (e) {}

  const isLy = x => /歌詞接唱|Hello Nico/.test(x.playlist || '');
  const song = old.filter(x => !isLy(x)), lyrics = old.filter(isLy);
  return {
    rec:   {song, lyrics},
    plays: {song: song.length, lyrics: lyrics.length}
  };
}

function saveHistory() {
  const g = grade(score);
  const mode = isLyricsMode() ? 'lyrics' : 'song';

  try {
    const b = readBoard();
    const list = b.rec[mode] || (b.rec[mode] = []);

    list.push({
      grade: g.k,
      score,
      combo: maxCombo,
      time: fmtTime(Math.floor(totalAnswerTime)),
      playlist: (typeof names !== 'undefined' && names[theme]) || (mode === 'lyrics' ? '歌詞接唱' : theme)
    });
    list.sort((a, c) => c.score - a.score);
    b.rec[mode] = list.slice(0, LB_KEEP);
    b.plays[mode] = (b.plays[mode] || 0) + 1;

    localStorage.setItem(LB_KEY, JSON.stringify(b));
  } catch (e) {}

  loadHistory();
}


/* ---- 共用：榜單列 ---- */

function lbRow(r, {title, sub, best = false}) {
  return `
    <li class="lb-row${best ? ' is-best' : ''}">
      <span class="lb-grade ${lbGradeCls(r.grade)}">${r.grade}</span>
      <span class="lb-body">
        <span class="lb-title-line">${title}</span>
        <span class="lb-sub">${sub}</span>
      </span>
      <b class="lb-score">${Number(r.score).toLocaleString()}<small>分</small></b>
    </li>`;
}

function lbEmptyRow(label, sub, badge) {
  return `
    <li class="lb-row is-empty">
      <span class="lb-grade">${badge}</span>
      <span class="lb-body">
        <span class="lb-title-line">${label}</span>
        ${sub ? `<span class="lb-sub">${sub}</span>` : ''}
      </span>
    </li>`;
}

const lbShort = p => LB_SHORT[p] || p;


/* ---- 主選單：成就區 + 各模式最佳一筆（函式名稱沿用 loadHistory，原本的呼叫處都不用改）---- */


function loadHistory() {
  const b = readBoard();

  // 首頁顯示的四種遊戲模式
  const homeModes = [
    {k: 'song', name: '歌名快答'},
    {k: 'lyrics', name: '歌詞接力'},
    // {k: 'singer', name: '歌手辨識 Coming Soon'},
    // {k: 'composer', name: '»» 猜猜作曲家'}
  ];

  // 計算總遊玩次數
  const plays = homeModes.reduce(
    (n, m) => n + (b.plays[m.k] || 0), 0
  );

  // 顯示累積遊玩次數
  /*暫時隱藏累積遊玩區塊，保留相關資料
  lbEl('lb-hero').classList.remove('is-new');
  //lbEl('lb-hero').innerHTML = `
    <div class="lb-hero-text">
      <div class="lb-hero-cap">累積遊玩</div>
      <div class="lb-hero-title">${plays} <small>次</small></div>
    </div>`;
    */

        // 顯示各模式最佳紀錄
  const expanded = lbEl('hist').classList.contains('is-expanded');

  lbEl('hist').innerHTML = homeModes.map(m => {
    const list = (b.rec[m.k] || []).slice(0, 3);

    const rows = Array.from({length: 3}, (_, i) => {
      const r = list[i];

      return r
        ? lbRow(r, {
            title: r.playlist,
            sub: `<span>${r.time} ． Combo ${r.combo}</span>`,
            best: i === 0
          })
        : lbEmptyRow('尚無紀錄', '', `0${i + 1}`);
    }).join('');

    return `
      <li class="lb-home-mode">
        <div class="lb-heading">${m.name}</div>
        <ul class="lb-list">${rows}</ul>
      </li>`;
  }).join('');
}



/* ---- 完整榜單：每個模式一頁，可左右滑動 ---- */

let lbTab = 0;

function renderBoard() {
  const b = readBoard();
  const tabs = lbEl('lb-tabs');

  tabs.style.setProperty('--n', LB_MODES.length);
  tabs.innerHTML = LB_MODES.map((m, i) =>
    `<button class="lb-tab" role="tab" onclick="boardGo(${i})">${m.name}</button>`).join('')
    + '<div class="lb-ind" id="lb-ind"></div>';

  lbEl('lb-pages').innerHTML = LB_MODES.map(m => {
    const list = b.rec[m.k] || [];
    const rows = Array.from({length: LB_KEEP}, (_, i) => {
      const r = list[i];
      return r
        ? lbRow(r, {
            title: r.playlist,
            sub: `<span>⏱ ${r.time}</span><span>🔥 ${r.combo}</span>`,
            best: i === 0
          })
        : lbEmptyRow('尚無紀錄', '', `0${i + 1}`);
    }).join('');

    return `
      <section class="lb-page" aria-label="${m.name}">
        <div class="lb-mode-info">
          <span class="lb-mode-desc">${m.desc}</span>
          <span class="lb-mode-plays">玩了 ${b.plays[m.k] || 0} 次</span>
        </div>
        <ul class="lb-list">${rows}</ul>
      </section>`;
  }).join('');

  boardMark();
}

function boardMark() {
  document.querySelectorAll('.lb-tab').forEach((t, i) => t.setAttribute('aria-selected', i === lbTab));
}

function boardGo(i, smooth = true) {
  const pages = lbEl('lb-pages');
  lbTab = Math.max(0, Math.min(LB_MODES.length - 1, i));
  pages.scrollTo({left: lbTab * pages.clientWidth, behavior: smooth ? 'smooth' : 'auto'});
  boardMark();
}

function openBoard() {
  renderBoard();
  show('m-board');
  boardGo(lbTab, false);

  const pages = lbEl('lb-pages');
  if (pages.dataset.bound) return;
  pages.dataset.bound = '1';

  // 手指滑動時，底線跟著移動、分頁文字同步變色
  pages.addEventListener('scroll', () => {
    const p = pages.scrollLeft / (pages.clientWidth || 1);
    const ind = lbEl('lb-ind');
    if (ind) ind.style.transform = `translateX(${p * 100}%)`;
    const i = Math.round(p);
    if (i !== lbTab) { lbTab = i; boardMark(); }
  }, {passive: true});

  document.addEventListener('keydown', e => {
    if (lbEl('m-board').style.display !== 'flex') return;
    if (e.key === 'Escape') hide('m-board');
    if (e.key === 'ArrowLeft') boardGo(lbTab - 1);
    if (e.key === 'ArrowRight') boardGo(lbTab + 1);
  });
}