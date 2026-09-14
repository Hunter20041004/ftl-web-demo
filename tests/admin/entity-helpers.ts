import { expect, type Page } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { TEST_URL } from "./helpers";

export const service = () => process.env.SUPABASE_TEST_SERVICE_KEY;
export const admin = () => createClient(TEST_URL()!, service()!, { auth: { persistSession: false } });

// 通用流程的後半：刪除 → 已刪除頁出現 → 還原 → 回到清單
export async function deleteAndRestore(page: Page, navLabel: string, rowText: string) {
  const row = page.getByTestId("entity-row").filter({ hasText: rowText });
  await row.getByRole("button", { name: "刪除" }).click();
  await page.getByRole("button", { name: "確定刪除" }).click();
  await expect(row).toHaveCount(0);
  await page.getByRole("navigation").getByRole("link", { name: "已刪除" }).click();
  await expect(page.getByText(rowText)).toBeVisible();
  await page.getByTestId("trash-row").filter({ hasText: rowText }).getByRole("button", { name: "還原" }).click();
  await page.getByRole("navigation").getByRole("link", { name: navLabel }).click();
  await expect(page.getByTestId("entity-row").filter({ hasText: rowText })).toHaveCount(1);
}
