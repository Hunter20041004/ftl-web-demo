# CMS 第 2 期：後台核心＋合作對象 實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 幹部用 Google 登入 `/admin/`，在「合作對象」頁新增／編輯／排序／刪除並按「發布」，2 分鐘後正式站更新。這是後台的骨架，第 3 期其餘編輯器照同一套模式加。

**Architecture:** 後台是同一個 Next.js 靜態匯出裡的 `(admin)` 路由群組（自己的 root layout、自己的 CSS，不吃前台的 `v6.css`）。全部是 client component，直接用 `@supabase/supabase-js` 讀寫（anon key＋使用者 JWT，權限靠 RLS）。發布＝寫 DB 後呼叫 Supabase Edge Function `trigger-rebuild`，它驗證管理員身分後用 GitHub token 送 `repository_dispatch`；同一個函式的 GET 回傳最近一次重建狀態。E2E 測試用「測試專案」＋ email/password 測試帳號（後台畫面只有 Google 按鈕，測試用 supabase-js 直接登入）。

**Tech Stack:** Next.js 16 static export、React 19、Tailwind v4＋shadcn/ui（既有 button）、@supabase/supabase-js 2、Supabase Edge Functions（Deno）、Playwright、Node 24 test runner、zod。

## Global Constraints

- 前台七頁與 80 個視覺測試不變；`npm test`（含單元測試）全綠才 commit。
- 後台所有站內連結與資源路徑走 `withBasePath()`；`scripts/check-internal-links.mjs` 涵蓋 `src/components/**`，後台元件也放在 `src/components/admin/**`。
- Supabase 連線資訊只從 `NEXT_PUBLIC_SUPABASE_URL`／`NEXT_PUBLIC_SUPABASE_ANON_KEY` 讀（build 時注入；anon key 設計上可公開）。沒設時後台顯示「尚未設定 Supabase」而不是白畫面。
- 不在瀏覽器出現任何 secret／service key／GitHub token。
- 介面中文；文案沒有備註式句子。基礎元件用 shadcn/ui（button、input、label、dialog、textarea、switch），不手刻。
- 圖片上傳前在瀏覽器縮圖：logo 最長邊 400px；SVG 原樣上傳。
- 決定 #7：已發布項目一編輯就是直接發布（確認框）；草稿只給新項目。
- 決定 #12：合作對象可拖曳排序、`mark_only` 勾選。
- 決定 #17：軟刪除、可還原。

---

## File Structure

| 檔案 | 責任 |
|---|---|
| `src/app/(site)/**` | 現有前台頁面與 root layout 搬進來（內容不變） |
| `src/app/(admin)/layout.tsx` | 後台 root layout：`admin.css`、字體、`<AdminShell>` |
| `src/app/(admin)/admin.css` | `@import "tailwindcss"`＋shadcn 代幣 |
| `src/app/(admin)/admin/page.tsx` | 總覽（重建狀態、各類筆數） |
| `src/app/(admin)/admin/partners/page.tsx` | 合作對象 |
| `src/app/(admin)/admin/admins/page.tsx` | 管理員名單 |
| `src/app/(admin)/admin/trash/page.tsx` | 已刪除 |
| `src/app/(site)/privacy/page.tsx` | 隱私權政策（Google 發布用） |
| `src/lib/admin/supabase.ts` | `getSupabase()` 單例；`hasSupabaseConfig()` |
| `src/lib/admin/auth.ts` | `useSession()`、`signInWithGoogle()`、`signOut()`、`useIsAdmin()` |
| `src/lib/admin/partners.ts` | 合作對象的讀寫：`listPartners`、`savePartner`、`reorderPartners`、`softDelete`、`restore`、`uploadLogo` |
| `src/lib/admin/rebuild.ts` | `triggerRebuild()`、`getRebuildStatus()`（呼叫 Edge Function） |
| `src/lib/admin/image.ts` | `resizeImage(file, maxEdge)`（純瀏覽器，canvas） |
| `src/components/admin/AdminShell.tsx` | 側欄＋登入閘（未登入→登入頁；非管理員→拒絕畫面） |
| `src/components/admin/PartnerForm.tsx` | 表單（中英名稱、連結、logo、mark_only）＋必填檢查 |
| `src/components/admin/PartnersList.tsx` | 可拖曳排序清單 |
| `src/components/admin/RebuildStatus.tsx` | 「已送出重建…」與狀態輪詢 |
| `src/components/ui/{input,label,dialog,switch,textarea}.tsx` | shadcn 元件 |
| `supabase/functions/trigger-rebuild/index.ts` | Edge Function |
| `supabase/migrations/0002_partners_validation.sql` | （無；合作對象用既有表） |
| `tests/unit/partner-validate.test.ts`、`tests/unit/image.test.ts`（節點無 canvas → 只測參數） | 單元 |
| `tests/admin/partners.spec.ts` | Playwright E2E（測試專案） |
| `playwright.config.ts` | 新增 `admin` project（單一桌機寬度、`tests/admin`） |

