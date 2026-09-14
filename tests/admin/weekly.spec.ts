import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { TEST_ANON, TEST_URL, USERS, loginAs } from "./helpers";
import { admin, deleteAndRestore, service } from "./entity-helpers";

test.beforeEach(() => { test.skip(!TEST_URL() || !TEST_ANON() || !service(), "needs SUPABASE_TEST_*"); });
test.afterEach(async () => { await admin().from("weekly_issues").delete().eq("vol", 99); });

test("weekly: paste → parse → fix missing → publish stores issue + 3 stories", async ({ page }) => {
  await loginAs(page, USERS.editor);
  await page.getByRole("navigation").getByRole("link", { name: "週報" }).click();
  await expect(page.getByTestId("entity-row")).toHaveCount(3);
  await page.getByRole("button", { name: "新增一期" }).click();
  await expect(page.getByLabel("期數")).toHaveValue("4");     // 自動建議下一期
  await page.getByLabel("期數").fill("99");
  const sample = readFileSync("tests/fixtures/weekly-paste.txt", "utf8");
  await page.getByLabel("貼上整份週報").fill(sample);
  await page.getByRole("button", { name: "拆解" }).click();
  await expect(page.getByTestId("story-0").getByLabel("標題（中文）")).toHaveValue("Circle 以 4 億美元收購 Tazapay");
  await expect(page.getByText("拆解後還缺")).toBeVisible();  // 第三則沒貼
  await page.getByRole("button", { name: "發布" }).click();
  await expect(page.getByText("必填").first()).toBeVisible();
  // 補第三則
  const s2 = page.getByTestId("story-2");
  for (const [label, v] of [["短標（中文）", "第三"], ["短標（英文）", "Third"], ["標題（中文）", "第三則"], ["標題（英文）", "Third"], ["一句話（中文）", "x"], ["一句話（英文）", "x"], ["背景（中文）", "x"], ["背景（英文）", "x"], ["為什麼重要（中文）", "x"], ["為什麼重要（英文）", "x"], ["台灣視角（中文）", "x"], ["台灣視角（英文）", "x"], ["重點（中文）", "a"], ["重點（英文）", "a"], ["接下來（中文）", "b"], ["接下來（英文）", "b"]]) await s2.getByLabel(label).fill(v);
  await s2.getByLabel("來源").fill("來源｜Source｜https://example.com/3｜一手");
  await page.getByRole("button", { name: "發布" }).click();
  await expect(page.getByText("已送出重建")).toBeVisible();
  await expect(page.getByTestId("entity-row")).toHaveCount(4);
  const { data: issue } = await admin().from("weekly_issues").select("id,status,range_start,data").eq("vol", 99).single();
  expect(issue?.status).toBe("published");
  const { data: stories } = await admin().from("weekly_stories").select("position,data").eq("issue_id", issue!.id).order("position");
  expect(stories?.length).toBe(3);
  expect(stories?.[0].data.headline).toBe("Circle 買跨境支付");
  expect(stories?.[0].data.sources[0].primary).toBe(true);
  await deleteAndRestore(page, "週報", "Vol.99");
});
