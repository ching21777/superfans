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
  },
  {
    no: '030',
    title: "後來",
    genre: "療癒系天后",
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
  {
    no: '031',
    title: "Last Dance",
    genre: "跨世代神曲",
    playUntil: 19,
    type: "fill",
    prompt: "你給的{{blank}}",
    answer: "愛ㄞ～～～",
    distractors: [
      "愛ㄞ～～",
      "愛ㄞ～",
      "愛ㄞ～～～～"
    ]
  },
  {
    no: '032',
    title: "挪威的森林",
    genre: "搖滾不敗經典",
    playUntil: 14,
    type: "previous",
    prompt: "依然愛我無法自拔",
    answer: "是否依然為我絲絲牽掛",
    distractors: [
      "是否依然為你絲絲牽掛",
      "是否依然為妳絲絲牽掛",
      "是否依然為他絲絲牽掛"
    ]
  },
  {
    no: '033',
    title: "妳是我的花朵",
    genre: "國民舞曲嗨歌",
    playUntil: 19,
    type: "next",
    prompt: "拉著我 不要飄走",
    answer: "我在妳背後擋風",
    distractors: [
      "我保妳一路暢通",
      "考驗我愛的程度",
      "我愛妳不眠不休"
    ]
  },
  {
    no: '034',
    title: "浪人情歌",
    genre: "KTV必點經典",
    playUntil: 20,
    type: "next",
    prompt: "不要再想妳 不要再愛妳",
    answer: "讓時間悄悄的飛逝",
    distractors: [
      "讓往事隨風而飄散",
      "抹去我倆的過去",
      "就當作是一場夢境"
    ]
  },
  {
    no: '035',
    title: "突然的自我",
    genre: "全場大合唱",
    playUntil: 19,
    type: "fill",
    prompt: "聽見妳說 朝陽起又落\n晴雨難測 {{blank}}",
    answer: "道路是腳步多",
    distractors: [
      "往事已隨風過",
      "人生路不好走",
      "心事誰人知曉"
    ]
  },
  {
    no: '036',
    title: "愛情限時批",
    genre: "台語對唱神曲",
    playUntil: 18,
    type: "next",
    prompt: "要安怎對你說出心內話",
    answer: "想了歸暝 恰想嘛歹勢",
    distractors: [
      "寫一張批 寄去給你知道",
      "看到你的時陣 我就頭犁犁",
      "不知影你甘有 相同的心意"
    ]
  },
  {
    no: '037',
    title: "淚橋",
    genre: "鐵漢柔情代表",
    playUntil: 20,
    type: "next",
    prompt: "無心過問妳的心裡",
    answer: "我的吻註定要留在",
    distractors: [
      "妳的愛已經不在這",
      "我只能默默地離開",
      "這段情早已經結束"
    ]
  },
  {
    no: '038',
    title: "世界第一等",
    genre: "江湖豪邁台語",
    playUntil: 19,
    type: "fill",
    prompt: "人生的風景\n親像大海的{{blank}}",
    answer: "風湧",
    distractors: [
      "波浪",
      "雲煙",
      "浮沉"
    ]
  },
  {
    no: '039',
    title: "樹枝孤鳥",
    genre: "金曲獎台語經典",
    playUntil: 20,
    type: "next",
    prompt: "飛去叨位 飛去叨位",
    answer: "阮不知影 阮不知影",
    distractors: [
      "找無巢穴 找無巢穴",
      "天頂星光 閃閃爍爍",
      "風吹微微 孤單一個"
    ]
  },
  {
    no: '040',
    title: "痛哭的人",
    genre: "硬派深情搖滾",
    playUntil: 18,
    type: "next",
    prompt: "今夜的寒風將我心撕碎",
    answer: "倉皇的腳步我不醉不歸",
    distractors: [
      "孤單的身影在街頭徘徊",
      "無情的雨點打在我臉上",
      "所有的回憶都化作眼淚"
    ]
  },
  {
    no: '041',
    title: "衝衝衝",
    genre: "熱血台語嗨歌",
    playUntil: 17,
    type: "fill",
    prompt: "提出信心{{blank}}\n向前衝 衝 衝 衝",
    answer: "頭前看",
    distractors: [
      "免驚惶",
      "拚落去",
      "大聲喝"
    ]
  },
  {
    no: '042',
    title: "再度重相逢",
    genre: "溫暖豁達金曲",
    playUntil: 19,
    type: "next",
    prompt: "妳說人生如夢",
    answer: "我說人生如秀",
    distractors: [
      "我說人生如酒",
      "我說隨風而走",
      "我說何必強求"
    ]
  },
  {
    no: '043',
    title: "白鴿",
    genre: "史詩級代表作",
    playUntil: 21,
    type: "next",
    prompt: "縱然帶著永遠的傷口",
    answer: "至少我還擁有自由",
    distractors: [
      "我也不會低頭認輸",
      "也要飛向遙遠天空",
      "依然相信明天會好"
    ]
  },
  {
    no: '044',
    title: "牽掛",
    genre: "早年溫柔抒情",
    playUntil: 20,
    type: "fill",
    prompt: "牽掛著妳是那顆我的心\n飄呀飄地{{blank}}",
    answer: "在妳面前捉摸不定",
    distractors: [
      "在風中靜靜等著妳",
      "落在了妳的掌心裡",
      "永遠都無法再平靜"
    ]
  },
  {
    no: '045',
    title: "與妳到永久",
    genre: "深情告白經典",
    playUntil: 19,
    type: "next",
    prompt: "風兒輕輕的吹",
    answer: "雨兒滴滴的下",
    distractors: [
      "雲兒慢慢的飄",
      "花兒靜靜的開",
      "鳥兒自由的飛"
    ]
  },
  {
    no: '046',
    title: "心愛的再會啦",
    genre: "藍調台語情歌",
    playUntil: 20,
    type: "next",
    prompt: "海上的船螺聲已經響起",
    answer: "對你猶原情綿綿",
    distractors: [
      "送你離開千里遠",
      "目屎已經流袂離",
      "心內只有你一人"
    ]
  },
  {
    no: '047',
    title: "晚風",
    genre: "KTV抒情搖滾",
    playUntil: 20,
    type: "fill",
    prompt: "慢慢吹 輕輕送\n人生路 {{blank}}",
    answer: "妳就走",
    distractors: [
      "莫回頭",
      "慢慢走",
      "一起走"
    ]
  },
  {
    no: '048',
    title: "夏夜晚風",
    genre: "經典抒情名曲",
    playUntil: 21,
    type: "next",
    prompt: "夏夜裡的晚風",
    answer: "吹拂著妳在我懷中",
    distractors: [
      "輕輕吹過妳的臉龐",
      "帶來一陣溫柔的夢",
      "陪著我們一起度過"
    ]
  },
  {
    no: '049',
    title: "被動",
    genre: "虐心搖滾神曲",
    playUntil: 19,
    type: "next",
    prompt: "我可以很久不和你聯絡",
    answer: "任憑日子一天天這麼過",
    distractors: [
      "假裝自己從來沒有愛過",
      "把所有的思念都藏心頭",
      "直到妳完全忘記了有我"
    ]
  },
  {
    no: '050',
    title: "一生最愛的人",
    genre: "深情痛徹代表",
    playUntil: 21,
    type: "fill",
    prompt: "妳是我一生{{blank}}\n為妳我願放棄一切",
    answer: "最愛的人",
    distractors: [
      "最深的痛",
      "唯一的夢",
      "難忘的人"
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