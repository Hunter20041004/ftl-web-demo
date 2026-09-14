// 發布鏈的後台端：叫 Edge Function trigger-rebuild（POST＝觸發重建、GET＝最近一次狀態）。
import { getSupabase } from "./supabase.ts";

export type RebuildStatus = { status: "queued" | "in_progress" | "completed" | "none"; conclusion?: "success" | "failure" | "cancelled" | null; updatedAt?: string; url?: string };

async function call(method: "GET" | "POST", body?: unknown) {
  const sb = getSupabase();
  const { data: { session } } = await sb.auth.getSession();
  if (!session) throw new Error("未登入");
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/trigger-rebuild`, {
    method,
    headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
  return json;
}

export const triggerRebuild = () => call("POST", {});
export const getRebuildStatus = (): Promise<RebuildStatus> => call("GET");
