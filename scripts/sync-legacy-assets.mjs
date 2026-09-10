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
