
import { DayData } from './types';

export const DEFAULT_ITINERARY: DayData[] = [
  {
    day: 1,
    date: "1/18",
    title: "抵達、海景購物與國際通首戰",
    tip: "iias 豐崎商場非常新且有海景，建議先在那邊買好第一晚的零食水酒。",
    events: [
      { 
        id: '1-1', time: "09:45", type: "Flight", title: "高雄起飛 (虎航 IT288)", location: "高雄國際機場", note: "建議 07:45 前抵達。",
        details: {
          about: ["建議 07:45 前抵達。高雄機場過安檢較快，但虎航櫃檯排隊人潮多，請預留充足時間。"]
        }
      },
      { 
        id: '1-2', time: "12:30", type: "Arrival", title: "抵達那霸機場 (OKA)", location: "那霸機場", note: "預計通關與領行李約需 45-60 分鐘",
        details: {
          about: ["下機後請準備好 Visit Japan Web 的 QR Code，預計通關與領行李約需 45-60 分鐘。"]
        }
      },
      { 
        id: '1-3', time: "13:30", type: "Food", title: "Potama 豬肉蛋飯糰 (機場店)", location: "那霸機場", note: "沖繩國民美食，機場 1F 抵達大廳",
        details: {
          about: ["沖繩最知名的國民美食，現點現做的午餐肉蛋飯糰。"],
          menuItems: [
            { original: "苦瓜天婦羅豬肉蛋飯糰", translated: "🍱 美食：人氣招牌推薦" },
            { original: "炸蝦塔塔醬飯糰", translated: "🍱 美食：外酥內軟經典口味" }
          ]
        }
      },
      { 
        id: '1-4', time: "14:30", type: "Shopping", title: "iias 沖繩豐崎", location: "豐見城市", note: "🛍️ 必買：Loft、Bic Camera、STEM RESORT",
        details: {
          about: ["結合生活雜貨與大型家電的海景購物中心。"],
          menuItems: [
            { original: "Loft (沖繩旗艦店)", translated: "🛍️ 逛街必買：文具、日系彩妝、質感居家小物" },
            { original: "Bic Camera X Kojima", translated: "🛍️ 逛街必買：吹風機、小家電（退稅流程流暢）" },
            { original: "STEM RESORT", translated: "📸 亮點：4樓頂樓有恐龍博物館與網美粉紅拍照牆" },
            { original: "Beef Rush (2F)", translated: "🍱 人氣美食：現烤牛排吃到飽，可自選熟度" },
            { original: "A&W (2F)", translated: "🍱 人氣美食：推薦「橙汁」，是內行人的消暑首選" }
          ]
        }
      },
      { 
        id: '1-5', time: "18:00", type: "Hotel", title: "Hotel GrandConsort Naha", location: "那霸市區", note: "🏨 2022 新開幕 / 行政酒廊",
        details: {
          about: [
            "🔖 預訂確認編號：6641130206 (Booking.com)",
            "🏨 飯店亮點：2022 年新開幕，備有行政酒廊（Lounge）提供酒精飲料與小點，部分房型配備 Dyson 吹風機。",
            "💡 小撇步：早餐以沖繩食材創意料理聞名，非常推薦預訂。"
          ]
        }
      },
      { 
        id: '1-6', time: "19:00", type: "Food", title: "晚餐：BAKUBAKU STEAK", location: "國際通", note: "🍱 必點「厚切牛排 + 漢堡排雙拼」",
        details: {
          about: ["在地高 CP 值牛排館，以石板加熱維持溫度。"],
          menuItems: [
            { original: "厚切牛排 + 漢堡排雙拼", translated: "🍱 推薦：沙拉、湯品與白飯無限供應" }
          ]
        }
      },
      { 
        id: '1-7', time: "20:00", type: "Shopping", title: "國際通購物 (Kokusai Dori)", location: "那霸市", note: "🛍️ 必買：唐吉訶德、首里石鹼、福砂屋",
        details: {
          about: ["那霸市中心最繁華的街道，全長 1.6 公里。"],
          menuItems: [
            { original: "唐吉訶德 (Don Quijote)", translated: "🛍️ 逛街必買：B1 藥妝最齊全，1F 買沖繩限定 KitKat" },
            { original: "SuiSavon 首里石鹼", translated: "🛍️ 逛街必買：沖繩天然植物洗面皂" },
            { original: "福砂屋", translated: "🎁 精選伴手禮：小方盒包裝，精緻好送禮" },
            { original: "鹽屋 (Ma-suya)", translated: "🎁 精選伴手禮：雪鹽牛奶霜淇淋，可自由撒上特色鹽巴" }
          ]
        }
      },
      { 
        id: '1-8', time: "21:30", type: "Food", title: "宵夜：暖暮拉麵 (那霸開南店)", location: "那霸市", note: "🍜 九州票選第一名拉麵",
        details: {
          about: ["曾獲九州票選第一名，以濃育豚骨湯頭著稱。"],
          menuItems: [
            { original: "烈火拉麵", translated: "🍜 推薦：招牌必點（可選辣度）" },
            { original: "一口餃子", translated: "🍜 推薦：搭配拉麵的首選" }
          ]
        }
      }
    ]
  },
  {
    day: 2,
    date: "1/19",
    title: "港川文青散策、海邊麵店與燈會",
    tip: "港川外人住宅社區氛圍極佳，每棟平房都有編號。建議停車於社區入口付費停車場。",
    events: [
      { id: '2-1', time: "10:00", type: "Location", title: "ORIX 美榮橋站前店領車", location: "那霸市", note: "取車代碼: 247157542" },
      { 
        id: '2-2', time: "10:50", type: "Shopping", title: "港川外人住宅 (Stateside Town)", location: "浦添市", note: "🏘️ 美軍宿舍改建文青聚落",
        details: {
          about: [
            "🏘️ 由美軍宿舍改建的文青聚落，每棟平房都有專屬編號，氛圍極佳。",
            "導航建議：建議搜尋 Houkiboshi 地址，車子可停在社區入口的付費停車場。"
          ],
          menuItems: [
            { original: "Houkiboshi (ほうき星) 港川本店", translated: "🎁 必買：位於 25 號棟。推薦「沖繩咖啡」與「石垣島牛乳」口味" },
            { original: "Cocoroar Cafe", translated: "🍱 美食：位於 15 號棟。推薦「焦糖烤布蕾鬆餅」，口感如空氣般輕盈" }
          ]
        }
      },
      { 
        id: '2-3', time: "12:45", type: "Food", title: "午餐：浜屋沖繩麵 (北谷)", location: "北谷町", note: "🍱 必點「軟骨麵 (Soki Soba)」",
        details: {
          about: [
            "沖繩麵代表性老店，湯頭清爽回甘，肉塊燉至軟嫩。",
            "💡 小撇步：13:00 左右抵達可避開第一波正午餐期，排隊時間較短。"
          ],
          menuItems: [
            { original: "軟骨麵 (Soki Soba)", translated: "🍱 推薦：招牌必點項目" },
            { original: "Juychee (沖繩炊飯)", translated: "🍱 推薦：內行吃法必配一碗炊飯" }
          ]
        }
      },
      { 
        id: '2-4', time: "15:30", type: "Hotel", title: "Hotel Nikko Alivila", location: "讀谷村", note: "🏨 西班牙風度假村 / 絕美沙灘",
        details: {
          about: [
            "🔖 預訂確認編號：6171476538 (Booking.com)",
            "🏨 飯店亮點：西班牙殖民風建築，擁有天然沙灘 Nirai Beach 與絕美婚禮教堂。",
            "💡 小撇步：早餐的「紅芋奶油果醬」與「現煎法式吐司」被譽為全沖繩第一。"
          ]
        }
      },
      { 
        id: '2-5', time: "17:30", type: "Ticket", title: "體驗王國＋琉球燈會", location: "讀谷村", note: "📸 亮點：冬季限定萬盞燈籠",
        details: {
          about: [
            "位於讀谷村，1 月份有萬件燈籠祭，極具東方韻味。",
            "📸 亮點速覽：園區內可進行琉球服裝體驗，拍照效果驚人。"
          ]
        }
      },
      { 
        id: '2-6', time: "19:30", type: "Food", title: "晚餐：居酒屋 燦 (Izakaya Sun)", location: "讀谷村", note: "🍱 讀谷在地名店 / 炭烤阿古豬",
        details: {
          about: ["讀谷村在地名店，就在飯店與燈會區域中間（開車 1 分鐘）。"],
          menuItems: [
            { original: "炭烤阿古豬", translated: "🍱 推薦：多汁軟嫩的沖繩名產豬" },
            { original: "海鮮料理", translated: "🍱 推薦：當日新鮮直送海味" }
          ]
        }
      }
    ]
  },
  {
    day: 3,
    date: "1/20",
    title: "北部賞櫻與海洋盛宴",
    tip: "櫻花祭期間八重岳可能稍微塞車，預留 20 分鐘緩衝時間。",
    events: [
      { 
        id: '3-1', time: "09:30", type: "Camera", title: "本部八重岳櫻花祭", location: "名護市", note: "📸 亮點：7000 棵寒緋櫻隧道",
        details: {
          about: [
            "沖繩最早盛開的櫻花地，由 7000 多棵寒緋櫻組成。",
            "📸 亮點速覽：建議車停「八重岳櫻之森公園」，櫻花隧道最密集。"
          ]
        }
      },
      { 
        id: '3-2', time: "12:00", type: "Nature", title: "備瀨福木林道", location: "本部町", note: "古老防風林隧道"
      },
      { 
        id: '3-3', time: "13:30", type: "Waves", title: "沖繩美麗海水族館", location: "本部町", note: "📸 亮點：黑潮之海巨大水槽",
        details: {
          about: ["觀賞世界最大水槽「黑潮之海」與巨大鯨鯊。"],
          menuItems: [
            { original: "Ocean Blue 咖啡廳", translated: "🍱 人氣美食：坐在水槽旁看鯨鯊吃下午茶" },
            { original: "Blue Manta 商店", translated: "🛍️ 買物：鯨鯊抱枕、海洋生物扭蛋" },
            { original: "鯨鯊造型自動鉛筆", translated: "🎁 伴手禮：水族館限定文具" }
          ]
        }
      },
      { 
        id: '3-4', time: "18:30", type: "Food", title: "晚餐：燒肉本部牧場 (本部總店)", location: "本部町", note: "🍱 必點「本部牛特選拼盤」",
        details: {
          about: [
            "使用高品質頂級 A5 本部牛，自家牧場直營。",
            "💡 小撇步：強烈建議事先官網預約。"
          ],
          menuItems: [
            { original: "本部牛豪華拼盤", translated: "🍱 推薦：A5 等級和牛，入口即化" }
          ]
        }
      },
      { 
        id: '3-5', time: "21:00", type: "Hotel", title: "Ala Mahaina Condo Hotel", location: "本部町", note: "🏨 全海景 / 景觀大浴場",
        details: {
          about: [
            "🔖 預訂確認編號：5297653966 (Booking.com)",
            "🏨 飯店亮點：2019 年開幕，全海景房，設有景觀大浴場與無邊際泳池。",
            "💡 小撇步：樓下就是 Hanisaki Marche 商場，有星巴克與甜點店。"
          ]
        }
      }
    ]
  },
  {
    day: 4,
    date: "1/21",
    title: "購物天堂與美式風情",
    tip: "來客夢商場極大，建議先鎖定 Pokemon Center 與百元店位置。",
    events: [
      { 
        id: '4-1', time: "10:00", type: "Shopping", title: "AEON MALL Rycom (來客夢)", location: "北中城村", note: "🛍️ 必買：Pokemon Center、Can Do",
        details: {
          about: ["沖繩最大型的購物中心，內部設有巨型魚缸，品牌極其齊全。"],
          menuItems: [
            { original: "Pokemon Center", translated: "🛍️ 買物：沖繩限定「風獅爺造型皮卡丘」" },
            { original: "Can Do", translated: "🛍️ 買物：高質感 100 日圓雜貨，收納用品齊全" },
            { original: "久世福商店", translated: "🎁 伴手禮：萬能高湯包、紅芋抹醬（主婦最愛）" }
          ]
        }
      },
      { 
        id: '4-2', time: "14:30", type: "Food", title: "A&W 北谷店", location: "北谷町", note: "🍔 50 年代復古美式速食",
        details: {
          menuItems: [
            { original: "麥根沙士 (Root Beer)", translated: "🥤 推薦：招牌飲料必試" },
            { original: "艾德堡 (Mozza Burger)", translated: "🍔 推薦：人氣招牌漢堡" },
            { original: "捲捲薯條", translated: "🍟 推薦：獨家特色口味" }
          ]
        }
      },
      { 
        id: '4-3', time: "16:00", type: "Location", title: "美濱美國村", location: "北谷町", note: "📸 亮點：日落海灘觀賞夕陽",
        details: {
          about: ["結合美式風格與沖繩海岸的區域，是看日落的最佳地點。"],
          menuItems: [
            { original: "American Depot", translated: "🛍️ 買物：專賣美式古著與二手雜貨" },
            { original: "Blue Seal 冰淇淋", translated: "🍱 美食：必吃海鹽奶酪口味" },
            { original: "日落海灘 (Sunset Beach)", translated: "📸 亮點：沖繩落日第一名觀賞場所" }
          ]
        }
      },
      { 
        id: '4-4', time: "20:00", type: "Hotel", title: "La'gent Hotel Okinawa Chatan", location: "北谷町", note: "🏨 工業風 / 精品大浴場",
        details: {
          about: [
            "🔖 預訂確認編號：6949018202 (Booking.com)",
            "🏨 飯店亮點：美式工業風設計，提供「電動嘟嘟車」免費接駁至美國村。",
            "💡 小撇步：大廳有免費迎賓飲料與冰棒，飯店設有投幣式洗衣機。"
          ]
        }
      }
    ]
  },
  {
    day: 5,
    date: "1/22",
    title: "海景百貨最後衝刺與賦歸",
    tip: "國內線航廈的大東壽司極受歡迎，下午可能完售。",
    events: [
      { 
        id: '5-1', time: "10:00", type: "Shopping", title: "浦添西海岸 PARCO CITY", location: "浦添市", note: "🛍️ 必買：阿卡將、吉伊卡哇、敘敘苑",
        details: {
          about: ["2019 年開幕的海景購物中心，擁有多個沖繩首家進駐品牌。"],
          menuItems: [
            { original: "阿卡將 (Akachan Honpo)", translated: "🛍️ 買物：沖繩唯一旗艦店，育嬰聖地" },
            { original: "Standard Products", translated: "🛍️ 買物：大創副牌，質感簡約雜貨" },
            { original: "吉伊卡哇 (Chiikawa)", translated: "🛍️ 買物：沖繩限定「風獅爺聯名」吊飾" },
            { original: "敘敘苑 (Jojoen)", translated: "🍱 美食：推薦平日中午午間套餐，CP 值極高" },
            { original: "極味屋 (Kiwamiya)", translated: "🍱 美食：可在熱石板上自選熟度煎製漢堡排" },
            { original: "Taco Rice Café Kijimuna", translated: "🍱 美食：招牌「歐姆蛋塔可飯」" }
          ]
        }
      },
      { id: '5-2', time: "15:30", type: "Arrow", title: "往機場移動、加油", location: "那霸市", note: "記得保留加油收據" },
      { id: '5-3', time: "17:00", type: "Location", title: "ORIX 那霸機場店還車", location: "那霸機場", note: "辦理還車手續" },
      { 
        id: '5-4', time: "17:30", type: "Shopping", title: "那霸機場國內線航廈", location: "那霸機場", note: "🍱 推薦：大東壽司、ROYCE",
        details: {
          about: ["國內線 2F 集合了全沖繩名產，比國際線好逛 10 倍，是最後採買伴手禮的好去處。"],
          menuItems: [
            { original: "大東壽司", translated: "🍱 美食：限量販售，入口即化必搶" },
            { original: "ROYCE' 沖繩限定", translated: "🎁 伴手禮：石垣鹽黑糖巧克力、泡盛生巧克力" },
            { original: "PABLO 沖繩限定", translated: "🎁 伴手禮：迷你紅芋起司塔" },
            { original: "御菓子御殿", translated: "🎁 伴手禮：紅芋塔最後補貨" }
          ]
        }
      },
      { 
        id: '5-5', time: "21:30", type: "Flight", title: "那霸起飛 (虎航 IT289)", location: "那霸機場", note: "預計 22:25 抵達高雄",
        details: {
          about: [
            "國際線航廈登機櫃檯約於起飛前 2-2.5 小時開放。",
            "帶著滿滿戰利品回溫暖的家，晚間機場交通接駁請預先規劃。"
          ]
        }
      }
    ]
  }
];
