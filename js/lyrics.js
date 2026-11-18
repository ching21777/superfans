const SONG_DATABASE = [
  {
    id: 1,
    title: "晴天",
    artist: "周杰倫",
    genre: "亞洲創作天王",
    itunesQuery: "晴天 周杰倫",
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
    id: 2,
    title: "小幸運",
    artist: "田馥甄",
    genre: "YouTube 破億神曲",
    itunesQuery: "小幸運 田馥甄",
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
    id: 3,
    title: "心電心",
    artist: "王心凌",
    genre: "甜心舞曲",
    itunesQuery: "心電心 王心凌",
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
    id: 4,
    title: "稻香",
    artist: "周杰倫",
    genre: "亞洲創作天王",
    itunesQuery: "稻香 周杰倫",
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
    id: 5,
    title: "不是因為天氣晴朗才愛你",
    artist: "理想混蛋",
    genre: "民謠獨立樂團",
    itunesQuery: "不是因為天氣晴朗才愛你 理想混蛋",
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
    id: 6,
    title: "美麗新世界",
    artist: "S.H.E",
    genre: "亞洲女子天團",
    itunesQuery: "美麗新世界 S.H.E",
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
    id: 7,
    title: "修煉愛情",
    artist: "林俊傑",
    genre: "華語金曲歌王",
    itunesQuery: "修煉愛情 林俊傑",
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
    id: 9,
    title: "突然好想你",
    artist: "五月天",
    genre: "華語搖滾天團",
    itunesQuery: "突然好想你 五月天",
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
    id: 10,
    title: "我愛他",
    artist: "丁噹",
    genre: "影視主題曲",
    itunesQuery: "我愛他 丁噹",
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
    id: 11,
    title: "想見你想見你想見你",
    artist: "八三夭",
    genre: "影視主題曲",
    itunesQuery: "想見你想見你想見你 八三夭",
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
    id: 12,
    title: "勇氣",
    artist: "梁靜茹",
    genre: "療癒系天后",
    itunesQuery: "勇氣 梁靜茹",
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
    id: 13,
    title: "江南",
    artist: "林俊傑",
    genre: "華語金曲歌王",
    itunesQuery: "江南 林俊傑",
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
    id: 14,
    title: "頭號甜心",
    artist: "張韶涵",
    genre: "穿透力女聲",
    itunesQuery: "張韶涵 頭號甜心",
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
    id: 15,
    title: "千千萬萬",
    artist: "鄭宜農",
    genre: "難以捉摸的創作人",
    itunesQuery: "鄭宜農 千千萬萬",
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
    id: 16,
    title: "你到底在選擇什麼",
    artist: "公館青少年",
    genre: "新生代人氣樂團",
    itunesQuery: "公館青少年 你到底在選擇什麼",
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
    id: 17,
    title: "若無你我欲去佗位",
    artist: "黃奇斌",
    genre: "臺語創作歌手",
    itunesQuery: "黃奇斌 若無你我欲去佗位",
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
    id: 18,
    title: "Just the Way You Are",
    artist: "Bruno Mars",
    genre: "火星人布魯諾",
    itunesQuery: "Bruno Mars Just the Way You Are",
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
    id: 19,
    title: "おどるポンポコリン",
    artist: "B.B.QUEENS",
    genre: "櫻桃小丸子主題曲",
    itunesQuery: "B.B.QUEENS おどるポンポコリン",
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
    id: 20,
    title: "與浪之間",
    artist: "VH Vast & Hazy",
    genre: "出口系樂團",
    itunesQuery: "VH Vast & Hazy 與浪之間",
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

const TEST_DATABASE = [
  {
    id: 101,
    title: "示意歌曲 A",
    artist: "示意歌手",

    type: "previous",
    prompt: "我曾經走過那段熟悉的街道",
    answer: "想起我們一起看過的星星",

    distractors: [
      "那些日子早已經遠去",
      "我還在等待你的消息",
      "回憶停留在那個夏季"
    ]
  },
  {
    id: 102,
    title: "示意歌曲 B",
    artist: "示意歌手",

    type: "next",
    prompt: "風吹過耳邊 帶走昨天的悲傷",
    answer: "明天的陽光依然會到來",

    distractors: [
      "雨落在窗邊 想起你的模樣",
      "我們曾經一起追逐夢想",
      "時間慢慢帶走所有遺憾"
    ]
  },
  {
    id: 103,
    title: "示意歌曲 C",
    artist: "示意歌手",

    type: "fill",
    prompt: "也許有一天{{blank}} 我們還會再次相遇",
    answer: "花朵再次盛開",

    distractors: [
      "天空突然放晴",
      "回憶慢慢遠去",
      "世界不再轉動"
    ]
  },
  {
    id: 8,
    title: "後來",
    artist: "劉若英",
    genre: "療癒系天后",
    itunesQuery: "後來 劉若英",
    playUntil: 11,

    type: "fill",
    prompt: "梔子花 {{blank}}\n落在我藍色百褶裙上",
    answer: "白花瓣",

    distractors: [
      "紅花瓣",
      "黃花瓣",
      "橙花瓣"
    ]
  },
];

const HELLO_NICO_DATABASE = [
  {
    id: 1,
    title: "花",
    artist: "Hello Nico",
    genre: "大合唱經典",
    itunesQuery: "花 Hello Nico",
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
    id: 2,
    title: "哭泣的橄欖樹",
    artist: "Hello Nico",
    genre: "入坑必聽神曲",
    itunesQuery: "哭泣的橄欖樹 Hello Nico",
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
    id: 3,
    title: "接下來如何",
    artist: "Hello Nico",
    genre: "入坑必聽神曲",
    itunesQuery: "接下來如何 Hello Nico",
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
    id: 4,
    title: "面向自己",
    artist: "Hello Nico",
    genre: "樂迷私房愛歌",
    itunesQuery: "面向自己 Hello Nico",
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
    id: 5,
    title: "變成一隻魚",
    artist: "Hello Nico",
    genre: "沉靜抒情獨白",
    itunesQuery: "變成一隻魚 Hello Nico",
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
    id: 6,
    title: "看不見",
    artist: "Hello Nico",
    genre: "樂迷私房愛歌",
    itunesQuery: "看不見 Hello Nico",
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
    id: 7,
    title: "規格化的城市、商品、人",
    artist: "Hello Nico",
    genre: "暗黑電氣搖滾",
    itunesQuery: "規格化的城市 商品 人 Hello Nico",
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
    id: 8,
    title: "返程",
    artist: "Hello Nico",
    genre: "沉澱回歸新作",
    itunesQuery: "返程 Hello Nico",
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
    id: 9,
    title: "光",
    artist: "Hello Nico",
    genre: "沉澱回歸新作",
    itunesQuery: "光 Hello Nico",
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
    id: 10,
    title: "我會想你",
    artist: "Hello Nico",
    genre: "最新發行主打",
    itunesQuery: "我會想你 Hello Nico",
    playUntil: 16,

    type: "next",
    prompt: "會不會你也曾想念",
    answer: "若我不在這段時間",

    distractors: [
      "想回到相遇那一天",
      "又經過幾次的冬天",
      "想留我在你的身邊"
    ]
  },
];