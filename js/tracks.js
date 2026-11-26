/* ========================================
   Super Fans｜歌曲基本資料
   no：Super Fans 內部歌曲編號
   appleMusicId：Apple Music Track ID
======================================== */

const TRACKS = [
  // Hello Nico
  { no: '001', title: '花', artist: 'Hello Nico', appleMusicId: null },
  { no: '002', title: '哭泣的橄欖樹', artist: 'Hello Nico', appleMusicId: null },
  { no: '003', title: '接下來如何', artist: 'Hello Nico', appleMusicId: null },
  { no: '004', title: '面向自己', artist: 'Hello Nico', appleMusicId: null },
  { no: '005', title: '變成一隻魚', artist: 'Hello Nico', appleMusicId: null },
  { no: '006', title: '看不見', artist: 'Hello Nico', appleMusicId: null },
  { no: '007', title: '規格化的城市、商品、人', artist: 'Hello Nico', appleMusicId: null },
  { no: '008', title: '返程', artist: 'Hello Nico', appleMusicId: null },
  { no: '009', title: '光', artist: 'Hello Nico', appleMusicId: null },
  { no: '010', title: '我會想你', artist: 'Hello Nico', appleMusicId: null },

  // 其他歌曲
  { no: '011', title: '晴天', artist: '周杰倫', appleMusicId: 535824738 },
  { no: '012', title: '小幸運', artist: '田馥甄', appleMusicId: 1017697311 },
  { no: '013', title: '心電心', artist: '王心凌', appleMusicId: 1705352272 },
  { no: '014', title: '稻香', artist: '周杰倫', appleMusicId: 1624001324 },
  { no: '015', title: '不是因為天氣晴朗才愛你', artist: '理想混蛋', appleMusicId: 1533697835 },
  { no: '016', title: '美麗新世界', artist: 'S.H.E', appleMusicId: null },
  { no: '017', title: '修煉愛情', artist: '林俊傑', appleMusicId: null },
  { no: '018', title: '突然好想你', artist: '五月天', appleMusicId: null },
  { no: '019', title: '我愛他', artist: '丁噹', appleMusicId: null },
  { no: '020', title: '想見你想見你想見你', artist: '八三夭', appleMusicId: null },
  { no: '021', title: '勇氣', artist: '梁靜茹', appleMusicId: null },
  { no: '022', title: '江南', artist: '林俊傑', appleMusicId: null },
  { no: '023', title: '頭號甜心', artist: '張韶涵', appleMusicId: null },
  { no: '024', title: '千千萬萬', artist: '鄭宜農', appleMusicId: null },
  { no: '025', title: '你到底在選擇什麼', artist: '公館青少年', appleMusicId: null },
  { no: '026', title: '若無你我欲去佗位', artist: '黃奇斌', appleMusicId: null },
  { no: '027', title: 'Just the Way You Are', artist: 'Bruno Mars', appleMusicId: null },
  { no: '028', title: 'おどるポンポコリン', artist: 'B.B.QUEENS', appleMusicId: null },
  { no: '029', title: '與浪之間', artist: 'VH Vast & Hazy', appleMusicId: null },
  { no: '030', title: '後來', artist: '劉若英', appleMusicId: 162143617 },
  { no: "031", title: "Last Dance", artist: "伍佰 & China Blue", appleMusicId: 1443262524 },
  { no: "032", title: "挪威的森林 (“雙面對決” Live)", artist: "伍佰 & China Blue", appleMusicId: 1440908378 },
  { no: "033", title: "妳是我的花朵 (“雙面對決” Live)", artist: "伍佰 & China Blue", appleMusicId: 1440909039 },

  // 男歌手精選
  { no: '9101', title: "非你莫屬", artist: "TANK", appleMusicId: 550972963 },
  { no: '9102', title: "給我你的愛", artist: "TANK", appleMusicId: 1270147321 },
  { no: '9103', title: "Love Song", artist: "方大同", appleMusicId: 272875200 },
  { no: '9104', title: "愛愛愛", artist: "方大同", appleMusicId: 369654279 },
  { no: '9105', title: "你不知道的事", artist: "王力宏", appleMusicId: 1528146380 },
  { no: '9106', title: "唯一", artist: "王力宏", appleMusicId: 312506885 },
  { no: '9107', title: "挪威的森林", artist: "伍佰", appleMusicId: 379810432 },
  { no: '9108', title: "淚橋", artist: "伍佰", appleMusicId: 808110752 },
  { no: '9109', title: "約定", artist: "光良", appleMusicId: 1597293047 },
  { no: '9110', title: "童話", artist: "光良", appleMusicId: 1600538156 },
  { no: '9111', title: "不屑紀念", artist: "吳克群", appleMusicId: 1753952675 },
  { no: '9112', title: "為你寫詩", artist: "吳克群", appleMusicId: 1753946646 },
  { no: '9113', title: "男傭", artist: "吳克群", appleMusicId: 1753947597 },
  { no: '9114', title: "手放開", artist: "李聖傑", appleMusicId: 1648090883 },
  { no: '9115', title: "痴心絕對", artist: "李聖傑", appleMusicId: 1530519464 },
  { no: '9116', title: "烏梅子醬", artist: "李榮浩", appleMusicId: 1655821629 },
  { no: '9117', title: "我會好好過", artist: "李玖哲", appleMusicId: 1646768086 },
  { no: '9118', title: "告白氣球", artist: "周杰倫", appleMusicId: 1118757877 },
  { no: '9119', title: "青花瓷", artist: "周杰倫", appleMusicId: 536030695 },
  { no: '9120', title: "簡單愛", artist: "周杰倫", appleMusicId: 535739351 },
  { no: '9121', title: "黃昏", artist: "周傳雄", appleMusicId: 290187219 },
  { no: '9122', title: "怎麼了", artist: "周興哲", appleMusicId: 1491159045 },
  { no: '9123', title: "可惜沒如果", artist: "林俊傑", appleMusicId: 1788007696 },
  { no: '9124', title: "背對背擁抱", artist: "林俊傑", appleMusicId: 1071517710 },
  { no: '9125', title: "曹操", artist: "林俊傑", appleMusicId: 1071513021 },
  { no: '9126', title: "兜圈", artist: "林宥嘉", appleMusicId: 1060974093 },
  { no: '9127', title: "少女", artist: "林宥嘉", appleMusicId: 1481033146 },
  { no: '9128', title: "說謊", artist: "林宥嘉", appleMusicId: 547173705 },
  { no: '9129', title: "他一定很愛你", artist: "阿杜", appleMusicId: 1091916580 },
  { no: '9130', title: "男人KTV", artist: "胡彥斌", appleMusicId: 1732636591 },
  { no: '9131', title: "因為愛", artist: "韋禮安", appleMusicId: 535064671 },
  { no: '9132', title: "慢慢等", artist: "韋禮安", appleMusicId: 542139616 },
  { no: '9133', title: "還是會", artist: "韋禮安", appleMusicId: 535407848 },
  { no: '9134', title: "情非得已", artist: "庾澄慶", appleMusicId: 312506680 },
  { no: '9135', title: "末日之戀", artist: "張智成", appleMusicId: 648241964 },
  { no: '9136', title: "月亮惹的禍", artist: "張宇", appleMusicId: 914675769 },
  { no: '9137', title: "小烏龜", artist: "張棟樑", appleMusicId: 1597292314 },
  { no: '9138', title: "寂寞邊界", artist: "張棟樑", appleMusicId: 1596463799 },
  { no: '9139', title: "自由", artist: "張震嶽", appleMusicId: 164054194 },
  { no: '9140', title: "愛的初體驗", artist: "張震嶽", appleMusicId: 164053514 },
  { no: '9141', title: "愛我別走", artist: "張震嶽", appleMusicId: 1777418726 },
  { no: '9142', title: "Superwoman", artist: "曹格", appleMusicId: 1746316318 },
  { no: '9143', title: "背叛", artist: "曹格", appleMusicId: 218877967 },
  { no: '9144', title: "天后", artist: "陳勢安", appleMusicId: 591757759 },
  { no: '9145', title: "你的背包", artist: "陳奕迅", appleMusicId: 651456031 },
  { no: '9146', title: "十年", artist: "陳奕迅", appleMusicId: 651456011 },
  { no: '9147', title: "愛情轉移", artist: "陳奕迅", appleMusicId: 1442420307 },
  { no: '9148', title: "找自己", artist: "陶喆", appleMusicId: 905206476 },
  { no: '9149', title: "愛很簡單", artist: "陶喆", appleMusicId: 1246658799 },
  { no: '9150', title: "音浪", artist: "黃立行", appleMusicId: 1805128186 },
  { no: '9151', title: "地球上最浪漫的一首歌", artist: "黃鴻升", appleMusicId: 543460129 },
  { no: '9152', title: "洋蔥", artist: "楊宗緯", appleMusicId: 1445132452 },
  { no: '9153', title: "愛上未來的你", artist: "潘瑋柏", appleMusicId: 1442272240 },
  { no: '9154', title: "壁虎漫步", artist: "潘瑋柏", appleMusicId: 1443367444 },
  { no: '9155', title: "早安晨之美", artist: "盧廣仲", appleMusicId: 799184015 },
  { no: '9156', title: "幾分之幾", artist: "盧廣仲", appleMusicId: 1342141668 },
  { no: '9157', title: "王妃", artist: "蕭敬騰", appleMusicId: 1834583378 },
  { no: '9158', title: "阿飛的小蝴蝶", artist: "蕭敬騰", appleMusicId: 1834583384 },
  { no: '9159', title: "撐腰", artist: "羅志祥", appleMusicId: 1546977195 },
  { no: '9160', title: "精舞門", artist: "羅志祥", appleMusicId: 804666917 },

  // 女歌手精選
  { no: '9201', title: "失戀無罪", artist: "A-Lin", appleMusicId: null },
  { no: '9202', title: "給我一個理由忘記", artist: "A-Lin", appleMusicId: null },
  { no: '9203', title: "手掌心", artist: "丁噹", appleMusicId: null },
  { no: '9204', title: "猜不透", artist: "丁噹", appleMusicId: null },
  { no: '9205', title: "月光", artist: "王心凌", appleMusicId: null },
  { no: '9206', title: "第一次愛的人", artist: "王心凌", appleMusicId: null },
  { no: '9207', title: "睫毛彎彎", artist: "王心凌", appleMusicId: null },
  { no: '9208', title: "有你的快樂", artist: "王若琳", appleMusicId: null },
  { no: '9209', title: "紅豆", artist: "王菲", appleMusicId: null },
  { no: '9210', title: "寂寞寂寞就好", artist: "田馥甄", appleMusicId: null },
  { no: '9211', title: "無人知曉", artist: "田馥甄", appleMusicId: null },
  { no: '9212', title: "幸福氧氣", artist: "卓文萱", appleMusicId: null },
  { no: '9213', title: "至少還有你", artist: "林憶蓮", appleMusicId: null },
  { no: '9214', title: "最初的夢想", artist: "范瑋琪", appleMusicId: null },
  { no: '9215', title: "最重要的決定", artist: "范瑋琪", appleMusicId: null },
  { no: '9216', title: "寂寞在唱歌", artist: "阿桑", appleMusicId: null },
  { no: '9217', title: "路過人間", artist: "郁可唯", appleMusicId: null },
  { no: '9218', title: "天黑黑", artist: "孫燕姿", appleMusicId: null },
  { no: '9219', title: "我懷念的", artist: "孫燕姿", appleMusicId: null },
  { no: '9220', title: "綠光", artist: "孫燕姿", appleMusicId: null },
  { no: '9221', title: "你敢不敢", artist: "徐佳瑩", appleMusicId: null },
  { no: '9222', title: "身騎白馬", artist: "徐佳瑩", appleMusicId: null },
  { no: '9223', title: "愛笑的眼睛", artist: "徐若瑄", appleMusicId: null },
  { no: '9224', title: "陰天", artist: "莫文蔚", appleMusicId: null },
  { no: '9225', title: "慢慢喜歡你", artist: "莫文蔚", appleMusicId: null },
  { no: '9226', title: "下一個天亮", artist: "郭靜", appleMusicId: null },
  { no: '9227', title: "心牆", artist: "郭靜", appleMusicId: null },
  { no: '9228', title: "我不想忘記你", artist: "郭靜", appleMusicId: null },
  { no: '9229', title: "三天三夜", artist: "張惠妹", appleMusicId: null },
  { no: '9230', title: "記得", artist: "張惠妹", appleMusicId: null },
  { no: '9231', title: "掉了", artist: "張惠妹", appleMusicId: null },
  { no: '9232', title: "淋雨一直走", artist: "張韶涵", appleMusicId: null },
  { no: '9233', title: "歐若拉", artist: "張韶涵", appleMusicId: null },
  { no: '9234', title: "親愛的那不是愛情", artist: "張韶涵", appleMusicId: null },
  { no: '9235', title: "寶貝", artist: "張懸", appleMusicId: null },
  { no: '9236', title: "分手快樂", artist: "梁靜茹", appleMusicId: null },
  { no: '9237', title: "會呼吸的痛", artist: "梁靜茹", appleMusicId: null },
  { no: '9238', title: "氣球", artist: "許哲珮", appleMusicId: null },
  { no: '9239', title: "相見恨晚", artist: "彭佳慧", appleMusicId: null },
  { no: '9240', title: "傻瓜", artist: "溫嵐", appleMusicId: null },
  { no: '9241', title: "沒那麼簡單", artist: "黃小琥", appleMusicId: null },
  { no: '9242', title: "年輪說", artist: "楊丞琳", appleMusicId: null },
  { no: '9243', title: "帶我走", artist: "楊丞琳", appleMusicId: null },
  { no: '9244', title: "理想情人", artist: "楊丞琳", appleMusicId: null },
  { no: '9245', title: "馬德里不思議", artist: "蔡依林", appleMusicId: null },
  { no: '9246', title: "舞孃", artist: "蔡依林", appleMusicId: null },
  { no: '9247', title: "說愛你", artist: "蔡依林", appleMusicId: null },
  { no: '9248', title: "無底洞", artist: "蔡健雅", appleMusicId: null },
  { no: '9249', title: "雙棲動物", artist: "蔡健雅", appleMusicId: null },
  { no: '9250', title: "成全", artist: "劉若英", appleMusicId: null },
  { no: '9251', title: "很愛很愛你", artist: "劉若英", appleMusicId: null },
  { no: '9252', title: "表白", artist: "蕭亞軒", appleMusicId: null },
  { no: '9253', title: "愛的主打歌", artist: "蕭亞軒", appleMusicId: null },
  { no: '9254', title: "旅行的意義", artist: "陳綺貞", appleMusicId: null },
  { no: '9255', title: "你要的愛", artist: "戴佩妮", appleMusicId: null },
  { no: '9256', title: "怎樣", artist: "戴佩妮", appleMusicId: null },
  { no: '9257', title: "你啊你啊", artist: "魏如萱", appleMusicId: null },
  { no: '9258', title: "買你", artist: "魏如萱", appleMusicId: null },
  { no: '9259', title: "光年之外", artist: "鄧紫棋", appleMusicId: null },
  { no: '9260', title: "泡沫", artist: "鄧紫棋", appleMusicId: null },

  // 戲劇主題曲／片尾曲
  { no: '9301', title: "花香", artist: "許紹洋", appleMusicId: null },               // 《薰衣草》片尾曲
  { no: '9302', title: "北極星的眼淚", artist: "張棟樑", appleMusicId: null },       // 《微笑PASTA》片尾曲
  { no: '9303', title: "流星雨", artist: "F4", appleMusicId: null },                 // 《流星花園》片尾曲
  { no: '9304', title: "專屬天使", artist: "TANK", appleMusicId: null },             // 《花樣少年少女》片尾曲
  { no: '9305', title: "曖昧", artist: "楊丞琳", appleMusicId: null },               // 《惡魔在身邊》片尾曲
  { no: '9306', title: "遺失的美好", artist: "張韶涵", appleMusicId: null },         // 《海豚灣戀人》片尾曲
  { no: '9307', title: "一了百了", artist: "信樂團", appleMusicId: null },           // 《超人氣學園》片尾曲
  { no: '9308', title: "好的事情", artist: "嚴爵", appleMusicId: null },             // 《醉後決定愛上你》片尾曲
  { no: '9309', title: "勢在必行", artist: "Bii", appleMusicId: null },              // 《勇士們》片頭曲
  { no: '9310', title: "想見你想見你想見你", artist: "八三夭", appleMusicId: null }, // 《想見你》片尾曲
  { no: '9311', title: "以後別做朋友", artist: "周興哲", appleMusicId: null },       // 《16個夏天》片尾曲
  { no: '9312', title: "我愛他", artist: "丁噹", appleMusicId: null },               // 《下一站，幸福》片頭曲
  { no: '9313', title: "倒帶", artist: "蔡依林", appleMusicId: null },               // 《求婚事務所》片尾曲
  { no: '9314', title: "癡心絕對", artist: "李聖傑", appleMusicId: null },           // 《愛上痞子男》片頭曲
  { no: '9315', title: "魚仔", artist: "盧廣仲", appleMusicId: null },               // 《植劇場－花甲男孩轉大人》片頭曲
  { no: '9316', title: "花都開好了", artist: "S.H.E", appleMusicId: null },          // 《薔薇之戀》片頭曲
  { no: '9317', title: "Lydia", artist: "飛兒樂團", appleMusicId: null },            // 《鬥魚》片尾曲
  { no: '9318', title: "隱形的翅膀", artist: "張韶涵", appleMusicId: null },         // 《愛殺17》片頭曲
  { no: '9319', title: "雨愛", artist: "楊丞琳", appleMusicId: null },               // 《海派甜心》片尾曲
  { no: '9320', title: "沒有如果", artist: "梁靜茹", appleMusicId: null },           // 《敗犬女王》片頭曲
  { no: '9321', title: "還是會", artist: "韋禮安", appleMusicId: null },             // 《我可能不會愛你》片頭曲
  { no: '9322', title: "微加幸福", artist: "郁可唯", appleMusicId: null },           // 《小資女孩向前衝》片尾曲
  { no: '9323', title: "暫時的男朋友", artist: "嚴爵", appleMusicId: null },         // 《真愛趁現在》片尾曲
  { no: '9324', title: "愛轉角", artist: "羅志祥", appleMusicId: null },             // 《轉角＊遇到愛》片尾曲
  { no: '9325', title: "再痛也沒關係", artist: "陳勢安", appleMusicId: null },       // 《花是愛》片尾曲
  { no: '9326', title: "轉身之後", artist: "Bii", appleMusicId: null },              // 《鍾無艷》片尾曲
  { no: '9327', title: "背叛", artist: "曹格", appleMusicId: null },                 // 《戀愛女王》片尾曲
  { no: '9328', title: "當", artist: "動力火車", appleMusicId: null },               // 《還珠格格》片頭曲
  { no: '9329', title: "葉子", artist: "阿桑", appleMusicId: null },                 // 《薔薇之戀》片尾曲
  { no: '9330', title: "無所謂", artist: "5566", appleMusicId: null },               // 《MVP情人》片頭曲
  { no: '9331', title: "我難過", artist: "5566", appleMusicId: null },               // 《MVP情人》片尾曲
  { no: '9332', title: "不要不要", artist: "卓文萱", appleMusicId: null },           // 《小資女孩向前衝》片頭曲
  { no: '9333', title: "心願便利貼", artist: "元若藍", appleMusicId: null },         // 《命中注定我愛你》片尾曲
  { no: '9334', title: "彩虹的微笑", artist: "王心凌", appleMusicId: null },         // 《微笑PASTA》片頭曲
  { no: '9335', title: "情非得已", artist: "庾澄慶", appleMusicId: null },           // 《流星花園》片頭曲
  { no: '9336', title: "孤單北半球", artist: "林依晨", appleMusicId: null },         // 《愛情合約》片尾曲
  { no: '9337', title: "櫻花草", artist: "Sweety", appleMusicId: null },             // 《星蘋果樂園》片尾曲
  { no: '9338', title: "記得我愛你", artist: "周渝民", appleMusicId: null },         // 《戰神》片尾曲
  { no: '9339', title: "風雲變色", artist: "5566", appleMusicId: null },             // 《紫禁之巔》片頭曲
  { no: '9340', title: "花的嫁紗", artist: "王心凌", appleMusicId: null },           // 《天國的嫁衣》片頭曲
  { no: '9341', title: "給我你的愛", artist: "TANK", appleMusicId: null },           // 《終極一班》片尾曲
  { no: '9342', title: "越來越愛", artist: "飛輪海", appleMusicId: null },           // 《愛就宅一起》片頭曲
  { no: '9343', title: "帶我走", artist: "楊丞琳", appleMusicId: null },             // 《不良笑花》片尾曲
  { no: '9344', title: "惡作劇", artist: "王藍茵", appleMusicId: null },             // 《惡作劇之吻》片尾曲
  { no: '9345', title: "手掌心", artist: "丁噹", appleMusicId: null },               // 《蘭陵王》片尾曲
  { no: '9346', title: "你，好不好？", artist: "周興哲", appleMusicId: null },       // 《遺憾拼圖》片尾曲
  { no: '9347', title: "三國戀", artist: "TANK", appleMusicId: null },               // 《終極三國》片尾曲
  { no: '9348', title: "兜圈", artist: "林宥嘉", appleMusicId: null },               // 《必娶女人》片尾曲
  { no: '9349', title: "臭男人", artist: "黃義達", appleMusicId: null },             // 《惡魔在身邊》片頭曲
  { no: '9350', title: "祝我生日快樂", artist: "溫嵐", appleMusicId: null },          // 《愛情魔髮師》片尾曲
  { no: '9351', title: "飛龍在天", artist: "江宏恩", appleMusicId: null },           // 《飛龍在天》片頭曲
  { no: '9352', title: "右手邊", artist: "光良", appleMusicId: null },               // 《舞動奇蹟》片尾曲
  { no: '9353', title: "迷魂計", artist: "183Club", appleMusicId: null },            // 《愛情魔髮師》片頭曲
  { no: '9354', title: "勇敢的幸福", artist: "立威廉", appleMusicId: null },         // 《綠光森林》片尾曲
  { no: '9355', title: "怎麼辦", artist: "S.H.E", appleMusicId: null },              // 《鬥牛要不要》片頭曲
  { no: '9356', title: "存在", artist: "5566", appleMusicId: null },                 // 《綠光森林》片頭曲
  { no: '9357', title: "伯樂", artist: "林宥嘉", appleMusicId: null },               // 《必娶女人》片頭曲
  { no: '9358', title: "一個人想著一個人", artist: "曾沛慈", appleMusicId: null },   // 《終極一班2》片尾曲
  { no: '9359', title: "家家酒", artist: "家家", appleMusicId: null },               // 《含苞欲墜的每一天》片頭曲
  { no: '9360', title: "分手快樂", artist: "梁靜茹", appleMusicId: null },            // 《麻辣鮮師》片尾曲
];


