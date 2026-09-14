import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { TEST_ANON, TEST_URL, USERS, loginAs } from "./helpers";

const service = () => process.env.SUPABASE_TEST_SERVICE_KEY;
const admin = () => createClient(TEST_URL()!, service()!, { auth: { persistSession: false } });

test.beforeEach(() => { test.skip(!TEST_URL() || !TEST_ANON() || !service(), "needs SUPABASE_TEST_*"); });
test.afterEach(async () => {
  // 清掉測試建立的資料，seed 的 4 個合作對象不動
  await admin().from("partners").delete().like("data->>zh", "E2E%");
});

test("admin can add, publish, reorder, delete and restore a partner", async ({ page }) => {
  await loginAs(page, USERS.editor);
  await page.getByRole("navigation").getByRole("link", { name: "合作對象" }).click();
  await expect(page.getByTestId("partner-row")).toHaveCount(4);

  // 新增：缺英文名 → 發布被擋、欄位標紅
  await page.getByRole("button", { name: "新增合作對象" }).click();
  await page.getByLabel("中文名稱").fill("E2E 測試夥伴");
  await page.getByLabel("連結").fill("https://example.com/");
  await page.getByRole("button", { name: "發布" }).click();
  await expect(page.getByText("必填")).toBeVisible();

  await page.getByLabel("英文名稱").fill("E2E Partner");
  await page.locator("#partner-logo").setInputFiles("assets/partners/gad.svg");
  await expect(page.getByTestId("logo-preview")).toBeVisible();
  await page.getByRole("button", { name: "發布" }).click();
  await expect(page.getByText("已送出重建")).toBeVisible();
  await expect(page.getByTestId("partner-row")).toHaveCount(5);

  const { data: rows } = await admin().from("partners").select("position,status,data").like("data->>zh", "E2E%");
  expect(rows?.[0].status).toBe("published");
  expect(rows?.[0].data.logo).toMatch(/^\/media\/partners\/gad-\d+\.svg$/);

  // 排序：把最後一個拖到第一個
  const rowsLocator = page.getByTestId("partner-row");
  await rowsLocator.nth(4).dragTo(rowsLocator.nth(0));
  await expect(rowsLocator.nth(0)).toContainText("E2E 測試夥伴");
  await expect.poll(async () => (await admin().from("partners").select("position").like("data->>zh", "E2E%")).data?.[0].position).toBe(0);

  // 刪除 → 已刪除 → 還原
  await rowsLocator.nth(0).getByRole("button", { name: "刪除" }).click();
  await page.getByRole("button", { name: "確定刪除" }).click();
  await expect(page.getByTestId("partner-row")).toHaveCount(4);
  await page.getByRole("navigation").getByRole("link", { name: "已刪除" }).click();
  await expect(page.getByText("E2E 測試夥伴")).toBeVisible();
  await page.getByRole("button", { name: "還原" }).click();
  await page.getByRole("navigation").getByRole("link", { name: "合作對象" }).click();
  await expect(page.getByTestId("partner-row")).toHaveCount(5);
});
