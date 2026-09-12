// 站上的真實內容，全部來自社團提供的文件（2026-09-12）：
// - 115-1 社團課程規劃與實施計畫（PDF）
// - 115-1 社費與出席獎勵金辦法 v2.2（PDF，內部文件；站上只放對外文案那一頁的內容）
// - 區塊鏈基礎系列課程 課程企劃書（對外）（DOCX）
// - 幹部名單截圖（姓名依原截圖遮罩，手機與學號不上站）
// - 使用者提供的職缺、獎學金、新聞連結
// 改內容改這裡，不要改頁面元件。

export const semester = {
  code: "115-1",
  range: "2026.09 – 2026.12",
  meetingDay: "每週三",
  meetingDayEn: "Wednesdays",
  focus: "金融 × 科技 × 產學 × 實作",
  concept: "專家講座 → 工作坊實作 → 英語閱讀與討論 → 校友與社員交流，四種形式輪流進行。",
  conceptEn: "Expert lectures → hands-on workshops → English reading & discussion → alumni and member networking, in rotation.",
};

export type CalendarKind = "lecture" | "workshop" | "reading" | "social" | "school";

export const calendarKinds: Record<CalendarKind, { zh: string; en: string; tag: string }> = {
  lecture: { zh: "講座", en: "Lecture", tag: "tag" },
  workshop: { zh: "工作坊", en: "Workshop", tag: "tag tag--cyan" },
  reading: { zh: "英語讀書會", en: "English reading club", tag: "tag tag--warn" },
  social: { zh: "社團活動", en: "Social", tag: "tag tag--ok" },
  school: { zh: "全校行事", en: "University calendar", tag: "tag tag--ghost" },
};

export type CalendarItem = { week: number; date: string; kind: CalendarKind; zh: string; en: string; note?: string; noteEn?: string; counts: boolean };

// counts＝是否計入出席獎勵金的 11 堂
export const calendar: CalendarItem[] = [
  { week: 1, date: "09/09", kind: "social", zh: "迎新相見歡", en: "Welcome night", note: "社團願景、學期規劃與分組破冰", noteEn: "Vision, semester plan and team ice-breaking", counts: false },
  { week: 2, date: "09/16", kind: "workshop", zh: "從痛點洞察到原型驗證：AI 賦能設計思考", en: "From pain points to prototypes: AI-assisted design thinking", note: "幹部群／客座講師帶領實作", noteEn: "Led by officers / guest instructor", counts: true },
  { week: 3, date: "09/23", kind: "lecture", zh: "AI 時代商業模式創新：穿透演算法黑盒的信任變現與價值重構", en: "Business model innovation in the AI era", note: "陳顯立 董事長（好廣告數據）", noteEn: "Chen Hsien-Li, Chairman, Good Ads Data", counts: true },
  { week: 4, date: "09/30", kind: "reading", zh: "Nexus: A Brief History of Information Networks from the Stone Age to AI", en: "Nexus (Yuval Noah Harari)", note: "全程英文", noteEn: "Conducted entirely in English", counts: true },
  { week: 5, date: "10/07", kind: "workshop", zh: "從精準 KYC 到策略落地：顧問式客製化解決方案", en: "From KYC to strategy: consulting-style solutions", note: "幹部群／客座講師帶領實作", noteEn: "Led by officers / guest instructor", counts: true },
  { week: 6, date: "10/14", kind: "lecture", zh: "雙軸轉型的未來金融：ESG 永續數據如何驅動普惠金融創新", en: "ESG data and inclusive finance", note: "林庠序 執行長（市民永續）", noteEn: "Lin Hsiang-Hsu, CEO, City Sustainability", counts: true },
  { week: 7, date: "10/21", kind: "reading", zh: "The Trading Game: A Confession", en: "The Trading Game (Gary Stevenson)", note: "全程英文", noteEn: "Conducted entirely in English", counts: true },
  { week: 8, date: "10/28", kind: "social", zh: "期中考前聚餐交流", en: "Pre-midterm dinner", note: "發放歐趴糖、考前打氣", noteEn: "Snacks and encouragement before midterms", counts: false },
  { week: 9, date: "11/04", kind: "school", zh: "期中考週", en: "Midterm week", note: "社課暫停一次", noteEn: "No session", counts: false },
  { week: 10, date: "11/11", kind: "workshop", zh: "從題目拆解到商模提案：AI 驅動商業競賽致勝策略", en: "From case to pitch: winning business competitions with AI", note: "幹部群／客座講師帶領實作", noteEn: "Led by officers / guest instructor", counts: true },
  { week: 11, date: "11/18", kind: "lecture", zh: "兆級藍海的無息經濟學：伊斯蘭金融治理架構與全球 FinTech 創新趨勢", en: "Islamic finance and global FinTech", note: "陳緹珍 研究員（台灣金融研訓院）", noteEn: "Chen Ti-Chen, Researcher, TABF", counts: true },
  { week: 12, date: "11/25", kind: "reading", zh: "Underground Empire: How America Weaponized the World Economy", en: "Underground Empire (Farrell & Newman)", note: "全程英文", noteEn: "Conducted entirely in English", counts: true },
  { week: 13, date: "12/02", kind: "social", zh: "金融科技校友 networking 會", en: "FinTech alumni networking", note: "產學連結與職涯經驗傳承", noteEn: "Industry links and career advice", counts: true },
  { week: 14, date: "12/09", kind: "social", zh: "學期社員雞尾酒會", en: "Semester cocktail party", note: "跨組深度交流", noteEn: "Cross-team networking", counts: true },
  { week: 15, date: "12/16", kind: "social", zh: "期末聚餐交流", en: "End-of-semester dinner", note: "學習成果回顧", noteEn: "Semester review", counts: false },
  { week: 16, date: "12/23", kind: "school", zh: "期末考週", en: "Final exam week", note: "社課結束", noteEn: "Sessions end", counts: false },
];

export type Lecture = { week: number; date: string; title: string; titleEn: string; speaker: string; speakerEn: string; role: string; roleEn: string; org: string; orgEn: string; bio: string[]; bioEn: string[]; abstract: string; abstractEn: string };

export const lectures: Lecture[] = [
  {
    week: 3, date: "09/23",
    title: "AI 時代商業模式創新：穿透演算法黑盒的信任變現與價值重構",
    titleEn: "Business model innovation in the AI era: turning trust into value beyond the algorithmic black box",
    speaker: "陳顯立", speakerEn: "Chen Hsien-Li", role: "董事長", roleEn: "Chairman", org: "好廣告數據", orgEn: "Good Ads Data",
    bio: [
      "學歷｜國立政治大學公共行政學系",
      "現任｜好廣告數據創辦人暨執行長、台灣電商顧問（TeSA）董事長、台灣青年職涯創新協會（TYCIA）理事長、東吳大學企業管理研究所兼任副教授",
      "歷任｜鴻海科技集團富盈數據董事長兼執行長、鴻海富奇想商務長、燦坤 3C 行銷暨電商營運長、特力零售集團網路服務部協理、電通集團凱絡媒體首席商業顧問",
    ],
    bioEn: [
      "Education｜Department of Public Administration, National Chengchi University",
      "Current｜Founder and CEO, Good Ads Data; Chairman, Taiwan E-commerce Service Association (TeSA); Chairman, Taiwan Youth Career Innovation Association (TYCIA); Adjunct Associate Professor, Graduate School of Business Administration, Soochow University",
      "Previously｜Chairman and CEO of Foxconn’s Fuying Data; CCO of Foxconn’s Fuqixiang; COO of Marketing and E-commerce, Tsann Kuen 3C; Senior Manager of Online Services, Test Rite Retail Group; Chief Business Consultant, Carat (Dentsu)",
    ],
    abstract: "在生成式 AI 與推薦演算法席捲各行各業的當下，單純的技術應用已不足以構築競爭壁壘。本講座聚焦於企業與個人如何重新定義價值交付路徑，穿透演算法黑盒建立長期「信任資產」，將 AI 技術轉化為具備可持續獲利能力的商業模式閉環。",
    abstractEn: "As generative AI and recommendation algorithms sweep every industry, applying the technology alone no longer builds a moat. This lecture looks at how companies and individuals redefine how value is delivered, see through the algorithmic black box to build long-term “trust assets”, and turn AI into a business model that keeps earning.",
  },
  {
    week: 6, date: "10/14",
    title: "雙軸轉型的未來金融：ESG 永續數據如何驅動普惠金融創新",
    titleEn: "Twin transition in finance: how ESG data drives inclusive finance",
    speaker: "林庠序", speakerEn: "Lin Hsiang-Hsu", role: "創辦人兼執行長", roleEn: "Founder and CEO", org: "市民永續（City Sustainability）", orgEn: "City Sustainability",
    bio: [
      "現任｜市民永續股份有限公司創辦人兼執行長",
      "專業經歷｜深耕空間資訊決策系統、智慧城市與永續科技（GreenTech）。創立市民永續並推出「全民碳集（個人碳存摺）」平台，攜手國立成功大學及上海商業儲蓄銀行等機構，運用區塊鏈去中心化帳本技術將大眾綠色消費與生活減碳行為「數據資產化」。",
    ],
    bioEn: [
      "Current｜Founder and CEO, City Sustainability Co., Ltd.",
      "Background｜Spatial decision systems, smart cities and GreenTech. Founded City Sustainability and launched the “Citizen Carbon Passbook” platform; with National Cheng Kung University and Shanghai Commercial & Savings Bank, uses blockchain ledgers to turn everyday green consumption and carbon-reduction behaviour into data assets.",
    ],
    abstract: "探討 FinTech 如何與 GreenTech 深度結合，藉由物聯網與區塊鏈透明可驗證的特性，將一般民眾與中小企業的永續減碳行為轉化為具備金融價值的信用資產，落實雙軸（數位＋綠色）轉型與普惠金融願景。",
    abstractEn: "How FinTech and GreenTech combine: using the transparency and verifiability of IoT and blockchain, the carbon-reduction behaviour of ordinary people and small businesses becomes a credit asset with financial value — delivering the twin (digital + green) transition and inclusive finance.",
  },
  {
    week: 11, date: "11/18",
    title: "兆級藍海的無息經濟學：伊斯蘭金融治理架構與全球 FinTech 創新趨勢",
    titleEn: "Interest-free economics: Islamic finance governance and global FinTech trends",
    speaker: "陳緹珍", speakerEn: "Chen Ti-Chen", role: "專案經理／研究員", roleEn: "Project Manager / Researcher", org: "台灣金融研訓院（TABF）", orgEn: "Taiwan Academy of Banking and Finance (TABF)",
    bio: [
      "學歷｜國立政治大學財務管理學系、國立成功大學會計學系研究所",
      "現任｜台灣金融研訓院研究員／專案經理",
      "歷任｜台灣金融研訓院海外業務發展中心專案經理／副所長、致遠國際財務管理顧問（Ernst & Young）財務工程部。專研中東金融、伊斯蘭金融、國際金融情勢與跨境金融合作。",
    ],
    bioEn: [
      "Education｜Department of Finance, National Chengchi University; Graduate Institute of Accountancy, National Cheng Kung University",
      "Current｜Researcher / Project Manager, Taiwan Academy of Banking and Finance",
      "Previously｜Project Manager / Deputy Director, TABF Overseas Business Development Center; Financial Engineering, Ernst & Young Transaction Advisory. Focus: Middle East finance, Islamic finance, international finance and cross-border cooperation.",
    ],
    abstract: "全球伊斯蘭金融資產規模已突破數兆美元，其禁止利息（Riba）、倡導風險共擔與實體資產錨定的治理架構，正與現代 ESG 投資和 Web3 智能合約思潮高度接軌。本講座帶領社員解構伊斯蘭合規金融架構，並探討 Islamic FinTech 在跨境支付、綠色 Sukuk 等前沿領域的創新機遇。",
    abstractEn: "Global Islamic finance assets now exceed several trillion US dollars. Its governance — no interest (riba), shared risk, anchoring to real assets — aligns closely with ESG investing and Web3 smart contracts. This lecture unpacks Shariah-compliant finance and the opportunities for Islamic FinTech in cross-border payments and green sukuk.",
  },
];