---

### Task 1: 路由群組拆分（前台不變）

- [ ] 把 `src/app/{layout.tsx,page.tsx,about,contact,events,insights,projects,resources,globals.css,icon.png}` 搬到 `src/app/(site)/`（`robots.ts`、`sitemap.ts`、`icon.png` 留在 `src/app/`，因為它們是全站的）。修正 `layout.tsx` 裡 `./globals.css` 的相對路徑（仍在同一層，不用改）。
- [ ] `npx tsc --noEmit -p . && npx playwright test --reporter=line | tail -1` → `80 passed`；`npm run build` 成功。
- [ ] Commit：`路由群組：前台搬進 (site)，為後台另一個 root layout 鋪路`

### Task 2: 後台 root layout、CSS、shadcn 元件、登入閘

**測試（先寫）** `tests/admin/auth.spec.ts`（新 Playwright project `admin`，`baseURL` 同前台）：
```ts
import { test, expect } from "@playwright/test";
const url = process.env.SUPABASE_TEST_URL, anon = process.env.SUPABASE_TEST_ANON_KEY;
test.skip(!url || !anon, "needs SUPABASE_TEST_*");

test("logged-out visitor sees the Google sign-in screen only", async ({ page }) => {
  await page.goto("/admin/");
  await expect(page.getByRole("button", { name: /Google 登入/ })).toBeVisible();
  await expect(page.getByText("合作對象")).toHaveCount(0);
});

test("a logged-in non-admin is rejected", async ({ page }) => {
  await page.goto("/admin/");
  await page.evaluate(async ({ url, anon }) => {
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const c = createClient(url, anon);
    await c.auth.signInWithPassword({ email: "outsider@test.local", password: "outsider-pass-123" });
  }, { url, anon });
  await page.reload();
  await expect(page.getByText("這個帳號沒有權限")).toBeVisible();
});
```
需要：測試專案開啟 Email provider（不用確認信），並用 service key 建兩個使用者 `outsider@test.local`（不在 admins）與 `editor@test.local`（在 admins）。放 `scripts/setup-test-users.ts`（service key，`auth.admin.createUser({ email, password, email_confirm: true })`＋`insert into admins`）。

**實作要點**
- `src/lib/admin/supabase.ts`：
  ```ts
  import { createClient, type SupabaseClient } from "@supabase/supabase-js";
  let client: SupabaseClient | null = null;
  export const hasSupabaseConfig = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  export function getSupabase() {
    if (!client) client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    return client;
  }
  ```
  E2E 裡的 `signInWithPassword` 用的是同一個 storage key（同 URL 的 supabase-js 預設 `sb-<ref>-auth-token`），所以 reload 後後台就是登入狀態。
- `src/lib/admin/auth.ts`：`useSession()` 用 `onAuthStateChange`；`useIsAdmin(email)` 查 `admins`（RLS 下非管理員查到 0 列＝拒絕）；`signInWithGoogle()` → `auth.signInWithOAuth({ provider: "google", options: { redirectTo: location.origin + withBasePath("/admin/") } })`。
- `AdminShell`：三態——未設定 Supabase／未登入（只有一顆「使用 Google 登入」）／已登入非管理員（「這個帳號沒有權限，請聯絡社長」＋登出）／管理員（側欄：總覽、合作對象、管理員、已刪除；右上 email＋登出）。
- 後台 layout 的 `<html lang="zh-Hant-TW">`、`admin.css`：`@import "tailwindcss"; :root{ --background:#F6F8FB; --foreground:#0B1F3A; --primary:#1668E3; ... }`；字體沿用 Outfit＋Huninn 的 Google Fonts link。
- shadcn 元件用 `npx shadcn@latest add input label dialog switch textarea`（若 CLI 需互動，手寫相同內容）。
- `playwright.config.ts` 加 project `admin`：`testDir: "tests/admin"`，viewport 1280×800；既有四個 project 的 `testDir` 改成 `tests/visual`（避免跑到 admin 測試）。`webServer.command` 改為 `npm run dev`（env 由 shell 帶進去）。
- Commit：`後台骨架：登入閘、側欄、admin.css；E2E 未登入／非管理員`

