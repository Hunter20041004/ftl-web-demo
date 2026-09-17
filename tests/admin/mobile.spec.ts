import { test, expect } from "@playwright/test";
import { TEST_ANON, TEST_URL, USERS, loginAs } from "./helpers";

// 後台手機版面契約（2026-09-17 健檢）：幹部偶爾會用手機改內容——每頁不能橫向捲動、可點元素 ≥ 40px、新增對話框放得下且能按到發布。
test.use({ viewport: { width: 375, height: 812 }, hasTouch: true });
test.beforeEach(() => { test.skip(!TEST_URL() || !TEST_ANON(), "needs SUPABASE_TEST_*"); });

const pages: Array<[string, string | null]> = [["/admin/", null], ["/admin/weekly/", "新增一期"], ["/admin/events/", "新增活動"], ["/admin/resources/", "新增資源"], ["/admin/projects/", "新增專案"], ["/admin/articles/", "新增文章"], ["/admin/partners/", "新增合作對象"], ["/admin/settings/", null], ["/admin/admins/", null], ["/admin/trash/", null]];

test("admin pages fit a phone and every control is tappable", async ({ page }) => {
  test.setTimeout(120_000);
  await loginAs(page, USERS.editor);
  for (const [route, addLabel] of pages) {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflow, `${route} 有橫向捲軸`).toBe(false);
    const small = await page.$$eval("main a[href], main button, aside a[href], aside button", (els) => els
      .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 40 && !el.closest("nextjs-portal"); })
      .map((el) => `${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 16)}" ${Math.round(el.getBoundingClientRect().height)}px`));
    expect(small, `${route} 有太小的點擊目標`).toEqual([]);
    if (!addLabel) continue;
    await page.getByRole("button", { name: addLabel }).first().click();
    const dialog = page.locator("[role=dialog]");
    await expect(dialog).toBeVisible();
    const box = (await dialog.boundingBox())!;
    expect(box.x, `${route} 對話框超出左邊`).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width, `${route} 對話框超出右邊`).toBeLessThanOrEqual(376);
    const close = dialog.getByRole("button", { name: "Close" });
    expect((await close.boundingBox())!.height, `${route} 對話框關閉鈕太小`).toBeGreaterThanOrEqual(40);
    const publish = dialog.getByRole("button", { name: "發布" }).last();
    await publish.scrollIntoViewIfNeeded();
    const reachable = await publish.evaluate((b) => { const r = b.getBoundingClientRect(); const el = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return r.top >= 0 && r.bottom <= innerHeight && !!el && (b.contains(el) || el.contains(b)); });
    expect(reachable, `${route} 發布鈕捲不到或被蓋住`).toBe(true);
    await close.click();
    await expect(dialog).toHaveCount(0);
  }
});