export type Workshop = { week: number; date: string; title: string; titleEn: string; goal: string; goalEn: string; modules: Array<[string, string]>; modulesEn: Array<[string, string]> };

export const workshops: Workshop[] = [
  {
    week: 2, date: "09/16",
    title: "從痛點洞察到原型驗證：AI 賦能設計思考",
    titleEn: "From pain points to prototypes: AI-assisted design thinking",
    goal: "以「使用者痛點」為導向定義產品，並用 AI 工具在 2 小時內完成產品原型（MVP）驗證。",
    goalEn: "Define a product around real user pain points and validate an MVP prototype with AI tools within two hours.",
    modules: [
      ["同理心與痛點挖掘", "運用 Persona 與 Empathy Map 拆解金融使用者的核心障礙。"],
      ["AI 輔助腦力激盪", "利用生成式 AI 快速發散上百種金融科技解決方案與價值主張。"],
      ["原型快速構建", "運用低代碼／無代碼 AI 生成工具，產出視覺化 Prototype 並進行組內測試反饋。"],
    ],
    modulesEn: [
      ["Empathy and pain points", "Use personas and empathy maps to break down the core obstacles of financial users."],
      ["AI-assisted brainstorming", "Use generative AI to diverge quickly into hundreds of FinTech solutions and value propositions."],
      ["Rapid prototyping", "Use low-code / no-code AI tools to produce a visual prototype and test it within the team."],
    ],
  },
  {
    week: 5, date: "10/07",
    title: "從精準 KYC 到策略落地：顧問式客製化解決方案",
    titleEn: "From KYC to strategy: consulting-style customised solutions",
    goal: "掌握管理顧問公司的解題框架，從多維度客戶數據中洞察真需求，產出客製化金融策略提案。",
    goalEn: "Learn the problem-solving frameworks used by management consultancies, read real needs from multi-dimensional customer data, and produce a customised financial strategy proposal.",
    modules: [
      ["多維 KYC 與畫像診斷", "結合財務數據與行為特徵，建立精準客戶畫像（KYC Framework）。"],
      ["MECE 架構問題拆解", "使用 Issue Tree 鎖定企業或個人客戶的痛點根因。"],
      ["顧問級提案產出", "依據商業價值與落地可行性，完成模組化的解決方案簡報架構。"],
    ],
    modulesEn: [
      ["Multi-dimensional KYC", "Combine financial data and behaviour to build a precise customer profile (KYC framework)."],
      ["MECE problem breakdown", "Use an issue tree to locate the root cause of a corporate or individual customer’s pain."],
      ["Consulting-grade proposal", "Build a modular solution deck ranked by business value and feasibility."],
    ],
  },
  {
    week: 10, date: "11/11",
    title: "從題目拆解到商模提案：AI 驅動商業競賽致勝策略",
    titleEn: "From case to pitch: winning business competitions with AI",
    goal: "針對各大金控商業競賽與 FinTech 創新創業大賽，學會評審視角的破題方法與提案流程。",
    goalEn: "For financial-holding business competitions and FinTech startup contests: learn how judges read a case and how to run a proposal from brief to pitch.",
    modules: [
      ["賽題解構與市場切入", "分析過往獲獎作品，掌握評審看重的「技術可行性 vs. 商業價值」。"],
      ["商模畫布（BMC）精準校準", "運用 AI 快速進行市場規模預估（TAM/SAM/SOM）與競品矩陣分析。"],
      ["Pitch Deck 架構與話術", "設計兼具故事性與數據支持的 3 分鐘電梯簡報與 Q&A 防守策略。"],
    ],
    modulesEn: [
      ["Case breakdown and market entry", "Analyse past winners to see how judges weigh technical feasibility against business value."],
      ["Business Model Canvas calibration", "Use AI to estimate market size (TAM/SAM/SOM) and build a competitor matrix quickly."],
      ["Pitch deck and delivery", "Design a three-minute pitch with story and data, plus a Q&A defence strategy."],
    ],
  },
];

export type Book = { week: number; date: string; title: string; author: string; cover: string; synopsis: string; synopsisEn: string; topics: string[] };

export const books: Book[] = [
  {
    week: 4, date: "09/30",
    title: "Nexus: A Brief History of Information Networks from the Stone Age to AI", author: "Yuval Noah Harari", cover: "/assets/books/nexus.jpg",
    synopsis: "審視人類文明從石器時代口述傳播、活字印刷一路到生成式 AI 的資訊網絡演進史。核心論點：資訊網絡的本質不只是傳遞「真實」，更是維持「秩序」。當 AI 成為具備自我迭代的非人類智能，將重構信任與權力機制。",
    synopsisEn: "A history of information networks from oral storytelling and the printing press to generative AI. The core argument: networks exist not only to transmit truth but to maintain order — and once AI becomes a self-improving non-human intelligence, trust and power are rebuilt.",
    topics: [
      "How do information networks reshape trust and algorithmic governance in financial markets?",
      "What are the systemic risks when AI acts as an autonomous agent in decentralized finance?",
    ],
  },
  {
    week: 7, date: "10/21",
    title: "The Trading Game: A Confession", author: "Gary Stevenson", cover: "/assets/books/trading-game.jpg",
    synopsis: "金融市場交易員回憶錄。作者出身倫敦工人階級，進入花旗銀行交易室後，從市場波動與貨幣政策中觀察財富不平等的結構性擴大，並反思高風險交易文化、金融體制與社會責任。",
    synopsisEn: "A trader’s memoir. From a working-class London background to Citibank’s trading floor, the author watches inequality widen through market swings and monetary policy, and reflects on high-stakes trading culture, the financial system and social responsibility.",
    topics: [
      "The psychological and ethical dilemmas within high-stakes trading floors.",
      "Can modern financial innovation and FinTech alleviate — or will they exacerbate — economic inequality?",
    ],
  },
  {
    week: 12, date: "11/25",
    title: "Underground Empire: How America Weaponized the World Economy", author: "Henry Farrell & Abraham Newman", cover: "/assets/books/underground-empire.jpg",
    synopsis: "揭示全球化背後的隱形架構。SWIFT 跨境結算、美元清算體系、海底光纜等核心節點形成全球經濟的咽喉點（Chokepoints），並可能被國家權力運用於金融制裁與地緣政治博弈。",
    synopsisEn: "The hidden architecture behind globalisation: SWIFT, dollar clearing and undersea cables form chokepoints of the world economy that states can use for sanctions and geopolitical leverage.",
    topics: [
      "The weaponization of SWIFT and the global US dollar clearing mechanism.",
      "Opportunities and challenges for CBDCs and blockchain-based cross-border payments in bypassing traditional financial chokepoints.",
    ],
  },
];