const TEST = [
  { no: '034', title: '浪人情歌', artist: '伍佰 & China Blue', appleMusicId: null },
  { no: '035', title: '突然的自我', artist: '伍佰 & China Blue', appleMusicId: null },
  { no: '036', title: '愛情限時批', artist: '伍佰 & 萬芳', appleMusicId: null },
  { no: '037', title: '淚橋', artist: '伍佰 & China Blue', appleMusicId: null },
  { no: '038', title: '世界第一等', artist: '伍佰 & China Blue', appleMusicId: null },
  { no: '039', title: '樹枝孤鳥', artist: '伍佰 & China Blue', appleMusicId: null },
  { no: '040', title: '痛哭的人', artist: '伍佰 & China Blue', appleMusicId: null },
  { no: '041', title: '衝衝衝', artist: '伍佰 & China Blue', appleMusicId: null },
  { no: '042', title: '再度重相逢', artist: '伍佰 & China Blue', appleMusicId: null },
  { no: '043', title: '白鴿', artist: '伍佰 & China Blue', appleMusicId: null },
  { no: '044', title: '牽掛', artist: '伍佰 & China Blue', appleMusicId: null },
  { no: '045', title: '與妳到永久', artist: '伍佰 & China Blue', appleMusicId: null },
  { no: '046', title: '心愛的再會啦', artist: '伍佰 & China Blue', appleMusicId: null },
  { no: '047', title: '晚風', artist: '伍佰 & China Blue', appleMusicId: null },
  { no: '048', title: '夏夜晚風', artist: '伍佰 & China Blue', appleMusicId: null },
  { no: '049', title: '被動', artist: '伍佰 & China Blue', appleMusicId: null },
  { no: '050', title: '一生最愛的人', artist: '伍佰 & China Blue', appleMusicId: null }
];