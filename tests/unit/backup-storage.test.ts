import test from "node:test";
import assert from "node:assert/strict";
import { backupStorage } from "../../scripts/lib/backup-storage.ts";

// 假的 bucket：資料夾與檔案混在同一層，模擬 Supabase Storage list() 的回傳
const tree: Record<string, { name: string; id: string | null }[]> = {
  "": [{ name: "partners", id: null }, { name: "root.png", id: "1" }],
  partners: [{ name: "gad.svg", id: "2" }, { name: "sub", id: null }],
  "partners/sub": [{ name: "deep.jpg", id: "3" }],
};

function fakeClient(failOn?: string) {
  const written: string[] = [];
  return {
    written,
    list: async (prefix: string) => tree[prefix] ?? [],
    download: async (path: string) => {
      if (path === failOn) throw new Error(`boom ${path}`);
      return new Uint8Array([1]);
    },
    writeFile: (rel: string) => { written.push(rel); },
  };
}

test("recursively lists folders and downloads every file", async () => {
  const c = fakeClient();
  const result = await backupStorage(c);
  assert.deepEqual(result.files.sort(), ["partners/gad.svg", "partners/sub/deep.jpg", "root.png"]);
  assert.deepEqual(c.written.sort(), ["backup/media/partners/gad.svg", "backup/media/partners/sub/deep.jpg", "backup/media/root.png"]);
});

test("a failed download fails the whole backup instead of skipping silently", async () => {
  const c = fakeClient("partners/gad.svg");
  await assert.rejects(() => backupStorage(c), /partners\/gad\.svg/);
});

test("an empty bucket is treated as an error (nothing to back up is suspicious)", async () => {
  const c = { ...fakeClient(), list: async () => [] };
  await assert.rejects(() => backupStorage(c), /empty/i);
});