// 區塊鏈基礎系列課程：社團主辦、TABEI 共同主辦。零基礎、不需程式。日期尚未排定（英文場 10/21）。
export type ChainCourse = { n: string; title: string; titleEn: string; keywords: string; keywordsEn: string; hook: string; hookEn: string; body: string; bodyEn: string; practice: string; practiceEn: string };

export const chainSeries = {
  name: "區塊鏈基礎系列課程",
  nameEn: "Blockchain Foundations Series",
  coHost: "社團法人臺灣區塊鏈愛好者協會（TABEI）",
  coHostEn: "Taiwan Blockchain Enthusiasts Institute (TABEI)",
  program: "2026 數位金融培訓工作坊系列課程 Level 1",
  programEn: "2026 Digital Finance Training Workshop Series, Level 1",
  format: "四堂中文課程（額外時段）＋一場英文讀書會（10/21 社課時段）；每堂 3.5 小時：講授 70 分鐘、體驗 90 分鐘，課末測驗與結業證明。",
  formatEn: "Four sessions in Chinese (extra time slots) plus one English reading session (10/21, regular slot). Each session is 3.5 hours: 70 minutes of teaching, 90 minutes hands-on, then a quiz and certificate.",
  audience: "零基礎、不需程式。每堂 15–30 人。",
  audienceEn: "No prior knowledge, no coding. 15–30 people per session.",
  instructor: "朱廷翊（合作企劃部）",
  instructorEn: "Chu Ting-Yi (Partnerships & programs)",
  courses: [
    { n: "01", title: "看不見的鎖：雜湊、簽章與後量子時代", titleEn: "The Invisible Lock: hashes, signatures and the post-quantum era", keywords: "雜湊 · 數位簽章 · 私鑰 · 錢包 · 後量子密碼學（PQC）", keywordsEn: "Hashes · Digital signatures · Private keys · Wallets · Post-quantum cryptography (PQC)", hook: "你在網站上設的密碼，資料庫裡到底存成什麼樣子？如果量子電腦真的問世，今天所有的加密還撐得住嗎？", hookEn: "What does the password you set on a website actually look like in the database? If quantum computers arrive, will today’s encryption hold?", body: "從最小的元件講起：一段文字如何被壓成固定長度的亂碼、簽名如何證明「這件事是我做的」而不需要任何人作保，最後談量子運算的威脅與各國的後量子密碼標準。", bodyEn: "Start from the smallest parts: how text is compressed into a fixed-length scramble, how a signature proves “I did this” without anyone vouching for you, and finally the quantum threat and the post-quantum standards countries are drafting.", practice: "驗證雜湊的雪崩效應、分組競賽找出符合條件的雜湊值、建立第一個錢包並完成一筆轉帳。", practiceEn: "Verify the avalanche effect of hashes, race in teams to find a qualifying hash, create your first wallet and make a transfer." },
    { n: "02", title: "一塊錢怎麼變成一串程式碼：穩定幣", titleEn: "How a Dollar Becomes Code: stablecoins", keywords: "穩定幣 · 準備金 · 脫鉤 · 跨境支付 · 虛擬資產服務法", keywordsEn: "Stablecoins · Reserves · De-pegging · Cross-border payments · Virtual Asset Services Act", hook: "為什麼一枚代幣可以長期等於一美元？同一筆錢在鏈上幾十秒就到，銀行為什麼要三天？", hookEn: "Why can one token stay worth one US dollar for years? Why does the same money arrive in seconds on-chain when a bank takes three days?", body: "拆解三種讓價格穩住的機制，回顧真實的脫鉤事件，並讀懂一份準備金報告——什麼叫「十足準備」、為什麼法規要禁止付息。", bodyEn: "Break down the three mechanisms that hold a price steady, revisit real de-pegging events, and learn to read a reserve report — what “fully reserved” means and why the law bans paying interest.", practice: "在測試網完成一次穩定幣轉帳，與傳統跨境匯款的時間和費用做對照；查閱真實發行商的準備金報告。", practiceEn: "Make a stablecoin transfer on a testnet and compare time and fees with a traditional remittance; read a real issuer’s reserve report." },
    { n: "03", title: "你的證件正在變成手機裡的一張卡：數位身分", titleEn: "Your ID Is Becoming a Card on Your Phone: digital identity", keywords: "DID · 可驗證憑證（VC）· 選擇性揭露 · 數位憑證皮夾 · 零知識證明", keywordsEn: "DID · Verifiable credentials (VC) · Selective disclosure · Digital credential wallet · Zero-knowledge proofs", hook: "買酒只需要證明你滿十八歲，為什麼店員連你住哪裡都看到了？", hookEn: "To buy alcohol you only need to prove you are over eighteen — so why does the clerk see your address?", body: "證件數位化真正的改變不是「不用帶卡」，而是「只給對方需要的那一項」。從發證者、持有者、驗證者的三方模型談到選擇性揭露、撤銷機制與零知識證明。", bodyEn: "What digitising ID really changes is not “no card to carry” but “only give the one field they need”. From the issuer–holder–verifier model to selective disclosure, revocation and zero-knowledge proofs.", practice: "用政府「數位憑證皮夾」App 在沙盒系統走完發卡、出示與驗證的流程，並實際操作可遺忘權清除資料。", practiceEn: "Use the government Digital Wallet app in a sandbox to issue, present and verify a credential, then exercise the right to be forgotten." },
    { n: "04", title: "資產上鏈：從供應鏈到跨境金融", titleEn: "Assets On-Chain: from supply chains to cross-border finance", keywords: "RWA 代幣化 · 聯盟鏈 · 供應鏈溯源 · 預言機 · 跨境結算", keywordsEn: "RWA tokenisation · Consortium chains · Supply-chain provenance · Oracles · Cross-border settlement", hook: "你手上這杯咖啡，真的來自標籤上寫的那座莊園嗎？一棟房子要怎麼被切成一千份？", hookEn: "Is the coffee in your hand really from the estate on the label? How do you split a house into a thousand pieces?", body: "處理「鏈上與現實怎麼對得起來」：真實資產代幣化的權利歸屬、企業為何選聯盟鏈、預言機為何是最脆弱的一環，以及國際金融基礎設施的代幣化實驗。", bodyEn: "How on-chain records line up with the real world: ownership in real-world asset tokenisation, why companies choose consortium chains, why oracles are the weakest link, and tokenisation experiments in international financial infrastructure.", practice: "分組為一項產品設計鏈上履歷憑證並實際簽發，觀察一筆資料從產地到消費者手上如何被驗證。", practiceEn: "Design and issue an on-chain provenance credential for a product and follow one record from origin to consumer." },
    { n: "EN", title: "Proof of Stake — The Making of Ethereum and the Philosophy of Blockchains", titleEn: "Proof of Stake — The Making of Ethereum and the Philosophy of Blockchains", keywords: "EVM · Solidity · 智能合約 · Gas · 權益證明", keywordsEn: "EVM · Solidity · Smart contracts · Gas · Proof of stake", hook: "比特幣只能記帳，以太坊為什麼可以跑程式？為什麼幾十行程式碼可以管住幾十億美元的資產？", hookEn: "Bitcoin only keeps accounts; why can Ethereum run programs? Why can a few dozen lines of code hold billions of dollars?", body: "以 Vitalik Buterin 的同名文集為引子，重點放在技術本身：EVM 如何讓每個節點跑出相同結果、Solidity 合約長什麼樣、為什麼要付 Gas、轉向權益證明改變了什麼。全程英文，10/21 社課時段。", bodyEn: "Using Vitalik Buterin’s essays as the entry point, the focus is the technology: how the EVM makes every node compute the same result, what a Solidity contract looks like, why gas is paid, and what changed with proof of stake. Entirely in English, 10/21.", practice: "在瀏覽器部署一份合約，把一句話寫上鏈並互相讀取；每位學員在鏈上留下一筆屬於自己的紀錄。", practiceEn: "Deploy a contract in the browser, write one sentence on-chain and read each other’s; every participant leaves a record of their own on the chain." },
  ] as ChainCourse[],
};

