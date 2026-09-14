# CMS 第 1 期：內容管線 實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 前台改成「重建時從 Supabase 拉內容 → 驗證 → 產生快照 → 建站」，畫面與現在一模一樣；沒有 Supabase 鑰匙時吃 repo 內的快照。這是後台（第 2、3 期）的地基。

**Architecture:** `src/lib/content.ts` 變成門面（facade）：留在程式裡的資料來自 `content.static.ts`，六類＋學期設定來自 `content.snapshot.json`（經 zod 驗證）。`scripts/pull-content.ts` 在 GitHub Actions 建站前把 Supabase 的已發布資料轉成快照並下載圖片；`scripts/seed-content.ts` 把現有內容一次匯入 Supabase。資料庫每張表用「幾個可篩選的欄位 ＋ `data` jsonb（前台形狀）」，所以拉資料幾乎不用轉換。

**Tech Stack:** Next.js 16（static export）、TypeScript、zod 4、@supabase/supabase-js 2、Node 24 內建 test runner（`node --test`，原生跑 `.ts`）、Playwright（既有 80 個測試不動）、Supabase（Postgres＋Storage＋RLS）、GitHub Actions。

## Global Constraints

- 前台畫面元件**一律不改**；本期只換資料來源。既有 `npx playwright test` 80 個測試必須全綠。
- 所有文字欄位中英成對（`xxx` / `xxxEn`），快照驗證時缺英文＝失敗。
- 任何一筆資料驗證失敗、或任何一張圖片下載失敗 → `pull-content` 以非 0 結束 → 不部署。
- 秘密分佈：`SUPABASE_SERVICE_KEY` 只在 GitHub Actions secrets；本機開發不需要任何鑰匙。
- 所有新腳本用 TypeScript、由 Node 24 直接執行（`node scripts/x.ts`）；匯入本地檔一律寫完整副檔名 `.ts`；不使用 TS 專有的執行期語法（enum、參數屬性、namespace）。
- 圖片在 Storage bucket `media`，路徑格式 `<category>/<slug>.<ext>`；快照裡寫成 `/media/<同路徑>`，`pull-content` 下載到 `public/media/`。
- Node 版本：本機 24、CI `setup-node` 改 24。
- 每個 Task 結尾 `npm test`（typecheck＋lint＋連結檢查＋單元測試）全過才 commit。
- 與 spec §5 的差異：spec 列的欄位改為「可篩選欄位＋`data` jsonb」。理由：拉資料與後台表單共用前台形狀，少一層轉換；對使用者無可見差異。

---

## File Structure

| 檔案 | 責任 |
|---|---|
| `src/lib/content.schema.ts` | 六類＋學期設定的 zod schema；匯出推導型別與 `snapshotSchema` |
| `src/lib/content.static.ts` | 留在程式裡的資料：`leadership`、`calendarKinds`、`chainSeries`、社團基本資料 |
| `src/lib/content.snapshot.json` | 最近一次成功拉到的內容（commit 進 repo） |
| `src/lib/content.remote.ts` | 讀快照、用 schema 驗證、匯出 `semester`、`membership`、`calendar`、`lectures`、`workshops`、`books`、`resources`、`partners`、`weekly`、`projectDecks`、`papers` |
| `src/lib/content.ts` | 門面：`export * from "./content.static"; export * from "./content.remote";`（元件的 import 路徑不變） |
| `scripts/export-snapshot.ts` | 一次性：把目前 `content.ts` 裡的六類資料寫成第一份快照 |
| `scripts/lib/rows-to-snapshot.ts` | 純函式：DB 列 → 快照物件（可單元測試） |
| `scripts/pull-content.ts` | 連 Supabase、喚醒、拉資料、下載圖片、寫快照 |
| `scripts/seed-content.ts` | 快照 → 上傳圖片到 Storage、寫入各表 |
| `supabase/migrations/0001_init.sql` | 建表、索引、RLS、Storage bucket |
| `tests/unit/*.test.ts` | Node 內建 test runner 的單元測試 |
| `tests/contract/rls.test.ts` | 契約測試：連測試專案驗 RLS（沒有環境變數就跳過） |
| `.github/workflows/pages.yml`、`next-ci.yml` | 加 `pull-content` 步驟、快照 commit、Node 24 |

---

### Task 1: 測試基礎建設（Node test runner ＋ `.ts` 直接執行）

**Files:**
- Modify: `package.json`（scripts、devDependencies）
- Modify: `tsconfig.json`（`allowImportingTsExtensions`）
- Create: `tests/unit/smoke.test.ts`

**Interfaces:**
- Produces: `npm run test:unit` 會跑 `tests/unit/**/*.test.ts`；`npm test` 包含它。

- [ ] **Step 1: 寫一個會失敗的煙霧測試**

`tests/unit/smoke.test.ts`：
```ts
import test from "node:test";
import assert from "node:assert/strict";

test("node test runner runs .ts directly", () => {
  const x: number = 1;
  assert.equal(x + 1, 2);
});
```

- [ ] **Step 2: 跑，確認現在還沒有這個指令**

Run: `npm run test:unit`
Expected: `npm error Missing script: "test:unit"`

- [ ] **Step 3: 加 script 與 tsconfig 設定**

`package.json` 的 `scripts` 改成：
```json
"scripts": {
  "predev": "node scripts/sync-legacy-assets.mjs",
  "dev": "next dev",
  "prebuild": "node scripts/sync-legacy-assets.mjs",
  "build": "next build",
  "typecheck": "tsc --noEmit",
  "lint": "eslint src scripts tests *.ts *.mjs",
  "test:unit": "node --test \"tests/unit/**/*.test.ts\"",
  "test": "npm run typecheck && npm run lint && node scripts/check-internal-links.mjs && npm run test:unit",
  "test:visual": "playwright test tests/visual"
}
```
`tsconfig.json` 的 `compilerOptions` 加一行：
```json
"allowImportingTsExtensions": true,
```

- [ ] **Step 4: 跑，確認通過**

Run: `npm run test:unit`
Expected: `# pass 1` `# fail 0`

- [ ] **Step 5: 安裝本期會用到的相依**

Run: `npm install zod@^4 @supabase/supabase-js@^2 --save`
Expected: `package.json` 的 `dependencies` 多 `zod` 與 `@supabase/supabase-js`。

- [ ] **Step 6: 全套過了就 commit**

Run: `npm test`
Expected: typecheck、lint、internal links ok、`# pass 1`

```bash
git add package.json package-lock.json tsconfig.json tests/unit/smoke.test.ts
git commit -m "測試基礎：Node 內建 test runner 跑 .ts 單元測試；加 zod 與 supabase-js"
```

---

### Task 2: 內容 schema（zod）

**Files:**
- Create: `src/lib/content.schema.ts`
- Test: `tests/unit/content-schema.test.ts`

**Interfaces:**
- Produces:
  - `snapshotSchema`（zod object）與 `type Snapshot = z.infer<typeof snapshotSchema>`
  - 各子 schema：`semesterSchema`、`membershipSchema`、`calendarItemSchema`、`lectureSchema`、`workshopSchema`、`bookSchema`、`resourceSchema`、`partnerSchema`、`weeklyIssueSchema`、`projectDeckSchema`、`paperSchema`
  - `parseSnapshot(json: unknown): Snapshot`（失敗時 throw，訊息含路徑）
- 形狀與現在 `content.ts` 的 TS 型別完全相同（欄位名、選填與否），這是前台不用改的前提。

- [ ] **Step 1: 寫失敗測試**

`tests/unit/content-schema.test.ts`：
```ts
import test from "node:test";
import assert from "node:assert/strict";
import { parseSnapshot, partnerSchema, resourceSchema, weeklyIssueSchema } from "../../src/lib/content.schema.ts";

test("partner requires zh/en/href; logo and markOnly optional", () => {
  assert.ok(partnerSchema.safeParse({ zh: "市民永續", en: "City Sustainability", href: "https://x.tw/" }).success);
  assert.ok(!partnerSchema.safeParse({ zh: "市民永續", href: "https://x.tw/" }).success);
});

test("resource kind is job/scholarship/program only, deadline optional", () => {
  const ok = { kind: "job", kindZh: "職缺", kindEn: "Job", title: "t", titleEn: "t", org: "o", orgEn: "o", summary: "s", summaryEn: "s" };
  assert.ok(resourceSchema.safeParse(ok).success);
  assert.ok(!resourceSchema.safeParse({ ...ok, kind: "book" }).success);
});

test("weekly issue needs exactly 3 headlines and stories with bilingual fields", () => {
  const story = {
    title: "t", titleEn: "t", lede: "l", ledeEn: "l", facts: ["a"], factsEn: ["a"], context: "c", contextEn: "c",
    why: "w", whyEn: "w", taiwan: "tw", taiwanEn: "tw", watch: ["x"], watchEn: ["x"],
    sources: [{ label: "s", labelEn: "s", href: "https://a.b/", primary: true }],
  };
  const issue = { vol: 1, range: "08/27 – 09/01", year: 2026, headlines: ["a", "b", "c"], headlinesEn: ["a", "b", "c"], lede: "x", ledeEn: "x", stories: [story, story, story] };
  assert.ok(weeklyIssueSchema.safeParse(issue).success);
  assert.ok(!weeklyIssueSchema.safeParse({ ...issue, headlines: ["a", "b"] }).success);
  assert.ok(!weeklyIssueSchema.safeParse({ ...issue, stories: [{ ...story, whyEn: undefined }] }).success);
});

test("parseSnapshot throws with a path when a field is missing", () => {
  assert.throws(() => parseSnapshot({ generatedAt: "2026-09-14T00:00:00Z" }), /semester/);
});
```

