// 拉內容的核心：先把所有東西抓齊、驗證過，最後才一次寫檔。任何一步失敗就不留下半成品。
import { rowsToSnapshot, collectImagePaths, type Rows } from "./rows-to-snapshot.ts";
import type { Snapshot } from "../../src/lib/content.schema.ts";

export type PullIO = {
  fetchRows: () => Promise<Rows>;
  fetchImage: (mediaPath: string) => Promise<Uint8Array>;
  writeFile: (relPath: string, bytes: Uint8Array | string) => void;
  today: string;
  now: string;
};

export async function pull(io: PullIO): Promise<{ snapshot: Snapshot; images: string[] }> {
  const rows = await io.fetchRows();
  const snapshot = rowsToSnapshot(rows, { today: io.today, generatedAt: io.now });
  const images = collectImagePaths(snapshot);
  const downloaded = new Map<string, Uint8Array>();
  for (const p of images) downloaded.set(p, await io.fetchImage(p.replace("/media/", "")));
  for (const [p, bytes] of downloaded) io.writeFile(`public/media/${p.replace("/media/", "")}`, bytes);
  io.writeFile("src/lib/content.snapshot.json", JSON.stringify(snapshot, null, 2) + "\n");
  return { snapshot, images };
}
