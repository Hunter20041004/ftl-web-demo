# Supabase 每週備份 — 設計

日期：2026-09-15

## 問題
Supabase 免費方案沒有自動備份。已發布的文字內容每次重建會存進 `content.snapshot.json`（有 git 歷史），但**圖片（Storage）與未發布草稿**只在 Supabase 上一份。專案閒置 7 天會被暫停。

## 決策（2026-09-15 與使用者確認）
| # | 決定 | 理由 |
|---|---|---|
| 1 | 用官方 `supabase db dump` 倒整個資料庫（roles / schema / data 三個 SQL 檔） | 還原只要一個指令；新增表格不用改備份腳本。代價：需要新增 `SUPABASE_DB_URL` secret（含資料庫密碼，由使用者自行貼進 GitHub） |
| 2 | Storage bucket `media` 另外用 service key 全量下載 | `db dump` 不含圖片檔本身 |
| 3 | 備份存進私人 repo `Hunter20041004/ftl-web-backup` | 本 repo 是公開的，草稿與資料庫不能進來；git 歷史等於每週一版 |
| 4 | 每週日 03:00（台北）自動跑，也可手動觸發 | 內容變動是週報等級；順便讓免費專案不會閒置暫停 |
| 5 | workflow 放本 repo，用 deploy key 推到備份 repo | 程式碼跟主專案一起版本控制；deploy key 只對備份 repo 有效，不用開個人 token |
| 6 | 失敗靠 GitHub 內建的 workflow 失敗通知信 | 不另建通知管道 |

## 不做
- 不做自動還原；還原步驟寫在 `docs/社員交接手冊.md`。
- 不做保留期限清理；repo 接近 1GB 時再處理。

## 架構
```
.github/workflows/backup.yml（每週日）
  1. scripts/backup-storage.ts  → 喚醒專案、列出 media 全部檔案、下載到 backup/media/
  2. supabase db dump ×3        → backup/db/{roles,schema,data}.sql
  3. 驗證：data.sql 非空、圖片數 = 清單數
  4. 用 deploy key 把 backup/ commit + push 到 ftl-web-backup
```

## 測試
- 單元：`tests/unit/backup-storage.test.ts`——假的 list/download，驗證遞迴列出子資料夾、全部下載、下載失敗時整個腳本失敗（不可靜默略過）。
- 實測：手動觸發一次 workflow，確認備份 repo 出現三個 SQL 檔與圖片。