- [ ] **Step 2: 跑，確認失敗**

Run: `npm run test:unit`
Expected: `Cannot find module '.../src/lib/content.schema.ts'`

- [ ] **Step 3: 寫 schema**

`src/lib/content.schema.ts`：
```ts
import { z } from "zod";

// 六類＋學期設定的形狀。跟 content.ts 原本的 TS 型別一模一樣，前台元件才不用改。
// 命名規則：中文欄位 xxx、英文欄位 xxxEn；兩者都必填（英文版永遠完整）。

const str = z.string().min(1);

export const semesterSchema = z.object({
  code: str, range: str, meetingDay: str, meetingDayEn: str, focus: str, concept: str, conceptEn: str,
});

export const membershipSchema = z.object({
  types: z.array(z.object({ name: str, en: str, fee: str, feeEn: str, how: str, howEn: str, perks: str, perksEn: str })),
  timeline: z.array(z.object({ date: str, zh: str, en: str, done: z.boolean() })),
  rewardTiers: z.array(z.tuple([str, str, str, str])),
  faq: z.array(z.tuple([str, str, str, str])),
  payment: str, paymentEn: str,
});

export const calendarKindSchema = z.enum(["lecture", "workshop", "reading", "social", "school"]);
export const calendarItemSchema = z.object({
  week: z.number().int().min(1), date: str, kind: calendarKindSchema, zh: str, en: str,
  note: z.string().optional(), noteEn: z.string().optional(), counts: z.boolean(),
});
export const lectureSchema = z.object({
  week: z.number().int(), date: str, title: str, titleEn: str, speaker: str, speakerEn: str, role: str, roleEn: str,
  org: str, orgEn: str, bio: z.array(str), bioEn: z.array(str), abstract: str, abstractEn: str,
});
export const workshopSchema = z.object({
  week: z.number().int(), date: str, title: str, titleEn: str, goal: str, goalEn: str,
  modules: z.array(z.tuple([str, str])), modulesEn: z.array(z.tuple([str, str])),
});
export const bookSchema = z.object({
  week: z.number().int(), date: str, title: str, author: str, cover: str, synopsis: str, synopsisEn: str, topics: z.array(str),
});

export const resourceSchema = z.object({
  kind: z.enum(["job", "scholarship", "program"]), kindZh: str, kindEn: str, title: str, titleEn: str, org: str, orgEn: str,
  summary: str, summaryEn: str, details: z.array(str).optional(), detailsEn: z.array(str).optional(),
  href: z.string().optional(), contact: z.string().optional(), deadline: z.string().optional(),
});

export const partnerSchema = z.object({
  zh: str, en: str, href: str, logo: z.string().optional(), markOnly: z.boolean().optional(),
});

export const weeklySourceSchema = z.object({ label: str, labelEn: str, href: z.string().url(), primary: z.boolean() });
export const weeklyStorySchema = z.object({
  title: str, titleEn: str, lede: str, ledeEn: str, facts: z.array(str), factsEn: z.array(str),
  context: str, contextEn: str, quote: z.string().optional(), quoteEn: z.string().optional(),
  quoteBy: z.string().optional(), quoteByEn: z.string().optional(), why: str, whyEn: str, taiwan: str, taiwanEn: str,
  watch: z.array(str), watchEn: z.array(str), term: z.string().optional(), termEn: z.string().optional(),
  sources: z.array(weeklySourceSchema).min(1),
});
export const weeklyIssueSchema = z.object({
  vol: z.number().int().min(1), range: str, year: z.number().int(),
  headlines: z.tuple([str, str, str]), headlinesEn: z.tuple([str, str, str]),
  lede: str, ledeEn: str, stories: z.array(weeklyStorySchema).length(3),
});

export const slideVisualSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("image"), src: str, alt: z.string().optional() }),
  z.object({ kind: z.literal("flow"), steps: z.array(str), stepsEn: z.array(str) }),
  z.object({ kind: z.literal("stats"), items: z.array(z.tuple([str, str, str])) }),
  z.object({ kind: z.literal("list"), items: z.array(str), itemsEn: z.array(str) }),
]);
export const slideSchema = z.object({ kicker: str, kickerEn: str, title: str, titleEn: str, body: str, bodyEn: str, visual: slideVisualSchema });
export const projectDeckSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/), name: str, nameEn: str, tagline: str, taglineEn: str, tags: z.array(str), tagsEn: z.array(str),
  repo: str, demo: z.string().optional(), owner: str, ownerEn: str, status: z.enum(["done", "wip"]), cover: str,
  slides: z.tuple([slideSchema, slideSchema, slideSchema, slideSchema]),
});

export const paperSchema = z.object({
  title: str, titleEn: z.string().optional(), authors: str, authorsEn: z.string().optional(), venue: str, venueEn: z.string().optional(),
  year: z.number().int(), region: z.enum(["intl", "tw"]), summary: str, summaryEn: str, href: str,
});

export const snapshotSchema = z.object({
  generatedAt: str,
  semester: semesterSchema,
  membership: membershipSchema,
  calendar: z.array(calendarItemSchema),
  lectures: z.array(lectureSchema),
  workshops: z.array(workshopSchema),
  books: z.array(bookSchema),
  resources: z.array(resourceSchema),
  partners: z.array(partnerSchema),
  weekly: z.array(weeklyIssueSchema),
  projectDecks: z.array(projectDeckSchema),
  papers: z.array(paperSchema),
});

export type Snapshot = z.infer<typeof snapshotSchema>;
export type CalendarKind = z.infer<typeof calendarKindSchema>;
export type CalendarItem = z.infer<typeof calendarItemSchema>;
export type Lecture = z.infer<typeof lectureSchema>;
export type Workshop = z.infer<typeof workshopSchema>;
export type Book = z.infer<typeof bookSchema>;
export type Resource = z.infer<typeof resourceSchema>;
export type Partner = z.infer<typeof partnerSchema>;
export type WeeklyStory = z.infer<typeof weeklyStorySchema>;
export type WeeklyIssue = z.infer<typeof weeklyIssueSchema>;
export type SlideVisual = z.infer<typeof slideVisualSchema>;
export type Slide = z.infer<typeof slideSchema>;
export type ProjectDeck = z.infer<typeof projectDeckSchema>;
export type Paper = z.infer<typeof paperSchema>;

export function parseSnapshot(json: unknown): Snapshot {
  const result = snapshotSchema.safeParse(json);
  if (result.success) return result.data;
  const lines = result.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`);
  throw new Error(`content snapshot invalid:\n  ${lines.join("\n  ")}`);
}
```

- [ ] **Step 4: 跑，確認通過**

Run: `npm run test:unit`
Expected: `# pass 5` `# fail 0`

- [ ] **Step 5: Commit**

```bash
npm test
git add src/lib/content.schema.ts tests/unit/content-schema.test.ts
git commit -m "內容 schema：六類＋學期設定的 zod 定義與 parseSnapshot"
```

---

### Task 3: 第一份快照（從現有 content.ts 匯出）

**Files:**
- Create: `scripts/export-snapshot.ts`
- Create: `src/lib/content.snapshot.json`（腳本產生）
- Test: `tests/unit/snapshot-valid.test.ts`

**Interfaces:**
- Consumes: `content.ts` 現有匯出：`semester`、`membership`、`calendar`、`lectures`、`workshops`、`books`、`resources`、`partners`、`weekly`、`projectDecks`、`papers`；`parseSnapshot`
- Produces: `src/lib/content.snapshot.json`，形狀＝`Snapshot`。圖片路徑此時仍是 `/assets/...`（Task 6 匯入 Supabase 後才改 `/media/...`）。

- [ ] **Step 1: 寫失敗測試（快照必須存在且通過驗證）**

`tests/unit/snapshot-valid.test.ts`：
```ts
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseSnapshot } from "../../src/lib/content.schema.ts";

test("committed snapshot validates and has the expected counts", () => {
  const snap = parseSnapshot(JSON.parse(readFileSync(new URL("../../src/lib/content.snapshot.json", import.meta.url), "utf8")));
  assert.equal(snap.weekly.length, 3);
  assert.equal(snap.projectDecks.length, 3);
  assert.equal(snap.papers.length, 6);
  assert.equal(snap.partners.length, 4);
  assert.equal(snap.calendar.length, 16);
  assert.ok(snap.resources.length >= 3);
});
```

