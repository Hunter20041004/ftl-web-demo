// GitHub Actions 建站前執行：從 Supabase 拉已發布內容 → 驗證 → 寫快照與圖片。
// 沒有鑰匙（本機、fork）就什麼都不做，沿用 repo 內的快照。
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { pull } from "./lib/pull.ts";
import type { Rows } from "./lib/rows-to-snapshot.ts";

const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_KEY;
if (!url || !key) { console.log("pull-content: no SUPABASE_URL, keeping committed snapshot"); process.exit(0); }
const db = createClient(url, key, { auth: { persistSession: false } });
const root = fileURLToPath(new URL("..", import.meta.url));

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

// 免費專案偶爾回 Gateway Timeout；每個查詢都重試 3 次（間隔 5 秒），不要因為一次抖動就讓發布失敗
async function retry<T>(label: string, fn: () => Promise<{ data: T | null; error: { message: string } | null }>): Promise<T> {
  let last = "";
  for (let i = 1; i <= 3; i += 1) {
    const { data, error } = await fn();
    if (!error && data) return data;
    last = error?.message ?? "empty";
    console.log(`${label}: attempt ${i} failed: ${last}`);
    await new Promise((r) => setTimeout(r, 5_000));
  }
  throw new Error(`${label}: ${last}`);
}

async function get<T>(table: string): Promise<T[]> {
  return retry<T[]>(table, () => db.from(table).select("*").eq("status", "published").is("deleted_at", null));
}

async function fetchRows(): Promise<Rows> {
  const issues = await get<Rows["weekly_issues"][number]>("weekly_issues");
  const stories = await retry<Rows["weekly_stories"]>("weekly_stories", () => db.from("weekly_stories").select("*").in("issue_id", issues.map((i) => i.id)));
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
  const blob = await retry<Blob>(`download ${mediaPath}`, () => db.storage.from("media").download(mediaPath));
  return new Uint8Array(await blob.arrayBuffer());
}

await wake();
const { snapshot, images } = await pull({
  fetchRows, fetchImage,
  writeFile: (rel, bytes) => { const p = resolve(root, rel); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, bytes); },
  today: new Date().toISOString().slice(0, 10),
  now: new Date().toISOString(),
});
console.log(`pull-content: ${snapshot.weekly.length} issues, ${snapshot.calendar.length} events, ${snapshot.resources.length} resources, ${snapshot.projectDecks.length} projects, ${snapshot.papers.length} papers, ${snapshot.partners.length} partners, ${images.length} images`);