// 入社：兩種身份、招募時程、社費與出席獎勵金（取自辦法第九節「對外文案」與第二節時程）
export const membership = {
  types: [
    { name: "專案生", en: "Project member", fee: "3,000 元／學期", feeEn: "NT$3,000 / semester", how: "書面審查＋團體面試", howEn: "Written screening + group interview", perks: "全部社課與交流活動、社課資源（簡報、錄影、閱讀材料）、LINE Bot 與 Discord 社群。適用出席獎勵金。", perksEn: "All sessions and socials, session materials (slides, recordings, readings), LINE Bot and Discord. Eligible for the attendance reward." },
    { name: "旁聽生", en: "Auditor", fee: "1,500 元／學期", feeEn: "NT$1,500 / semester", how: "免書審，LINE Bot 隨時繳費入社", howEn: "No screening; join any time by paying through the LINE Bot", perks: "旁聽生資格與權益範圍另行公告；不適用出席獎勵金。", perksEn: "Auditor entitlements to be announced; not eligible for the attendance reward." },
  ],
  timeline: [
    { date: "09/07 – 09/17", zh: "書審填寫", en: "Applications", done: false },
    { date: "09/18", zh: "公布書審結果並確認面試時間", en: "Screening results; confirm interview slot", done: false },
    { date: "09/19 – 09/20", zh: "（六、日）晚上面試", en: "Interviews, Sat–Sun evening", done: false },
    { date: "09/21", zh: "公布專案生結果", en: "Project-member results", done: false },
  ],
  reward: {
    headline: "入社 3,000，全勤領回 2,000。",
    headlineEn: "Pay NT$3,000; full attendance gets NT$2,000 back.",
    tiers: [
      ["11 堂（全勤）", "2,000 元", "11 (full attendance)", "NT$2,000"],
      ["9–10 堂", "1,000 元", "9–10", "NT$1,000"],
      ["7–8 堂", "500 元", "7–8", "NT$500"],
      ["6 堂以下", "0 元", "6 or fewer", "NT$0"],
    ],
    countedSessions: "計入的 11 堂：3 場講座、3 場工作坊、3 場英語讀書會、校友 networking 會、雞尾酒會。迎新、期中與期末聚餐不計入。",
    countedSessionsEn: "The 11 counted sessions: 3 lectures, 3 workshops, 3 English reading sessions, the alumni networking night and the cocktail party. Welcome night and the two dinners do not count.",
    attendance: "以 LINE Bot 當堂簽到為準。開始前 15 分鐘至開始後 30 分鐘內簽到都算出席；超過 30 分鐘不計。因病、面試、重要考試等不可抗力缺席，可事前申請補作業認列，每學期一次。",
    attendanceEn: "Attendance is the LINE Bot check-in. Checking in from 15 minutes before to 30 minutes after the start counts; later does not. For illness, interviews or major exams you may apply in advance to make up with an assignment, once per semester.",
    payout: "12/10 雞尾酒會後結算並推播，12/10–12/12 異議期，12/18 前匯入登記帳戶。",
    payoutEn: "Settled and pushed after the 12/10 cocktail party; objections 12/10–12/12; transferred to your registered account by 12/18.",
    points: "另設積分獎金：學期積分第一名 4,000 元（由贊助款支出）。積分項目包含社課分享／提問、個人任務、專案里程碑、期末發表、活動協助等；每月 1 日 Bot 推播 Top 5。積分與出席獎勵金互不掛鉤。",
    pointsEn: "A separate points prize: NT$4,000 for the top scorer of the semester (funded by sponsorship). Points come from sharing and questions in sessions, individual tasks, project milestones, the final presentation and event help; the Bot pushes the top 5 on the 1st of each month. Points do not affect the attendance reward.",
  },
  faq: [
    ["社費 3,000 元包含什麼？", "三場業界講座、三場工作坊、三場英語讀書會、校友會與雞尾酒會。全勤者期末領回 2,000 元，實際負擔 1,000 元。", "What does the NT$3,000 fee cover?", "Three industry lectures, three workshops, three English reading sessions, the alumni night and the cocktail party. Full attendance gets NT$2,000 back, so the net cost is NT$1,000."],
    ["缺一堂還算全勤嗎？", "不算。11 堂全到才是全勤。不可抗力可以事前申請補作業認列，一學期一次。", "Does missing one session break full attendance?", "Yes. Full attendance means all 11 sessions. For unavoidable absences you may apply in advance to make up with an assignment, once per semester."],
    ["遲到算出席嗎？", "開始後 30 分鐘內簽到都算出席，只是積分較低。超過 30 分鐘不計。", "Does arriving late count?", "Checking in within 30 minutes of the start counts, with fewer points. Later than 30 minutes does not count."],
    ["社課臨時停課怎麼算？", "該堂不計入分母，級距門檻依比例由幹部會議公告調整。", "What if a session is cancelled?", "That session is removed from the total and the thresholds are adjusted proportionally by the officers’ meeting."],
    ["中途退社會退費嗎？", "依章程，自願離社不退社費，亦不發放獎勵金。", "Is the fee refunded if I leave?", "No. Under the constitution, voluntary withdrawal is not refunded and no reward is paid."],
    ["旁聽生和專案生差在哪？", "旁聽生免書審、隨時可繳費入社，1,500 元，不適用出席獎勵金；專案生需書審＋面試，3,000 元，適用出席獎勵金。", "Auditor vs. project member?", "Auditors skip screening, can join any time for NT$1,500 and are not eligible for the reward; project members go through screening and an interview, pay NT$3,000 and are eligible."],
  ],
  payment: [
    "錄取通知後加入官方 LINE Bot，完成基本資料填寫。",
    "Bot 推播匯款資訊（金額、備註填學號）。",
    "匯款後於 Bot 回覆「後五碼 xxxxx」。",
    "財務組核對後，Bot 通知入社成功並發送社群連結。",
  ],
  paymentEn: [
    "After the admission notice, add the official LINE Bot and fill in your basic details.",
    "The Bot sends the transfer details (amount; put your student ID in the memo).",
    "After transferring, reply to the Bot with the last five digits.",
    "Once the finance team confirms, the Bot notifies you and sends the community links.",
  ],
  note: "以上依「115-1 社費與出席獎勵金辦法 v2.2」，9/9 迎新社員大會表決通過後生效。",
};

// 幹部：姓名依社團提供的名單（原始資料即為遮罩形式）。手機與學號不上站。
export type Officer = { name: string; dept: string; deptEn: string };
export const leadership = {
  president: { name: "方○享", dept: "資管三", deptEn: "MIS, 3rd year" },
  vicePresident: { name: "何○文", dept: "日文三", deptEn: "Japanese, 3rd year" },
  departments: [
    { name: "專案開發部", en: "Projects", members: [{ name: "曾○庭", dept: "會計四", deptEn: "Accounting, 4th year" }, { name: "陳○安", dept: "資管三", deptEn: "MIS, 3rd year" }, { name: "劉○綺", dept: "資管二", deptEn: "MIS, 2nd year" }, { name: "藍○瀋", dept: "統計碩二", deptEn: "Statistics, MS 2nd year" }] as Officer[] },
    { name: "合作企劃部", en: "Partnerships & programs", members: [{ name: "朱○翊", dept: "資管四", deptEn: "MIS, 4th year" }] as Officer[] },
    { name: "品牌人資社群部", en: "Brand, people & community", members: [{ name: "曾○甫", dept: "國貿三", deptEn: "International Business, 3rd year" }, { name: "謝○裕", dept: "財管三", deptEn: "Finance, 3rd year" }] as Officer[] },
    { name: "企業關係部", en: "Corporate relations", members: [{ name: "胡○晟", dept: "風管三", deptEn: "Risk Management, 3rd year" }, { name: "曾○翔", dept: "金融碩三", deptEn: "Money and Banking, MS 3rd year" }, { name: "李○翰", dept: "國金碩二", deptEn: "International Finance, MS 2nd year" }] as Officer[] },
  ],
};

export type Resource = { kind: "job" | "scholarship" | "program"; kindZh: string; kindEn: string; title: string; titleEn: string; org: string; orgEn: string; summary: string; summaryEn: string; details?: string[]; detailsEn?: string[]; href?: string; contact?: string; deadline?: string };

export const resources: Resource[] = [
  {
    kind: "job", kindZh: "職缺", kindEn: "Job", title: "保險理賠作業分析員（含部分簡易理賠評估）", titleEn: "Claims Operations Analyst (with simple claims assessment)", org: "安達國際人壽保險（Chubb Life）", orgEn: "Chubb Life Insurance Taiwan",
    summary: "6 個月約聘，日薪 1,920 元；可全職者薪資另議。無經驗可、應屆畢業生可、在籍學生時間可配合亦可。",
    summaryEn: "Six-month contract, NT$1,920 per day; full-time candidates negotiable. No experience required; fresh graduates and current students with flexible hours welcome.",
    details: [
      "支援日常理賠作業及行政協調；處理簡易理賠案件（約 50%）",
      "製作並維護 SLA、待辦案件量（backlog）及營運報表（約 20%）",
      "支援流程改善與營運效率提升專案；例行理賠行政備援",
      "條件：細心、有學習意願、溝通與組織能力佳、熟悉 Excel 與基本報表",
    ],
    detailsEn: [
      "Support daily claims operations and admin coordination; handle simple claims (about 50%)",
      "Produce and maintain SLA, backlog and operations reports (about 20%)",
      "Support process-improvement projects; back up routine claims admin",
      "Requirements: attention to detail, willingness to learn, good communication and organisation, Excel and basic reporting",
    ],
    contact: "Aaron Chao 趙贊恩｜Human Resources｜aaron.chao@chubb.com｜02-8161-1988 #8719",
  },
  {
    kind: "scholarship", kindZh: "獎學金", kindEn: "Scholarship", title: "115 學年陳顯立數位商業人才培育獎學金", titleEn: "Chen Hsien-Li Digital Business Talent Scholarship, AY115", org: "政大學務處 生活事務暨僑生輔導組", orgEn: "NCCU Office of Student Affairs",
    summary: "由本學期第 3 週講者陳顯立董事長設立。實施要點與申請書見學務處公告（2026/09/02）。",
    summaryEn: "Established by Chairman Chen Hsien-Li, our week-3 speaker. Guidelines and application form in the Office of Student Affairs notice (2026/09/02).",
    href: "https://osa.nccu.edu.tw/tw/生活事務暨僑生輔導組/最新消息/14369-115學年陳顯立數位商業人才培育獎學金",
  },
  {
    kind: "program", kindZh: "計畫", kindEn: "Program", title: "Claude Campus Ambassador", titleEn: "Claude Campus Ambassador", org: "Anthropic", orgEn: "Anthropic",
    summary: "Anthropic 重啟校園大使計畫，分三條線：本科生 Claude Builder Club（校內 AI workshop、Hackathon、Demo Night）、研究生 Claude Campus Conversations、博士 Claude Science。",
    summaryEn: "Anthropic has relaunched its campus ambassador program in three tracks: Claude Builder Club for undergraduates (AI workshops, hackathons, demo nights), Claude Campus Conversations for graduate students, and Claude Science for PhDs.",
    href: "https://x.com/MaxForAI/status/2095196465773822266",
  },
];