- [ ] **Step 2: 跑，確認失敗**

Run: `npm run test:unit`
Expected: `ENOENT ... content.snapshot.json`

- [ ] **Step 3: 寫匯出腳本**

`scripts/export-snapshot.ts`：
```ts
// 一次性：把目前寫死在 content.ts 的六類內容輸出成第一份快照。
// 之後快照由 pull-content.ts 從 Supabase 產生，這支腳本只在遷移時用一次。
import { writeFileSync } from "node:fs";
import { parseSnapshot } from "../src/lib/content.schema.ts";
import { semester, membership, calendar, lectures, workshops, books, resources, partners, weekly, projectDecks, papers } from "../src/lib/content.ts";

const snapshot = parseSnapshot({
  generatedAt: new Date().toISOString(),
  semester, membership, calendar, lectures, workshops, books, resources, partners, weekly, projectDecks, papers,
});
const out = new URL("../src/lib/content.snapshot.json", import.meta.url);
writeFileSync(out, JSON.stringify(snapshot, null, 2) + "\n");
console.log(`snapshot written: ${out.pathname}`);
```

注意：`content.ts` 目前以 `@/lib/...` 之外的方式匯入其他檔嗎？跑之前用 `grep -n "^import" src/lib/content.ts` 確認它沒有 `@/` 別名匯入（Node 不認得別名）；有的話改成相對路徑並加 `.ts` 副檔名。

- [ ] **Step 4: 產生快照、跑測試**

Run: `node scripts/export-snapshot.ts && npm run test:unit`
Expected: `snapshot written: ...` 然後 `# pass 6` `# fail 0`

若 `parseSnapshot` 報錯（例如某筆 `partners` 缺 `logo` 以外的欄位、某篇 `papers` 缺 `summaryEn`），**修 `content.ts` 裡的資料**讓它符合 schema，不要放寬 schema；把修了什麼記在 commit 訊息。

- [ ] **Step 5: Commit**

```bash
npm test
git add scripts/export-snapshot.ts src/lib/content.snapshot.json tests/unit/snapshot-valid.test.ts src/lib/content.ts
git commit -m "第一份內容快照：由現有 content.ts 匯出並通過 schema 驗證"
```

---

### Task 4: 前台改吃快照（content.ts 變門面）

**Files:**
- Create: `src/lib/content.static.ts`
- Create: `src/lib/content.remote.ts`
- Modify: `src/lib/content.ts`（整檔改寫成兩行 re-export）
- Modify: `scripts/export-snapshot.ts`（改從 `content.static`＋快照以外的來源匯出已無意義 → 刪除此腳本）
- Test: 既有 `npx playwright test`（80 個）＋ `tests/unit/snapshot-valid.test.ts`

**Interfaces:**
- Consumes: `content.snapshot.json`、`parseSnapshot`
- Produces: `@/lib/content` 匯出集合**與改前相同**（名稱、型別）。`calendarKinds`、`leadership`、`chainSeries`、`Officer`、`ChainCourse` 來自 static；其餘來自 remote。

- [ ] **Step 1: 先確認保護網：跑既有視覺測試基準**

Run: `npx playwright test --reporter=line 2>&1 | tail -1`
Expected: `80 passed`

- [ ] **Step 2: 建 `content.static.ts`**

把 `content.ts` 裡下列區塊**原封不動剪過去**（用編輯器搬，不要重打）：`CalendarKind`＋`calendarKinds`（第 19–27 行附近）、`ChainCourse`＋`chainSeries`、`Officer`＋`leadership`。檔頭：
```ts
// 留在程式裡、一年才改一次的資料：類別標籤、區塊鏈系列課程、幹部名單。
// 六類會變動的內容（週報、活動、資源、專案、研究文章、合作對象）與學期設定在 content.remote.ts。
import type { CalendarKind } from "./content.schema.ts";
export type { CalendarKind } from "./content.schema.ts";
```
`calendarKinds` 的型別註記改用這個 `CalendarKind`。

- [ ] **Step 3: 建 `content.remote.ts`**

```ts
// 六類內容＋學期設定：來自最近一次成功拉到的快照（scripts/pull-content.ts 產生）。
// 沒有 Supabase 鑰匙的環境（本機開發、fork）直接用 repo 內的這份快照，所以 npm run dev 不需要任何帳號。
import snapshotJson from "./content.snapshot.json";
import { parseSnapshot } from "./content.schema.ts";

export type { CalendarItem, Lecture, Workshop, Book, Resource, Partner, WeeklyStory, WeeklyIssue, SlideVisual, Slide, ProjectDeck, Paper } from "./content.schema.ts";

const snapshot = parseSnapshot(snapshotJson);

export const semester = snapshot.semester;
export const membership = snapshot.membership;
export const calendar = snapshot.calendar;
export const lectures = snapshot.lectures;
export const workshops = snapshot.workshops;
export const books = snapshot.books;
export const resources = snapshot.resources;
export const partners = snapshot.partners;
export const weekly = snapshot.weekly;
export const projectDecks = snapshot.projectDecks;
export const papers = snapshot.papers;
export const contentGeneratedAt = snapshot.generatedAt;
```

- [ ] **Step 4: `content.ts` 改成門面**

整檔內容換成：
```ts
// 門面：元件一律 import "@/lib/content"。實際資料分兩處——
// content.static.ts：留在程式裡的；content.remote.ts：從快照（Supabase）來的。
export * from "./content.static.ts";
export * from "./content.remote.ts";
```
刪除 `scripts/export-snapshot.ts`（它依賴舊 `content.ts`，任務已完成）。

- [ ] **Step 5: 型別檢查，處理型別差異**

Run: `npx tsc --noEmit -p .`
可能出現的錯誤與處理：
- 元件用到 `membership.timeline` 的 `done` 等欄位：schema 已含。
- `projectDecks` 的 `slides` 在 schema 是 tuple，元件若用 `deck.slides.map` 沒問題。
- `resources` 原本有 `kindZh/kindEn`：schema 已含。
- 若元件匯入了不存在於兩個新檔的名稱（例如 `Book` 型別以外的輔助常數），把那個常數搬到 `content.static.ts`。
Expected: 0 errors。

- [ ] **Step 6: 視覺測試全綠、建置成功**

Run: `npx playwright test --reporter=line 2>&1 | tail -1 && npm run build 2>&1 | tail -2`
Expected: `80 passed`；build 印出 `○ (Static) prerendered as static content`

- [ ] **Step 7: Commit**

```bash
npm test
git add -A src/lib scripts
git commit -m "前台改吃內容快照：content.ts 變門面，static／remote 分檔；畫面不變（80 測試全綠）"
```

---

### Task 5: 資料庫結構、RLS、Storage（Supabase migration）

**Files:**
- Create: `supabase/migrations/0001_init.sql`
- Create: `supabase/README.md`（使用者要做的步驟）
- Test: `tests/contract/rls.test.ts`（有 `SUPABASE_TEST_URL`／`SUPABASE_TEST_ANON_KEY`／`SUPABASE_TEST_SERVICE_KEY` 才跑，否則 skip）

**Interfaces:**
- Produces（後續 Task 與第 2 期後台都依賴）：
  - 表：`settings(id text pk, data jsonb)`；`events(id uuid pk, semester text, week int, date date, kind text, position int, data jsonb)`；`resources(id uuid pk, kind text, deadline date null, data jsonb)`；`projects(id text pk, position int, data jsonb)`；`papers(id uuid pk, year int, data jsonb)`；`partners(id uuid pk, position int, data jsonb)`；`weekly_issues(id uuid pk, vol int unique, range_start date, data jsonb)`；`weekly_stories(id uuid pk, issue_id uuid fk, position int, data jsonb)`；`admins(email text pk, added_by text, added_at timestamptz)`
  - 每張內容表另有 `status text check in ('draft','published') default 'draft'`、`deleted_at timestamptz null`、`created_at`、`updated_at`、`updated_by text`
  - Storage bucket `media`（公開讀取，寫入限管理員）
  - RLS：`is_admin()` 函式＝`auth.jwt()->>'email'` 在 `admins` 內；所有表與 bucket 的四種操作都要 `is_admin()`。

- [ ] **Step 1: 寫契約測試（先寫，環境變數沒設會 skip，所以「紅」在有測試專案時才看得到）**

