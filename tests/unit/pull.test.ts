import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { pull, type PullIO } from "../../scripts/lib/pull.ts";
import { parseSnapshot } from "../../src/lib/content.schema.ts";
import { rewriteAssetPaths, snapshotToRows } from "../../scripts/lib/snapshot-to-rows.ts";

const snap = rewriteAssetPaths(parseSnapshot(JSON.parse(readFileSync(new URL("../../src/lib/content.snapshot.json", import.meta.url), "utf8"))));

function fakeIO(overrides: Partial<PullIO> = {}) {
  const written = new Map<string, Uint8Array | string>();
  const io: PullIO = {
    fetchRows: async () => snapshotToRows(snap),
    fetchImage: async () => new Uint8Array([1, 2, 3]),
    writeFile: (p, b) => { written.set(p, b); },
    today: "2026-09-14", now: "2026-09-14T00:00:00Z",
    ...overrides,
  };
  return { io, written };
}

test("writes snapshot json and every image", async () => {
  const { io, written } = fakeIO();
  const out = await pull(io);
  assert.ok(written.has("src/lib/content.snapshot.json"));
  assert.ok(out.images.length >= 7, "expect logos, book covers, project covers");
  for (const img of out.images) assert.ok(written.has(`public/media/${img.replace("/media/", "")}`), img);
  assert.equal(JSON.parse(String(written.get("src/lib/content.snapshot.json"))).generatedAt, "2026-09-14T00:00:00Z");
});

test("image download failure aborts without writing anything", async () => {
  const { io, written } = fakeIO({ fetchImage: async (p) => { throw new Error(`404 ${p}`); } });
  await assert.rejects(() => pull(io), /404/);
  assert.equal(written.size, 0);
});

test("invalid rows abort without writing anything", async () => {
  const { io, written } = fakeIO({ fetchRows: async () => { const r = snapshotToRows(snap); r.partners[0] = { ...r.partners[0], data: { zh: "x" } }; return r; } });
  await assert.rejects(() => pull(io), /partners\.0/);
  assert.equal(written.size, 0);
});
