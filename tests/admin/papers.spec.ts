import { test, expect } from "@playwright/test";
import { TEST_ANON, TEST_URL, USERS, loginAs } from "./helpers";
import { admin, deleteAndRestore, service } from "./entity-helpers";

test.beforeEach(() => { test.skip(!TEST_URL() || !TEST_ANON() || !service(), "needs SUPABASE_TEST_*"); });
test.afterEach(async () => { await admin().from("papers").delete().like("data->>title", "E2E%"); });

test("papers: add with validation, publish, delete, restore", async ({ page }) => {
  await loginAs(page, USERS.editor);
  await page.getByRole("navigation").getByRole("link", { name: "研究文章" }).click();
  await expect(page.getByTestId("entity-row")).toHaveCount(6);
  await page.getByRole("button", { name: "新增研究文章" }).click();
  await page.getByLabel("標題（中文）").fill("E2E 論文");
  await page.getByLabel("作者（中文）").fill("某某");
  await page.getByLabel("出處（中文）").fill("期刊");
  await page.getByLabel("年份").fill("2025");
  await page.getByLabel("摘要（中文）").fill("這是摘要");
  await page.getByLabel("連結").fill("https://example.com/paper");
  await page.getByRole("button", { name: "發布" }).click();
  await expect(page.getByText("必填").first()).toBeVisible();        // 英文摘要缺
  await page.getByLabel("摘要（英文）").fill("Summary");
  await page.getByRole("button", { name: "發布" }).click();
  await expect(page.getByText("已送出重建")).toBeVisible();
  await expect(page.getByTestId("entity-row")).toHaveCount(7);
  const { data } = await admin().from("papers").select("year,status,data").like("data->>title", "E2E%").single();
  expect(data?.year).toBe(2025);
  expect(data?.status).toBe("published");
  expect(data?.data.region).toBe("tw");
  await deleteAndRestore(page, "研究文章", "E2E 論文");
});
