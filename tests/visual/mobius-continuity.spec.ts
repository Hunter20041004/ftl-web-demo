import { expect, test } from "@playwright/test";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

test("mobius reads as a restrained translucent material instead of an energy trail", async ({ page }) => {
  await page.goto(`${basePath}/`);
  await page.waitForLoadState("networkidle");

  const lightMobius = page.locator(".mob:not(.mob--in) .mob__v--a").first();
  const surface = lightMobius.locator(".mob__surf");
  const edge = lightMobius.locator(".mob__edge");
  const specular = lightMobius.locator(".mob-ribbon__specular").first();
  const glint = lightMobius.locator(".mob-ribbon__glint").first();

  await expect(specular).toBeAttached();
  await expect(glint).toBeAttached();

  const surfaceStyle = await surface.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      display: style.display,
      opacity: Number.parseFloat(style.opacity),
    };
  });
  expect(surfaceStyle.display).not.toBe("none");
  expect(surfaceStyle.opacity).toBeGreaterThanOrEqual(0.65);

  const edgeStyle = await edge.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      display: style.display,
      opacity: Number.parseFloat(style.opacity),
    };
  });
  expect(edgeStyle.display).not.toBe("none");
  expect(edgeStyle.opacity).toBeGreaterThanOrEqual(0.35);
  expect(edgeStyle.opacity).toBeLessThanOrEqual(0.7);

  const specularStyle = await specular.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      width: Number.parseFloat(style.strokeWidth),
      opacity: Number.parseFloat(style.strokeOpacity),
      dash: style.strokeDasharray,
      cap: style.strokeLinecap,
    };
  });
  expect(specularStyle.width).toBeLessThanOrEqual(4);
  expect(specularStyle.opacity).toBeLessThanOrEqual(0.22);
  expect(specularStyle.dash).not.toBe("none");
  expect(specularStyle.cap).toBe("round");

  const glintStyle = await glint.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      width: Number.parseFloat(style.strokeWidth),
      opacity: Number.parseFloat(style.strokeOpacity),
      dash: style.strokeDasharray,
      cap: style.strokeLinecap,
    };
  });
  expect(glintStyle.width).toBeLessThanOrEqual(4);
  expect(glintStyle.opacity).toBeGreaterThanOrEqual(0.2);
  expect(glintStyle.opacity).toBeLessThanOrEqual(0.5);
  expect(glintStyle.dash).not.toBe("none");
  expect(glintStyle.cap).toBe("round");

  await expect(lightMobius.locator(".mob__cont")).toHaveCSS("display", "none");
  expect(await page.locator(".mob-ribbon__halo, .mob-ribbon__core, .mob-ribbon__dash").count()).toBe(0);

  const echo = page.locator(".mob:not(.mob--in) .mob__v--b").first();
  if (await echo.count()) {
    const echoOpacity = Number.parseFloat(await echo.evaluate((el) => getComputedStyle(el).opacity));
    expect(echoOpacity).toBeLessThanOrEqual(0.22);
  }

  const darkSpecular = page.locator("#contact .mob--in .mob__v--a .mob-ribbon__specular").first();
  const darkGlint = page.locator("#contact .mob--in .mob__v--a .mob-ribbon__glint").first();
  await expect(darkSpecular).toHaveCSS("stroke", "rgb(183, 231, 247)");
  await expect(darkGlint).toHaveCSS("stroke", "rgb(216, 248, 255)");
});
