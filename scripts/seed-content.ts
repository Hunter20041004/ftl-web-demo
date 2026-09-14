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