`tests/contract/rls.test.ts`：
```ts
import test from "node:test";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_TEST_URL;
const anon = process.env.SUPABASE_TEST_ANON_KEY;
const service = process.env.SUPABASE_TEST_SERVICE_KEY;
const enabled = Boolean(url && anon && service);

// 沒登入（anon）的人：任何表都讀不到、寫不進。這條防「畫面有擋、資料庫沒擋」。
test("anonymous client cannot read or write content tables", { skip: !enabled }, async () => {
  const client = createClient(url!, anon!);
  for (const table of ["settings", "events", "resources", "projects", "papers", "partners", "weekly_issues", "weekly_stories", "admins"]) {
    const read = await client.from(table).select("*").limit(1);
    assert.deepEqual(read.data, [], `${table} should be empty for anon`);
    const write = await client.from(table).insert({ data: {} } as never);
    assert.ok(write.error, `${table} insert should fail for anon`);
  }
});

test("service role can read every table (used by pull-content)", { skip: !enabled }, async () => {
  const client = createClient(url!, service!);
  const res = await client.from("partners").select("id").limit(1);
  assert.equal(res.error, null);
});

test("media bucket is public-read, anon cannot upload", { skip: !enabled }, async () => {
  const client = createClient(url!, anon!);
  const up = await client.storage.from("media").upload(`contract-test/${Date.now()}.txt`, new Blob(["x"]));
  assert.ok(up.error);
});
```
在 `package.json` 加：`"test:contract": "node --test \"tests/contract/**/*.test.ts\""`（不放進 `npm test`，因為要外部環境）。

- [ ] **Step 2: 寫 migration**

`supabase/migrations/0001_init.sql`：
```sql
-- 內容表：每張都是「可篩選欄位 + data jsonb（前台形狀）」。
-- 共用欄位：status（draft/published）、deleted_at（軟刪除）、created_at/updated_at/updated_by。

create extension if not exists pgcrypto;

create table if not exists admins (
  email text primary key,
  added_by text,
  added_at timestamptz not null default now()
);

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where email = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;

create or replace function set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  new.updated_by = coalesce(auth.jwt() ->> 'email', new.updated_by);
  return new;
end $$;

-- 共用欄位用一個巨集式寫法：每張表都重複一次（Postgres 沒有繼承友善的 RLS，寫清楚比取巧好）
create table if not exists settings (
  id text primary key,
  data jsonb not null,
  status text not null default 'published' check (status in ('draft','published')),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  semester text not null,
  week int not null,
  date date not null,
  kind text not null check (kind in ('lecture','workshop','reading','social','school')),
  position int not null default 0,
  data jsonb not null,
  status text not null default 'draft' check (status in ('draft','published')),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);
create index if not exists events_semester_week on events (semester, week);

create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('job','scholarship','program','book')),
  deadline date,
  position int not null default 0,
  data jsonb not null,
  status text not null default 'draft' check (status in ('draft','published')),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists projects (
  id text primary key,
  position int not null default 0,
  data jsonb not null,
  status text not null default 'draft' check (status in ('draft','published')),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists papers (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  data jsonb not null,
  status text not null default 'draft' check (status in ('draft','published')),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  position int not null default 0,
  data jsonb not null,
  status text not null default 'draft' check (status in ('draft','published')),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists weekly_issues (
  id uuid primary key default gen_random_uuid(),
  vol int not null unique,
  range_start date not null,
  range_end date not null,
  data jsonb not null,
  status text not null default 'draft' check (status in ('draft','published')),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists weekly_stories (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references weekly_issues (id) on delete cascade,
  position int not null check (position between 1 and 3),
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text,
  unique (issue_id, position)
);

-- updated_at 觸發器
do $$
declare t text;
begin
  foreach t in array array['settings','events','resources','projects','papers','partners','weekly_issues','weekly_stories'] loop
    execute format('drop trigger if exists %I_updated on %I', t, t);
    execute format('create trigger %I_updated before update on %I for each row execute function set_updated_at()', t, t);
  end loop;
end $$;

-- RLS：只有 admins 名單內的登入者可以讀寫；service role 不受 RLS 限制（給 pull-content 用）
do $$
declare t text;
begin
  foreach t in array array['admins','settings','events','resources','projects','papers','partners','weekly_issues','weekly_stories'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists admin_all on %I', t);
    execute format('create policy admin_all on %I for all to authenticated using (is_admin()) with check (is_admin())', t);
  end loop;
end $$;

-- Storage：media bucket 公開讀，寫入限管理員
insert into storage.buckets (id, name, public) values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects for select using (bucket_id = 'media');
drop policy if exists media_admin_write on storage.objects;
create policy media_admin_write on storage.objects for all to authenticated
  using (bucket_id = 'media' and is_admin()) with check (bucket_id = 'media' and is_admin());
```

- [ ] **Step 3: 寫使用者操作說明**

`supabase/README.md`：
```md
# Supabase 設定（由使用者用社團 Gmail 操作）

正式與測試各建一個專案，步驟相同。

1. https://supabase.com 用社團 Gmail 註冊 → New project：名稱 `ftl-web`（測試用 `ftl-web-test`）、Region 選 Northeast Asia (Tokyo)、資料庫密碼請存進社團密碼管理處。
2. 左側 SQL Editor → New query → 貼上 `supabase/migrations/0001_init.sql` 全文 → Run。看到 `Success` 即可。
3. 再開一個 query，把社團 Gmail 放進管理員名單：
   `insert into admins (email, added_by) values ('nccufintechlab@gmail.com', 'setup');`
4. 左側 Authentication → Providers → Google：Enable，照畫面說明去 Google Cloud Console 建 OAuth Client（授權的 redirect URI 就貼 Supabase 畫面給的那一串），把 Client ID / Secret 貼回來。
5. Authentication → URL Configuration：Site URL 填 `https://hunter20041004.github.io/ftl-web-demo/admin/`，Redirect URLs 加同一個網址。
6. 左側 Project Settings → API：把 `Project URL`、`anon public` key、`service_role` key 三個值交給工程師（service_role 只放 GitHub secrets，不貼進任何對話紀錄以外的地方；交完可在 API 頁 rotate）。

工程師接著會：把 URL 與 service key 放進 GitHub repo 的 Secrets（`SUPABASE_URL`、`SUPABASE_SERVICE_KEY`；測試專案為 `SUPABASE_TEST_URL`、`SUPABASE_TEST_ANON_KEY`、`SUPABASE_TEST_SERVICE_KEY`），跑 `scripts/seed-content.ts` 匯入現有內容。
```

- [ ] **Step 4: 在測試專案跑 migration 與契約測試**

前提：使用者已依 README 建好 **測試** 專案並交付三個值。本機：
```bash
export SUPABASE_TEST_URL=... SUPABASE_TEST_ANON_KEY=... SUPABASE_TEST_SERVICE_KEY=...
npm run test:contract
```
Expected: `# pass 3` `# fail 0`（若 anon 讀得到資料，代表 RLS 沒生效，回去檢查 migration 有沒有整段執行）。

若使用者還沒建好專案：這個 Task 先 commit 檔案，契約測試 skip；**在 HANDOFF.md 記下「Task 5 Step 4 待使用者建立測試專案後補跑」**，不可標記完成。

- [ ] **Step 5: Commit**

```bash
npm test
git add supabase tests/contract package.json
git commit -m "Supabase：建表、RLS、media bucket 的 migration；契約測試；使用者設定說明"
```

---

### Task 6: 列 → 快照 的純函式（rows-to-snapshot）

**Files:**
- Create: `scripts/lib/rows-to-snapshot.ts`
- Test: `tests/unit/rows-to-snapshot.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export type Rows = {
    settings: Array<{ id: string; data: unknown }>;
    events: Array<{ id: string; semester: string; week: number; date: string; kind: string; position: number; data: unknown }>;
    resources: Array<{ id: string; kind: string; deadline: string | null; position: number; data: unknown }>;
    projects: Array<{ id: string; position: number; data: unknown }>;
    papers: Array<{ id: string; year: number; data: unknown }>;
    partners: Array<{ id: string; position: number; data: unknown }>;
    weekly_issues: Array<{ id: string; vol: number; range_start: string; range_end: string; data: unknown }>;
    weekly_stories: Array<{ id: string; issue_id: string; position: number; data: unknown }>;
  };
  export function rowsToSnapshot(rows: Rows, opts: { today: string; generatedAt: string }): Snapshot;
  export function collectImagePaths(snapshot: Snapshot): string[];  // 所有 /media/... 路徑
  ```
- 規則：
  - `settings` 取 `id='default'` 的 `data` → `{ semester, membership }`。
  - `events` 只取 `semester === settings.semester.code`；依 `week` 排序；每筆 `data` 含 `CalendarItem` 欄位（`zh/en/note/noteEn/counts`）＋依 kind 的細節：`lecture` 有 `lecture: {...Lecture 欄位（不含 week/date）}`、`workshop` 有 `workshop: {...}`、`reading` 有 `book: {...}`。函式拆成 `calendar`、`lectures`、`workshops`、`books` 四個陣列（`week/date` 由列的欄位補上）。
  - `resources` 排除 `kind === 'book'`（書由前台 `books` 顯示，來自讀書會活動；資源頁的書在第 3 期另處理）；排除 `deadline < today`；依 `position` 排序。
  - `projects` 依 `position`；`papers` 依 `year` 降冪；`partners` 依 `position`。
  - `weekly`：依 `vol` 降冪；`range` 由 `range_start/range_end` 產生 `MM/DD – MM/DD`；`year` 取 `range_start` 的年；`headlines/headlinesEn` 取三則 story 的 `data.headline/headlineEn`；story 的 `data` 其餘欄位即 `WeeklyStory`。
  - 最後整體丟給 `parseSnapshot`，失敗就 throw。

