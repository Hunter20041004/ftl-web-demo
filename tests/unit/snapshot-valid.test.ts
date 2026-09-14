import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseSnapshot } from "../../src/lib/content.schema.ts";

// 注意：這個測試在正式站建置時（pull-content 之後）也會跑，內容是幹部隨時會改的，
// 所以只驗「格式正確」，不能寫死筆數（曾經因為多了一篇研究文章讓發布失敗）。
test("committed snapshot validates against the schema", () => {
  const snap = parseSnapshot(JSON.parse(readFileSync(new URL("../../src/lib/content.snapshot.json", import.meta.url), "utf8")));
  assert.ok(snap.generatedAt);
  assert.ok(snap.semester.code);
  for (const issue of snap.weekly) assert.equal(issue.stories.length, 3);
  for (const deck of snap.projectDecks) assert.equal(deck.slides.length, 4);
});
