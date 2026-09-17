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
- Google OAuth 已發布（實際運作中）：任何在 admins 名單上的 Google 帳號都能登入，不需要測試使用者名單；品牌頁的首頁與隱私權連結指向正式站與 /privacy/。


## CMS 第 2 期（後台核心＋合作對象）— 2026-09-14

計畫：`docs/plans/2026-09-14-cms-plan-2-admin-core.md`。Task 1–5 完成。
- 後台 `/admin/`：`src/app/(admin)`（自己的 root layout＋admin.css，視覺沿用前台）、`src/components/admin`、`src/lib/admin`。
- 發布鏈：`supabase/functions/trigger-rebuild`（部署在測試與正式專案；測試專案設 `REBUILD_DRY_RUN=true`）；GitHub fine-grained token 只在 Supabase secrets 與 `.env.local`（`GITHUB_DISPATCH_TOKEN`）。
- 測試：後台 E2E 6 條（`tests/admin`，測試專案 email 帳號 `scripts/setup-test-users.ts`）、契約 6 條、單元 20、前台視覺 80。CI 的 next-ci 跑全部（含 admin E2E，用 TEST secrets）。
- 本機開發：`.env.local` 的 `NEXT_PUBLIC_SUPABASE_*` 指向測試專案；正式 build 由 pages.yml 用 secrets 注入正式專案。
- 第 3 期要做：週報／活動／資源／專案／研究文章編輯器、學期設定、已刪除擴到全類別、Google OAuth 從測試模式發布（品牌頁填首頁與 /privacy/）。


## CMS 第 3 期（其餘編輯器）— 2026-09-14

計畫：`docs/plans/2026-09-14-cms-plan-3-all-editors.md`。全部完成。
- 通用層：`src/lib/admin/collection.ts`（makeCollection）、`validate.ts`（zod → 欄位錯誤）、`media.ts`、`components/admin/fields`、`EntityPage.tsx`。新類別＝一個 form ＋ 一個 list 元件 ＋ 一個 route。
- 週報：`lib/admin/weekly.ts`（一期＝issue＋3 stories）、`weekly-parse.ts`（貼上拆解，單元測試）；格式 `docs/週報貼上格式.md`。
- 活動：`data` 也存 semester/week/date/kind（pull-content 以欄位為準並去掉重複鍵）。
- 測試：後台 E2E 12、單元 24、契約 7、視覺 80。（洞察文章後：E2E 16、單元 30、視覺 84）

## 極端測試與正式站驗證 — 2026-09-14（第 3 期上線後）

真的在正式站走過：合作對象改名→上線→改回；研究文章新增→上線→刪除→消失。六類都用「後台畫面→測試專案→pull→build→HTML」的整合腳本（`scripts/integration-admin-to-front.sh`）驗過會出現在前台。

這一輪抓到並修掉的（都是上線後才會炸的那種）：
1. 語言切換用 innerHTML 塞 data-en → 後台輸入 `<img onerror>` 會在訪客瀏覽器執行（stored XSS）→ 改純文字。
2. 正式站建置時跑的單元測試寫死了「6 篇研究文章」→ 幹部一新增就發布失敗 → 只驗格式。
3. 視覺測試同樣寫死筆數 → CI 隨內容變紅 → 從快照算。
4. pull-content 單一查詢碰到 Supabase Gateway Timeout 就整個失敗 → 每個查詢重試 3 次。
5. 六類全部刪光 → 洞察頁 build 崩 → 加空狀態（全空 build 已驗證）。
6. 非圖片檔上傳沒訊息、數字欄空白算 0、年份沒範圍、週報「下一期」在清單載入前算錯。

已知限制（沒修，要知道）：
- 發布觸發的重建若失敗，幹部只看到「重建失敗」，要再按一次發布；沒有自動重試整個 workflow。
- 圖片刪除項目後不會清 Storage 裡的檔（會慢慢累積，免費 1GB 很久才滿）。
- 沒有版本歷史；改壞了靠 git 裡的快照 commit 由工程師撈。
- GitHub Pages 本身偶爾短暫 503（實測遇到一次），與我們無關。

## 資安檢查 — 2026-09-14

實際探測（測試專案）：匿名讀 admins/settings → 0 列；匿名刪 Storage、非管理員改 settings → API 回 ok 但 RLS 靜默過濾、資料未變（已驗證）；非管理員自我加入 admins、上傳、觸發重建 → 全被擋；被移除的管理員舊 token 立即失效（RLS 每次查 admins）；偽造 JWT → 401。git 歷史無鑰匙；前台 bundle 只有 publishable key；npm audit 0；前台無第三方腳本。
本次補強：正式專案關 email/password 登入（只留 Google）；後台加 frame-busting。
接受的風險：Storage bucket 公開可列（都是前台要公開的圖）；GitHub Pages 無法設 CSP/X-Frame-Options；後台 session 存 localStorage（前台已無 innerHTML 注入點）；管理員彼此可加減（設計如此）；工程師這台 Mac 的 `.env.local` 存有全部鑰匙。

