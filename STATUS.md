# STATUS — FTL Website

## 正式站
`main` ＝ Glass V6（2026-09-13 合併），GitHub Pages：https://hunter20041004.github.io/ftl-web-demo/
- 部署：push 到 `main` 就由 `.github/workflows/pages.yml` build 並發布，約 2 分鐘。
- 只有這一個分支。舊的 redesign／preview 分支已於 2026-09-13 全部刪除。

## Glass V6（現行版本）
- Next.js 16 靜態匯出；決策：零硬線玻璃材質、Outfit ＋ Huninn、首屏 logo 線條動畫、七頁全部套用。
- spec：`docs/specs/2026-09-12-glass-v6-redesign-design.md`；交接：`HANDOFF.md`；週報格式：`docs/週報編輯規範.md`。

## 已退役的視覺方向（不要復活）
- 交易網絡（2026-09-11 ～ 09-12，已自 Next 版刪除）
- V2–V5 各 redesign 分支

## 技術棧
Next.js 16（static export）／React 19／TypeScript 5.9／Playwright 視覺測試／GitHub Actions 部署 GitHub Pages。
