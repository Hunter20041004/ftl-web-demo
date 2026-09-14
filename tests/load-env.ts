// Playwright 的 globalSetup：把 .env.local 讀進 process.env（沒有檔案就略過），讓後台 E2E 拿得到測試專案的鑰匙。
import { existsSync, readFileSync } from "node:fs";

export default function loadEnv() {
  const file = new URL("../.env.local", import.meta.url);
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}
