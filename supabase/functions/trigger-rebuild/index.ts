// Edge Function：後台按「發布」時呼叫。驗證呼叫者在 admins 名單，再用 GITHUB_TOKEN 叫 GitHub 重建；
// GET 回傳最近一次 pages.yml 的狀態。GitHub token 只存在這裡（Supabase secrets），不會到瀏覽器。
import { createClient } from "npm:@supabase/supabase-js@2";

const REPO = "Hunter20041004/ftl-web-demo";
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};
const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const auth = req.headers.get("Authorization") ?? "";
  if (!auth.startsWith("Bearer ")) return json({ error: "unauthenticated" }, 401);
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: auth } },
  });
  const { data: { user } } = await sb.auth.getUser();
  if (!user?.email) return json({ error: "unauthenticated" }, 401);
  const { data: admin } = await sb.from("admins").select("email").eq("email", user.email.toLowerCase()).maybeSingle();
  if (!admin) return json({ error: "forbidden" }, 403);

  const gh = {
    Authorization: `Bearer ${Deno.env.get("GITHUB_TOKEN") ?? ""}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "ftl-admin",
  };

  if (req.method === "GET") {
    const r = await fetch(`https://api.github.com/repos/${REPO}/actions/workflows/pages.yml/runs?per_page=1`, { headers: gh });
    if (!r.ok) return json({ status: "none", github: r.status }, 200);
    const run = (await r.json()).workflow_runs?.[0];
    return json(run ? { status: run.status, conclusion: run.conclusion, createdAt: run.created_at, updatedAt: run.updated_at, url: run.html_url } : { status: "none" }, 200);
  }

  const body = await req.json().catch(() => ({}));
  // 測試專案設 REBUILD_DRY_RUN=true：E2E 按發布不會真的重建正式站
  if (body.dryRun || Deno.env.get("REBUILD_DRY_RUN") === "true") return json({ ok: true, dryRun: true }, 200);
  const r = await fetch(`https://api.github.com/repos/${REPO}/dispatches`, {
    method: "POST",
    headers: gh,
    body: JSON.stringify({ event_type: "content-updated", client_payload: { by: user.email } }),
  });
  return json({ ok: r.status === 204, github: r.status }, r.status === 204 ? 200 : 502);
});
