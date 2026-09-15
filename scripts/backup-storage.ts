// 每週備份用：把 Supabase Storage bucket `media` 全部下載到 backup/media/。
// 設計：docs/specs/2026-09-15-supabase-backup-design.md
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { backupStorage } from "./lib/backup-storage.ts";

const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_KEY;
if (!url || !key) { console.error("backup-storage: SUPABASE_URL / SUPABASE_SERVICE_KEY missing"); process.exit(1); }
const db = createClient(url, key, { auth: { persistSession: false } });
const root = fileURLToPath(new URL("..", import.meta.url));

// 免費專案閒置會暫停：先戳一下，最多等 3 次（與 pull-content 相同）
async function wake() {
  for (let i = 1; i <= 3; i += 1) {
    const { error } = await db.from("settings").select("id").limit(1);
    if (!error) return;
    console.log(`wake attempt ${i} failed: ${error.message}`);
    await new Promise((r) => setTimeout(r, 20_000));
  }
  throw new Error("Supabase did not wake up after 3 attempts");
}

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

await wake();
const bucket = db.storage.from("media");
const { files } = await backupStorage({
  list: (prefix) => retry(`list ${prefix || "/"}`, () => bucket.list(prefix, { limit: 1000 })),
  download: async (path) => new Uint8Array(await (await retry<Blob>(`download ${path}`, () => bucket.download(path))).arrayBuffer()),
  writeFile: (rel, bytes) => { const p = resolve(root, rel); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, bytes); },
});
console.log(`backup-storage: ${files.length} files`);
