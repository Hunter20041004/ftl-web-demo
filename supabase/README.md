# Supabase 設定（由使用者用社團 Gmail 操作）

正式與測試各建一個專案，步驟相同（免費方案可開兩個專案）。

1. https://supabase.com 用社團 Gmail 註冊 → New project：名稱 `ftl-web`（測試用 `ftl-web-test`）、Region 選 Northeast Asia (Tokyo)、資料庫密碼請存進社團密碼管理處。
2. 左側 SQL Editor → New query → 貼上 `supabase/migrations/0001_init.sql` 全文 → Run。看到 `Success` 即可。
3. 再開一個 query，把社團 Gmail 放進管理員名單：
   `insert into admins (email, added_by) values ('nccufintechlab@gmail.com', 'setup');`
4. 左側 Authentication → Providers → Google：Enable，照畫面說明去 Google Cloud Console 建 OAuth Client（授權的 redirect URI 就貼 Supabase 畫面給的那一串），把 Client ID / Secret 貼回來。（第 2 期後台才會用到，可以先做）
5. Authentication → URL Configuration：Site URL 填 `https://hunter20041004.github.io/ftl-web-demo/admin/`，Redirect URLs 加同一個網址。
6. 左側 Project Settings → API：把 `Project URL`、`anon public` key、`service_role` key 三個值交給工程師（service_role 只放 GitHub secrets；交完可在 API 頁 rotate）。

工程師接著會：把 URL 與 service key 放進 GitHub repo 的 Secrets（`SUPABASE_URL`、`SUPABASE_SERVICE_KEY`；測試專案為 `SUPABASE_TEST_URL`、`SUPABASE_TEST_ANON_KEY`、`SUPABASE_TEST_SERVICE_KEY`），跑 `scripts/seed-content.ts` 匯入現有內容。
