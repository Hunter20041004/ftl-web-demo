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

待使用者補做（依 `supabase/README.md`）：
- [ ] 建 Supabase **測試**專案，交付 `SUPABASE_TEST_URL`／`SUPABASE_TEST_ANON_KEY`／`SUPABASE_TEST_SERVICE_KEY` → 工程師跑 `npm run test:contract`（Task 5 Step 4）、`seed-content`（Task 7 Step 6）、`pull-content` 實跑（Task 8 Step 6）。
- [ ] 建 Supabase **正式**專案，交付 URL 與 service key → `gh secret set SUPABASE_URL` / `SUPABASE_SERVICE_KEY`（Task 9 Step 3），跑 seed，手動觸發一次 `pages.yml`，做端到端驗收（Task 9 Step 6）。

在那之前 `pages.yml` 走降級路徑（`keeping committed snapshot`），正式站內容不變。