- [ ] **Step 1: 寫失敗測試**

`tests/unit/rows-to-snapshot.test.ts`：
```ts
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { rowsToSnapshot, collectImagePaths, type Rows } from "../../scripts/lib/rows-to-snapshot.ts";
import { parseSnapshot } from "../../src/lib/content.schema.ts";

// 用 repo 內的快照反推一組 DB 列，當作固定測試資料
const snap = parseSnapshot(JSON.parse(readFileSync(new URL("../../src/lib/content.snapshot.json", import.meta.url), "utf8")));

function rowsFromSnapshot(): Rows {
  const lectures = new Map(snap.lectures.map((l) => [l.week, l]));
  const workshops = new Map(snap.workshops.map((w) => [w.week, w]));
  const books = new Map(snap.books.map((b) => [b.week, b]));
  return {
    settings: [{ id: "default", data: { semester: snap.semester, membership: snap.membership } }],
    events: snap.calendar.map((c, i) => {
      const { week, date, kind, ...rest } = c;
      const detail = kind === "lecture" ? { lecture: omitWeekDate(lectures.get(week)) }
        : kind === "workshop" ? { workshop: omitWeekDate(workshops.get(week)) }
        : kind === "reading" ? { book: omitWeekDate(books.get(week)) } : {};
      return { id: `e${i}`, semester: snap.semester.code, week, date, kind, position: i, data: { ...rest, ...detail } };
    }),
    resources: snap.resources.map((r, i) => ({ id: `r${i}`, kind: r.kind, deadline: r.deadline ?? null, position: i, data: r })),
    projects: snap.projectDecks.map((p, i) => ({ id: p.id, position: i, data: p })),
    papers: snap.papers.map((p, i) => ({ id: `p${i}`, year: p.year, data: p })),
    partners: snap.partners.map((p, i) => ({ id: `pa${i}`, position: i, data: p })),
    weekly_issues: snap.weekly.map((w) => ({ id: `w${w.vol}`, vol: w.vol, range_start: `${w.year}-${w.range.slice(0, 5).replace("/", "-")}`, range_end: `${w.year}-${w.range.slice(-5).replace("/", "-")}`, data: { lede: w.lede, ledeEn: w.ledeEn } })),
    weekly_stories: snap.weekly.flatMap((w) => w.stories.map((s, i) => ({ id: `w${w.vol}s${i}`, issue_id: `w${w.vol}`, position: i + 1, data: { ...s, headline: w.headlines[i], headlineEn: w.headlinesEn[i] } }))),
  };
}
function omitWeekDate<T extends { week: number; date: string }>(x: T | undefined) {
  if (!x) throw new Error("fixture missing");
  const { week: _w, date: _d, ...rest } = x;
  return rest;
}

test("rows round-trip to the same snapshot", () => {
  const out = rowsToSnapshot(rowsFromSnapshot(), { today: "2026-09-14", generatedAt: "2026-09-14T00:00:00Z" });
  assert.deepEqual(out.calendar, snap.calendar);
  assert.deepEqual(out.lectures, snap.lectures);
  assert.deepEqual(out.workshops, snap.workshops);
  assert.deepEqual(out.books, snap.books);
  assert.deepEqual(out.weekly, snap.weekly);
  assert.deepEqual(out.projectDecks, snap.projectDecks);
  assert.deepEqual(out.partners, snap.partners);
});

test("expired resources and other semesters are excluded", () => {
  const rows = rowsFromSnapshot();
  rows.resources.push({ id: "old", kind: "job", deadline: "2026-01-01", position: 99, data: { ...snap.resources[0], title: "過期" } });
  rows.events.push({ ...rows.events[0], id: "next", semester: "115-2" });
  const out = rowsToSnapshot(rows, { today: "2026-09-14", generatedAt: "x" });
  assert.ok(!out.resources.some((r) => r.title === "過期"));
  assert.equal(out.calendar.length, snap.calendar.length);
});

test("invalid row data fails loudly with the path", () => {
  const rows = rowsFromSnapshot();
  rows.partners[0] = { ...rows.partners[0], data: { zh: "沒英文", href: "https://x/" } };
  assert.throws(() => rowsToSnapshot(rows, { today: "2026-09-14", generatedAt: "x" }), /partners\.0\.en/);
});

test("collectImagePaths lists every /media path once", () => {
  const out = rowsToSnapshot(rowsFromSnapshot(), { today: "2026-09-14", generatedAt: "x" });
  const paths = collectImagePaths({ ...out, partners: [{ zh: "a", en: "a", href: "https://a/", logo: "/media/partners/a.png" }, { zh: "b", en: "b", href: "https://b/", logo: "/media/partners/a.png" }] });
  assert.equal(paths.filter((p) => p === "/media/partners/a.png").length, 1);
});
```

- [ ] **Step 2: 跑，確認失敗**

Run: `npm run test:unit`
Expected: `Cannot find module '.../scripts/lib/rows-to-snapshot.ts'`

- [ ] **Step 3: 寫實作**

`scripts/lib/rows-to-snapshot.ts`：
```ts
// DB 列 → 前台快照。純函式，沒有 I/O，所以能用假資料測。
import { parseSnapshot, type Snapshot } from "../../src/lib/content.schema.ts";

export type Rows = {
  settings: Array<{ id: string; data: unknown }>;
  events: Array<{ id: string; semester: string; week: number; date: string; kind: string; position: number; data: unknown }>;
  resources: Array<{ id: string; kind: string; deadline: string | null; position: number; data: unknown }>;
  projects: Array<{ id: string; position: number; data: unknown }>;
  papers: Array<{ id: string; year: number; data: unknown }>;
  partners: Array<{ id: string; position: number; data: unknown }>;
  weekly_issues: Array<{ id: string; vol: number; range_start: string; range_end: string; data: unknown }>;
  weekly_stories: Array<{ id: string; issue_id: string; position: number; data: unknown }>;
};

type Obj = Record<string, unknown>;
const obj = (x: unknown): Obj => (x && typeof x === "object" ? (x as Obj) : {});
const mmdd = (iso: string) => `${iso.slice(5, 7)}/${iso.slice(8, 10)}`;

export function rowsToSnapshot(rows: Rows, opts: { today: string; generatedAt: string }): Snapshot {
  const settings = obj(rows.settings.find((s) => s.id === "default")?.data);
  const semester = obj(settings.semester);
  const code = String(semester.code ?? "");

  const events = rows.events.filter((e) => e.semester === code).sort((a, b) => a.week - b.week || a.position - b.position);
  const calendar = events.map((e) => {
    const { lecture: _l, workshop: _w, book: _b, ...rest } = obj(e.data);
    return { week: e.week, date: e.date, kind: e.kind, ...rest };
  });
  const lectures = events.filter((e) => e.kind === "lecture").map((e) => ({ week: e.week, date: e.date, ...obj(obj(e.data).lecture) }));
  const workshops = events.filter((e) => e.kind === "workshop").map((e) => ({ week: e.week, date: e.date, ...obj(obj(e.data).workshop) }));
  const books = events.filter((e) => e.kind === "reading").map((e) => ({ week: e.week, date: e.date, ...obj(obj(e.data).book) }));

  const resources = rows.resources
    .filter((r) => r.kind !== "book" && (!r.deadline || r.deadline >= opts.today))
    .sort((a, b) => a.position - b.position)
    .map((r) => r.data);

  const projectDecks = [...rows.projects].sort((a, b) => a.position - b.position).map((p) => p.data);
  const papers = [...rows.papers].sort((a, b) => b.year - a.year).map((p) => p.data);
  const partners = [...rows.partners].sort((a, b) => a.position - b.position).map((p) => p.data);

  const storiesByIssue = new Map<string, Rows["weekly_stories"]>();
  for (const s of rows.weekly_stories) storiesByIssue.set(s.issue_id, [...(storiesByIssue.get(s.issue_id) ?? []), s]);
  const weekly = [...rows.weekly_issues].sort((a, b) => b.vol - a.vol).map((issue) => {
    const stories = (storiesByIssue.get(issue.id) ?? []).sort((a, b) => a.position - b.position).map((s) => obj(s.data));
    const data = obj(issue.data);
    return {
      vol: issue.vol,
      range: `${mmdd(issue.range_start)} – ${mmdd(issue.range_end)}`,
      year: Number(issue.range_start.slice(0, 4)),
      headlines: stories.map((s) => s.headline),
      headlinesEn: stories.map((s) => s.headlineEn),
      lede: data.lede, ledeEn: data.ledeEn,
      stories: stories.map(({ headline: _h, headlineEn: _e, ...rest }) => rest),
    };
  });

  return parseSnapshot({
    generatedAt: opts.generatedAt,
    semester, membership: settings.membership,
    calendar, lectures, workshops, books, resources, partners, weekly, projectDecks, papers,
  });
}

// 找出快照裡所有 /media/... 圖片路徑（合作對象 logo、書封、專案封面與投影片圖）
export function collectImagePaths(snapshot: Snapshot): string[] {
  const out = new Set<string>();
  const add = (p?: string) => { if (p && p.startsWith("/media/")) out.add(p); };
  snapshot.partners.forEach((p) => add(p.logo));
  snapshot.books.forEach((b) => add(b.cover));
  snapshot.projectDecks.forEach((d) => { add(d.cover); d.slides.forEach((s) => { if (s.visual.kind === "image") add(s.visual.src); }); });
  return [...out];
}
```