### Task 3: 合作對象——讀、寫、排序、刪除、還原、logo 上傳

**單元測試（先寫）** `tests/unit/partner-validate.test.ts`：
```ts
import { validatePartner } from "../../src/lib/admin/partners.ts";
test("publish requires zh, en, href; logo optional", ...)   // 缺 en → errors.en === "必填"
test("href must be http(s)", ...)
test("draft save skips required checks", ...)                // validatePartner(x, { draft: true }) → {}
```
**E2E（先寫）** `tests/admin/partners.spec.ts`：以 `editor@test.local` 登入 → 進「合作對象」→ 看到 seed 的 4 個 → 新增「測試夥伴」（中英、連結、上傳 `assets/partners/gad.svg`）→ 發布 → 清單出現且 `status=published`（用 service key 查 DB）→ 拖到第一個 → DB `position=0` → 刪除 → 進「已刪除」→ 還原。E2E 結束後用 service key 清掉測試建立的列。

**實作要點**
- `partners.ts`：
  ```ts
  export type PartnerRow = { id: string; position: number; status: "draft"|"published"; deleted_at: string|null; data: Partner };
  export async function listPartners(includeDeleted=false): Promise<PartnerRow[]>   // order position
  export function validatePartner(p: Partial<Partner>, opts?: { draft?: boolean }): Record<string,string>
  export async function savePartner(row: { id?: string; data: Partner; status: "draft"|"published"; position?: number }): Promise<PartnerRow>  // upsert
  export async function reorderPartners(ids: string[]): Promise<void>     // 逐筆 update position（<10 筆，不做 RPC）
  export async function softDeletePartner(id: string) / restorePartner(id: string)
  export async function uploadLogo(file: File): Promise<string>           // 縮圖 → storage.upload(`partners/${slug}-${Date.now()}.${ext}`) → 回 "/media/partners/..."
  ```
  `data.logo` 存 `/media/partners/x.ext`（跟 pull-content 的約定一致）。
- `image.ts`：`resizeImage(file, maxEdge)`：SVG 直接回傳；其他用 `createImageBitmap`＋canvas 輸出 `image/png`（有透明）或 `image/jpeg` 0.85。
- 拖曳排序：用原生 HTML5 drag events（不加套件）；每列有 `data-testid="partner-row"`。
- 表單：`PartnerForm`（shadcn input/label/switch）；必填錯誤標紅並 `scrollIntoView` 第一個。
- 「發布」按鈕：已發布項目編輯時先 `confirm`（shadcn dialog）「這會直接上線」。
- Commit：`合作對象：清單、表單、logo 上傳、拖曳排序、軟刪除與還原（E2E＋單元）`

### Task 4: 發布鏈——Edge Function `trigger-rebuild`＋狀態

**契約測試（先寫）** `tests/contract/trigger-rebuild.test.ts`（測試專案；`skip` 條件同 rls.test）：
- 沒帶 JWT → 401。
- 以 `outsider@test.local` 的 JWT → 403。
- 以 `editor@test.local` 的 JWT＋`{ dryRun: true }` → 200 `{ ok: true, dryRun: true }`（不真的打 GitHub）。
- GET 帶 editor JWT → 200 `{ status, conclusion, updatedAt, url }`（讀 GitHub Actions 最近一次 `pages.yml` run）。

