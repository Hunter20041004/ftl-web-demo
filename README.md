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
npm run test:visual  # Playwright（四種寬度）
```

推到 `main` 就會由 `.github/workflows/pages.yml` 建置並部署到 GitHub Pages，約兩分鐘生效。

## 檔案結構

```
src/lib/content.ts      全站內容（課程、招募、週報、專案、資源）
src/components/         各頁與元件
assets/v6.css           唯一的樣式檔（設計代幣、玻璃卡、標籤、週曆…）
assets/                 logo、書封、合作對象 logo、專案封面、LINE QR
tests/visual/           Playwright 契約與視覺測試
docs/                   設計 spec、週報編輯規範、待確認清單
```