// logo 找得到的放 logo（assets/partners/），找不到的維持文字
export const partners = [
  { zh: "臺灣區塊鏈愛好者協會（TABEI）", en: "Taiwan Blockchain Enthusiasts Institute", logo: "/assets/partners/tabei.png", markOnly: true, href: "https://www.chain.tw/" },
  { zh: "好廣告數據", en: "Good Ads Data", logo: "/assets/partners/gad.svg", href: "https://gad-dev-464210.web.app/" },
  { zh: "市民永續", en: "City Sustainability", href: "https://www.greenhope.com.tw/" },
  { zh: "台灣金融研訓院", en: "Taiwan Academy of Banking and Finance", logo: "/assets/partners/tabf.svg", href: "https://www.tabf.org.tw/" },
];

// ── FinTech 週報 ─────────────────────────────────────────────────────────
// 依 nccu-fintechlab-social/docs/週報-Prompt.md 的規則產出：先做選題卡（每條事實附來源），
// 再鋪成「封面三則短標 ＋ 三則各一段 ≤180 字摘要」。網站版多放來源連結，讓讀者可以自己點開查證。
export type WeeklyStory = { title: string; titleEn: string; summary: string; summaryEn: string; sources: Array<{ label: string; labelEn: string; href: string; primary: boolean }> };
export type WeeklyIssue = { vol: number; range: string; year: number; headlines: [string, string, string]; headlinesEn: [string, string, string]; stories: WeeklyStory[]; note?: string };

