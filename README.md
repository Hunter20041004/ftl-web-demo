# 政大金融科技創新實驗室 — 官網

NCCU FinTech Innovation Lab 的網站。Next.js 靜態匯出，部署在 GitHub Pages。

線上版：**https://hunter20041004.github.io/ftl-web-demo/**

## 內容來源

站上的課程、招募時程、社費與出席獎勵、幹部名單、合作對象、職缺與獎學金，都來自社團提供的 115-1 學期資料；幹部姓名依社團提供的遮罩形式顯示，網站不放學號與電話。FinTech 週報每則都附來源連結，格式見 `docs/週報編輯規範.md`。

## 頁面

| 路徑 | 內容 |
|---|---|
| `/` | 首頁：我們是誰 → 重要時程（週曆）→ FinTech 週報 → 專案 → 合作對象 → 聯絡我們 |
| `/about/` | 成立資訊、指導單位、幹部、社員相關資訊（專案生／旁聽生）、常見問題 |
| `/events/` | 學期行事曆、講座、工作坊、英語讀書會、區塊鏈基礎系列課程 |
| `/projects/` | 專案牆，點一張看投影片（痛點／解法／產品／影響） |
| `/insights/` | FinTech 週報與研究文章 |
| `/resources/` | 職缺、獎學金、計畫、書單 |
| `/contact/` | LINE Bot、IG、Threads、Email、研究中心聯絡資訊 |

右上角可切中英文，選擇會記在瀏覽器裡。

## 在自己電腦上跑

```bash
npm install
npm run dev
```

打開 http://localhost:3000。改 `assets/v6.css` 之後要重新啟動 `npm run dev`（樣式檔在啟動時複製到 `public/assets`）。

## 測試與部署

```bash
npm test           # 型別檢查、lint、站內連結檢查
npx playwright test  # 前台視覺（四種寬度）＋後台 E2E（需 .env.local 有測試專案鑰匙，否則 skip）
npm run test:contract  # 連 Supabase 測試專案驗 RLS 與 Edge Function
```

推到 `main` 就會由 `.github/workflows/pages.yml` 建置並部署到 GitHub Pages，約兩分鐘生效。

## 內容怎麼更新

六類內容（週報、活動、資源、專案、研究文章、合作對象）與學期設定存在 Supabase。建站時 `scripts/pull-content.ts` 會拉已發布的資料、驗證格式、下載圖片，寫成 `src/lib/content.snapshot.json`；任何一筆不合格就不部署，前台維持舊版。

- 後台 https://hunter20041004.github.io/ftl-web-demo/admin/ ：用管理員名單上的 Google 帳號登入，改完按「發布」，約 2 分鐘上線。目前開放「合作對象」；其餘類別（週報、活動、資源、專案、研究文章、學期設定）第 3 期加入，在此之前仍可直接在 Supabase 後台改資料後手動跑一次 `Deploy to GitHub Pages`。
- 幹部操作說明：`docs/後台使用說明.md`。
- 幹部名單、指導單位、社團基本資料仍在 `src/lib/content.static.ts`，由工程師改。

## 檔案結構

```
src/lib/content.ts      門面：元件一律從這裡 import
src/lib/content.static.ts   留在程式裡的資料（幹部、區塊鏈課程、類別標籤）
src/lib/content.remote.ts   六類內容＋學期設定，讀 content.snapshot.json（由 Supabase 產生）
src/lib/content.schema.ts   內容的 zod schema（快照與資料庫共用同一形狀）
src/app/(admin)/            後台（/admin/，自己的 layout 與 admin.css）
src/components/admin/       後台元件；src/lib/admin/ 後台的資料存取
supabase/functions/         Edge Function trigger-rebuild（發布 → 重建）
scripts/pull-content.ts     建站時從 Supabase 拉內容、驗證、下載圖片、寫快照
scripts/seed-content.ts     一次性：把快照匯入 Supabase
supabase/                   資料庫 migration 與設定說明
src/components/         各頁與元件
assets/v6.css           唯一的樣式檔（設計代幣、玻璃卡、標籤、週曆…）
assets/                 logo、書封、合作對象 logo、專案封面、LINE QR
tests/visual/           Playwright 契約與視覺測試
docs/                   設計 spec、週報編輯規範、待確認清單
```
