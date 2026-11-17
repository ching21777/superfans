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