## 洞察文章改為社團自撰長文 — 2026-09-14

使用者決定：洞察文章是社團做研究後自己寫的詳細長文，不是外部論文連結。
- DB：`articles` 表（migration 0003，正式／測試皆套用）；舊 `papers` 表保留但程式已不用（可日後 drop）。
- 前台：`/insights/<slug>/` 每篇一頁（`src/app/(site)/insights/[slug]/page.tsx`），內文用 `src/lib/markdown.ts` 的安全子集（標題／段落／清單／引言／粗體／連結，無 innerHTML）；洞察頁卡片列表；英文內文選填。
- 後台：`/admin/articles/`（`ArticleForm`、`ArticlesList`）；已刪除／總覽同步。
- 上線時抓到：零篇文章時 `output: export` 拒絕產空的動態路由 → 正式站發布失敗一次（舊站未受影響）→ `src/lib/article-params.ts` 沒文章時產 `/insights/_none/` 佔位頁（單元測試＋全空 build 驗證）。
- 正式站實測：後台新增 `prod-test-article` → 上線 → 刪除 → 消失（見本節下方紀錄）。
- 文件：`docs/社員交接手冊.md`（給幹部的完整教學）、`docs/後台使用說明.md`、spec 變更紀錄。

## 聯絡頁去重＋部署保險調整 — 2026-09-16

- 聯絡頁下半段（Email 按鈕＋Instagram／Threads）與上方卡片內容完全重複，整段移除（`e1a801d`）。
- 使用者 2026-09-16 早上在後台把三個舊專案全部下架，準備換新專案；`tests/unit/pull.test.ts` 原本寫死「圖片至少 7 張」，CI 拉到 0 個專案就擋下部署。改成「快照列到的圖都要落地、至少有合作對象 logo」（`b170c49`），已模擬 0 專案通過。
- 正式站已驗證：聯絡頁無重複區塊、專案頁 0 筆時正常顯示（只有標題，無錯誤）、無 console 錯誤。
- 下一步：使用者在後台新增新專案並發布即可，不需再改程式。

## 使用者回饋三修 — 2026-09-17

使用者用手機實測後回報三個問題（`2fa9d53`）：
1. 幹部少一人：專案開發部加入王○問（交大管科三）。名單仍在 `src/lib/content.static.ts`（不在後台），沿用遮罩姓名、無英文名欄位（使用者拍板）。
2. 週報「短標」上限 14 字寫不下外商公司名：`src/lib/admin/weekly.ts` 改 24 字，後台提示與 `docs/週報貼上格式.md`、`docs/週報編輯規範.md` 同步為「建議 12 字內、最多 24 字」；單元測試 `tests/unit/weekly-headline.test.ts`。
3. 手機選單打開後被首屏標題與 logo 蓋住、點不到：`.sheet` 在 `#site-header` 裡，而 `#site-header` 與 `.page` 同為 `z-index:1`，後出現的 `.page` 壓過去 → `#site-header{ z-index:2 }`（`assets/v6.css`）。`tests/visual/mobile-menu.spec.ts` 用 `elementFromPoint` 驗每個選單項目都在最上層（桌機視口跳過）。

順手修的既有失敗：`glass-v6.spec.ts` 的「專案牆」寫死了已下架的 `course-scheduler`／`smart-album`，0 個專案時 CI 四個視口全紅 → 改從快照取第一／最後一個專案，0 個時跳過；有專案時用 `4d03559` 的舊快照驗過 4 視口通過。

環境備註：本機 `next dev` 若是在新增路由之前啟動的，會對新頁面回 404（這次 `/admin/articles/` 就是），後台 E2E 會卡在「找不到新增文章」；重開伺服器即可。視覺測試 4 工作程序同時打老舊的開發伺服器會出現動畫時序類的偶發失敗，`--workers=2` 穩定。

驗證：`npm test` 35/35、視覺 81 通過 7 跳過、後台 E2E 16 通過 1 跳過（需 TEST 鑰匙的那條）。
- 部署流程補強（同日）：回寫快照的 push 撞到兩個問題——建置期間有人推新 commit 會被拒（`14e95ce`）、建置會弄髒 `next-env.d.ts` 讓 rebase 拒跑（`1f7a871`）→ `git pull --rebase --autostash origin main` 再 push。正式站 https://hunter20041004.github.io/ftl-web-demo/ 已驗：關於頁有王○問、CSS 含 `#site-header{ z-index:2 }`、後台週報提示「最多 24 字」、手機視口選單 7 個項目都在最上層、console 無錯。
