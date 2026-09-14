# 後台管理系統（CMS）設計

日期：2026-09-14　狀態：待使用者審閱
前置：Glass V6 前台已上線（`main`，GitHub Pages）。

## 1. 目的

讓不會寫網站的幹部，透過後台表單新增／修改內容，2 分鐘內出現在前台，全程不碰程式碼、不找工程師。

## 2. 範圍

### 後台管理的內容（六類＋一組設定）

| 類別 | 說明 |
|---|---|
| 週報 | 期數＋每期三則新聞 |
| 活動 | 學期行事曆的每一場（講座／工作坊／英語讀書會／社團活動／全校行事） |
| 資源 | 職缺／獎學金／計畫／書 |
| 專案 | 專案牆（封面＋四張投影片） |
| 研究文章 | |
| 合作對象 | 名稱＋logo＋連結，可排序 |
| 學期設定 | 目前學期代號、開學日、上課日；招募時程（書審、公告、面試、放榜）、社費、出席獎勵金級距、常見問題 |

### 留在程式裡（每年改一次，由工程師改）

幹部名單、指導單位資訊、社團基本資料（成立日期、標語、聯絡方式）。

### 第一版不做

審核流程、分部門權限、後台內建 AI 產草稿、一鍵翻譯、後台即時預覽前台排版、每筆內容的版本歷史。

## 3. 已拍板的決定

| # | 決定 | 理由 |
|---|---|---|
| 1 | 使用者：5–10 個幹部，每年換屆；人人權限相同 | 分權限要多做審核流程，第一版不需要 |
| 2 | 所有服務帳號掛社團 Gmail | 換屆交接不斷線 |
| 3 | 零費用：Supabase 免費方案＋GitHub Pages＋GitHub Actions | 社團流量遠低於免費上限 |
| 4 | 前台維持靜態；發布後自動重建，約 2 分鐘上線 | 最穩、最便宜；Supabase 當機前台不受影響 |
| 5 | 週報用「貼一整段 → 自動拆欄位 → 逐格修」 | 一期 40 幾格手填太重；Prompt 改成輸出固定格式 |
| 6 | 中英文都必填才能發布 | 英文版永遠完整 |
| 7 | 只有新項目能存草稿；已發布的項目一編輯就是直接發布（有確認框） | 單一版本，簡單 |
| 8 | 「目前學期」是後台設定；活動標學期，前台只顯示目前學期 | 換學期不用改程式 |
| 9 | 讀書會活動自帶書名／作者／封面／簡介，與資源頁的書互相獨立 | 使用者決定 |
| 10 | 週報每則另填 ≤12 字短標 | 短標是編輯工作，不用標題截斷 |
| 11 | 專案投影片四種視覺（圖片／流程／數字／清單）都支援 | 流程與數字是投影片好看的原因 |
| 12 | 合作對象可拖曳排序；有「logo 已含名稱，不另顯示文字」勾選 | 順序有社交意義 |
| 13 | 職缺／獎學金／計畫有選填的截止日；到期自動不進前台，後台標灰 | 掛著已截止的職缺觀感最差 |
| 14 | 後台放在同一個 GitHub Pages 的 `/admin/` | 少一個帳號；有網域後前後台一起換 |
| 15 | 專案可拖曳排序，首頁顯示前 3；週報首頁顯示最新 3 期 | 首頁主打什麼由人決定 |
| 16 | 改壞了靠每次重建 commit 的內容快照救回（由工程師操作） | 版本歷史等頻繁編輯再做 |
| 17 | 刪除為軟刪除，後台「已刪除」可還原 | 誤刪可救 |

## 4. 架構

```
幹部 ─Google 登入─▶ 後台 /admin/（靜態 SPA，Next.js＋Tailwind＋shadcn/ui）
                        │ 讀寫（Supabase JS client，公開 anon key）
                        ▼
                  Supabase（Postgres 資料庫＋Auth＋Storage）
                        │ 發布時呼叫 Edge Function trigger-rebuild
                        ▼
                  GitHub Actions pages.yml（repository_dispatch）
                        │ scripts/pull-content.mjs：拉已發布內容、驗證、下載圖片、寫 snapshot
                        ▼
                  前台（GitHub Pages，網址不變）
```

原則：
- 前台只在重建當下讀 Supabase 一次；執行期完全不依賴它。
- 後台是純靜態網頁，沒有伺服器；權限靠 Supabase 的 Row Level Security（RLS，資料庫列級權限）。
- 秘密分佈：GitHub 鑰匙只在 Supabase 秘密區；Supabase service key 只在 GitHub Actions secrets；瀏覽器只有 anon key。

