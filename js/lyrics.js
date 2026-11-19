// 歌詞接唱題型：
// previous：接續前一句歌詞
// next：接續後一句歌詞
// fill：將歌詞填入 {{blank}} 標記
// 手動換行用\n取代空格


const SONG_DATABASE = [
  {
    no: '011',
    title: "晴天",
    genre: "亞洲創作天王",
    playUntil: 9,
    type: "fill",
    prompt: "吹著前奏望著天空\n我想起{{blank}}",
    answer: "花瓣試著掉落",
    distractors: [
      "風兒吹散的夢",
      "妳卻消失街角",
      "陽台衣服沒收"
    ]
  },
  {
    no: '012',
    title: "小幸運",
    genre: "YouTube 破億神曲",
    playUntil: 18.5,
    type: "fill",
    prompt: "也許當時{{blank}} 忙著追逐天空中的流星",
    answer: "忙著微笑和哭泣",
    distractors: [
      "忙著賞月和登頂",
      "忙著微醺和生氣",
      "忙著哭哭又啼啼"
    ]
  },
  {
    no: '013',
    title: "心電心",
    genre: "甜心舞曲",
    playUntil: 16,
    type: "next",
    prompt: "手心貼手心 一起心電心",
    answer: "高矮不在意 也不管你幾公斤",
    distractors: [
      "幸福在洋溢 全世界我最吸睛",
      "張開你的手 戀愛精彩又刺激",
      "現在聽口令 跟我大聲黏ＴＴ"
    ]
  },
  {
    no: '014',
    title: "稻香",
    genre: "亞洲創作天王",
    playUntil: 12.5,
    type: "next",
    prompt: "還記得你說家是唯一的城堡",
    answer: "隨著稻香河流繼續奔跑",
    distractors: [
      "微風吹過田野間的微笑",
      "帶著童年的紙飛機尋找",
      "回到最初最溫暖的懷抱"
    ]
  },
  {
    no: '015',
    title: "不是因為天氣晴朗才愛你",
    genre: "民謠獨立樂團",
    playUntil: 22,
    type: "fill",
    prompt: "才一直 一直 {{blank}} 擁抱你 什麼角度最合適",
    answer: "一直在腦海裡複習",
    distractors: [
      "一直在人海裡嘆息",
      "一直在睡夢中清醒",
      "一直在幻想裡預習"
    ]
  },
  {
    no: '016',
    title: "美麗新世界",
    genre: "亞洲女子天團",
    playUntil: 19,
    type: "next",
    prompt: "別再記著昨天 還有什麼悲傷",
    answer: "Baby don't cry",
    distractors: [
      "Honey don't lie",
      "Don't jump so high",
      "Singing in the rain"
    ]
  },
  {
    no: '017',
    title: "修煉愛情",
    genre: "華語金曲歌王",
    playUntil: 11,
    type: "next",
    prompt: "我們那些信仰",
    answer: "要忘記多難",
    distractors: [
      "該怎麼原諒",
      "還依然滾燙",
      "要如何前往"
    ]
  },
  {
    no: '018',
    title: "突然好想你",
    genre: "華語搖滾天團",
    playUntil: 19,
    type: "fill",
    prompt: "突然好想你\n突然{{blank}}",
    answer: "鋒利的回憶",
    distractors: [
      "諷刺的情書",
      "瘋掉的回應",
      "風鈴的回音"
    ]
  },
  {
    no: '019',
    title: "我愛他",
    genre: "影視主題曲",
    playUntil: 17,
    type: "fill",
    prompt: "曾為他相信明天就是未來 {{blank}}有多壞都不肯醒來",
    answer: "情節",
    distractors: [
      "劇情",
      "奇蹟",
      "夢境"
    ]
  },
  {
    no: '020',
    title: "想見你想見你想見你",
    genre: "影視主題曲",
    playUntil: 22.5,
    type: "fill",
    prompt: "想見你只想見你\n未來過去{{blank}}",
    answer: "我只想見你",
    distractors: [
      "全都是為你",
      "穿越了世紀",
      "不能沒有你"
    ]
  },
  {
    no: '021',
    title: "勇氣",
    genre: "療癒系天后",
    playUntil: 19,
    type: "next",
    prompt: "只要你一個眼神肯定",
    answer: "我的愛就有意義",
    distractors: [
      "就跨越所有距離",
      "就把真心交給你",
      "我們都需要勇氣"
    ]
  },
  {
    no: '022',
    title: "江南",
    genre: "華語金曲歌王",
    playUntil: 19,
    type: "next",
    prompt: "愛有萬分之一甜",
    answer: "寧願我就葬在這一點",
    distractors: [
      "寧願我就葬在這一天",
      "這一剎那凍結了時間",
      "相愛就像風雲的善變"
    ]
  },
  {
    no: '023',
    title: "頭號甜心",
    genre: "穿透力女聲",
    playUntil: 14,
    type: "previous",
    prompt: "每一口 代表一個步驟",
    answer: "像巧克力的誘惑",
    distractors: [
      "默契好的沒話說",
      "最喜歡牽我的手",
      "像棉花糖的誘惑"
    ]
  },
  {
    no: '024',
    title: "千千萬萬",
    genre: "難以捉摸的創作人",
    playUntil: 21,
    type: "next",
    prompt: "誰聽見了嗎",
    answer: "在億萬光年之外",
    distractors: [
      "在三十公里之外",
      "在一萬光年之外",
      "在一片銀河之外"
    ]
  },
  {
    no: '025',
    title: "你到底在選擇什麼",
    genre: "新生代人氣樂團",
    playUntil: 19.5,
    type: "previous",
    prompt: "難道是早已經被誰偷走",
    answer: "你怎麼還沒把心交給我",
    distractors: [
      "你到底到底在選擇什麼",
      "要怎麼做你才能看向我",
      "你怎麼沒說命中缺個我"
    ]
  },
  {
    no: '026',
    title: "若無你我欲去佗位",
    genre: "臺語創作歌手",
    playUntil: 21,
    type: "next",
    prompt: "咱談情說愛的彼張相片 閣囥佇我的身邊",
    answer: "親像咱猶原鬥陣",
    distractors: [
      "你講過咱攏袂改變",
      "哪知你無欲閣轉來",
      "我毋情願你離開"
    ]
  },
  {
    no: '027',
    title: "Just the Way You Are",
    genre: "火星人布魯諾",
    playUntil: 19,
    type: "next",
    prompt: "'Cause you're amazing",
    answer: "Just the way you are",
    distractors: [
      "When I see your face",
      "Nothing I would change",
      "I tell you everyday"
    ]
  },
  {
    no: '028',
    title: "おどるポンポコリン",
    genre: "櫻桃小丸子主題曲",
    playUntil: 10,
    type: "next",
    prompt: "ピーヒャラ　ピーヒャラ　おへそがちらり",
    answer: "タッタタラリラ",
    distractors: [
      "パッパパラパ",
      "ピーヒャラ",
      "お腹がへったよ"
    ]
  },
  {
    no: '029',
    title: "與浪之間",
    genre: "出口系樂團",
    playUntil: 15,
    type: "fill",
    prompt: "看不見你 也看不見自己\n看不見你 {{blank}}",
    answer: "就看不見自己",
    distractors: [
      "就只想擁抱你",
      "就尋一個出口",
      "就只想抓住你"
    ]
  }
];

