import { test, expect } from "@playwright/test";
import { TEST_ANON, TEST_URL, USERS, loginAs } from "./helpers";
import { admin, service } from "./entity-helpers";

test.beforeEach(() => { test.skip(!TEST_URL() || !TEST_ANON() || !service(), "needs SUPABASE_TEST_*"); });
test.afterEach(async () => {
  const { data } = await admin().from("settings").select("data").eq("id", "default").single();
  await admin().from("settings").update({ data: { ...data!.data, semester: { ...data!.data.semester, code: "115-1" } } }).eq("id", "default");
});

test("settings: edit semester code and a reward tier, publish", async ({ page }) => {
  await loginAs(page, USERS.editor);
  await page.getByRole("navigation").getByRole("link", { name: "學期設定" }).click();
  await expect(page.getByLabel("學期代號")).toHaveValue("115-1");
  await page.getByLabel("學期代號").fill("");
  await page.getByRole("button", { name: "發布" }).click();
  await expect(page.getByText("必填").first()).toBeVisible();
  await page.getByLabel("學期代號").fill("115-2");
  await page.getByRole("button", { name: "發布" }).click();
  await page.getByRole("button", { name: "確定發布" }).click();
  await expect(page.getByText("已送出重建")).toBeVisible();
  const { data } = await admin().from("settings").select("data").eq("id", "default").single();
  expect(data?.data.semester.code).toBe("115-2");
  expect(data?.data.membership.reward.tiers.length).toBe(4);
});
