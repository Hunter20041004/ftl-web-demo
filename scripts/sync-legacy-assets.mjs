import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const source = resolve(root, "assets");
const publicRoot = resolve(root, "public");
const target = resolve(publicRoot, "assets");

if (!existsSync(source)) {
  throw new Error(`Legacy assets directory not found: ${source}`);
}

mkdirSync(publicRoot, { recursive: true });
rmSync(target, { recursive: true, force: true });
cpSync(source, target, { recursive: true });

console.log("Synced legacy assets -> public/assets");

// 快照裡的圖片路徑是 /media/...（正式站由 pull-content 從 Supabase 下載）。
// 本機沒有鑰匙時 public/media 不存在，就用 repo 內的 assets 當替身，圖片才不會破。
const media = resolve(publicRoot, "media");
if (!existsSync(media)) {
  for (const dir of ["partners", "books", "projects"]) {
    const from = resolve(source, dir);
    if (existsSync(from)) cpSync(from, resolve(media, dir), { recursive: true });
  }
  console.log("No public/media yet: copied assets/{partners,books,projects} as a local stand-in");
}