- [ ] **Step 4: 跑，確認通過**

Run: `npm run test:unit`
Expected: 全部 pass（含前面 6 個）。若 `rows round-trip` 因欄位順序不同而 `deepEqual` 失敗：`deepEqual` 不看鍵順序，只看值；真的不同就是轉換邏輯錯，修 `rowsToSnapshot`，不要改測試。

- [ ] **Step 5: Commit**

```bash
npm test
git add scripts/lib/rows-to-snapshot.ts tests/unit/rows-to-snapshot.test.ts
git commit -m "rows-to-snapshot：DB 列轉快照的純函式（過濾過期資源、非目前學期，週報組裝）"
```

---

### Task 7: 匯入現有內容到 Supabase（seed）

**Files:**
- Create: `scripts/seed-content.ts`
- Test: 手動驗證＋`npm run test:contract`（Task 5）；另加 `tests/unit/seed-plan.test.ts` 測「快照 → 要寫入的列」的純函式

**Interfaces:**
- Consumes: `content.snapshot.json`、`parseSnapshot`、Supabase service key（環境變數 `SUPABASE_URL`、`SUPABASE_SERVICE_KEY`）
- Produces: `scripts/lib/snapshot-to-rows.ts` 的 `snapshotToRows(snapshot, mediaPrefix): Rows`（Task 6 `Rows` 型別的反向）；圖片路徑由 `/assets/...` 改寫為 `/media/...`

- [ ] **Step 1: 寫失敗測試（反向轉換要能被 rowsToSnapshot 還原）**

`tests/unit/seed-plan.test.ts`：
```ts
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseSnapshot } from "../../src/lib/content.schema.ts";
import { snapshotToRows, rewriteAssetPaths } from "../../scripts/lib/snapshot-to-rows.ts";
import { rowsToSnapshot } from "../../scripts/lib/rows-to-snapshot.ts";

const snap = parseSnapshot(JSON.parse(readFileSync(new URL("../../src/lib/content.snapshot.json", import.meta.url), "utf8")));

test("snapshot → rows → snapshot is identity (after path rewrite)", () => {
  const rewritten = rewriteAssetPaths(snap);
  const rows = snapshotToRows(rewritten);
  const back = rowsToSnapshot(rows, { today: "2000-01-01", generatedAt: rewritten.generatedAt });
  assert.deepEqual(back, rewritten);
});

test("rewriteAssetPaths turns /assets/x into /media/x and leaves others", () => {
  const out = rewriteAssetPaths({ ...snap, partners: [{ zh: "a", en: "a", href: "https://a/", logo: "/assets/partners/gad.svg" }] });
  assert.equal(out.partners[0].logo, "/media/partners/gad.svg");
});
```

- [ ] **Step 2: 跑，確認失敗**

Run: `npm run test:unit`
Expected: `Cannot find module '.../scripts/lib/snapshot-to-rows.ts'`

- [ ] **Step 3: 寫純函式**

`scripts/lib/snapshot-to-rows.ts`：
```ts
// 快照 → DB 列（seed 用）。是 rows-to-snapshot 的反向；兩邊互為測試。
import type { Snapshot } from "../../src/lib/content.schema.ts";
import type { Rows } from "./rows-to-snapshot.ts";

const toMedia = (p?: string) => (p && p.startsWith("/assets/") ? p.replace("/assets/", "/media/") : p);

export function rewriteAssetPaths(s: Snapshot): Snapshot {
  return {
    ...s,
    partners: s.partners.map((p) => ({ ...p, ...(p.logo ? { logo: toMedia(p.logo)! } : {}) })),
    books: s.books.map((b) => ({ ...b, cover: toMedia(b.cover)! })),
    projectDecks: s.projectDecks.map((d) => ({
      ...d, cover: toMedia(d.cover)!,
      slides: d.slides.map((sl) => (sl.visual.kind === "image" ? { ...sl, visual: { ...sl.visual, src: toMedia(sl.visual.src)! } } : sl)) as Snapshot["projectDecks"][number]["slides"],
    })),
  };
}

const isoFromRange = (year: number, mmdd: string) => `${year}-${mmdd.slice(0, 2)}-${mmdd.slice(3, 5)}`;
const omitWeekDate = <T extends { week: number; date: string }>({ week: _w, date: _d, ...rest }: T) => rest;

export function snapshotToRows(s: Snapshot): Rows {
  const lectures = new Map(s.lectures.map((l) => [l.week, l]));
  const workshops = new Map(s.workshops.map((w) => [w.week, w]));
  const books = new Map(s.books.map((b) => [b.week, b]));
  return {
    settings: [{ id: "default", data: { semester: s.semester, membership: s.membership } }],
    events: s.calendar.map((c, i) => {
      const { week, date, kind, ...rest } = c;
      const l = lectures.get(week), w = workshops.get(week), b = books.get(week);
      const detail = kind === "lecture" && l ? { lecture: omitWeekDate(l) } : kind === "workshop" && w ? { workshop: omitWeekDate(w) } : kind === "reading" && b ? { book: omitWeekDate(b) } : {};
      return { id: `${s.semester.code}-w${String(week).padStart(2, "0")}`, semester: s.semester.code, week, date, kind, position: i, data: { ...rest, ...detail } };
    }),
    resources: s.resources.map((r, i) => ({ id: `res-${i + 1}`, kind: r.kind, deadline: r.deadline ?? null, position: i, data: r })),
    projects: s.projectDecks.map((p, i) => ({ id: p.id, position: i, data: p })),
    papers: s.papers.map((p, i) => ({ id: `paper-${i + 1}`, year: p.year, data: p })),
    partners: s.partners.map((p, i) => ({ id: `partner-${i + 1}`, position: i, data: p })),
    weekly_issues: s.weekly.map((w) => ({ id: `vol-${w.vol}`, vol: w.vol, range_start: isoFromRange(w.year, w.range.slice(0, 5)), range_end: isoFromRange(w.year, w.range.slice(-5)), data: { lede: w.lede, ledeEn: w.ledeEn } })),
    weekly_stories: s.weekly.flatMap((w) => w.stories.map((st, i) => ({ id: `vol-${w.vol}-${i + 1}`, issue_id: `vol-${w.vol}`, position: i + 1, data: { ...st, headline: w.headlines[i], headlineEn: w.headlinesEn[i] } }))),
  };
}
```
注意：`Rows` 的 `id` 在這裡是人讀得懂的字串；真正寫入 DB 時 uuid 欄位的表要用 `gen_random_uuid()`，所以 seed 腳本會把這些 id 換掉（見 Step 5），`weekly_stories.issue_id` 用寫入後拿到的 uuid 對回去。

- [ ] **Step 4: 跑，確認通過**

Run: `npm run test:unit`
Expected: 全部 pass。

- [ ] **Step 5: 寫 seed 腳本**