## 5. 資料模型

所有表共用欄位：`id`（uuid）、`created_at`、`updated_at`、`updated_by`（email）、`status`（`draft`｜`published`）、`deleted_at`（軟刪除）。文字欄位一律成對：`xxx_zh`、`xxx_en`。

| 表 | 欄位 |
|---|---|
| `settings`（單列） | `semester`（如 115-1）、`semester_start`、`meeting_day`、招募時程四段（起迄日）、`fee`、`reward_tiers`（json）、`faq`（json）、`payment`（zh/en） |
| `weekly_issues` | `vol`（唯一）、`range_start`、`range_end`、`lede` |
| `weekly_stories` | `issue_id`、`position`（1–3）、`headline`（短標 ≤12）、`title`、`lede`、`facts`（json 陣列）、`context`、`quote`、`quote_by`、`why`、`taiwan`、`watch`（json 陣列）、`term`（選填）、`sources`（json：label/href/primary） |
| `events` | `semester`、`week`、`date`、`kind`、`title`、`note`、`counts_reward`；講座：`speaker`、`speaker_role`、`speaker_org`、`abstract`、`bio`（json）；工作坊：`goal`、`modules`（json）；讀書會：`book_title`、`book_author`、`book_cover`、`book_synopsis`、`book_topics`（json） |
| `resources` | `kind`（job/scholarship/program/book）、`title`、`org`、`body`、`href`、`deadline`（選填）、`cta`；書：`author`、`cover`、`synopsis`、`topics`（json） |
| `projects` | `name`、`tagline`、`owner`、`state`（done/wip）、`tags`（json）、`cover`、`github`、`demo`、`position`、`slides`（json：固定 4 張，各含 kicker/title/body/visual） |
| `papers` | `title`、`authors`、`venue`、`year`、`summary`、`href`、`topic` |
| `partners` | `name`、`logo`、`href`、`position`、`mark_only` |
| `admins` | `email`（唯一）、`added_by`、`added_at` |

圖片：Supabase Storage bucket `media`，上傳時前端縮圖（logo 最長邊 400px、封面 1200px、書封 600px），存路徑到對應欄位。

RLS：所有表 `select/insert/update/delete` 只允許 `auth.email()` 在 `admins` 表內的使用者；`admins` 表本身同規則（任何管理員可加減）。Storage 同規則。service key 只給重建腳本，僅讀。

## 6. 後台頁面

登入：只有 Google 登入。登入後 email 不在 `admins` → 顯示「這個帳號沒有權限，請聯絡社長」並登出。

| 頁 | 內容 |
|---|---|
| 總覽 | 最近一次重建（時間、狀態：進行中／成功／失敗＋原因）、六類筆數與草稿數、「目前學期」設定入口 |
| 週報 | 期數清單 → 一期三則。新增：先「貼上整份週報」→「拆解」→ 三則表單（拆不出的欄位留空標黃）→ 存草稿／發布。系統自動建議下一期期數與本週日期範圍 |
| 活動 | 依學期＋週次排序；新增先選類型，表單依類型顯示欄位；可切換學期檢視 |
| 資源 | 類型篩選；書顯示封面縮圖；過期項目標灰 |
| 專案 | 可拖曳排序的卡片；編輯頁＝封面分頁＋四張投影片分頁；每張選視覺類型再填 |
| 研究文章 | 清單＋表單 |
| 合作對象 | 可拖曳排序；上傳 logo 即顯示；mark_only 勾選 |
| 學期設定 | 表單 |
| 管理員 | email 清單，加減 |
| 已刪除 | 六類軟刪除項目，可還原 |
| 說明 | 給幹部的操作說明（截圖＋步驟） |

共用行為：
- 表單右上「存草稿」「發布」；發布時檢查必填（含英文），缺格標紅並捲到第一個。
- 已發布項目的編輯頁只有「發布」（按下前確認「這會直接上線」）。
- 自動存草稿（30 秒）；僅對新項目。
- 發布成功 → 「已送出重建，約 2 分鐘後上線」＋前台連結。
- 手機可用，主要按桌機設計。介面中文。

