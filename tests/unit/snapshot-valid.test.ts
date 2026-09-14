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
