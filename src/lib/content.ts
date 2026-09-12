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

export type Resource = { kind: "job" | "scholarship" | "program" | "news"; kindZh: string; kindEn: string; title: string; titleEn: string; org: string; orgEn: string; summary: string; summaryEn: string; details?: string[]; detailsEn?: string[]; href?: string; contact?: string; deadline?: string };

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
  {
    kind: "news", kindZh: "產學", kindEn: "Industry", title: "八校聯盟攜手中信金控，打造金融科技創新實戰平台", titleEn: "Eight-university alliance and CTBC build a FinTech innovation platform", org: "今周刊", orgEn: "Business Today",
    summary: "政大金融科技研究中心主任王儷玲教授召集八校聯盟，與中國信託金控合作開設「金融科技趨勢與創新課程」並舉辦「金融科技創新提案競賽」。",
    summaryEn: "Professor Wang Li-Ling, director of the NCCU FinTech Research Center, convened an eight-university alliance with CTBC Financial Holding to run a FinTech Trends and Innovation course and a FinTech innovation proposal competition.",
    href: "https://www.businesstoday.com.tw/article/category/183017/post/202603170043/",
  },
];

export const partners = [
  { zh: "臺灣區塊鏈愛好者協會（TABEI）", en: "Taiwan Blockchain Enthusiasts Institute", sub: "區塊鏈基礎系列課程 共同主辦", subEn: "Co-host, Blockchain Foundations Series" },
  { zh: "好廣告數據", en: "Good Ads Data", sub: "第 3 週講座", subEn: "Week 3 lecture" },
  { zh: "市民永續", en: "City Sustainability", sub: "第 6 週講座", subEn: "Week 6 lecture" },
  { zh: "台灣金融研訓院", en: "Taiwan Academy of Banking and Finance", sub: "第 11 週講座", subEn: "Week 11 lecture" },
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
        summaryEn: "Circle, issuer of the USDC stablecoin, announced on September 8 an all-stock, $400 million acquisition of Singapore-based Tazapay. Tazapay handles business-to-business cross-border payments: over $25 billion in annualised volume, payout rails in more than 100 markets, and about 60% of volume already settled in stablecoins. Closing is expected in 2027, subject to approvals including the Monetary Authority of Singapore. Why it matters in Taiwan: the Virtual Asset Services Act passed in June, and the FSC chair said on September 2 that stablecoin rules could take effect as early as Q1 2027 — regulation is catching up with stablecoins turning from speculation into payment plumbing.",
        summary: "發行美元穩定幣 USDC 的 Circle 在 9 月 8 日宣布，以 4 億美元全股票交易收購新加坡的 Tazapay。Tazapay 做的是「企業之間的跨境收付款」，年化交易量超過 250 億美元，付款通路涵蓋 100 多個市場，其中約六成的交易量已經用穩定幣結算。交易預計 2027 年完成，還要經過新加坡金管局等監理機關核准。對台灣讀者的關係：台灣的《虛擬資產服務法》今年 6 月三讀通過，金管會主委 9 月 2 日表示穩定幣子法最快 2027 年第一季上路——穩定幣從「炒作標的」變成「付款管線」的趨勢，台灣的法規正在追上。",
        sources: [
          { label: "Circle 新聞稿（Business Wire，2026-09-08）", labelEn: "Circle press release (Business Wire, 2026-09-08)", href: "https://www.businesswire.com/news/home/20260908409825/en/", primary: true },
          { label: "Payments Dive 報導（2026-09-10）", labelEn: "Payments Dive (2026-09-10)", href: "https://www.paymentsdive.com/news/circle-buys-tazapay-for-400m/829956/", primary: false },
          { label: "Focus Taiwan：金管會主委談穩定幣子法時程（2026-09-02）", labelEn: "Focus Taiwan: FSC chair on the stablecoin rules timeline (2026-09-02)", href: "https://focustaiwan.tw/business/202609020014", primary: false },
        ],
      },
      {
        title: "Block 向美國 OCC 申請設立「只保管、不收存款」的信託銀行",
        titleEn: "Block asks the OCC for a custody-only national trust bank",
        summaryEn: "Block, parent of Square and Cash App, announced on September 8 an application to the OCC for Builders Bank & Trust, a national trust bank that takes no deposits and makes no loans, offering custody and fiduciary services including bitcoin and stablecoins. Block already owns a Utah industrial bank founded in 2021. After a May executive order told agencies to speed up fintech charter applications, Stripe, Circle, Revolut and PayPal took the same route. Why it matters in Taiwan: the FSC is piloting virtual-asset custody by banks this year, so the US approach is a reference point. Approval timing: not available.",
        summary: "Square 與 Cash App 的母公司 Block 在 9 月 8 日宣布，向美國聯邦金融監理機關 OCC 申請設立 Builders Bank & Trust，這是一家「國家信託銀行」：不收存款、不放款，專門提供保管與信託服務，包括保管比特幣和穩定幣。Block 目前已經有一家 2021 年成立的猶他州工業銀行。今年 5 月美國總統簽署行政命令要求加速金融科技公司的銀行執照申請後，Stripe、Circle、Revolut、PayPal 都走了同一條路。對台灣讀者的關係：金管會今年也在推動「虛擬資產保管業務試辦」，讓銀行替客戶保管虛擬資產——美國的做法是台灣可以對照的樣本。核准時程查不到。",
        sources: [
          { label: "Payments Dive 報導（2026-09-09，引 Block 新聞稿）", labelEn: "Payments Dive (2026-09-09, citing Block’s press release)", href: "https://www.paymentsdive.com/news/block-seeks-occ-bank-charter/829903/", primary: false },
          { label: "時報資訊：金管會 2026 金融科技雙主軸與保管業務試辦（2026-08-19）", labelEn: "China Times: FSC’s 2026 FinTech themes and custody pilot (2026-08-19)", href: "https://www.chinatimes.com/realtimenews/20260819001292-260410", primary: false },
        ],
      },
      {
        title: "金管會：7 月底電子支付帳戶使用者約 4,151 萬人",
        titleEn: "FSC: about 41.51 million e-payment accounts at end of July",
        summaryEn: "On September 10 the FSC published July figures: about 41.51 million e-payment account users, up roughly 380,000 from June. Monthly payment collection was about NT$33.01 billion (NT$29.65 billion in June), stored-value deposits about NT$33.5 billion, domestic and overseas small remittances about NT$18.01 billion, and outstanding balances about NT$20.09 billion. “E-payment” means accounts such as LINE Pay Money, JKOPay and EasyWallet that can store value and transfer. Why it matters in Taiwan: 41.51 million accounts exceed the population, so most people hold more than one; the monthly release is the most direct way to track mobile-payment growth.",
        summary: "金管會 9 月 10 日公布 7 月份統計：電子支付帳戶總使用者約 4,151 萬人，比上個月多約 38 萬人。當月代理收付實質交易款項約 330.1 億元（上月 296.5 億元），收受儲值款項約 335 億元，國內外小額匯兌約 180.1 億元，支付款項餘額約 200.9 億元。「電子支付」指的是 LINE Pay Money、街口、悠遊付這類可以儲值、轉帳的帳戶。對台灣讀者的關係：4,151 萬個帳戶已經超過台灣人口，代表多數人不只一個電支帳戶；這些數字每月公布一次，是觀察行動支付有沒有繼續成長最直接的來源。",
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
        summary: "金管會主委彭金隆 9 月 2 日在台北的亞洲金融科技聯盟（AFA）高峰會表示，《虛擬資產服務法》今年 6 月 30 日三讀通過後，金管會正在訂九項子法規，其中穩定幣的草案預計最快明年第一季公告實施。「穩定幣」是價格釘住某種法定貨幣（例如美元）的加密貨幣；台灣第一次為它的發行訂出法律架構。對台灣讀者的關係：之後在台灣發行穩定幣的業者要同時經過金管會與央行核准，這是判斷哪些穩定幣「合規」的第一個依據。子法規的正式內容還沒公布。",
        summaryEn: "At the Asia FinTech Alliance summit in Taipei on September 2, FSC chair Peng Jin-lung said that after the Virtual Asset Services Act passed on June 30, the FSC is drafting nine subsidiary regulations, and the stablecoin draft could be announced and take effect as early as Q1 2027. A stablecoin is a cryptocurrency pegged to a fiat currency such as the US dollar; this is Taiwan’s first legal framework for issuing one. Why it matters in Taiwan: issuers will need approval from both the FSC and the central bank — the first yardstick for which stablecoins count as compliant. The text of the rules is not yet published.",
        sources: [
          { label: "Focus Taiwan（中央社英文）報導（2026-09-02）", labelEn: "Focus Taiwan (CNA English), 2026-09-02", href: "https://focustaiwan.tw/business/202609020014", primary: false },
          { label: "Taipei Times 報導（2026-09-03）", labelEn: "Taipei Times (2026-09-03)", href: "https://www.taipeitimes.com/News/biz/archives/2026/09/03/2003863581", primary: false },
        ],
      },
      {
        title: "Stripe 延攬 Drew Turchin 負責穩定幣連結的支付卡業務",
        titleEn: "Stripe hires Drew Turchin to run stablecoin-linked payment cards",
        summary: "Payments Dive 9 月 3 日報導，Stripe 聘請曾任職 Native Markets 與 Uniswap Labs 的 Drew Turchin，負責「穩定幣連結的支付卡」：使用者的穩定幣餘額可以在任何收卡的地方直接刷。Stripe 2024 年 10 月以 11 億美元收購穩定幣平台 Bridge，今年 6 月又加入約 140 家公司共同宣布的 Open USD 穩定幣。Stripe 網站引用的研究顯示，穩定幣連結卡的月交易量在 2024 年達 15 億美元，前一年是 2.5 億美元。對台灣讀者的關係：這類卡在台灣還不能發行，要等穩定幣子法規（見上一則）定案。",
        summaryEn: "Payments Dive reported on September 3 that Stripe hired Drew Turchin, formerly of Native Markets and Uniswap Labs, to lead stablecoin-linked payment cards — cards that let a stablecoin balance be spent anywhere cards are accepted. Stripe bought the stablecoin platform Bridge for $1.1 billion in October 2024 and in June joined about 140 companies announcing the Open USD stablecoin. Research cited on Stripe’s site puts stablecoin-linked card volume at $1.5 billion a month in 2024, up from $250 million the year before. Why it matters in Taiwan: such cards cannot be issued here until the stablecoin rules above are finalised.",
        sources: [
          { label: "Payments Dive 報導（2026-09-03）", labelEn: "Payments Dive (2026-09-03)", href: "https://www.paymentsdive.com/news/stripe-taps-new-stablecoin-executive/829509/", primary: false },
        ],
      },
      {
        title: "Ramp 推出 Router：把公司花在 AI 上的錢納入費用管理",
        titleEn: "Ramp launches Router to bring corporate AI spending under expense controls",
        summary: "發企業卡與費用管理軟體的 Ramp 在 8 月 19 日推出 Router，讓公司看到自己在 OpenAI、Anthropic、Google 等各家模型上花了多少「代幣費」，依成本與速度把任務分派給不同模型，並像差旅費一樣設上限。Ramp 說自家的 AI 支出從 2025 年夏天到現在成長了 21 倍；同月 Stripe 以 75 億美元收購同類型的 OpenRouter。對台灣讀者的關係：「AI 用量」正在變成企業的一項固定支出，費用管理、企業卡與支付公司都在搶這塊；找實習或看產業時，這是一條新出現的產品線。",
        summaryEn: "Ramp, which issues corporate cards and expense software, launched Router on August 19: it shows what a company spends on tokens across OpenAI, Anthropic, Google and other models, routes tasks by cost and speed, and sets limits the way travel expenses are capped. Ramp says its own AI spend grew 21× since summer 2025; the same month Stripe bought the comparable OpenRouter for $7.5 billion. Why it matters in Taiwan: AI usage is becoming a fixed line item for companies, and expense, corporate-card and payments firms are competing for it — a new product line worth knowing when looking at internships or the industry.",
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
// 先用社員在 GitHub 上公開的專案當第一版；每個專案是一疊「投影片」，每張一個重點。
export type Slide = { kicker?: string; kickerEn?: string; title: string; titleEn: string; body?: string; bodyEn?: string; bullets?: string[]; bulletsEn?: string[]; stat?: [string, string]; statEn?: string };
export type ProjectDeck = { id: string; name: string; nameEn: string; tagline: string; taglineEn: string; tags: string[]; tagsEn: string[]; repo: string; demo?: string; owner: string; ownerEn: string; cover: string; slides: Slide[] };

export const projectDecks: ProjectDeck[] = [
  {
    id: "course-scheduler", name: "政大排課", nameEn: "NCCU Course Scheduler",
    tagline: "實習友善的排課工具：AI 提方案，本地規則做最後把關。",
    taglineEn: "An internship-friendly course planner: AI proposes, local rules decide.",
    tags: ["AI", "產品", "開源"], tagsEn: ["AI", "Product", "Open source"], repo: "https://github.com/Hunter20041004/nccu-course-scheduler", demo: "https://hunter20041004.github.io/nccu-course-scheduler/", owner: "社員專案", ownerEn: "Member project",
    cover: "https://opengraph.githubassets.com/1/Hunter20041004/nccu-course-scheduler",
    slides: [
      { kicker: "問題", kickerEn: "Problem", title: "選課要同時顧衝堂、資格、學分、實習空檔", titleEn: "Course selection means juggling conflicts, eligibility, credits and internship days", body: "政大 115-1 有 2,800 多門課。學生真正的痛點不是找課，是把「能不能修」「跟實習撞不撞」「學分夠不夠」一起算清楚。", bodyEn: "NCCU offers 2,800+ courses in 115-1. The real pain is not finding courses but working out eligibility, internship clashes and credit totals all at once." },
      { kicker: "做法", kickerEn: "Approach", title: "AI 提案，規則裁決", titleEn: "AI proposes, rules decide", body: "模型產生候選課表；一個確定性的驗證器擋掉任何衝堂、不符資格、學分不足、動到鎖定課或實習日的方案。沒通過的方案永遠不會出現在使用者面前，幻覺出來的課進不了課表。", bodyEn: "The model generates candidate schedules; a deterministic validator rejects any plan with a time conflict, an eligibility breach, too few credits, a changed locked course or an internship-day clash. Rejected plans are never shown; hallucinated courses cannot reach the timetable." },
      { kicker: "功能", kickerEn: "Features", title: "從候選清單到手機桌布", titleEn: "From candidate list to phone wallpaper", bullets: ["政大節次方格（A/B/1/2…/H）", "官方課程庫搜尋，不需 API Key", "截圖匯入、AI 推薦最多三個方案", "實習時段規劃：已確認／待確認分開算", "匯出手機桌布課表"], bulletsEn: ["NCCU period grid (A/B/1/2…/H)", "Official course search, no API key needed", "Screenshot import; up to three AI-recommended plans", "Internship planning: confirmed and pending slots counted separately", "Export the timetable as a phone wallpaper"] },
      { kicker: "隱私", kickerEn: "Privacy", title: "自帶金鑰，伺服器什麼都不留", titleEn: "Bring your own key; the server keeps nothing", body: "AI 功能用使用者自己的 Gemini API Key，只存在當前分頁；截圖與提示不落地。", bodyEn: "AI features use the user’s own Gemini API key, kept only in the current tab; screenshots and prompts are never stored." },
      { kicker: "品質", kickerEn: "Quality", title: "測試與 CI", titleEn: "Tests and CI", bullets: ["Unit tests、rendered HTML tests", "對政大課程系統的 live contract test", "GitHub Actions CI"], bulletsEn: ["Unit tests and rendered HTML tests", "Live contract test against the NCCU course system", "GitHub Actions CI"], stat: ["2,829", "門課程可查"], statEn: "courses searchable" },
    ],
  },
  {
    id: "design-thinking-ai", name: "Design Thinking × AI 作品集", nameEn: "Design Thinking × AI Portfolio",
    tagline: "從 Python 視覺化到神經網路、遷移學習與多模型協作的課程作業整理版。",
    taglineEn: "Coursework from Python visualisation to neural networks, transfer learning and multi-model orchestration.",
    tags: ["AI", "課程作業", "Notebook"], tagsEn: ["AI", "Coursework", "Notebook"], repo: "https://github.com/Hunter20041004/design-thinking-ai-portfolio", owner: "社員專案", ownerEn: "Member project",
    cover: "https://opengraph.githubassets.com/1/Hunter20041004/design-thinking-ai-portfolio",
    slides: [
      { kicker: "這是什麼", kickerEn: "What it is", title: "六本可在 Colab 打開的 Notebook", titleEn: "Six notebooks you can open in Colab", body: "政大「設計思考 × AI」課程與一門 MOOCs 深度學習課的作業，每本都有 Problem、Method、Results、Limitations 四節。", bodyEn: "Assignments from NCCU’s Design Thinking × AI course and a MOOC deep-learning course; each has Problem, Method, Results and Limitations sections." },
      { kicker: "內容", kickerEn: "Contents", title: "由淺到深", titleEn: "From basics up", bullets: ["01 函數與數學視覺化", "02 MNIST 神經網路（Gradio 介面）", "03 BTS 遷移學習分類器（ResNet50V2）", "04 多 LLM 辯論場", "05 Reflection Agent：Writer → Reviewer → Writer", "06 CNN 手寫數字分類"], bulletsEn: ["01 Function and math visualisation", "02 MNIST neural network (Gradio UI)", "03 BTS transfer-learning classifier (ResNet50V2)", "04 Multi-LLM debate arena", "05 Reflection agent: Writer → Reviewer → Writer", "06 CNN handwritten-digit classifier"] },
      { kicker: "方法", kickerEn: "Method", title: "把評估方法與安全邊界寫清楚", titleEn: "Evaluation method and safety boundaries made explicit", body: "驗證只用訓練資料切分、測試集只評一次；固定隨機種子；金鑰只從環境變數讀，不寫進 Notebook；公開版不含執行輸出與身分資訊。", bodyEn: "Validation uses only a training split; the test set is evaluated once; seeds are fixed; keys are read from environment variables, never written into notebooks; public copies contain no outputs or identity metadata." },
      { kicker: "誠實", kickerEn: "Honesty", title: "不編數字", titleEn: "No invented numbers", body: "只保留公開檔案撐得住的證據。Notebook 03 的曲線是課堂診斷，不是獨立測試結果；04、05 的範例輸出是作者手寫、明確標示的示範，不是模型輸出。", bodyEn: "Only evidence the public files support is kept. Notebook 03’s curves are classroom diagnostics, not an independent test; the examples in 04 and 05 are author-written, clearly labelled, not model output." },
    ],
  },
  {
    id: "smart-album", name: "AI 表情相簿管家", nameEn: "Smart Album Cleaner",
    tagline: "本機執行的照片整理工具：用表情品質分類，配可還原的垃圾桶流程。",
    taglineEn: "A local photo-cleanup tool: expression-quality classification with a recoverable trash workflow.",
    tags: ["電腦視覺", "隱私", "FastAPI + Vue"], tagsEn: ["Computer vision", "Privacy", "FastAPI + Vue"], repo: "https://github.com/Hunter20041004/smart-album-cleaner", owner: "社員專案", ownerEn: "Member project",
    cover: "https://opengraph.githubassets.com/1/Hunter20041004/smart-album-cleaner",
    slides: [
      { kicker: "問題", kickerEn: "Problem", title: "幾千張照片，哪些該刪？", titleEn: "Thousands of photos — which ones to delete?", body: "手機相簿裡大量閉眼、模糊、表情尷尬的照片。想清理，又怕誤刪。", bodyEn: "Phone albums fill up with closed-eye, blurry and awkward shots. You want to clean up but fear deleting the wrong ones." },
      { kicker: "做法", kickerEn: "Approach", title: "MobileNetV3 判斷表情品質，全程在本機", titleEn: "MobileNetV3 scores expression quality, entirely on your machine", body: "FastAPI 提供 API 與前端，Vue 3 顯示掃描進度與結果；照片不離開電腦。刪除走 Trash 清單：軟刪除、可還原、最後才移到系統垃圾桶。", bodyEn: "FastAPI serves the API and frontend; Vue 3 shows scan progress and results; photos never leave the computer. Deletion goes through a Trash list: soft-delete, restore, and only then the system trash." },
      { kicker: "證據", kickerEn: "Evidence", title: "75.1% 準確率，193 張標記測試集", titleEn: "75.1% accuracy on 193 labelled test images", body: "主觀的 Good／Bad 二分類：Bad 召回率 82.8%、Good 召回率 67.0%。Model Card 明寫這不代表真實世界、子群體或身分辨識表現。", bodyEn: "A subjective Good/Bad classification: Bad recall 82.8%, Good recall 67.0%. The model card states this does not establish real-world, subgroup or identity-recognition performance.", stat: ["75.1%", "測試集準確率"], statEn: "test-set accuracy" },
      { kicker: "安全", kickerEn: "Safety", title: "限制主機、來源與可存取的照片根目錄", titleEn: "Restricts hosts, origins and accessible photo roots", body: "以 weights_only=True 載入模型權重；目前完整掃描流程僅支援 macOS。", bodyEn: "Model weights load with weights_only=True; the full scan flow currently supports macOS only." },
    ],
  },
];
