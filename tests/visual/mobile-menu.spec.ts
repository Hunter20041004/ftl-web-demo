import { expect, test } from "@playwright/test";

// 手機選單打開後，每個選單項目都必須是畫面上最上層的東西——
// 曾經因為 #site-header 與 .page 同一層，首屏標題與 logo 蓋在選單上讓人點不到。
test("mobile menu sits above page content and every link is clickable", async ({ page, viewport }) => {
  test.skip(!viewport || viewport.width > 940, "只有手機／平板寬度才有漢堡選單");
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "開啟選單" }).click();
  const sheet = page.locator("#mobile-sheet");
  await expect(sheet).toHaveAttribute("data-open", "true");

  const links = sheet.locator(".sheet__link");
  const count = await links.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i += 1) {
    const box = await links.nth(i).boundingBox();
    expect(box).not.toBeNull();
    const topmostIsMenu = await page.evaluate(([x, y]) => {
      const el = document.elementFromPoint(x, y);
      return Boolean(el?.closest("#mobile-sheet"));
    }, [box!.x + box!.width / 2, box!.y + box!.height / 2]);
    expect(topmostIsMenu, `第 ${i + 1} 個選單項目被頁面內容蓋住`).toBe(true);
  }
});
