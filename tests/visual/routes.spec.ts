import { expect, test } from "@playwright/test";

const routes = ["/", "/about/", "/projects/", "/insights/", "/resources/", "/events/", "/contact/"];

for (const route of routes) {
  test(`${route} renders without horizontal overflow`, async ({ page }, testInfo) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflow).toBe(false);
    await expect(page.locator("main")).toBeVisible();
    const slug = route === "/" ? "home" : route.replaceAll("/", "");
    await page.screenshot({ path: testInfo.outputPath(`${slug}.png`), fullPage: true });
  });
}
