// 管理員名單：任何管理員可加減 email（RLS 同一條規則）。不能移除自己，避免把自己鎖在門外。
import { getSupabase } from "./supabase.ts";

export type AdminRow = { email: string; added_by: string | null; added_at: string };

export async function listAdmins(): Promise<AdminRow[]> {
  const { data, error } = await getSupabase().from("admins").select("email, added_by, added_at").order("added_at");
  if (error) throw new Error(error.message);
  return data as AdminRow[];
}

export function normalizeEmail(input: string) {
  const email = input.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

export async function addAdmin(email: string, addedBy: string) {
  const { error } = await getSupabase().from("admins").insert({ email, added_by: addedBy });
  if (error) throw new Error(error.code === "23505" ? "已經在名單裡" : error.message);
}

export async function removeAdmin(email: string) {
  const { error } = await getSupabase().from("admins").delete().eq("email", email);
  if (error) throw new Error(error.message);
}

// 總覽用：各表已發布／草稿筆數
export async function countTable(table: string): Promise<{ published: number; draft: number }> {
  const sb = getSupabase();
  const [p, d] = await Promise.all([
    sb.from(table).select("*", { count: "exact", head: true }).eq("status", "published").is("deleted_at", null),
    sb.from(table).select("*", { count: "exact", head: true }).eq("status", "draft").is("deleted_at", null),
  ]);
  return { published: p.count ?? 0, draft: d.count ?? 0 };
}