**Edge Function** `supabase/functions/trigger-rebuild/index.ts`（Deno）：
```ts
import { createClient } from "npm:@supabase/supabase-js@2";
const REPO = "Hunter20041004/ftl-web-demo";
Deno.serve(async (req) => {
  const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, content-type", "Access-Control-Allow-Methods": "GET, POST, OPTIONS" };
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const auth = req.headers.get("Authorization") ?? "";
  if (!auth.startsWith("Bearer ")) return json({ error: "unauthenticated" }, 401, cors);
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: auth } } });
  const { data: { user } } = await sb.auth.getUser();
  if (!user?.email) return json({ error: "unauthenticated" }, 401, cors);
  const { data: admin } = await sb.from("admins").select("email").eq("email", user.email.toLowerCase()).maybeSingle();
  if (!admin) return json({ error: "forbidden" }, 403, cors);
  const gh = { Authorization: `Bearer ${Deno.env.get("GITHUB_TOKEN")}`, Accept: "application/vnd.github+json", "User-Agent": "ftl-admin" };
  if (req.method === "GET") {
    const r = await fetch(`https://api.github.com/repos/${REPO}/actions/workflows/pages.yml/runs?per_page=1`, { headers: gh });
    const run = (await r.json()).workflow_runs?.[0];
    return json(run ? { status: run.status, conclusion: run.conclusion, updatedAt: run.updated_at, url: run.html_url } : { status: "none" }, 200, cors);
  }
  const body = await req.json().catch(() => ({}));
  if (body.dryRun) return json({ ok: true, dryRun: true }, 200, cors);
  const r = await fetch(`https://api.github.com/repos/${REPO}/dispatches`, { method: "POST", headers: gh, body: JSON.stringify({ event_type: "content-updated", client_payload: { by: user.email } }) });
  return json({ ok: r.status === 204, github: r.status }, r.status === 204 ? 200 : 502, cors);
});
const json = (b: unknown, s: number, h: Record<string,string>) => new Response(JSON.stringify(b), { status: s, headers: { ...h, "Content-Type": "application/json" } });
```
- 部署：`npx supabase functions deploy trigger-rebuild --project-ref <ref>`（需要 `SUPABASE_ACCESS_TOKEN`，從 Supabase 帳號設定「Access Tokens」產生，存 `.env.local`）；`npx supabase secrets set GITHUB_TOKEN=... --project-ref <ref>`。GitHub token：fine-grained PAT，只給 `Hunter20041004/ftl-web-demo` 的 Contents: Read and write（`repository_dispatch` 需要）＋Actions: Read。**PAT 由使用者在 GitHub 建立**（或由工程師用 Chrome 在使用者確認下建立），值只進 Supabase secrets 與 `.env.local`。
- 測試專案與正式專案各部署一次；測試專案的 GITHUB_TOKEN 可用同一把（dryRun 不會真的打）。
- `rebuild.ts`：`triggerRebuild()` POST；`getRebuildStatus()` GET；都帶 `session.access_token`。
- `RebuildStatus.tsx`：發布後顯示「已送出重建，約 2 分鐘後上線」＋每 15 秒 GET 一次直到 `completed`，顯示 成功／失敗（附 run 連結）。總覽頁也顯示最近一次。
- Commit：`發布鏈：trigger-rebuild Edge Function（驗管理員、repository_dispatch、狀態查詢）＋後台狀態顯示`

### Task 5: 總覽、管理員、已刪除、隱私權頁、部署、端到端

- 總覽：六類筆數（`select count`）與草稿數、最近一次重建。
- 管理員頁：清單＋新增 email（小寫化）＋刪除（不能刪自己）。E2E：editor 新增 `new@test.local` → 出現 → 刪除。
- 已刪除：目前只有合作對象；列表＋「還原」。
- `/privacy/`（前台路由群組，套 v6 樣式）：後台登入只用 Google 帳號的 email 與顯示名稱來辨識管理員，不蒐集其他資料、不對外公開、可要求移除。加進 `check-internal-links` 涵蓋範圍（自然涵蓋）。
- `pages.yml`／`next-ci.yml`：build 時帶 `NEXT_PUBLIC_SUPABASE_URL`／`NEXT_PUBLIC_SUPABASE_ANON_KEY`（正式）。next-ci 另跑 admin E2E（env 用 TEST secrets；dev server 用測試專案）。
- 端到端驗收（正式）：用社團 Gmail 在正式 `/admin/` Google 登入 → 改一個合作對象名稱 → 發布 → 狀態變成功 → 正式站出現 → 改回。
- Google Auth Platform「品牌」頁補首頁 `https://hunter20041004.github.io/ftl-web-demo/` 與隱私權 `…/privacy/` → 「發布應用程式」（需使用者按）。
- 文件：README「內容怎麼更新」改成後台流程；STATUS、HANDOFF；`docs/後台使用說明.md`（幹部版，含截圖）。
- Commit：`後台總覽／管理員／已刪除；隱私權頁；CI 帶 Supabase 公開設定；文件`

## 自我檢查
- Spec 覆蓋：§4 架構（Task 2、4）、§6 登入與共用行為（Task 2、3）、§7 發布流程（Task 4）、§9 後台 E2E＋契約（Task 2–4）、§10 步驟 4（Task 5）。未涵蓋＝第 3 期：其餘五類編輯器、學期設定、週報貼上拆解、幹部說明頁的完整內容。
- 型別一致：`Partner` 來自 `content.schema.ts`；`PartnerRow` 只在 `partners.ts`；`triggerRebuild/getRebuildStatus` 只在 `rebuild.ts`。
