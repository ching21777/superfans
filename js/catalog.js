/* ========================================
   點歌目錄
   星數、分類、編號都在下面的 PAGES 設定。
   歌名預設讀 #m-theme 的 .theme-name（目前還要保留它）。
   整支包在 IIFE 裡，不會和其他檔案的全域變數撞名。
======================================== */
(function () {
  'use strict';

  // pages[0]＝左頁、pages[1]＝右頁
  //   k     ＝ pickTheme 用的歌單 key
  //   no    ＝ 目錄編號
  //   level ＝ 難度星數 1~3（直接在這裡設定，不再讀 HTML）
  //   name  ＝（選填）歌名。不填就讀 #m-theme 的 .theme-name，再找不到就顯示 k
  const PAGES = [
    [
      { title: '歌名快答', items: [
        { k: 'drama',    no: '00111', level: 1 },
        { k: 'she',      no: '00121', level: 2 },
        { k: 'fish',     no: '00122', level: 2 },
        { k: 'vagabond', no: '00211', level: 3 },
        { k: '伍佰演唱會', no: '00211', level: 3 },
      ]},
    ],
    [
      { title: '歌詞接力', items: [
        { k: 'lyrics',   no: '30111', level: 1 },
      ]},
    ],
  ];

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // 從原本的歌單按鈕讀出歌名（找不到回傳空字串）
  function readName(k) {
    const src = [...document.querySelectorAll('#m-theme .tb')]
      .find(b => b.dataset.k === k);
    return (src?.querySelector('.theme-name')?.textContent || '').trim();
  }

  function render() {
    PAGES.forEach((sections, pageIdx) => {
      const host = document.querySelector('[data-sb-page="' + pageIdx + '"]');
      if (!host) { console.warn('[catalog] 找不到 data-sb-page="' + pageIdx + '"'); return; }
      host.replaceChildren();

      sections.forEach(sec => {
        const wrap = el('section', 'sb-section');
        wrap.appendChild(el('h2', 'sb-section-title', sec.title));

        sec.items.forEach(it => {
          const name  = it.name || readName(it.k) || it.k;
          const level = Math.min(3, Math.max(1, it.level || 1));

          const btn = el('button', 'sb-song');
          btn.type = 'button';
          btn.dataset.k = it.k;
          btn.appendChild(el('span', 'sb-no', it.no));
          btn.appendChild(el('span', 'sb-name', name));
          btn.appendChild(el('span', 'sb-stars', '★'.repeat(level) + '☆'.repeat(3 - level)));
          wrap.appendChild(btn);
        });

        host.appendChild(wrap);
      });
    });
  }

  window.openCatalog = function () {
    try { render(); } catch (err) { console.error('[catalog] render 失敗：', err); }
    show('m-catalog');                 // 就算渲染出錯，也一定會打開
  };

  // 關閉＝回主選單（和原本 m-theme 的 ✖ 行為一樣）
  window.closeCatalog = function () {
    hide('m-catalog');
    show('m-start');
  };

  // 點歌曲 → 開始遊戲
  document.addEventListener('click', e => {
    const btn = e.target.closest('#m-catalog .sb-song');
    if (!btn) return;
    hide('m-catalog');
    hide('m-start');
    pickTheme(btn.dataset.k);
  });
})();