`scripts/seed-content.ts`：
```ts
// 一次性：把 repo 內的快照匯入 Supabase（上傳圖片到 media bucket、寫入各表，全部 published）。
// 需要環境變數 SUPABASE_URL、SUPABASE_SERVICE_KEY。再跑一次會先清空各表（只在初次建置與測試專案使用）。
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { parseSnapshot } from "../src/lib/content.schema.ts";
import { rewriteAssetPaths, snapshotToRows } from "./lib/snapshot-to-rows.ts";
import { collectImagePaths } from "./lib/rows-to-snapshot.ts";

const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_KEY;
if (!url || !key) { console.error("need SUPABASE_URL and SUPABASE_SERVICE_KEY"); process.exit(1); }
const db = createClient(url, key, { auth: { persistSession: false } });

const snapshot = rewriteAssetPaths(parseSnapshot(JSON.parse(readFileSync(new URL("../src/lib/content.snapshot.json", import.meta.url), "utf8"))));
const rows = snapshotToRows(snapshot);

// 1. 圖片：/media/x → 讀 assets/x 上傳到 bucket media 路徑 x
for (const p of collectImagePaths(snapshot)) {
  const rel = p.replace("/media/", "");
  const file = readFileSync(new URL(`../assets/${rel}`, import.meta.url));
  const ext = rel.split(".").pop();
  const type = ext === "svg" ? "image/svg+xml" : ext === "png" ? "image/png" : "image/jpeg";
  const { error } = await db.storage.from("media").upload(rel, file, { contentType: type, upsert: true });
  if (error) throw new Error(`upload ${rel}: ${error.message}`);
  console.log("uploaded", rel);
}

// 2. 清空（順序：先子表）
for (const t of ["weekly_stories", "weekly_issues", "partners", "papers", "projects", "resources", "events", "settings"]) {
  const { error } = await db.from(t).delete().not("created_at", "is", null);
  if (error) throw new Error(`clear ${t}: ${error.message}`);
}

const published = { status: "published", updated_by: "seed" };
const insert = async (table: string, data: object[]) => {
  const { data: out, error } = await db.from(table).insert(data).select("id");
  if (error) throw new Error(`insert ${table}: ${error.message}`);
  console.log(`inserted ${table}: ${out.length}`);
  return out as Array<{ id: string }>;
};

await insert("settings", rows.settings.map((r) => ({ ...r, ...published })));
await insert("events", rows.events.map(({ id: _i, ...r }) => ({ ...r, ...published })));
await insert("resources", rows.resources.map(({ id: _i, ...r }) => ({ ...r, ...published })));
await insert("projects", rows.projects.map((r) => ({ ...r, ...published })));
await insert("papers", rows.papers.map(({ id: _i, ...r }) => ({ ...r, ...published })));
await insert("partners", rows.partners.map(({ id: _i, ...r }) => ({ ...r, ...published })));
const issues = await insert("weekly_issues", rows.weekly_issues.map(({ id: _i, ...r }) => ({ ...r, ...published })));
const issueIdByVol = new Map(rows.weekly_issues.map((r, i) => [r.id, issues[i].id]));
await insert("weekly_stories", rows.weekly_stories.map(({ id: _i, issue_id, ...r }) => ({ ...r, issue_id: issueIdByVol.get(issue_id), updated_by: "seed" })));
console.log("seed done");
```

- [ ] **Step 6: 對測試專案跑 seed，驗證筆數**

```bash
SUPABASE_URL=$SUPABASE_TEST_URL SUPABASE_SERVICE_KEY=$SUPABASE_TEST_SERVICE_KEY node scripts/seed-content.ts
```
Expected: 每張表印出 inserted 筆數：settings 1、events 16、resources ≥3、projects 3、papers 6、partners 4、weekly_issues 3、weekly_stories 9；uploaded 若干。到 Supabase 後台 Table Editor 看 `partners` 有 4 列、Storage `media/partners/` 有 3 個檔。

若使用者尚未提供測試專案：commit 程式，HANDOFF 記「Task 7 Step 6 待補跑」。

- [ ] **Step 7: Commit**

```bash
npm test
git add scripts/seed-content.ts scripts/lib/snapshot-to-rows.ts tests/unit/seed-plan.test.ts
git commit -m "seed：把現有內容匯入 Supabase（圖片上傳＋各表寫入）；snapshot↔rows 互為反向測試"
```

---

### Task 8: pull-content（重建時從 Supabase 產生快照與圖片）

**Files:**
- Create: `scripts/pull-content.ts`
- Create: `scripts/lib/pull.ts`（可注入 I/O 的核心，方便單元測試）
- Test: `tests/unit/pull.test.ts`

**Interfaces:**
- Consumes: `rowsToSnapshot`、`collectImagePaths`、Supabase service key
- Produces:
  ```ts
  // scripts/lib/pull.ts
  export type PullIO = {
    fetchRows: () => Promise<Rows>;
    fetchImage: (mediaPath: string) => Promise<Uint8Array>;   // mediaPath 如 "partners/gad.svg"
    writeFile: (relPath: string, bytes: Uint8Array | string) => void; // 相對 repo 根目錄
    today: string; now: string;
  };
  export async function pull(io: PullIO): Promise<{ snapshot: Snapshot; images: string[] }>;
  ```
  - 寫 `src/lib/content.snapshot.json` 與 `public/media/<path>`；任何步驟失敗 throw（不寫任何檔）。
- `scripts/pull-content.ts`：組真實 I/O（supabase-js＋fetch＋fs），先喚醒（對 `settings` 做一次 select，失敗重試 3 次、間隔 20 秒），成功印出筆數摘要，失敗以非 0 結束。沒有環境變數時印 `pull-content: no SUPABASE_URL, keeping committed snapshot` 並以 0 結束（本機與 fork 走這條）。

- [ ] **Step 1: 寫失敗測試**

`tests/unit/pull.test.ts`：
```ts
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { pull, type PullIO } from "../../scripts/lib/pull.ts";
import { parseSnapshot } from "../../src/lib/content.schema.ts";
import { rewriteAssetPaths, snapshotToRows } from "../../scripts/lib/snapshot-to-rows.ts";

const snap = rewriteAssetPaths(parseSnapshot(JSON.parse(readFileSync(new URL("../../src/lib/content.snapshot.json", import.meta.url), "utf8"))));

function fakeIO(overrides: Partial<PullIO> = {}) {
  const written = new Map<string, Uint8Array | string>();
  const io: PullIO = {
    fetchRows: async () => snapshotToRows(snap),
    fetchImage: async () => new Uint8Array([1, 2, 3]),
    writeFile: (p, b) => { written.set(p, b); },
    today: "2026-09-14", now: "2026-09-14T00:00:00Z",
    ...overrides,
  };
  return { io, written };
}

test("writes snapshot json and every image", async () => {
  const { io, written } = fakeIO();
  const out = await pull(io);
  assert.ok(written.has("src/lib/content.snapshot.json"));
  for (const img of out.images) assert.ok(written.has(`public/media/${img.replace("/media/", "")}`), img);
  assert.equal(JSON.parse(String(written.get("src/lib/content.snapshot.json"))).generatedAt, "2026-09-14T00:00:00Z");
});

test("image download failure aborts without writing anything", async () => {
  const { io, written } = fakeIO({ fetchImage: async (p) => { throw new Error(`404 ${p}`); } });
  await assert.rejects(() => pull(io), /404/);
  assert.equal(written.size, 0);
});

test("invalid rows abort without writing anything", async () => {
  const { io, written } = fakeIO({ fetchRows: async () => { const r = snapshotToRows(snap); r.partners[0] = { ...r.partners[0], data: { zh: "x" } }; return r; } });
  await assert.rejects(() => pull(io), /partners\.0/);
  assert.equal(written.size, 0);
});
```

- [ ] **Step 2: 跑，確認失敗**

Run: `npm run test:unit`
Expected: `Cannot find module '.../scripts/lib/pull.ts'`

- [ ] **Step 3: 寫核心**

`scripts/lib/pull.ts`：
```ts
// 拉內容的核心：先把所有東西抓齊、驗證過，最後才一次寫檔。任何一步失敗就不留下半成品。
import { rowsToSnapshot, collectImagePaths, type Rows } from "./rows-to-snapshot.ts";
import type { Snapshot } from "../../src/lib/content.schema.ts";

export type PullIO = {
  fetchRows: () => Promise<Rows>;
  fetchImage: (mediaPath: string) => Promise<Uint8Array>;
  writeFile: (relPath: string, bytes: Uint8Array | string) => void;
  today: string;
  now: string;
};

export async function pull(io: PullIO): Promise<{ snapshot: Snapshot; images: string[] }> {
  const rows = await io.fetchRows();
  const snapshot = rowsToSnapshot(rows, { today: io.today, generatedAt: io.now });
  const images = collectImagePaths(snapshot);
  const downloaded = new Map<string, Uint8Array>();
  for (const p of images) downloaded.set(p, await io.fetchImage(p.replace("/media/", "")));
  for (const [p, bytes] of downloaded) io.writeFile(`public/media/${p.replace("/media/", "")}`, bytes);
  io.writeFile("src/lib/content.snapshot.json", JSON.stringify(snapshot, null, 2) + "\n");
  return { snapshot, images };
}
```

- [ ] **Step 4: 跑，確認通過**

Run: `npm run test:unit`
Expected: 全部 pass。

- [ ] **Step 5: 寫真實 I/O 的入口**

