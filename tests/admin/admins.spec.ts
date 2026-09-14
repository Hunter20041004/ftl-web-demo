import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { TEST_ANON, TEST_URL, USERS, loginAs } from "./helpers";

const service = () => process.env.SUPABASE_TEST_SERVICE_KEY;
test.beforeEach(() => { test.skip(!TEST_URL() || !TEST_ANON() || !service(), "needs SUPABASE_TEST_*"); });
test.afterEach(async () => { await createClient(TEST_URL()!, service()!).from("admins").delete().eq("email", "new@test.local"); });

test("admin can add and remove another admin, but not themselves", async ({ page }) => {
  await loginAs(page, USERS.editor);
  await page.getByRole("navigation").getByRole("link", { name: "管理員" }).click();
  await expect(page.locator(`[data-testid="admin-row"][data-email="${USERS.editor.email}"]`)).toHaveCount(1);
  await page.getByLabel("Email").fill("New@Test.local");
  await page.getByRole("button", { name: "加入" }).click();
  await expect(page.getByText("new@test.local")).toBeVisible();
  // 自己那列沒有移除鍵
  const row = (email: string) => page.locator(`[data-testid="admin-row"][data-email="${email}"]`);
  await expect(row(USERS.editor.email).getByRole("button", { name: "移除" })).toHaveCount(0);
  await row("new@test.local").getByRole("button", { name: "移除" }).click();
  await page.getByRole("button", { name: "確定移除" }).click();
  await expect(page.getByText("new@test.local")).toHaveCount(0);
});

test("overview shows counts and last rebuild", async ({ page }) => {
  await loginAs(page, USERS.editor);
  await expect(page.getByTestId("count-partners")).toContainText(/\d+/);
  await expect(page.getByTestId("last-rebuild")).toBeVisible();
});
