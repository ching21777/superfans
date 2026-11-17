
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

    <button class="bevel go" id="dev-auto-btn">
      開始自動模擬答題
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



  // ========================================
  // 自動模擬答題
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
    if (!devRunning) return oldPlayClip(my, done, leaveEarly);

    clip.url = '';
    setLyricStage(true);

    clipTimer = setTimeout(() => {
      if (my !== reqId) return;

      setLyricStage(false);
      done();
    }, 700);
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
