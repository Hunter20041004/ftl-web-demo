// 留在程式裡、一年才改一次的資料：類別標籤、區塊鏈系列課程、幹部名單。
// 六類會變動的內容（週報、活動、資源、專案、洞察文章、合作對象）與學期設定在 content.remote.ts。
import type { CalendarKind } from "./content.schema.ts";
export type { CalendarKind } from "./content.schema.ts";

export const calendarKinds: Record<CalendarKind, { zh: string; en: string; tag: string }> = {
  lecture: { zh: "講座", en: "Lecture", tag: "tag" },
  workshop: { zh: "工作坊", en: "Workshop", tag: "tag tag--cyan" },
  reading: { zh: "英語讀書會", en: "English reading club", tag: "tag tag--warn" },
  social: { zh: "社團活動", en: "Social", tag: "tag tag--ok" },
  school: { zh: "全校行事", en: "University calendar", tag: "tag tag--ghost" },
};

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

// 幹部：姓名依社團提供的名單（原始資料即為遮罩形式）。手機與學號不上站。
export type Officer = { name: string; dept: string; deptEn: string };
export const leadership = {
  president: { name: "方○享", dept: "資管三", deptEn: "MIS, 3rd year" },
  vicePresident: { name: "何○文", dept: "日文三", deptEn: "Japanese, 3rd year" },
  departments: [
    { name: "專案開發部", en: "Projects", members: [{ name: "曾○庭", dept: "會計四", deptEn: "Accounting, 4th year" }, { name: "陳○安", dept: "資管三", deptEn: "MIS, 3rd year" }, { name: "劉○綺", dept: "資管二", deptEn: "MIS, 2nd year" }, { name: "藍○瀋", dept: "統計碩二", deptEn: "Statistics, MS 2nd year" }, { name: "王○問", dept: "交大管科三", deptEn: "Management Science (NYCU), 3rd year" }] as Officer[] },
    { name: "合作企劃部", en: "Partnerships & programs", members: [{ name: "朱○翊", dept: "資管四", deptEn: "MIS, 4th year" }] as Officer[] },
    { name: "品牌人資社群部", en: "Brand, people & community", members: [{ name: "曾○甫", dept: "國貿三", deptEn: "International Business, 3rd year" }, { name: "謝○裕", dept: "財管三", deptEn: "Finance, 3rd year" }] as Officer[] },
    { name: "企業關係部", en: "Corporate relations", members: [{ name: "胡○晟", dept: "風管三", deptEn: "Risk Management, 3rd year" }, { name: "曾○翔", dept: "金融碩三", deptEn: "Money and Banking, MS 3rd year" }, { name: "李○翰", dept: "國金碩二", deptEn: "International Finance, MS 2nd year" }] as Officer[] },
  ],
};
