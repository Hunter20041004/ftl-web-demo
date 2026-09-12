# STATUS — FTL Website

## 正式站
`main` ＝ 第一版靜態站（`fa033f0`），GitHub Pages：https://hunter20041004.github.io/ftl-web-demo/

## 進行中：Glass V6 改版（2026-09-12 起）
- 分支 `redesign/glass-v6`，基底是 Next.js 16 靜態匯出版（`rebuild/v1-on-new-architecture`）。
- 決策：零硬線玻璃材質、Outfit ＋ Huninn、首屏 logo 線條動畫、移除四個問題清單／數據列／交易網絡、七頁全部套用。
- spec：`docs/specs/2026-09-12-glass-v6-redesign-design.md`；交接：`HANDOFF.md`。
- 預覽：https://raw.githack.com/Hunter20041004/ftl-web-demo/preview-glass-v6/index.html

## 已退役的視覺方向（不要復活）
- 莫比烏斯（`assets/mobius.js`，只留給根目錄舊靜態頁）
- 交易網絡（2026-09-11 ～ 09-12，已自 Next 版刪除）
- V2–V5 各 redesign 分支

## 技術棧
Next.js 16（static export）／React 19／TypeScript 5.9／Playwright 視覺測試／GitHub Actions 建預覽分支。
