import { test, expect } from "@playwright/test";
import { TEST_ANON, TEST_URL, USERS, loginAs } from "./helpers";

test.beforeEach(() => { test.skip(!TEST_URL() || !TEST_ANON(), "needs SUPABASE_TEST_*"); });

test("logged-out visitor sees the Google sign-in screen only", async ({ page }) => {
  await page.goto("/admin/");
  await expect(page.getByRole("button", { name: /Google 登入/ })).toBeVisible();
  await expect(page.getByRole("navigation").getByRole("link", { name: "合作對象" })).toHaveCount(0);
});

test("a logged-in non-admin is rejected and can sign out", async ({ page }) => {
  await loginAs(page, USERS.outsider);
  await expect(page.getByText("這個帳號沒有權限")).toBeVisible();
  await page.getByRole("button", { name: "登出" }).click();
  await expect(page.getByRole("button", { name: /Google 登入/ })).toBeVisible();
});

test("an admin sees the shell with navigation", async ({ page }) => {
  await loginAs(page, USERS.editor);
  await expect(page.getByRole("navigation").getByRole("link", { name: "合作對象" })).toBeVisible();
  await expect(page.getByRole("complementary").getByText(USERS.editor.email)).toBeVisible();
});
