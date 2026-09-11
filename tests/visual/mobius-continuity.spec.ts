import { expect, test } from "@playwright/test";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

test("mobius uses layered ribbon material instead of contour-line bundle", async ({ page }) => {
  await page.goto(`${basePath}/`);
  await page.waitForLoadState("networkidle");

  const halo = page.locator(".mob:not(.mob--in) .mob__v--a .mob-ribbon__halo").first();
  const core = page.locator(".mob:not(.mob--in) .mob__v--a .mob-ribbon__core").first();
  const dash = page.locator(".mob:not(.mob--in) .mob__v--a .mob-ribbon__dash").first();

  await expect(halo).toBeVisible();
  await expect(core).toBeVisible();
  await expect(dash).toBeVisible();

  const haloStyle = await halo.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      stroke: style.stroke,
      width: Number.parseFloat(style.strokeWidth),
      opacity: Number.parseFloat(style.strokeOpacity),
    };
  });
  expect(haloStyle.stroke).toBe("rgb(22, 104, 227)");
  expect(haloStyle.width).toBeGreaterThanOrEqual(56);
  expect(haloStyle.opacity).toBeLessThanOrEqual(0.08);

  const coreStyle = await core.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      stroke: style.stroke,
      width: Number.parseFloat(style.strokeWidth),
      opacity: Number.parseFloat(style.strokeOpacity),
    };
  });
  expect(coreStyle.stroke).toBe("rgb(74, 155, 240)");
  expect(coreStyle.width).toBeGreaterThanOrEqual(24);
  expect(coreStyle.opacity).toBeGreaterThanOrEqual(0.08);

  const dashStyle = await dash.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      stroke: style.stroke,
      width: Number.parseFloat(style.strokeWidth),
      dash: style.strokeDasharray,
      cap: style.strokeLinecap,
    };
  });
  expect(dashStyle.stroke).toBe("rgb(96, 208, 240)");
  expect(dashStyle.width).toBeGreaterThanOrEqual(5);
  expect(dashStyle.dash).not.toBe("none");
  expect(dashStyle.cap).toBe("round");

  await expect(page.locator(".mob:not(.mob--in) .mob__cont").first()).toHaveCSS("display", "none");
  await expect(page.locator(".mob:not(.mob--in) .mob__edge").first()).toHaveCSS("display", "none");

  const darkCore = page.locator("#contact .mob--in .mob__v--a .mob-ribbon__core").first();
  const darkDash = page.locator("#contact .mob--in .mob__v--a .mob-ribbon__dash").first();
  await expect(darkCore).toHaveCSS("stroke", "rgb(96, 208, 240)");
  await expect(darkDash).toHaveCSS("stroke", "rgb(126, 220, 250)");
});
