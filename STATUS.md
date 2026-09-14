# STATUS — FTL Website

## 正式站
`main` ＝ Glass V6（2026-09-13 合併），GitHub Pages：https://hunter20041004.github.io/ftl-web-demo/
- 部署：push 到 `main` 就由 `.github/workflows/pages.yml` build 並發布，約 2 分鐘。
- 只有這一個分支。舊的 redesign／preview 分支已於 2026-09-13 全部刪除。
- 內容來源（2026-09-14 起）：六類內容與學期設定存在 Supabase（社團 Gmail 名下）；建站時 `scripts/pull-content.ts` 拉已發布資料成 `src/lib/content.snapshot.json`，並把圖片下載到 `public/media/`。沒有鑰匙的環境（本機、fork）沿用 repo 內快照，所以 `npm run dev` 不需要帳號。
- 後台管理系統：spec 在 `docs/specs/2026-09-14-admin-cms-design.md`，分三期；第 1 期（內容管線）與第 2 期（後台核心＋合作對象）已上線（2026-09-14）：`/admin/` Google 登入、合作對象編輯、發布→Edge Function→重建。第 3 期（其餘五類編輯器、學期設定、週報貼上拆解）已上線（2026-09-14）。六類內容與學期設定全部可在後台編輯。洞察文章已改為社團自撰長文（每篇獨立頁面，2026-09-14）。幹部教學：`docs/社員交接手冊.md`。

## Glass V6（現行版本）
- Next.js 16 靜態匯出；決策：零硬線玻璃材質、Outfit ＋ Huninn、首屏 logo 線條動畫、七頁全部套用。
- spec：`docs/specs/2026-09-12-glass-v6-redesign-design.md`；交接：`HANDOFF.md`；週報格式：`docs/週報編輯規範.md`。

## 已退役的視覺方向（不要復活）
- 交易網絡（2026-09-11 ～ 09-12，已自 Next 版刪除）
- V2–V5 各 redesign 分支

## 技術棧
Next.js 16（static export）／React 19／TypeScript 5.9／Playwright 視覺測試／GitHub Actions 部署 GitHub Pages。
