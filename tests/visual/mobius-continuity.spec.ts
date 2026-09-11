import { expect, test } from "@playwright/test";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

test("mobius reads as a luminous brand ribbon rather than hairline traces", async ({ page }) => {
  await page.goto(`${basePath}/`);
  await page.waitForLoadState("networkidle");

  const ribbon = page.locator(".mob:not(.mob--in) .mob__v--a .pulse").first();
  await expect(ribbon).toBeVisible();

  const ribbonStyle = await ribbon.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      stroke: style.stroke,
      width: Number.parseFloat(style.strokeWidth),
      opacity: Number.parseFloat(style.strokeOpacity),
      dash: style.strokeDasharray,
    };
  });

  expect(ribbonStyle.stroke).toBe("rgb(22, 104, 227)");
  expect(ribbonStyle.width).toBeGreaterThanOrEqual(18);
  expect(ribbonStyle.opacity).toBeGreaterThanOrEqual(0.08);
  expect(ribbonStyle.opacity).toBeLessThanOrEqual(0.18);
  expect(ribbonStyle.dash).toBe("none");

  const highlight = page.locator(".mob:not(.mob--in) .mob__v--a .mob__edge path:not(.lit)").first();
  await expect(highlight).toBeVisible();
  const highlightStyle = await highlight.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      stroke: style.stroke,
      width: Number.parseFloat(style.strokeWidth),
      opacity: Number.parseFloat(style.strokeOpacity),
      cap: style.strokeLinecap,
    };
  });
  expect(highlightStyle.stroke).toBe("rgb(74, 155, 240)");
  expect(highlightStyle.width).toBeGreaterThanOrEqual(3);
  expect(highlightStyle.opacity).toBeGreaterThanOrEqual(0.28);
  expect(highlightStyle.cap).toBe("round");

  const darkRibbon = page.locator("#contact .mob--in .mob__v--a .pulse").first();
  await expect(darkRibbon).toBeVisible();
  await expect(darkRibbon).toHaveCSS("stroke", "rgb(96, 208, 240)");

  const darkHighlight = page.locator("#contact .mob--in .mob__v--a .mob__edge path:not(.lit)").first();
  await expect(darkHighlight).toBeVisible();
  await expect(darkHighlight).toHaveCSS("stroke", "rgb(126, 220, 250)");
});