export const weekly: WeeklyIssue[] = [
  {
    vol: 3, range: "09/07 – 09/13", year: 2026,
    headlines: ["Circle 4 億美元買跨境支付", "Block 申請國家信託銀行", "電支帳戶突破 4,150 萬"],
    headlinesEn: ["Circle buys Tazapay for $400M", "Block applies for a trust bank", "E-payment accounts pass 41.5M"],
    stories: [
      {
        title: "Circle 以 4 億美元收購新加坡跨境支付公司 Tazapay",
        titleEn: "Circle to acquire Singapore cross-border payments firm Tazapay for $400M",
        summaryEn: "Circle issues USDC, a stablecoin pegged to the US dollar — increasingly used as a payment rail rather than an investment. On September 8 Circle announced a $400 million all-stock acquisition of Singapore-based Tazapay, which handles business-to-business cross-border payments: over $25 billion in annualised volume, payout rails in more than 100 markets, and about 60% of volume already settled in stablecoins. Circle’s stated reason is to join “issuing a stablecoin” with “actually moving money into bank accounts across countries”, making USDC easier to use for payments in Asia and emerging markets. Closing is expected in 2027, subject to approvals including the Monetary Authority of Singapore.\n\nWhy it matters in Taiwan: the Virtual Asset Services Act passed in June, and the FSC chair said on September 2 that stablecoin rules could take effect as early as Q1 2027. While stablecoins abroad are already becoming cross-border payment plumbing, Taiwan’s rules are catching up — and services here that let you pay abroad in stablecoins will likely run on infrastructure like this.",
        summary: "Circle 是發行美元穩定幣 USDC 的公司；「穩定幣」是一種價格釘住美元的加密貨幣，用途愈來愈接近付款工具而不是投資標的。9 月 8 日 Circle 宣布以 4 億美元全股票交易收購新加坡的 Tazapay。Tazapay 做的是企業之間的跨境收付款：年化交易量超過 250 億美元，付款通路涵蓋 100 多個市場，其中約六成的交易量已經用穩定幣結算。Circle 說買下它的原因，是把「發行穩定幣」和「把錢真正送到各國銀行帳戶」這兩段接起來，讓 USDC 在亞洲與新興市場更容易被拿來付款。交易預計 2027 年完成，還要經過新加坡金管局等監理機關核准。\n\n跟台灣讀者的關係：台灣的《虛擬資產服務法》今年 6 月三讀通過，金管會主委 9 月 2 日表示穩定幣子法最快 2027 年第一季上路。也就是說，當國外已經在把穩定幣當成跨境付款的管線，台灣的法規正在追上；之後在台灣看到「用穩定幣付跨境款項」的服務，背後很可能就是這類基礎設施。",
        sources: [
          { label: "Circle 新聞稿（Business Wire，2026-09-08）", labelEn: "Circle press release (Business Wire, 2026-09-08)", href: "https://www.businesswire.com/news/home/20260908409825/en/", primary: true },
          { label: "Payments Dive 報導（2026-09-10）", labelEn: "Payments Dive (2026-09-10)", href: "https://www.paymentsdive.com/news/circle-buys-tazapay-for-400m/829956/", primary: false },
          { label: "Focus Taiwan：金管會主委談穩定幣子法時程（2026-09-02）", labelEn: "Focus Taiwan: FSC chair on the stablecoin rules timeline (2026-09-02)", href: "https://focustaiwan.tw/business/202609020014", primary: false },
        ],
      },
      {
        title: "Block 向美國 OCC 申請設立「只保管、不收存款」的信託銀行",
        titleEn: "Block asks the OCC for a custody-only national trust bank",
        summaryEn: "Block is the parent of Square terminals and Cash App. On September 8 it announced an application to the OCC, the US federal bank regulator, for Builders Bank & Trust — a national trust bank that takes no deposits and makes no loans, offering custody and fiduciary services including custody of bitcoin and stablecoins. Block already owns a Utah industrial bank founded in 2021; the extra charter puts “custody of digital assets” under a federal framework instead of state-by-state supervision. The backdrop: a May executive order telling federal agencies to speed up fintech bank-charter applications, after which Stripe, Circle, Revolut and PayPal took the same route — become a custody-only bank first, then see. Approval timing is not available.\n\nWhy it matters in Taiwan: the FSC is piloting virtual-asset custody by banks this year. The US answer is a special-purpose charter; Taiwan’s is letting existing banks pilot. Different paths, same question: who may legally hold your coins, and who is liable when something goes wrong.",
        summary: "Block 是 Square 收款機與 Cash App 的母公司。9 月 8 日它宣布向美國聯邦金融監理機關 OCC 申請設立 Builders Bank & Trust，這是一家「國家信託銀行」：不收存款、不放款，專門做保管與信託服務，包括替客戶保管比特幣與穩定幣。Block 其實已經有一家 2021 年成立的猶他州工業銀行，這次多申請一張執照，是想把「保管數位資產」這件事放進聯邦層級的監理框架裡，而不是各州各管。背景是今年 5 月美國總統簽署行政命令，要求聯邦機關加速金融科技公司的銀行執照申請；之後 Stripe、Circle、Revolut、PayPal 都走了同一條路——先當「只保管、不放款」的銀行，再看下一步。核准時程目前查不到。\n\n跟台灣讀者的關係：金管會今年也在推動「虛擬資產保管業務試辦」，讓銀行替客戶保管虛擬資產。美國的做法是「發一種專門的執照」，台灣是「讓既有銀行試辦」，路徑不同，但要解決的問題一樣：誰可以合法替你保管幣，出事誰負責。",
        sources: [
          { label: "Payments Dive 報導（2026-09-09，引 Block 新聞稿）", labelEn: "Payments Dive (2026-09-09, citing Block’s press release)", href: "https://www.paymentsdive.com/news/block-seeks-occ-bank-charter/829903/", primary: false },
          { label: "時報資訊：金管會 2026 金融科技雙主軸與保管業務試辦（2026-08-19）", labelEn: "China Times: FSC’s 2026 FinTech themes and custody pilot (2026-08-19)", href: "https://www.chinatimes.com/realtimenews/20260819001292-260410", primary: false },
        ],
      },
      {
        title: "金管會：7 月底電子支付帳戶使用者約 4,151 萬人",
        titleEn: "FSC: about 41.51 million e-payment accounts at end of July",
        summaryEn: "“E-payment” means accounts such as LINE Pay Money, JKOPay and EasyWallet that can store value, transfer and pay — unlike a credit card, they work like a small wallet on your phone. The FSC publishes their statistics monthly; the September 10 release covers July: about 41.51 million e-payment account users, up roughly 380,000 from June; monthly payment collection about NT$33.01 billion (NT$29.65 billion in June), stored-value deposits about NT$33.5 billion, domestic and overseas small remittances about NT$18.01 billion, and outstanding balances about NT$20.09 billion. All four figures rose month on month.\n\nWhy it matters in Taiwan: 41.51 million accounts exceed the population, so most people hold more than one, and “which one gets used” is now the competitive question. The release is monthly and fixed in format — the most direct source for tracking whether mobile payments keep growing and which line (stored value, transfers, collection) grows fastest, and citable in any report or project.",
        summary: "「電子支付」指的是 LINE Pay Money、街口、悠遊付這類可以儲值、轉帳、收付款的帳戶，跟只能刷卡付款的信用卡不同，它更像一個放在手機裡的小錢包。金管會每個月公布一次這些帳戶的統計，9 月 10 日公布的是 7 月份：電子支付帳戶總使用者約 4,151 萬人，比上個月多約 38 萬人；當月代理收付實質交易款項約 330.1 億元（上月 296.5 億元），收受儲值款項約 335 億元，國內外小額匯兌約 180.1 億元，支付款項餘額約 200.9 億元。四個數字都比上個月高。\n\n跟台灣讀者的關係：4,151 萬個帳戶已經超過台灣人口，代表多數人不只開了一個電支帳戶，「用哪一個」正在變成業者的競爭重點。這份統計每月公布一次、格式固定，是觀察台灣行動支付有沒有繼續成長、哪一項（儲值、轉帳、代收付）長得最快的最直接來源，之後做報告或專案都可以直接引用。",
        sources: [
          { label: "金管會新聞稿：115 年 7 月份信用卡、現金卡及電子支付機構業務資訊（2026-09-10）", labelEn: "FSC press release: July 2026 credit card, cash card and e-payment statistics (2026-09-10)", href: "https://www.fsc.gov.tw/ch/home.jsp?id=96&parentpath=0,2&mcustomize=news_view.jsp&dataserno=202609100002&dtable=News", primary: true },
        ],
      },
    ],
    note: "三則皆於 2026-09-12 查證；發布前請再點開來源確認。",
  },
  {
    vol: 2, range: "09/02 – 09/06", year: 2026,
    headlines: ["穩定幣子法最快明年 Q1", "Stripe 找人做穩定幣卡", "Ramp 把 AI 花費納管"],
    headlinesEn: ["Taiwan stablecoin rules: Q1 2027", "Stripe hires for stablecoin cards", "Ramp brings AI spend under control"],
    stories: [
      {
        title: "金管會主委：虛擬資產與穩定幣子法規最快 2027 年第一季上路",
        titleEn: "FSC chair: virtual-asset and stablecoin rules could take effect in Q1 2027",
        summary: "「穩定幣」是價格釘住某種法定貨幣（例如美元）的加密貨幣。台灣今年 6 月 30 日三讀通過《虛擬資產服務法》，第一次為虛擬資產業者與穩定幣的發行訂出法律架構；但法律只是骨架，細節要靠子法規。金管會主委彭金隆 9 月 2 日在台北的亞洲金融科技聯盟（AFA）高峰會表示，金管會正在訂九項子法規，其中穩定幣的草案預計最快明年第一季公告實施。他也提到，國際上對虛擬資產與穩定幣的討論已經從「該不該發展」變成「怎麼健全地發展」。子法規的正式內容目前還沒公布。\n\n跟台灣讀者的關係：之後在台灣發行穩定幣的業者要同時經過金管會與央行核准，這會是判斷哪些穩定幣「合規」的第一個依據。對想做相關專案或找相關實習的人來說，2027 年第一季是一個值得記住的時間點：法規上路前後，會是業者最需要人手的時候。",
        summaryEn: "A stablecoin is a cryptocurrency pegged to a fiat currency such as the US dollar. Taiwan passed the Virtual Asset Services Act on June 30, its first legal framework for virtual-asset providers and stablecoin issuance — but the act is only the skeleton; the details come from subsidiary regulations. At the Asia FinTech Alliance summit in Taipei on September 2, FSC chair Peng Jin-lung said the FSC is drafting nine such regulations, and that the stablecoin draft could be announced and take effect as early as Q1 2027. He added that the global conversation has moved from “whether” to “how to develop soundly”. The text of the rules is not yet published.\n\nWhy it matters in Taiwan: issuers will need approval from both the FSC and the central bank — the first yardstick for which stablecoins count as compliant. For anyone planning a project or an internship in this area, Q1 2027 is a date to remember: the months around a rule taking effect are when firms need people most.",
        sources: [
          { label: "Focus Taiwan（中央社英文）報導（2026-09-02）", labelEn: "Focus Taiwan (CNA English), 2026-09-02", href: "https://focustaiwan.tw/business/202609020014", primary: false },
          { label: "Taipei Times 報導（2026-09-03）", labelEn: "Taipei Times (2026-09-03)", href: "https://www.taipeitimes.com/News/biz/archives/2026/09/03/2003863581", primary: false },
        ],
      },
      {
        title: "Stripe 延攬 Drew Turchin 負責穩定幣連結的支付卡業務",
        titleEn: "Stripe hires Drew Turchin to run stablecoin-linked payment cards",
        summary: "Stripe 是全球最大的線上收款基礎設施公司之一。Payments Dive 9 月 3 日報導，Stripe 聘請曾任職 Native Markets 與 Uniswap Labs 的 Drew Turchin，負責「穩定幣連結的支付卡」——使用者把穩定幣放在帳戶裡，刷卡時自動換成當地貨幣付款，任何收卡的地方都能用。這不是突然的決定：Stripe 2024 年 10 月以 11 億美元收購穩定幣平台 Bridge，今年 6 月又加入約 140 家公司共同宣布的 Open USD 穩定幣。Stripe 網站引用的研究顯示，穩定幣連結卡的月交易量在 2024 年達 15 億美元，前一年是 2.5 億美元，一年成長六倍。\n\n跟台灣讀者的關係：這類卡在台灣還不能發行，要等穩定幣子法規（見上一則）定案。但它說明了穩定幣真正的落地方式可能不是「大家去買幣」，而是藏在一張看起來很普通的卡後面——這是看 FinTech 產品時很值得記住的一個模式：技術在後面換掉，前面的使用習慣不變。",
        summaryEn: "Stripe is one of the largest online payment infrastructure companies. Payments Dive reported on September 3 that Stripe hired Drew Turchin, formerly of Native Markets and Uniswap Labs, to lead stablecoin-linked payment cards: the user holds stablecoins in an account, and at checkout the card converts to local currency, usable anywhere cards are accepted. It is not a sudden move: Stripe bought the stablecoin platform Bridge for $1.1 billion in October 2024 and in June joined about 140 companies announcing the Open USD stablecoin. Research cited on Stripe’s site puts stablecoin-linked card volume at $1.5 billion a month in 2024, up from $250 million the year before — six times in a year.\n\nWhy it matters in Taiwan: such cards cannot be issued here until the stablecoin rules above are finalised. But they show how stablecoins may actually land: not “everyone buys crypto”, but hidden behind an ordinary-looking card. A pattern worth remembering when you look at FinTech products — the technology changes underneath, the habit in front stays the same.",
        sources: [
          { label: "Payments Dive 報導（2026-09-03）", labelEn: "Payments Dive (2026-09-03)", href: "https://www.paymentsdive.com/news/stripe-taps-new-stablecoin-executive/829509/", primary: false },
        ],
      },
      {
        title: "Ramp 推出 Router：把公司花在 AI 上的錢納入費用管理",
        titleEn: "Ramp launches Router to bring corporate AI spending under expense controls",
        summary: "Ramp 是一家發企業卡、做費用管理軟體的美國金融科技公司；企業用它的卡付款，再用它的軟體管報銷與預算。8 月 19 日 Ramp 推出 Router：公司可以看到自己在 OpenAI、Anthropic、Google、Meta 等各家模型上花了多少「代幣費」（AI 依用量計價的單位），依成本、速度與表現把任務分派給不同模型，並像管差旅費一樣設上限。Ramp 說這個工具內部已經用了三年，自家的 AI 支出從 2025 年夏天到現在成長了 21 倍；同一個月，Stripe 以 75 億美元收購同類型的 OpenRouter，這個領域約有十來家公司在做。\n\n跟台灣讀者的關係：「AI 用量」正在變成企業一項會失控的固定支出，所以費用管理、企業卡與支付公司都在搶著幫企業管它。這是一條新出現的產品線——找實習、看產業、或想做專案時，「幫公司管 AI 花費」是一個台灣還很少人做的題目。",
        summaryEn: "Ramp is a US fintech that issues corporate cards and makes expense software: companies pay with its cards and manage reimbursements and budgets in its software. On August 19 Ramp launched Router: a company can see what it spends on tokens (the usage unit AI is priced in) across OpenAI, Anthropic, Google, Meta and others, route tasks to models by cost, speed and performance, and set limits the way travel expenses are capped. Ramp says it has used the tool internally for three years and that its own AI spend grew 21× since summer 2025; the same month Stripe bought the comparable OpenRouter for $7.5 billion, in a field of roughly a dozen players.\n\nWhy it matters in Taiwan: AI usage is becoming a fixed cost that companies struggle to control, so expense, corporate-card and payment firms are racing to manage it. It is a new product line — for internships, industry watching or a project, “helping companies manage AI spend” is a topic few in Taiwan have touched.",
        sources: [
          { label: "Payments Dive 報導（2026-09-04）", labelEn: "Payments Dive (2026-09-04)", href: "https://www.paymentsdive.com/news/ramp-takes-on-ai-expense/829642/", primary: false },
        ],
      },
    ],
  },
  {
    vol: 1, range: "08/27 – 09/01", year: 2026,
    headlines: ["烏國跨境支付", "ECB 重評 TARGET", "澳洲 A2A 支付"],
    headlinesEn: ["Uzbekistan cross-border pay", "ECB re-plans TARGET", "Australia A2A payments"],
    stories: [
      { title: "烏國央行與螞蟻談跨境支付", titleEn: "Uzbekistan’s central bank talks cross-border payments with Ant Group", summaryEn: "At the Silk Road FinTech Forum the Central Bank of Uzbekistan discussed cross-border payment cooperation with Ant Group: easier payments for international visitors and better access to payment services for Uzbek citizens abroad, plus fintech talent development. So far only discussions; no product or launch date has been announced.", summary: "烏茲別克央行在絲路金融科技論壇與螞蟻集團討論跨境支付合作。焦點包括讓國際旅客付款更便利，也改善烏國公民在海外使用支付服務的可近性。雙方同時談到金融科技人才培育，但目前只有合作討論，尚未公布產品或上線時程。", sources: [{ label: "烏茲別克央行新聞稿", labelEn: "Central Bank of Uzbekistan press release", href: "https://cbu.uz/en/press_center/releases/4444882/", primary: true }] },
      { title: "ECB 重評 TARGET 更新時程", titleEn: "ECB reassesses the TARGET release timeline", summaryEn: "After Swift postponed its 2026 standards update, the Eurosystem decided to reassess the November TARGET Services release. The ECB is still evaluating updating the system on schedule while delaying the retirement of unstructured addresses. The final timeline is not yet published; participants should watch for the decision.", summary: "Swift 延後 2026 年標準更新後，歐元體系決定重新評估 11 月 TARGET Services 發布時程。ECB 仍在評估如期更新系統、但延後停用非結構化地址的方案。最終時程尚未公布，參與機構需留意後續決定。", sources: [{ label: "ECB 公告", labelEn: "ECB announcement", href: "https://www.ecb.europa.eu/press/intro/news/html/ecb.mipnews260828.en.html", primary: true }] },
      { title: "澳洲推進 A2A 支付現代化", titleEn: "Australia pushes account-to-account payments modernisation", summaryEn: "The Reserve Bank of Australia’s Payments System Board reviewed the future of account-to-account payments, welcomed an industry vision and a roadmap. Open questions remain on the batch clearing system, resilience, pull payments and standardisation; if industry cannot coordinate, the Board encourages the RBA to consider further action.", summary: "澳洲央行支付系統委員會檢視帳戶對帳戶支付的未來，歡迎業界提出願景並推動路線圖。仍待解決批次清算系統去向、韌性、拉式付款與標準化等問題。若業界無法協調推進，委員會鼓勵央行考慮進一步行動。", sources: [{ label: "澳洲央行新聞稿", labelEn: "Reserve Bank of Australia media release", href: "https://www.rba.gov.au/media-releases/2026/mr-26-23.html", primary: true }] },
    ],
    note: "取自社群專案 2026-09-01 的實跑輸出；三則均來自事件主責央行或主管機關。",
  },
];