const HELLO_NICO_DATABASE = [
  {
    no: '001',
    title: "花",
    genre: "大合唱經典",
    playUntil: 20,
    type: "fill",
    prompt: "我只是想{{blank}} ",
    answer: "和你玩耍",
    distractors: [
      "在你身旁",
      "聽你說話",
      "讓你受傷"
    ]
  },
  {
    no: '002',
    title: "哭泣的橄欖樹",
    genre: "入坑必聽神曲",
    playUntil: 18,
    type: "next",
    prompt: "一個還一個",
    answer: "永無平息的上演著",
    distractors: [
      "等待某天化作花香",
      "他們不再恐懼失慌",
      "贈還予你熟悉荒涼"
    ]
  },
  {
    no: '003',
    title: "接下來如何",
    genre: "入坑必聽神曲",
    playUntil: 21,
    type: "next",
    prompt: "以為從此就不會愛了",
    answer: "黑色我關上了燈",
    distractors: [
      "白色是自己弄髒",
      "未來沒人能預測",
      "卻成弄壞的雕刻"
    ]
  },
  {
    no: '004',
    title: "面向自己",
    genre: "樂迷私房愛歌",
    playUntil: 18,
    type: "next",
    prompt: "悲傷的 喜悅的",
    answer: "不算是全部吧",
    distractors: [
      "是該順從了嗎",
      "是太擁擠了嗎",
      "隱藏哪個部分"
    ]
  },
  {
    no: '005',
    title: "變成一隻魚",
    genre: "沉靜抒情獨白",
    playUntil: 11,
    type: "next",
    prompt: "我變成一隻魚",
    answer: "靜靜徘徊水裡",
    distractors: [
      "緩緩游向天際",
      "悄悄躲進雨裡",
      "慢慢忘記呼吸"
    ]
  },
  {
    no: '006',
    title: "看不見",
    genre: "樂迷私房愛歌",
    playUntil: 15,
    type: "next",
    prompt: "這裡破了一個無底的洞",
    answer: "就著你身邊依然陷落",
    distractors: [
      "每個都守住自己的窩",
      "我寧願什麼都看不懂",
      "太遙遠太不切實際了"
    ]
  },
  {
    no: '007',
    title: "規格化的城市、商品、人",
    genre: "暗黑電氣搖滾",
    playUntil: 19,
    type: "fill",
    prompt: "{{blank}}就給你最好的\n代價是忘了你自己",
    answer: "乖乖的",
    distractors: [
      "空空的",
      "靜靜的",
      "壞壞的"
    ]
  },
  {
    no: '008',
    title: "返程",
    genre: "沉澱回歸新作",
    playUntil: 15,
    type: "next",
    prompt: "眼淚才沒有氾濫",
    answer: "等會兒要吃早餐",
    distractors: [
      "等會兒要吃午餐",
      "等會兒要吃晚餐",
      "等會兒要去看海"
    ]
  },
  {
    no: '009',
    title: "光",
    genre: "沉澱回歸新作",
    playUntil: 16,
    type: "fill",
    prompt: "離別之前{{blank}}",
    answer: "我擁抱你",
    distractors: [
      "我已老去",
      "我會老去",
      "我在老去"
    ]
  },
  {
    no: '010',
    title: "我會想你",
    genre: "最新發行主打",
    playUntil: 16,
    type: "next",
    prompt: "會不會你也曾想念",
    answer: "若我不在這段時間",
    distractors: [
      "想回到相遇那一天",
      "又經過幾次的冬天",
      "想留我在你的身邊"
    ]
  }
];