週報貼上格式（Prompt 改成輸出這個）：
```
【本期一句話】…
---
【短標】…
【標題】…
【一句話】…
【重點】
- …
【背景】…
【說法】…｜誰說的
【為什麼重要】…
【台灣視角】…
【接下來】
- …
【名詞】…（可省略）
【來源】
- 標籤｜https://…｜一手
---
（第二則、第三則同上）
```
每個欄位有中英兩份：`【標題】` 與 `【Title】` 之類的英文標記成對出現。

## 7. 發布流程

1. 後台寫入 Supabase（`status=published`）。
2. 後台呼叫 Edge Function `trigger-rebuild`（帶使用者 JWT）；函式驗證 email 在 `admins`，再用 GitHub token 送 `repository_dispatch`（event `content-updated`）。
3. `pages.yml` 新增觸發 `repository_dispatch`；build 前執行 `scripts/pull-content.mjs`。
4. 後台總覽每 15 秒查 GitHub API 最近一次 `pages.yml` run 的狀態。

`pull-content.mjs`：
- 先打一次 Supabase 喚醒（免費專案閒置會暫停），失敗重試 3 次（間隔 20 秒）。
- 拉六類 `status=published AND deleted_at IS NULL`；資源另過濾 `deadline >= today`；活動只取 `semester = settings.semester`。
- 用 zod 驗證每筆（必填、中英成對、圖片可下載）；任一筆失敗 → 腳本失敗 → 不部署。
- 圖片下載到 `public/media/`，路徑改成本地。
- 寫 `content.snapshot.json` 並 commit 回 `main`（bot 帳號、`[skip ci]`）。
- 沒有 Supabase 鑰匙時（本機）直接用 repo 內的快照。

防呆：`cancel-in-progress` 只跑最新一次；拉資料失敗不部署，前台維持舊版；工程師 push 走同一流程。

## 8. 前台改法

- `src/lib/content.ts` 拆成 `content.static.ts`（幹部、指導單位、社團基本資料）與 `content.remote.ts`（讀 `content.snapshot.json`，型別由 zod schema 推導）。
- 畫面元件不改；只改資料來源。
- 首頁週報＝最新 3 期；專案＝`position` 前 3；資源頁自動排除過期；活動頁與週曆只顯示目前學期。
- 第一次上線前把現有 `content.ts` 內容全部匯入 Supabase（腳本 `scripts/seed-content.mjs`），用現有 80 個測試證明前台一模一樣。

## 9. 測試

- **後台 E2E（Playwright）**：登入被拒／通過；每類新增→存草稿→發布→出現在清單；必填標紅；週報貼上拆解（固定輸入→固定欄位）；拖曳排序；軟刪除還原。用獨立的 Supabase 測試專案。
- **pull-content 單元測試**：假的 API 回應 → 驗證擋壞資料、圖片下載失敗讓腳本失敗、過期資源被排除、非目前學期活動被排除。
- **契約測試**（連真的測試專案）：不在 `admins` 的登入者讀不到、寫不進任何表與 bucket；`trigger-rebuild` 拒絕非管理員。
- **前台**：現有 80 個測試改吃快照，全綠。
- **部署後驗證**：正式網址七頁可開、無 console 錯誤、發布一筆合作對象 → 2 分鐘內出現在首頁跑馬燈。

## 10. 上線順序

1. 使用者用社團 Gmail 建 Supabase 專案（正式＋測試各一）、開 Google OAuth（Google Cloud）、把 URL 與 anon key／service key 交給工程師；GitHub 建 fine-grained token（僅 `contents: write`＋`actions`）放進 Supabase 秘密區。
2. 建表、RLS、Storage、`admins` 放入社團 Gmail；`seed-content.mjs` 匯入現有內容。
3. 前台改吃快照，重建一次，測試全綠、正式站不變。
4. 後台骨架＋登入＋合作對象（最簡單的一類）→ 跑通整條鏈。
5. 依序：資源、研究文章、專案、學期設定、活動、週報（含貼上拆解）。
6. 幹部說明頁；把週報-Prompt 改成輸出固定格式。
7. 更新 README／STATUS／HANDOFF。

## 11. 風險與未定

- Supabase 免費專案閒置 7 天暫停：重建前喚醒＋重試；後台第一次開會慢幾秒。若實測不可靠，改成每週一次排程重建保持活躍。
- 圖片下載讓重建多幾十秒：可接受，實測後記錄。
- GitHub API 查重建狀態需要 token：後台用「公開 repo 的 Actions 狀態」免 token 讀取；若 rate limit 不夠，改由 Edge Function 代查。
- 網域：之後有網域時，Supabase 的 OAuth redirect 與 GitHub Pages 自訂網域各改一處。