// ── 專案：簡報式呈現 ────────────────────────────────────────────────────
// 每個專案固定四張：痛點 → 解法 → 產品 → 影響，再加封面與 GitHub／Demo 連結。
// 每張有一個視覺：圖片、流程、數字或清單。進行中的專案標 status: "wip"。
export type SlideVisual =
  | { kind: "image"; src: string; alt?: string }
  | { kind: "flow"; steps: string[]; stepsEn: string[] }
  | { kind: "stats"; items: Array<[string, string, string]> }
  | { kind: "list"; items: string[]; itemsEn: string[] };
export type Slide = { kicker: string; kickerEn: string; title: string; titleEn: string; body: string; bodyEn: string; visual: SlideVisual };
export type ProjectDeck = { id: string; name: string; nameEn: string; tagline: string; taglineEn: string; tags: string[]; tagsEn: string[]; repo: string; demo?: string; owner: string; ownerEn: string; status: "done" | "wip"; cover: string; slides: [Slide, Slide, Slide, Slide] };

const K = {
  pain: ["痛點", "Pain point"], solution: ["解法", "Solution"], product: ["產品", "Product"], impact: ["影響", "Impact"],
} as const;

export const projectDecks: ProjectDeck[] = [
  {
    id: "course-scheduler", name: "政大排課", nameEn: "NCCU Course Scheduler",
    tagline: "實習友善的排課工具：AI 提方案，本地規則做最後把關。",
    taglineEn: "An internship-friendly course planner: AI proposes, local rules decide.",
    tags: ["AI", "產品", "開源"], tagsEn: ["AI", "Product", "Open source"], repo: "https://github.com/Hunter20041004/nccu-course-scheduler", demo: "https://hunter20041004.github.io/nccu-course-scheduler/", owner: "社員專案", ownerEn: "Member project", status: "done",
    cover: "/assets/projects/course-scheduler.jpg",
    slides: [
      { kicker: K.pain[0], kickerEn: K.pain[1], title: "選課要同時顧衝堂、資格、學分、實習空檔", titleEn: "Course selection means juggling conflicts, eligibility, credits and internship days", body: "政大 115-1 有 2,800 多門課。學生真正的痛點不是找課，是把「能不能修」「跟實習撞不撞」「學分夠不夠」一起算清楚——現有工具只幫你排時間。", bodyEn: "NCCU offers 2,800+ courses in 115-1. The real pain is not finding courses but working out eligibility, internship clashes and credit totals at once — existing tools only lay out the timetable.", visual: { kind: "stats", items: [["2,829", "門課程", "courses"], ["4", "個條件要同時成立", "constraints at once"], ["3", "個 AI 方案上限", "AI plans at most"]] } },
      { kicker: K.solution[0], kickerEn: K.solution[1], title: "AI 提案，規則裁決", titleEn: "AI proposes, rules decide", body: "模型產生候選課表；一個確定性的驗證器擋掉任何衝堂、不符資格、學分不足、動到鎖定課或實習日的方案。沒通過的方案永遠不會出現在使用者面前。", bodyEn: "The model generates candidate schedules; a deterministic validator rejects any plan with a conflict, an eligibility breach, too few credits, a changed locked course or an internship-day clash. Rejected plans are never shown.", visual: { kind: "flow", steps: ["輸入背景與偏好", "AI 產生最多三個方案", "本地規則驗證", "只顯示通過的方案"], stepsEn: ["Enter background and preferences", "AI generates up to three plans", "Local rules validate", "Only passing plans are shown"] } },
      { kicker: K.product[0], kickerEn: K.product[1], title: "從候選清單到手機桌布", titleEn: "From candidate list to phone wallpaper", body: "政大節次方格、官方課程庫搜尋（不需 API Key）、截圖匯入、實習時段規劃、匯出手機桌布課表。AI 功能用使用者自己的 Gemini 金鑰，伺服器什麼都不留。", bodyEn: "NCCU period grid, official course search (no API key), screenshot import, internship planning, and timetable export as a phone wallpaper. AI features use the user’s own Gemini key; the server keeps nothing.", visual: { kind: "image", src: "/assets/projects/course-scheduler.jpg" } },
      { kicker: K.impact[0], kickerEn: K.impact[1], title: "幻覺出來的課進不了課表", titleEn: "Hallucinated courses cannot reach the timetable", body: "「AI 提案、規則裁決」是一個可以複用的模式：模型負責發散，確定性程式負責守門。專案附完整測試與對政大課程系統的即時契約測試，任何人都能驗證。", bodyEn: "“AI proposes, rules decide” is a reusable pattern: the model diverges, deterministic code guards the gate. The project ships with full tests and a live contract test against NCCU’s course system, so anyone can verify it.", visual: { kind: "list", items: ["Unit tests 與 rendered HTML tests", "對政大課程系統的 live contract test", "GitHub Actions CI，每次提交都跑", "開源，可公開檢視"], itemsEn: ["Unit tests and rendered HTML tests", "Live contract test against NCCU’s course system", "GitHub Actions CI on every commit", "Open source, publicly reviewable"] } },
    ],
  },
  {
    id: "hextech-video", name: "Hextech Video Studio", nameEn: "Hextech Video Studio",
    tagline: "把《英雄聯盟》版本與賽事資料變成雙語短影音的內容工廠。",
    taglineEn: "A content factory that turns League of Legends patch and esports data into bilingual short videos.",
    tags: ["AI", "影音自動化", "Next.js"], tagsEn: ["AI", "Video automation", "Next.js"], repo: "https://github.com/Hunter20041004/lol-video-generator", owner: "社員專案", ownerEn: "Member project", status: "done",
    cover: "/assets/projects/hextech.jpg",
    slides: [
      { kicker: K.pain[0], kickerEn: K.pain[1], title: "資料每兩週更新，影片卻要一支一支手工做", titleEn: "Data updates every two weeks; videos are still made one by one", body: "遊戲版本改動與賽事結果是結構化的公開資料，但要變成能發到 Instagram、Threads 的短影音，得先讀資料、寫中英文腳本、排版、算圖、再排程發布——每一支都重來一次，而且很容易在某一步把數字抄錯。", bodyEn: "Patch changes and match results are structured public data, but turning them into short videos for Instagram and Threads means reading the data, writing a bilingual script, laying it out, rendering and scheduling — from scratch every time, with plenty of chances to copy a number wrong.", visual: { kind: "stats", items: [["2", "週一個版本", "weeks per patch"], ["2", "種語言", "languages"], ["5", "個手工步驟", "manual steps"]] } },
      { kicker: K.solution[0], kickerEn: K.solution[1], title: "一條從資料到發布的管線", titleEn: "One pipeline from data to publishing", body: "版本掃描 → 候選內容評分 → 中英文腳本 → Remotion 算圖 → 發布佇列。中間有一道「發布安全閘門」：素材不完整、資料來源降級或影片不存在時，會擋住正式發布，不會把半成品送出去。", bodyEn: "Patch scan → candidate scoring → bilingual script → Remotion render → publishing queue, with a safety gate in between: incomplete assets, degraded data sources or a missing video block the real publish, so half-finished work never goes out.", visual: { kind: "flow", steps: ["掃描版本與賽事資料", "評分挑出候選內容", "產生中英文腳本", "Remotion 算圖", "閘門檢查後排程發布"], stepsEn: ["Scan patch and esports data", "Score and pick candidates", "Generate bilingual scripts", "Render with Remotion", "Gate check, then schedule"] } },
      { kicker: K.product[0], kickerEn: K.product[1], title: "四個工作區合成一個 Next.js 工作台", titleEn: "Four workspaces in one Next.js workbench", body: "版本改動工廠、電競賽事、Meta 內容工廠、發布與成效控制台。不設定第三方金鑰也能瀏覽工作台與跑測試；實際 AI 分析、社群 OAuth 與發布需要各服務的合法憑證。", bodyEn: "Patch content factory, esports, meta content factory, and a publishing and insights console. The workbench and tests run without any third-party keys; real AI analysis, social OAuth and publishing need proper credentials.", visual: { kind: "image", src: "/assets/projects/hextech.jpg" } },
      { kicker: K.impact[0], kickerEn: K.impact[1], title: "資料層可重跑，失敗可以復原", titleEn: "A re-runnable data layer that recovers from failure", body: "snapshot、佇列與成效資料都存在本機資料層，中途失敗可以從上一步重來；unit、API 邊界、render 與可選的即時契約測試保護每一段。公開的示範影片使用明確標示的合成資料，不含真實玩家資料。", bodyEn: "Snapshots, queues and insights live in a local data layer, so a failed step can be re-run from the last good state; unit, API-boundary, render and opt-in live contract tests guard each stage. The public demo video uses clearly synthetic data, no real player data.", visual: { kind: "list", items: ["Unit、API boundary、render 測試", "可選的 live contract tests", "失敗復原與排程重跑", "示範影片為合成資料，已標示"], itemsEn: ["Unit, API-boundary and render tests", "Opt-in live contract tests", "Failure recovery and re-runnable scheduling", "Demo video uses labelled synthetic data"] } },
    ],
  },
  {
    id: "smart-album", name: "AI 表情相簿管家", nameEn: "Smart Album Cleaner",
    tagline: "本機執行的照片整理工具：用表情品質分類，配可還原的垃圾桶流程。",
    taglineEn: "A local photo-cleanup tool: expression-quality classification with a recoverable trash workflow.",
    tags: ["電腦視覺", "隱私", "FastAPI + Vue"], tagsEn: ["Computer vision", "Privacy", "FastAPI + Vue"], repo: "https://github.com/Hunter20041004/smart-album-cleaner", owner: "社員專案", ownerEn: "Member project", status: "wip",
    cover: "/assets/projects/smart-album.jpg",
    slides: [
      { kicker: K.pain[0], kickerEn: K.pain[1], title: "幾千張照片，哪些該刪？", titleEn: "Thousands of photos — which ones to delete?", body: "手機相簿裡大量閉眼、模糊、表情尷尬的照片。想清理，又怕誤刪；把照片丟上雲端服務整理，又不想讓私人照片離開電腦。", bodyEn: "Phone albums fill up with closed-eye, blurry and awkward shots. You want to clean up but fear deleting the wrong ones, and you don’t want private photos leaving your computer for a cloud service.", visual: { kind: "stats", items: [["1,000+", "張待整理", "photos to sort"], ["2", "個怕的事：誤刪、外流", "fears: wrong deletes, leaks"]] } },
      { kicker: K.solution[0], kickerEn: K.solution[1], title: "本機判斷，可還原地刪", titleEn: "Judge locally, delete reversibly", body: "MobileNetV3 在本機分析人臉表情品質，照片不離開電腦。刪除走 Trash 清單：先軟刪除、可還原，最後才移到系統垃圾桶。", bodyEn: "MobileNetV3 scores expression quality on the machine; photos never leave it. Deletion goes through a Trash list: soft-delete first, restorable, then the system trash.", visual: { kind: "flow", steps: ["選資料夾", "本機掃描與分類", "檢視結果", "軟刪除 → 可還原 → 系統垃圾桶"], stepsEn: ["Pick a folder", "Scan and classify locally", "Review results", "Soft-delete → restore → system trash"] } },
      { kicker: K.product[0], kickerEn: K.product[1], title: "FastAPI ＋ Vue 3 的本機應用", titleEn: "A local FastAPI + Vue 3 app", body: "後端限制主機、來源與可存取的照片根目錄；前端顯示掃描進度與結果。目前完整掃描流程支援 macOS。", bodyEn: "The backend restricts hosts, origins and accessible photo roots; the frontend shows scan progress and results. The full scan flow currently supports macOS.", visual: { kind: "image", src: "/assets/projects/smart-album.jpg" } },
      { kicker: K.impact[0], kickerEn: K.impact[1], title: "75.1% 準確率，並老實寫出它不代表什麼", titleEn: "75.1% accuracy — and an honest note on what it does not mean", body: "193 張標記測試集：Bad 召回率 82.8%、Good 召回率 67.0%。Model Card 明寫這不代表真實世界、子群體或身分辨識表現。", bodyEn: "193 labelled test images: Bad recall 82.8%, Good recall 67.0%. The model card states this does not establish real-world, subgroup or identity-recognition performance.", visual: { kind: "stats", items: [["75.1%", "測試集準確率", "test-set accuracy"], ["82.8%", "Bad 召回率", "Bad recall"], ["67.0%", "Good 召回率", "Good recall"]] } },
    ],
  },
];

