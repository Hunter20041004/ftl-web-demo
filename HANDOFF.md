# HANDOFF — Glass V6 改版

## 這一輪在做什麼
使用者看過 Next.js 重建版後認為線條太生硬、與柔和漸層背景不搭，決定大改版。
設計決策全部在 `docs/specs/2026-09-12-glass-v6-redesign-design.md`，本檔只寫交接與驗收。

## 分支
- 只有 `main`。2026-09-13 使用者拍板後把 `redesign/glass-v6` 合併進來，其餘分支全部刪除。
- 正式站：push `main` → `.github/workflows/pages.yml` → https://hunter20041004.github.io/ftl-web-demo/
- 之後的修改開功能分支，測試通過後合併回 `main`（全域規則）。

## 視覺規則（取代舊的「V1 為準」）
- **零硬線**：不准用 1px 實線分層。卡片＝玻璃（`--glass`）＋內側高光（`--glass-hi`）＋柔陰影（`--shadow-soft`）。
- 色調沿用 V1 的變數，不新增主色。
- 字體：英文 Outfit、中文 Huninn（LINE Seed TC 不在 Google Fonts；若使用者提供字體檔，放 `assets/fonts/` 後把 `--f` 第一順位換回 LINE Seed TC）。
- 一頁只有一個主角動畫：首頁是 logo 線條畫入（`LogoDraw`）。其他只做進場淡入、hover 微浮 4px、社團宗旨的捲動填色。
- 莫比烏斯與交易網絡兩套裝飾都已退役，不要從舊分支撿回來。

## 檔案地圖
- `assets/v6.css` — 唯一的樣式表（`ftl.css` 只給根目錄舊的靜態 HTML 用，Next 版不再載入）
- `src/components/visual/LogoDraw.tsx` — 首屏 logo 動畫；骨架路徑座標系＝`ftl-logo.png` 的 733×692
- `src/components/runtime/MotionEnhancements.tsx` — 捲動填色
- `tests/visual/glass-v6.spec.ts` — 視覺契約；`routes.spec.ts` — 七頁四視口無橫向捲軸

## 驗收關卡
1. `npm test`（typecheck ＋ lint）
2. `npm run test:visual`（48 個案例：7 頁 × 4 視口 ＋ glass-v6 契約 × 4 視口）
3. `npm run build` 靜態匯出成功
4. 1280×800 與 375×812 截圖自檢通過（見 spec 檢查清單）
5. 預覽網址開得起來、console 無錯

## 內容
- 2026-09-12 起站上內容全部來自社團文件，集中在 `src/lib/content.ts`；來源與待確認項目見 `docs/內容待確認清單.md`。
- 版面歸屬（使用者 2026-09-12 指定）：入社資訊放「關於我們」、課程內容放「活動」；「專案」與「洞察」兩頁維持原本內容不動。
- 文案原則：直接講事實，不做標語式的一句話；區塊標題只留名稱；藍色強調字用 `--g-brand` 漸層。
- 標語只有一個：「金融 × 科技 × 產學 × 實作」。品牌英文名依使用者決定維持現狀（logo「FinTech Lab NCCU」、站上「NCCU FinTech Innovation Lab」）。
- 專案頁＝`SlideDeck`（每專案一疊投影片，資料在 `content.ts` 的 `projectDecks`）；洞察頁＝週報（`weekly`），新一期照 nccu-fintechlab-social 的 `docs/週報-Prompt.md` 產出後加到陣列最前面。
- 分享縮圖 `assets/og.png`（1200×630）；favicon `src/app/icon.png`；書封 `assets/books/`（Open Library）。
- 英文：長文都有 `*En` 欄位，元件用 `data-en` 帶出；`SiteInteractions` 的 MutationObserver 會把切換身份／翻週／翻投影片時新產生的節點也翻成英文。
- 首頁順序：首屏 → 我們是誰（五種形式）→ 重要時程 → FinTech 週報 → 專案 → 合作對象 → 聯絡我們。每段都是摘要，細節在內頁。


## CMS 第 1 期（內容管線）— 2026-09-14

計畫：`docs/plans/2026-09-14-cms-plan-1-content-pipeline.md`。Task 1–9 程式全部完成、`npm test` 與 80 個視覺測試全綠。

全部接上（2026-09-14）：
- Supabase 組織「政大金融創新實驗室」（社團 Gmail）：正式專案 `xesxfcqtbzmlanyvdeys`（首爾）、測試專案 `ftl-web-test` `bpadohdiuvbimvkwpecv`（孟買）。兩邊都跑過 migration、管理員＝社團 Gmail、seed 完成。
- 鑰匙：GitHub secrets `SUPABASE_URL`／`SUPABASE_SERVICE_KEY`／`SUPABASE_TEST_*`；本機 `.env.local`（gitignore）。用的是新格式 `sb_publishable_…`／`sb_secret_…`。
- 驗證：契約測試 3/3；pull-content 實跑；Playwright 80；正式站 pipeline 從 Supabase 拉到 3 期／16 活動／…；端到端「改合作對象名稱 → 重建 → 正式站出現 → 改回」通過。
- Google 登入已設好（2026-09-14）：Google Cloud 專案 `ftl-web`（社團 Gmail 名下）、OAuth 用戶端「Supabase (ftl-web)」、redirect 指向 Supabase callback；Supabase 正式專案 Google provider Enabled，Site URL 與 redirect 白名單＝`…/ftl-web-demo/admin/**` 與 `http://localhost:3000/admin/**`。Client ID/Secret 在 `.env.local`。
- Google OAuth 目前是「測試」狀態：只有測試使用者名單上的帳號能登入（已加社團 Gmail 與 weiwsxwsx@gmail.com，上限 100 人）。要對所有幹部開放而不用逐一加名單，得在 Google Auth Platform「品牌」頁補首頁與隱私權政策連結後按「發布應用程式」（只用 email/profile 範圍，不需審核）——第 2 期做後台時順便做一頁 /privacy/。


## CMS 第 2 期（後台核心＋合作對象）— 2026-09-14

計畫：`docs/plans/2026-09-14-cms-plan-2-admin-core.md`。Task 1–5 完成。
- 後台 `/admin/`：`src/app/(admin)`（自己的 root layout＋admin.css，視覺沿用前台）、`src/components/admin`、`src/lib/admin`。
- 發布鏈：`supabase/functions/trigger-rebuild`（部署在測試與正式專案；測試專案設 `REBUILD_DRY_RUN=true`）；GitHub fine-grained token 只在 Supabase secrets 與 `.env.local`（`GITHUB_DISPATCH_TOKEN`）。
- 測試：後台 E2E 6 條（`tests/admin`，測試專案 email 帳號 `scripts/setup-test-users.ts`）、契約 6 條、單元 20、前台視覺 80。CI 的 next-ci 跑全部（含 admin E2E，用 TEST secrets）。
- 本機開發：`.env.local` 的 `NEXT_PUBLIC_SUPABASE_*` 指向測試專案；正式 build 由 pages.yml 用 secrets 注入正式專案。
- 第 3 期要做：週報／活動／資源／專案／研究文章編輯器、學期設定、已刪除擴到全類別、Google OAuth 從測試模式發布（品牌頁填首頁與 /privacy/）。
