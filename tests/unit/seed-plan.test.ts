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

test("snapshotToRows writes ISO dates for events (Postgres date column)", () => {
  const rows = snapshotToRows(snap);
  assert.match(rows.events[0].date, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(rows.events[0].date, "2026-09-09");
});

test("rewriteAssetPaths turns /assets/x into /media/x and leaves others", () => {
  const out = rewriteAssetPaths({ ...snap, partners: [{ zh: "a", en: "a", href: "https://a/", logo: "/assets/partners/gad.svg" }] });
  assert.equal(out.partners[0].logo, "/media/partners/gad.svg");
});
