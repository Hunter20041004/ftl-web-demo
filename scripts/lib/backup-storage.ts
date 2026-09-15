// 把 Supabase Storage bucket 整個下載到 backup/media/。純邏輯，方便用假的 client 測試。
// Storage 的 list() 把子資料夾與檔案混在同一層回傳：資料夾的 id 是 null。
export type StorageEntry = { name: string; id: string | null };

export type StorageClient = {
  list: (prefix: string) => Promise<StorageEntry[]>;
  download: (path: string) => Promise<Uint8Array>;
  writeFile: (rel: string, bytes: Uint8Array) => void;
};

async function listAll(client: StorageClient, prefix: string): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await client.list(prefix)) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.id === null) files.push(...(await listAll(client, path)));
    else files.push(path);
  }
  return files;
}

export async function backupStorage(client: StorageClient) {
  const files = await listAll(client, "");
  if (files.length === 0) throw new Error("backup-storage: bucket is empty — refusing to write an empty backup");
  for (const path of files) client.writeFile(`backup/media/${path}`, await client.download(path));
  return { files };
}
