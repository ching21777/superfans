const SONG_DATABASE = [
  {
    id: 1,
    title: "晴天",
    artist: "周杰倫",
    genre: "亞洲創作天王",
    itunesQuery: "晴天 周杰倫",
    playUntil: 9,
    prevLyric: "吹著前奏望著天空　我想起＿＿＿＿＿",
    correctNext: "花瓣試著掉落",
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
    prevLyric: "也許當時＿＿＿＿＿　忙著追逐天空中的流星",
    correctNext: "忙著微笑和哭泣",
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
    prevLyric: "手心貼手心　一起心電心　＿＿＿＿＿",
    correctNext: "高矮不在意　也不管你幾公斤",
    distractors: [
      "幸福在洋溢　全世界我最吸睛",
      "張開你的手　戀愛精彩又刺激",
      "現在聽口令　跟我大聲黏ＴＴ"
    ]
  },
  {
    id: 4,
    title: "稻香",
    artist: "周杰倫",
    genre: "亞洲創作天王",
    itunesQuery: "稻香 周杰倫",
    playUntil: 12.5,
    prevLyric: "還記得你說家是唯一的城堡　＿＿＿＿＿",
    correctNext: "隨著稻香河流繼續奔跑",
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
    genre: "人氣樂團",
    itunesQuery: "不是因為天氣晴朗才愛你 理想混蛋",
    playUntil: 22,
    prevLyric: "才一直　一直　＿＿＿＿＿　擁抱你　什麼角度最合適",
    correctNext: "一直在腦海裡複習",
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
    prevLyric: "別再記著昨天　還有什麼悲傷　＿＿＿＿＿",
    correctNext: "Baby don't cry",
    distractors: [
      "Honey don't lie",
      "Jump into sky",
      "Trust we can fly"
    ]
  },
  {
    id: 7,
    title: "修煉愛情",
    artist: "林俊傑",
    genre: "華語金曲歌王",
    itunesQuery: "修煉愛情 林俊傑",
    playUntil: 11,
    prevLyric: "我們那些信仰　＿＿＿＿＿",
    correctNext: "要忘記多難",
    distractors: [
      "該怎麼原諒",
      "還依然滾燙",
      "要如何前往"
    ]
  },
  {
    id: 8,
    title: "後來",
    artist: "劉若英",
    genre: "療癒系天后",
    itunesQuery: "後來 劉若英",
    playUntil: 11.5,
    prevLyric: "梔子花　＿＿＿＿＿　落在我藍色百褶裙上",
    correctNext: "白花瓣",
    distractors: [
      "紅花瓣",
      "黃花瓣",
      "橙花瓣"
    ]
  },
  {
    id: 9,
    title: "突然好想你",
    artist: "五月天",
    genre: "人氣樂團",
    itunesQuery: "突然好想你 五月天",
    playUntil: 19,
    prevLyric: "突然好想你　突然＿＿＿＿＿",
    correctNext: "鋒利的回憶",
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
    prevLyric: "曾為他相信明天就是未來　＿＿＿＿＿都不肯醒來",
    correctNext: "情節有多壞",
    distractors: [
      "劇情有多壞",
      "奇蹟有多壞",
      "夢境有多壞"
    ]
  },
  {
    id: 11,
    title: "想見你想見你想見你",
    artist: "八三夭",
    genre: "影視主題曲",
    itunesQuery: "想見你想見你想見你 八三夭",
    playUntil: 22.5,
    prevLyric: "想見你只想見你　未來過去＿＿＿＿＿",
    correctNext: "我只想見你",
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
    prevLyric: "只要你一個眼神肯定　＿＿＿＿＿",
    correctNext: "我的愛就有意義",
    distractors: [
      "就跨越所有距離",
      "就把真心交給你",
      "我們到下個世紀"
    ]
  }
];

const HELLO_NICO_DATABASE = [
  {
    id: 101,
    type: "previous",
    title: "示意歌曲 A",
    artist: "示意歌手",
    promptLyric: "我曾經走過那段熟悉的街道",
    answerLyric: "想起我們一起看過的星星",
    correctNext: "想起我們一起看過的星星",
    distractors: [
      "那些日子早已經遠去",
      "我還在等待你的消息",
      "回憶停留在那個夏季"
    ]
  },
  {
    id: 102,
    type: "next",
    title: "示意歌曲 B",
    artist: "示意歌手",
    promptLyric: "風吹過耳邊　帶走昨天的悲傷",
    answerLyric: "明天的陽光依然會到來",
    correctNext: "明天的陽光依然會到來",
    distractors: [
      "雨落在窗邊　想起你的模樣",
      "我們曾經一起追逐夢想",
      "時間慢慢帶走所有遺憾"
    ]
  },
  {
    id: 103,
    type: "fill",
    title: "示意歌曲 C",
    artist: "示意歌手",
    lyricText: "也許有一天{{blank}}　我們還會再次相遇",
    blankAnswer: "花朵再次盛開",
    correctNext: "我們還會再次相遇",
    distractors: [
      "天空突然放晴",
      "回憶慢慢遠去",
      "世界不再轉動"
    ]
  },

  {
    id: 1,
    type: "next",
    title: "花",
    artist: "Hello Nico",
    genre: "大合唱經典",
    itunesQuery: "花 Hello Nico",
    playUntil: 20,
    promptLyric: "我只是想",
    answerLyric: "和你玩耍",
    correctNext: "和你玩耍",
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
    prevLyric: "一個還一個　＿＿＿＿＿",
    correctNext: "永無平息的上演著",
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
    prevLyric: "以為從此就不會愛了　＿＿＿＿＿",
    correctNext: "黑色我關上了燈",
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
    prevLyric: "悲傷的　喜悅的　＿＿＿＿＿",
    correctNext: "不算是全部吧",
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
    prevLyric: "我變成一隻魚　＿＿＿＿＿",
    correctNext: "靜靜徘徊水裡",
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
    prevLyric: "這裡破了一個無底的洞 ＿＿＿＿＿",
    correctNext: "就著你身邊依然陷落",
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
    prevLyric: "＿＿＿＿＿就給你最好的",
    correctNext: "乖乖的",
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
    prevLyric: "眼淚才沒有氾濫　＿＿＿＿＿",
    correctNext: "等會兒要吃早餐",
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
    prevLyric: "離別之前＿＿＿＿＿",
    correctNext: "我擁抱你",
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
    prevLyric: "會不會你也曾想念　＿＿＿＿＿",
    correctNext: "若我不在這段時間",
    distractors: [
      "想回到相遇那一天",
      "又經過幾次的冬天",
      "想留我在你的身邊"
    ]
  }
];