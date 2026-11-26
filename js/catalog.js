/* ========================================
   點歌目錄 v3
   編號規則（5 碼）：
     第 1~3 碼：歌單編號
     第 4 碼  ：遊戲模式（對應下面 MODES 的 id）
     第 5 碼  ：難度 1~3（星數）
   資料只寫 k 和 no，模式與星數都由編號推出來。

   版面會隨內容自動切換：
   - 有歌的模式只有 1~2 個：不出現標籤，左頁一個模式、右頁一個模式
   - 有歌的模式達 3 個以上：出現索引標籤，標籤內的歌單從左頁流到右頁
   - 某個模式的歌單超過 10 份：才依難度分區（★ / ★★ / ★★★）
   - 沒有歌的模式不顯示；「即將上架」排在最後，點了會顯示提示
   整支包在 IIFE 裡，不會和其他檔案的全域變數撞名。
======================================== */
(function () {
  'use strict';

  // ---- 模式（第 4 碼）。新模式在這裡加一行 ----
  const MODES = [
    { id: 1, title: '歌名快答' },
    { id: 2, title: '歌詞接唱' },
    { id: 3, title: '歌手辨識' },
    // { id: 4, title: '待定' },
  ];

  // ---- 難度（第 5 碼）的區名（只在出現標籤時使用）----
  const LEVEL_NAMES = { 1: '入門', 2: '進階', 3: '挑戰' };

  // ---- 版面門檻 ----
  const TAB_THRESHOLD     = 3;   // 有歌的模式 ≥ 這個數字，才出現標籤
  const SECTION_THRESHOLD = 10;  // 一個模式的歌單 > 這個數字，才依難度分區
  const SPLIT_MIN         = 8;   // 內容（含標題）不到這個列數，就不分到右頁

  // ---- 歌單 ----
  //   k      ＝ pickTheme 用的歌單 key
  //   no     ＝ 5 碼編號：前三碼歌單、第四碼玩法、第五碼難度
  //   name   ＝（選填）歌名。不填就讀 names[k]，再找不到就顯示 k
  //   status ＝（選填）'soon' 表示即將上架
  //   mode / level ＝（選填）覆寫由編號推出的值，給還沒編號的項目用
  // 下面的編號是依規則排的「範例」，請換成你的真實編號。
  const SONGS = [
    { k: 'drama',    no: '20112' },
    { k: 'she',      no: '30113' },
    { k: 'fish',     no: '30213' },
    { k: 'vagabond', no: '＊＊＊', mode: 1, level: 3, status: 'soon' },
    { k: '你一定聽過的西洋歌曲', no: '＊＊＊', mode: 1, level: 2, status: 'soon' },
    { k: 'lyrics',   no: '00321' },
    { k: 'male',   no: '00111' },
    { k: 'female', no: '00211' },
    { k: 'jay',          no: '＊＊＊', mode: 2, level: 3, status: 'soon' },
    { k: 'LIVE 演唱會預習歌單', no: '＊＊＊', mode: 2, level: 3, status: 'soon' },
  ];

  // ---- 以下是程式 ----
  let current = MODES[0].id;       // 目前的標籤（關掉再開會停在上次的）
  let toastTimer = 0;

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function readName(k) {
    return (typeof names !== 'undefined' && names && names[k]) || '';
  }

  // 由編號推出模式與難度；不合規則的項目會被略過並在 console 警告
  function parse(s) {
    const coded = /^\d{5}$/.test(s.no || '');
    const mode  = s.mode  != null ? s.mode  : (coded ? +s.no[3] : null);
    const level = s.level != null ? s.level : (coded ? +s.no[4] : null);
    if (!MODES.some(m => m.id === mode) || ![1, 2, 3].includes(level)) {
      console.warn('[catalog] 略過（編號或模式/難度不正確）：', s.k, s.no);
      return null;
    }
    return { k: s.k, no: s.no, name: s.name, status: s.status, mode, level };
  }

  function byOrder(a, b) {
    return (a.status === 'soon') - (b.status === 'soon') ||
           String(a.no).localeCompare(String(b.no));
  }

  function stars(level) {
    return '★'.repeat(level) + '☆'.repeat(3 - level);
  }

  // 把一個模式的歌單整理成「分區」陣列：[{ title, items }]
  //   歌少：一個分區，標題是模式名稱
  //   歌多：依難度分區；沒有標籤時，標題要帶模式名稱才知道是誰的
  function buildSections(mode, parsed, withTabs) {
    const songs = parsed.filter(s => s.mode === mode.id).sort(byOrder);
    if (songs.length <= SECTION_THRESHOLD) return [{ title: mode.title, items: songs }];

    return [1, 2, 3]
      .map(level => ({
        title: withTabs ? stars(level) + '　' + LEVEL_NAMES[level]
                        : mode.title + '　' + stars(level),
        items: songs.filter(s => s.level === level),
      }))
      .filter(sec => sec.items.length);
  }

  function songRow(it) {
    const soon = it.status === 'soon';
    const btn = el('button', 'sb-song' + (soon ? ' soon' : ''));
    btn.type = 'button';
    btn.dataset.k = it.k;
    // 不用 disabled：disabled 的按鈕收不到 click，就無法顯示提示
    if (soon) btn.setAttribute('aria-disabled', 'true');
    btn.appendChild(el('span', 'sb-no', it.no));
    btn.appendChild(el('span', 'sb-name', it.name || readName(it.k) || it.k));
    btn.appendChild(el('span', 'sb-stars', soon ? '即將上架' : stars(it.level)));
    return btn;
  }

  // 把分區放進一個或兩個頁面。兩頁時，內容夠多就從左頁流到右頁（太長的分區會接續）
  function place(sections, hosts) {
    const total = sections.reduce((n, s) => n + s.items.length + 1, 0);   // 每個標題算 1 列
    const canSplit = hosts.length === 2 && total > SPLIT_MIN;
    const half = Math.ceil(total / 2);
    let side = 0, placed = 0, count = 0, wrap = null;

    function open(sec, cont) {
      wrap = el('section', 'sb-section' + (cont ? ' cont' : ''));
      wrap.appendChild(el('h2', 'sb-section-title', sec.title + (cont ? '（續）' : '')));
      hosts[side].appendChild(wrap);
      if (cont) hosts[side].classList.add('cont');
      placed++; count = 0;
    }

    sections.forEach(sec => {
      if (canSplit && side === 0 && placed >= half) side = 1;   // 新分區改從右頁開始
      open(sec, false);
      sec.items.forEach(it => {
        if (canSplit && side === 0 && placed >= half && count > 0) { side = 1; open(sec, true); }
        wrap.appendChild(songRow(it));
        placed++; count++;
      });
    });
  }

  // 標籤列：list 為空就移除
  function renderTabs(list) {
    let bar = document.querySelector('#m-catalog .sb-tabs');
    if (!list.length) { if (bar) bar.remove(); return; }
    if (!bar) {
      const pages = document.querySelector('#m-catalog .sb-pages');
      if (!pages) { console.warn('[catalog] 找不到 .sb-pages'); return; }
      bar = el('div', 'sb-tabs');
      bar.setAttribute('role', 'tablist');
      pages.parentNode.insertBefore(bar, pages);
    }
    bar.replaceChildren();
    list.forEach(m => {
      const on = m.id === current;
      const t = el('button', 'sb-tab' + (on ? ' on' : ''), m.title);
      t.type = 'button';
      t.dataset.mode = m.id;
      t.setAttribute('role', 'tab');
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      bar.appendChild(t);
    });
  }

  function render() {
    const hosts = [0, 1].map(i => document.querySelector('[data-sb-page="' + i + '"]'));
    if (hosts.some(h => !h)) { console.warn('[catalog] 找不到 data-sb-page'); return; }
    hosts.forEach(h => { h.replaceChildren(); h.classList.remove('cont'); });

    const parsed  = SONGS.map(parse).filter(Boolean);
    const visible = MODES.filter(m => parsed.some(s => s.mode === m.id));
    const useTabs = visible.length >= TAB_THRESHOLD;

    const book = document.querySelector('#m-catalog .songbook');
    if (book) book.classList.toggle('has-tabs', useTabs);
    if (useTabs && !visible.some(m => m.id === current)) current = visible[0].id;
    renderTabs(useTabs ? visible : []);

    if (!visible.length) {
      hosts[0].appendChild(el('p', 'sb-empty', '歌單陸續推出中'));
    } else if (useTabs) {
      const mode = visible.find(m => m.id === current);
      place(buildSections(mode, parsed, true), hosts);
    } else {
      // 1~2 個模式：各佔一頁
      visible.forEach((mode, i) => place(buildSections(mode, parsed, false), [hosts[i]]));
    }
  }

  function showToast(msg) {
    const host = document.getElementById('m-catalog');
    if (!host) return;
    let t = host.querySelector('.sb-toast');
    if (!t) { t = el('div', 'sb-toast'); host.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 1600);
  }

  window.openCatalog = function () {
    try { render(); } catch (err) { console.error('[catalog] render 失敗：', err); }
    if (window.preloadPlaylistIntroArtworks) {
      const keys = [...document.querySelectorAll('#m-catalog .sb-song:not(.soon)')]
        .map(btn => btn.dataset.k);
      window.preloadPlaylistIntroArtworks(keys);
    }
    show('m-catalog');                 // 就算渲染出錯，也一定會打開
  };

  // 關閉＝回主選單
  window.closeCatalog = function () {
    hide('m-catalog');
    show('m-start');
  };

  document.addEventListener('click', e => {
    // 切換標籤
    const tab = e.target.closest('#m-catalog .sb-tab');
    if (tab) {
      current = +tab.dataset.mode;
      render();
      const pages = document.querySelector('#m-catalog .sb-pages');
      if (pages) pages.scrollTop = 0;
      return;
    }

    // 點歌
    const btn = e.target.closest('#m-catalog .sb-song');
    if (!btn) return;
    if (btn.getAttribute('aria-disabled') === 'true') {
      showToast('敬請期待 (*´▽｀*)');
      return;
    }
    hide('m-catalog');
    hide('m-start');
    pickTheme(btn.dataset.k);
  });
})();
