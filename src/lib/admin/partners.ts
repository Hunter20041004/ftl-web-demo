// 合作對象的讀寫。資料形狀＝前台的 Partner（zh/en/href/logo/markOnly），存在 partners.data。
import type { Partner } from "../content.schema.ts";
import { getSupabase } from "./supabase.ts";
import { resizeImage } from "./image.ts";

export type PartnerRow = { id: string; position: number; status: "draft" | "published"; deleted_at: string | null; updated_at: string; data: Partner };

export function validatePartner(p: Partial<Partner>, opts: { draft?: boolean } = {}): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!opts.draft) {
    if (!p.zh?.trim()) errors.zh = "必填";
    if (!p.en?.trim()) errors.en = "必填";
    if (!p.href?.trim()) errors.href = "必填";
  }
  if (p.href && !/^https?:\/\//.test(p.href)) errors.href = "要以 http:// 或 https:// 開頭";
  return errors;
}

export async function listPartners(includeDeleted = false): Promise<PartnerRow[]> {
  let q = getSupabase().from("partners").select("id, position, status, deleted_at, updated_at, data").order("position");
  if (!includeDeleted) q = q.is("deleted_at", null);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data as PartnerRow[];
}

export async function savePartner(row: { id?: string; data: Partner; status: "draft" | "published"; position?: number }): Promise<PartnerRow> {
  const sb = getSupabase();
  const payload = { data: row.data, status: row.status, ...(row.position !== undefined ? { position: row.position } : {}) };
  const q = row.id
    ? sb.from("partners").update(payload).eq("id", row.id)
    : sb.from("partners").insert({ ...payload, position: row.position ?? (await nextPosition()) });
  const { data, error } = await q.select("id, position, status, deleted_at, updated_at, data").single();
  if (error) throw new Error(error.message);
  return data as PartnerRow;
}

async function nextPosition() {
  const { data } = await getSupabase().from("partners").select("position").order("position", { ascending: false }).limit(1);
  return (data?.[0]?.position ?? -1) + 1;
}

// 只有幾筆，逐筆更新 position 就好
export async function reorderPartners(ids: string[]) {
  const sb = getSupabase();
  for (const [i, id] of ids.entries()) {
    const { error } = await sb.from("partners").update({ position: i }).eq("id", id);
    if (error) throw new Error(error.message);
  }
}

export async function softDeletePartner(id: string) {
  const { error } = await getSupabase().from("partners").update({ deleted_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function restorePartner(id: string) {
  const { error } = await getSupabase().from("partners").update({ deleted_at: null }).eq("id", id);
  if (error) throw new Error(error.message);
}

// 上傳 logo：先縮到最長邊 400px（SVG 原樣），存到 media bucket 的 partners/，回傳前台用的 /media/... 路徑
export async function uploadLogo(file: File): Promise<string> {
  const blob = await resizeImage(file, 400);
  const ext = blob.type === "image/svg+xml" ? "svg" : blob.type === "image/png" ? "png" : "jpg";
  const slug = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "logo";
  const path = `partners/${slug}-${Date.now()}.${ext}`;
  const { error } = await getSupabase().storage.from("media").upload(path, blob, { contentType: blob.type, upsert: false });
  if (error) throw new Error(error.message);
  return `/media/${path}`;
}

export function publicMediaUrl(mediaPath: string) {
  return getSupabase().storage.from("media").getPublicUrl(mediaPath.replace(/^\/media\//, "")).data.publicUrl;
}
