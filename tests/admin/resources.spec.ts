import { test, expect } from "@playwright/test";
import { TEST_ANON, TEST_URL, USERS, loginAs } from "./helpers";
import { admin, deleteAndRestore, service } from "./entity-helpers";

test.beforeEach(() => { test.skip(!TEST_URL() || !TEST_ANON() || !service(), "needs SUPABASE_TEST_*"); });
test.afterEach(async () => { await admin().from("resources").delete().like("data->>title", "E2E%"); });

test("resources: kind auto-fills labels, deadline saved as column, expired rows flagged", async ({ page }) => {
  await loginAs(page, USERS.editor);
  await page.getByRole("navigation").getByRole("link", { name: "資源" }).click();
  await expect(page.getByTestId("entity-row")).toHaveCount(3);
  await page.getByRole("button", { name: "新增資源" }).click();
  await page.getByLabel("類型").selectOption("scholarship");
  await page.getByLabel("標題（中文）").fill("E2E 獎學金");
  await page.getByLabel("標題（英文）").fill("E2E Scholarship");
  await page.getByLabel("單位（中文）").fill("政大");
  await page.getByLabel("單位（英文）").fill("NCCU");
  await page.getByLabel("說明（中文）").fill("說明");
  await page.getByLabel("說明（英文）").fill("Summary");
  await page.getByLabel("截止日").fill("2020-01-01");
  await page.getByRole("button", { name: "發布" }).click();
  await expect(page.getByText("已送出重建")).toBeVisible();
  const row = page.getByTestId("entity-row").filter({ hasText: "E2E 獎學金" });
  await expect(row).toContainText("已過期");
  const { data } = await admin().from("resources").select("kind,deadline,data").like("data->>title", "E2E%").single();
  expect(data?.kind).toBe("scholarship");
  expect(data?.deadline).toBe("2020-01-01");
  expect(data?.data.kindZh).toBe("獎學金");
  expect(data?.data.kindEn).toBe("Scholarship");
  await deleteAndRestore(page, "資源", "E2E 獎學金");
});
