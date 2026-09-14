import test from "node:test";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";

// 契約測試：Edge Function trigger-rebuild 真的部署在測試專案上，且權限判斷正確。
const url = process.env.SUPABASE_TEST_URL;
const anon = process.env.SUPABASE_TEST_ANON_KEY;
const enabled = Boolean(url && anon);
const fn = `${url}/functions/v1/trigger-rebuild`;

async function tokenFor(email: string, password: string) {
  const { data, error } = await createClient(url!, anon!, { auth: { persistSession: false } }).auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session!.access_token;
}

test("no token → 401", { skip: !enabled }, async () => {
  const r = await fetch(fn, { method: "POST", body: "{}" });
  assert.equal(r.status, 401);
});

test("non-admin token → 403", { skip: !enabled }, async () => {
  const t = await tokenFor("outsider@test.local", "outsider-pass-123");
  const r = await fetch(fn, { method: "POST", headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }, body: "{}" });
  assert.equal(r.status, 403);
});

test("admin dry run → 200 ok, and GET returns a status", { skip: !enabled }, async () => {
  const t = await tokenFor("editor@test.local", "editor-pass-123");
  const h = { Authorization: `Bearer ${t}`, "Content-Type": "application/json" };
  const r = await fetch(fn, { method: "POST", headers: h, body: JSON.stringify({ dryRun: true }) });
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { ok: true, dryRun: true });
  const s = await fetch(fn, { method: "GET", headers: h });
  assert.equal(s.status, 200);
  const body = await s.json();
  assert.ok(["queued", "in_progress", "completed", "none"].includes(body.status), JSON.stringify(body));
});
