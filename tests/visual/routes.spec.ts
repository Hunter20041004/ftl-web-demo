import { expect, test } from "@playwright/test";

const routes = ["/", "/about/", "/courses/", "/join/", "/resources/", "/events/", "/contact/"];

for (const route of routes) {
  test(`${route} renders without horizontal overflow`, async ({ page }, testInfo) => {
    // V1 intentionally reveals content on scroll. For deterministic full-page QA,
    // reduced motion makes the runtime reveal everything immediately without
    // changing production behavior.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflow).toBe(false);
    await expect(page.locator("main")).toBeVisible();
    const slug = route === "/" ? "home" : route.replaceAll("/", "");
    await page.screenshot({ path: testInfo.outputPath(`${slug}.png`), fullPage: true });
  });
}
