
/* ========================================
   Super Fans｜開發測試工具
   只在網址帶有 ?dev 時啟用
======================================== */

if (new URLSearchParams(location.search).has('dev')) {

  // 開發測試面板
  const devPanel = document.createElement('section');

  devPanel.id = 'dev-panel';
  devPanel.innerHTML = `
    <div class="dev-heading">🛠 開發測試工具</div>

    <label for="dev-mode">模擬答題情境</label>
    <select id="dev-mode">
      <option value="correct">全部答對</option>
      <option value="mixed">答對與答錯混合</option>
      <option value="wrong">全部答錯</option>
    </select>

    <button class="bevel go" id="dev-auto-btn" disabled>
      自動模擬答題（準備中）
    </button>

    <button class="bevel btn-sm" id="dev-result-btn">
      直接預覽結算畫面
    </button>
  `;

  // 面板樣式
  const devStyle = document.createElement('style');

  devStyle.textContent = `
    #dev-panel {
      display: flex;
      flex-direction: column;
      gap: 9px;
      margin-top: 16px;
      padding: 12px;
      border: 1px dashed rgba(240,214,164,.5);
      border-radius: 10px;
      background: rgba(0,0,0,.2);
    }

    .dev-heading {
      color: #F0D6A4;
      font-size: 14px;
      font-weight: 900;
      text-align: left;
    }

    #dev-panel label {
      color: rgba(255,255,255,.7);
      font-size: 12px;
      text-align: left;
    }

    #dev-mode {
      width: 100%;
      padding: 9px;
      border: 0;
      border-radius: 6px;
      font-size: 14px;
    }

    #dev-panel button {
      width: 100%;
    }
  `;

  document.head.appendChild(devStyle);

  // 放在主選單版權文字下方
  const menu = document.querySelector('#m-start .mc');
  const copyright = menu.querySelector('.copyright-notice');

  copyright.after(devPanel);

  // 移除舊的測試按鈕
  document.getElementById('test-btn')?.remove();

  // 直接預覽結算畫面
  document.getElementById('dev-result-btn').addEventListener('click', () => {
    const backup = { score, maxCombo, startAt, cds, total, usedChoice };

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
    cds = conds.map((cond, i) => ({ art: cover(i * 36), cond }));

    stopAll();
    document.querySelectorAll('.ov').forEach(m => m.style.display = 'none');
    showResult();

    ({ score, maxCombo, startAt, cds, total, usedChoice } = backup);
  });

}