`scripts/pull-content.ts`：
```ts
// GitHub Actions 建站前執行：從 Supabase 拉已發布內容 → 驗證 → 寫快照與圖片。
// 沒有鑰匙（本機、fork）就什麼都不做，沿用 repo 內的快照。
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { pull } from "./lib/pull.ts";
import type { Rows } from "./lib/rows-to-snapshot.ts";

const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_KEY;
if (!url || !key) { console.log("pull-content: no SUPABASE_URL, keeping committed snapshot"); process.exit(0); }
const db = createClient(url, key, { auth: { persistSession: false } });
const root = resolve(new URL("..", import.meta.url).pathname);

// 免費專案閒置會暫停，第一次查詢可能失敗：重試 3 次，每次隔 20 秒
async function wake() {
  for (let i = 1; i <= 3; i += 1) {
    const { error } = await db.from("settings").select("id").limit(1);
    if (!error) return;
    console.log(`wake attempt ${i} failed: ${error.message}`);
    await new Promise((r) => setTimeout(r, 20_000));
  }
  throw new Error("Supabase did not wake up after 3 attempts");
}

const live = (q: ReturnType<typeof db.from>) => q.select("*").eq("status", "published").is("deleted_at", null);

async function fetchRows(): Promise<Rows> {
  const get = async <T,>(table: string, q = live(db.from(table))) => {
    const { data, error } = await q;
    if (error) throw new Error(`${table}: ${error.message}`);
    return data as T[];
  };
  const issues = await get<Rows["weekly_issues"][number]>("weekly_issues");
  const { data: stories, error } = await db.from("weekly_stories").select("*").in("issue_id", issues.map((i) => i.id));
  if (error) throw new Error(`weekly_stories: ${error.message}`);
  return {
    settings: await get("settings"),
    events: await get("events"),
    resources: await get("resources"),
    projects: await get("projects"),
    papers: await get("papers"),
    partners: await get("partners"),
    weekly_issues: issues,
    weekly_stories: stories as Rows["weekly_stories"],
  };
}

async function fetchImage(mediaPath: string) {
  const { data, error } = await db.storage.from("media").download(mediaPath);
  if (error || !data) throw new Error(`download ${mediaPath}: ${error?.message ?? "empty"}`);
  return new Uint8Array(await data.arrayBuffer());
}

await wake();
const { snapshot, images } = await pull({
  fetchRows, fetchImage,
  writeFile: (rel, bytes) => { const p = resolve(root, rel); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, bytes); },
  today: new Date().toISOString().slice(0, 10),
  now: new Date().toISOString(),
});
console.log(`pull-content: ${snapshot.weekly.length} issues, ${snapshot.calendar.length} events, ${snapshot.resources.length} resources, ${snapshot.projectDecks.length} projects, ${snapshot.papers.length} papers, ${snapshot.partners.length} partners, ${images.length} images`);
```

- [ ] **Step 6: 對測試專案實跑，確認前台不變**

```bash
SUPABASE_URL=$SUPABASE_TEST_URL SUPABASE_SERVICE_KEY=$SUPABASE_TEST_SERVICE_KEY node scripts/pull-content.ts
git diff --stat src/lib/content.snapshot.json
npx playwright test --reporter=line 2>&1 | tail -1
```
Expected：印出筆數摘要；`content.snapshot.json` 的差異只有 `generatedAt` 與圖片路徑 `/assets/→/media/`；`public/media/` 出現圖片；Playwright `80 passed`（若有測試直接比對 `/assets/partners/...` 路徑，把測試的預期改成 `/media/...`，因為這是預期中的路徑變更）。

沒有測試專案時：跳過實跑，HANDOFF 記「Task 8 Step 6 待補跑」。

- [ ] **Step 7: `.gitignore` 加 `public/media/`（圖片由重建時下載，不進 repo；`public/assets/` 本來就是同步產物）**

- [ ] **Step 8: Commit**

```bash
npm test
git add scripts/pull-content.ts scripts/lib/pull.ts tests/unit/pull.test.ts .gitignore
git commit -m "pull-content：重建時從 Supabase 拉已發布內容、驗證、下載圖片、寫快照；失敗不留半成品"
```

---

### Task 9: GitHub Actions 接上（pull → build → 快照 commit）

**Files:**
- Modify: `.github/workflows/pages.yml`
- Modify: `.github/workflows/next-ci.yml`（Node 24、跑 `npm test` 含單元測試）
- Modify: `STATUS.md`、`HANDOFF.md`、`README.md`（部署與內容來源說明）

**Interfaces:**
- Consumes: `scripts/pull-content.ts`；GitHub secrets `SUPABASE_URL`、`SUPABASE_SERVICE_KEY`（正式專案）
- Produces: `pages.yml` 可由 `push`、`workflow_dispatch`、`repository_dispatch`（type `content-updated`，第 2 期後台會用）觸發；成功後把更新的快照 commit 回 `main`（`[skip ci]`）。

- [ ] **Step 1: 改 `pages.yml`**

整檔換成：
```yaml
# 正式站：main 推送、手動、或後台發布（repository_dispatch: content-updated）都會
# 從 Supabase 拉內容 → build → 部署到 GitHub Pages，並把新快照 commit 回 main。
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:
  repository_dispatch:
    types: [content-updated]

permissions:
  contents: write
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: main
      - uses: actions/setup-node@v4
        with:
          node-version: 24
      - run: npm install --no-audit --no-fund
      - name: Pull published content from Supabase
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
        run: node scripts/pull-content.ts
      - run: npm run typecheck
      - run: node scripts/check-internal-links.mjs
      - run: npm run test:unit
      - run: NEXT_PUBLIC_BASE_PATH=/ftl-web-demo npm run build
      - run: touch out/.nojekyll
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out
      - name: Commit refreshed snapshot
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add src/lib/content.snapshot.json
          git diff --cached --quiet || git commit -m "內容快照更新 [skip ci]"
          git push
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: 改 `next-ci.yml`：`node-version: 24`，並把 `npm run typecheck`／`npm run lint` 兩步換成 `npm test`（含連結檢查與單元測試）。**

- [ ] **Step 3: 把正式 secrets 放進 repo（使用者提供正式專案的值之後）**

```bash
gh secret set SUPABASE_URL --body "https://xxxx.supabase.co"
gh secret set SUPABASE_SERVICE_KEY --body "..."
```
若尚未提供：不設 secrets，`pull-content` 會印 `keeping committed snapshot` 並正常建站——這是設計好的降級路徑，CI 不會紅。

- [ ] **Step 4: 文件**

`STATUS.md` 的「正式站」段加：
```
- 內容來源：六類內容與學期設定存在 Supabase（社團 Gmail 名下）；建站時 `scripts/pull-content.ts` 拉已發布資料成 `src/lib/content.snapshot.json`。沒有鑰匙的環境沿用 repo 內快照。
- 後台：第 2 期（見 docs/specs/2026-09-14-admin-cms-design.md）。
```
`README.md` 的「檔案結構」把 `src/lib/content.ts` 那行改成三行（`content.static.ts`／`content.remote.ts`＋快照／`content.schema.ts`），並加一段「內容怎麼更新」：現在＝改 Supabase 後手動 `workflow_dispatch`，第 2 期後＝後台按發布。
`HANDOFF.md`：記錄本期完成狀態與「待使用者補做」清單（測試專案、正式專案、secrets）。

- [ ] **Step 5: push 並驗證正式站**

```bash
npm test && git add -A && git commit -m "GitHub Actions：建站前拉 Supabase 內容、快照回寫；Node 24；文件"
git push origin main
```
等 `pages.yml` 跑完（`gh run watch`），然後：
```bash
curl -s https://hunter20041004.github.io/ftl-web-demo/ | grep -c "Hextech Video Studio"
```
Expected: `1`（內容不變）。到 Actions log 確認 `pull-content:` 那行印出筆數（有 secrets）或 `keeping committed snapshot`（沒有）。Playwright 對正式站跑一次 `tests/visual/routes.spec.ts`（把 `baseURL` 暫時指向正式站）確認七頁無錯誤。

- [ ] **Step 6: 若有正式 secrets：從 Supabase 後台改一筆合作對象名稱 → 手動 `gh workflow run pages.yml` → 2 分鐘後正式站出現新名稱 → 改回去再跑一次。** 這是本期的端到端驗收。

---

## 自我檢查（寫完計畫後）

- **Spec 覆蓋**：§4 架構（Task 8、9）、§5 資料模型（Task 5；差異已在 Global Constraints 說明）、§7 發布流程的「拉資料、驗證、下載圖片、快照 commit、喚醒重試、失敗不部署」（Task 8、9）、§8 前台改法（Task 3、4）、§9 測試中的「pull-content 單元測試、契約測試、前台 80 測試」（Task 5、6、8）、§10 上線順序第 1–3 步（Task 5、7、9）。**未涵蓋（屬第 2、3 期）**：Edge Function `trigger-rebuild`、後台所有頁面、後台 E2E、資源頁的書（`resources.kind='book'`）與讀書會分離的後台編輯、學期設定的後台編輯、週報貼上拆解、幹部說明頁。
- **占位掃描**：無 TBD／TODO；每個程式步驟都有完整程式碼。
- **型別一致**：`Rows`（Task 6）在 Task 7、8 一致；`PullIO` 只在 Task 8；`parseSnapshot`／`Snapshot` 來自 Task 2；`rewriteAssetPaths`／`snapshotToRows` 來自 Task 7；`collectImagePaths` 來自 Task 6。
