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
