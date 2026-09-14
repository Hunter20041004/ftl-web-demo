import { test, expect } from "@playwright/test";
import { TEST_ANON, TEST_URL, USERS, loginAs } from "./helpers";
import { admin, deleteAndRestore, service } from "./entity-helpers";

test.beforeEach(() => { test.skip(!TEST_URL() || !TEST_ANON() || !service(), "needs SUPABASE_TEST_*"); });
test.afterEach(async () => { await admin().from("articles").delete().eq("id", "e2e-article"); });

test("articles: slug, markdown body, publish, delete, restore", async ({ page }) => {
  await loginAs(page, USERS.editor);
  await page.getByRole("navigation").getByRole("link", { name: "洞察文章" }).click();
  await page.getByRole("button", { name: "新增文章" }).click();
  await page.getByLabel("網址代號").fill("E2E Article");
  await expect(page.getByLabel("網址代號")).toHaveValue("e2e-article");
  await page.getByLabel("標題（中文）").fill("E2E 文章");
  await page.getByLabel("標題（英文）").fill("E2E article");
  await page.getByLabel("作者（中文）").fill("測試作者");
  await page.getByLabel("作者（英文）").fill("Tester");
  await page.getByLabel("摘要（中文）").fill("摘要");
  await page.getByRole("button", { name: "發布" }).click();
  await expect(page.getByText("必填").first()).toBeVisible();   // 英文摘要
  await page.getByLabel("摘要（英文）").fill("Summary");
  await page.getByLabel("內文（中文）").fill("## 小標\n\n第一段 **重點**。\n\n- 一\n- 二");
  await page.getByRole("button", { name: "發布" }).click();
  await expect(page.getByText("已送出重建")).toBeVisible();
  const { data } = await admin().from("articles").select("id,published_at,status,data").eq("id", "e2e-article").single();
  expect(data?.status).toBe("published");
  expect(data?.data.bodyEn).toBeUndefined();
  expect(data?.published_at).toBe(data?.data.date);
  await deleteAndRestore(page, "洞察文章", "E2E 文章");
});
