import { test, expect } from "@playwright/test";
import { TEST_ANON, TEST_URL, USERS, loginAs } from "./helpers";
import { admin, deleteAndRestore, service } from "./entity-helpers";

test.beforeEach(() => { test.skip(!TEST_URL() || !TEST_ANON() || !service(), "needs SUPABASE_TEST_*"); });
test.afterEach(async () => { await admin().from("events").delete().like("data->>zh", "E2E%"); });

test("events: lecture fields, ISO date column, current-semester filter", async ({ page }) => {
  await loginAs(page, USERS.editor);
  await page.getByRole("navigation").getByRole("link", { name: "活動" }).click();
  await expect(page.getByTestId("entity-row")).toHaveCount(16);
  await page.getByRole("button", { name: "新增活動" }).click();
  await page.getByLabel("類型").selectOption("lecture");
  await page.getByLabel("週次").fill("17");
  await page.getByLabel("日期").fill("2026-12-30");
  await page.getByLabel("活動名稱（中文）").fill("E2E 講座");
  await page.getByLabel("活動名稱（英文）").fill("E2E Lecture");
  await page.getByLabel("講題（中文）").fill("題目");
  await page.getByLabel("講題（英文）").fill("Topic");
  await page.getByLabel("講者（中文）").fill("王小明");
  await page.getByLabel("講者（英文）").fill("Wang");
  await page.getByLabel("職稱（中文）").fill("經理");
  await page.getByLabel("職稱（英文）").fill("Manager");
  await page.getByLabel("單位（中文）").fill("公司");
  await page.getByLabel("單位（英文）").fill("Corp");
  await page.getByLabel("摘要（中文）").fill("摘要");
  await page.getByLabel("摘要（英文）").fill("Abstract");
  await page.getByLabel("簡歷（中文）").fill("學歷｜政大");
  await page.getByLabel("簡歷（英文）").fill("Education | NCCU");
  await page.getByRole("button", { name: "發布" }).click();
  await expect(page.getByText("已送出重建")).toBeVisible();
  await expect(page.getByTestId("entity-row")).toHaveCount(17);
  const { data } = await admin().from("events").select("semester,week,date,kind,data").like("data->>zh", "E2E%").single();
  expect(data?.semester).toBe("115-1");
  expect(data?.week).toBe(17);
  expect(data?.date).toBe("2026-12-30");
  expect(data?.kind).toBe("lecture");
  expect(data?.data.lecture.speaker).toBe("王小明");
  await deleteAndRestore(page, "活動", "E2E 講座");
});

test("editing a seeded lecture shows its type and speaker fields (columns merged into the form)", async ({ page }) => {
  await loginAs(page, USERS.editor);
  await page.getByRole("navigation").getByRole("link", { name: "活動" }).click();
  const row = page.getByTestId("entity-row").filter({ hasText: "AI 時代商業模式創新" });
  await expect(row).toContainText("講座");
  // 學期下拉不能出現 undefined（曾因 list 沒撈可篩選欄位而出現）
  await expect(page.getByRole("combobox", { name: "學期" }).locator("option")).toHaveCount(1);
  await expect(page.getByRole("combobox", { name: "學期" })).not.toContainText("undefined");
  await row.getByRole("button", { name: "編輯" }).click();
  await expect(page.getByLabel("類型")).toHaveValue("lecture");
  await expect(page.getByLabel("週次")).toHaveValue("3");
  await expect(page.getByLabel("日期")).toHaveValue("2026-09-23");
  await expect(page.getByLabel("講者（中文）")).toHaveValue("陳顯立");
});
