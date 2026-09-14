// 測試專案專用：建立 E2E 用的兩個 email/password 使用者（一個是管理員、一個不是）。
// 需要 SUPABASE_TEST_URL、SUPABASE_TEST_SERVICE_KEY。正式專案不要跑。
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_TEST_URL, key = process.env.SUPABASE_TEST_SERVICE_KEY;
if (!url || !key) { console.error("need SUPABASE_TEST_URL and SUPABASE_TEST_SERVICE_KEY"); process.exit(1); }
const db = createClient(url, key, { auth: { persistSession: false } });

export const TEST_USERS = {
  editor: { email: "editor@test.local", password: "editor-pass-123", admin: true },
  outsider: { email: "outsider@test.local", password: "outsider-pass-123", admin: false },
};

for (const u of Object.values(TEST_USERS)) {
  const { data: list } = await db.auth.admin.listUsers({ perPage: 200 });
  const existing = list?.users.find((x) => x.email === u.email);
  if (!existing) {
    const { error } = await db.auth.admin.createUser({ email: u.email, password: u.password, email_confirm: true });
    if (error) throw new Error(`create ${u.email}: ${error.message}`);
    console.log("created", u.email);
  } else console.log("exists", u.email);
  if (u.admin) {
    const { error } = await db.from("admins").upsert({ email: u.email, added_by: "setup-test-users" });
    if (error) throw new Error(`admins ${u.email}: ${error.message}`);
  } else {
    await db.from("admins").delete().eq("email", u.email);
  }
}
console.log("test users ready");
