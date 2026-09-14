import test from "node:test";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";

// 契約測試：連真的 Supabase「測試專案」，驗證資料庫層的權限真的有擋。
// 環境變數沒設就整個 skip（本機沒鑰匙、fork 都能跑 npm test）。
const url = process.env.SUPABASE_TEST_URL;
const anon = process.env.SUPABASE_TEST_ANON_KEY;
const service = process.env.SUPABASE_TEST_SERVICE_KEY;
const enabled = Boolean(url && anon && service);

const tables = ["settings", "events", "resources", "projects", "papers", "partners", "weekly_issues", "weekly_stories", "admins"];

// 沒登入（anon）的人：任何表都讀不到、寫不進。這條防「畫面有擋、資料庫沒擋」。
test("anonymous client cannot read or write content tables", { skip: !enabled }, async () => {
  const client = createClient(url!, anon!);
  for (const table of tables) {
    const read = await client.from(table).select("*").limit(1);
    assert.deepEqual(read.data, [], `${table} should be empty for anon`);
    const write = await client.from(table).insert({ data: {} } as never);
    assert.ok(write.error, `${table} insert should fail for anon`);
  }
});

test("service role can read every table (used by pull-content)", { skip: !enabled }, async () => {
  const client = createClient(url!, service!);
  const res = await client.from("partners").select("id").limit(1);
  assert.equal(res.error, null);
});

test("media bucket is public-read, anon cannot upload", { skip: !enabled }, async () => {
  const client = createClient(url!, anon!);
  const up = await client.storage.from("media").upload(`contract-test/${Date.now()}.txt`, new Blob(["x"]));
  assert.ok(up.error);
});