// ── 研究文章：國內外較深度的研究，每篇附一句「在講什麼」與原文連結 ─────────────────
export type Paper = { title: string; titleEn?: string; authors: string; authorsEn?: string; venue: string; venueEn?: string; year: number; region: "intl" | "tw"; summary: string; summaryEn: string; href: string };
export const papers: Paper[] = [
  { title: "On the Rise of FinTech: Credit Scoring Using Digital Footprints", authors: "Tobias Berg, Valentin Burg, Ana Gombović, Manju Puri", venue: "The Review of Financial Studies", year: 2020, region: "intl", summary: "用你在網站上留下的「數位足跡」（裝置、作業系統、下單時間、email 網域）預測違約，準確度可以比得上傳統信用評分。這是「另類信用資料」最常被引用的一篇。", summaryEn: "Digital footprints left on a website — device, OS, time of order, email domain — predict default about as well as traditional credit scores. The most-cited paper on alternative credit data.", href: "https://www.nber.org/papers/w24551" },
  { title: "The FinTech Opportunity", authors: "Thomas Philippon", venue: "NBER Working Paper 22476", year: 2016, region: "intl", summary: "金融中介的成本一百多年來幾乎沒有下降。作者主張 FinTech 真正的機會不是把舊流程數位化，而是讓監理制度允許新進者用不同的方式提供服務。", summaryEn: "The cost of financial intermediation has barely fallen in a century. The real FinTech opportunity is not digitising old processes but a regulatory regime that lets new entrants serve differently.", href: "https://www.nber.org/papers/w22476" },
  { title: "BigTech and the changing structure of financial intermediation", authors: "Jon Frost, Leonardo Gambacorta, Yi Huang, Hyun Song Shin, Pablo Zbinden", venue: "BIS Working Papers No. 779", year: 2019, region: "intl", summary: "大型科技平台（阿里、騰訊、Mercado Libre）靠交易資料放款，在銀行分行少、法規執行弱的地方成長最快；它們的信用模型用的是平台資料而不是抵押品。", summaryEn: "Big tech platforms (Alibaba, Tencent, Mercado Libre) lend on transaction data and grow fastest where bank branches are scarce and enforcement weak; their credit models use platform data, not collateral.", href: "https://www.bis.org/publ/work779.htm" },
  { title: "The technology of retail central bank digital currency", authors: "Raphael Auer, Rainer Böhme", venue: "BIS Quarterly Review", year: 2020, region: "intl", summary: "把設計零售型 CBDC 的選擇整理成一棵決策樹：帳戶制或代幣制、直接或間接、集中或分散帳本。之後幾乎所有央行的 CBDC 報告都用這個框架。", summaryEn: "Organises the design choices for retail CBDC into a decision tree — account- or token-based, direct or indirect, centralised or distributed ledger — a framework almost every central bank report has since used.", href: "https://www.bis.org/publ/qtrpdf/r_qt2003j.htm" },
  { title: "中央銀行數位貨幣（CBDC）整備狀況、以及如何因應加密貨幣跨入金融市場", titleEn: "Taiwan’s CBDC readiness and the response to crypto entering financial markets", authors: "中央銀行", authorsEn: "Central Bank of the Republic of China (Taiwan)", venue: "立法院財政委員會專題報告", venueEn: "Report to the Legislative Yuan Finance Committee", year: 2022, region: "tw", summary: "央行向立法院說明台灣 CBDC 的兩階段概念驗證（批發型、通用型）、採「雙層式」架構的理由，以及對加密貨幣進入金融市場的立場。", summaryEn: "The central bank’s report to the Legislative Yuan on Taiwan’s two-phase CBDC proof of concept (wholesale, general-purpose), why a two-tier architecture was chosen, and its stance on crypto entering financial markets.", href: "https://www.cbc.gov.tw/tw/dl-178284-f4f6c762503e41a2a1a2fd6ba7184cd3.html" },
  { title: "國際間央行數位貨幣之最新發展趨勢", titleEn: "Recent international developments in central bank digital currency", authors: "中央銀行", authorsEn: "Central Bank of the Republic of China (Taiwan)", venue: "央行理監事會後記者會參考資料", venueEn: "Board meeting press briefing material", year: 2020, region: "tw", summary: "整理各國 CBDC 的動機、設計與進度，並說明台灣為什麼先做批發型再做通用型。適合當中文入門讀本。", summaryEn: "Surveys the motives, designs and progress of CBDC projects worldwide and explains why Taiwan started with wholesale before general-purpose CBDC. A good Chinese-language primer.", href: "https://www.cbc.gov.tw/dl-150533-c0f398c10ec44986add6b674677fc773.html" },
];
