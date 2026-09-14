import type { Page } from "@playwright/test";

export const TEST_URL = () => process.env.SUPABASE_TEST_URL;
export const TEST_ANON = () => process.env.SUPABASE_TEST_ANON_KEY;
export const USERS = {
  editor: { email: "editor@test.local", password: "editor-pass-123" },
  outsider: { email: "outsider@test.local", password: "outsider-pass-123" },
};

// 後台畫面只有 Google 按鈕；測試用 supabase-js 直接以 email/password 登入，寫進同一個 localStorage key，重整後就是登入狀態。
export async function loginAs(page: Page, user: { email: string; password: string }) {
  await page.goto("/admin/");
  await page.waitForFunction(() => Boolean((window as unknown as { __ftlSupabase?: unknown }).__ftlSupabase));
  const err = await page.evaluate(async (u) => {
    const sb = (window as unknown as { __ftlSupabase: { auth: { signInWithPassword: (c: { email: string; password: string }) => Promise<{ error: { message: string } | null }> } } }).__ftlSupabase;
    const { error } = await sb.auth.signInWithPassword(u);
    return error?.message ?? null;
  }, user);
  if (err) throw new Error(`login failed: ${err}`);
  await page.reload();
}
