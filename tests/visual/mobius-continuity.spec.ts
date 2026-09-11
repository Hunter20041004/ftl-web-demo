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
      filter: style.filter,
    };
  });
  expect(surfaceStyle.display).not.toBe("none");
  expect(surfaceStyle.opacity).toBeGreaterThanOrEqual(0.9);
  expect(surfaceStyle.filter).not.toBe("none");

  /* Fragmented construction edges read like a data stream, so the physical
     material relies on the surface plus one continuous boundary highlight. */
  await expect(edge).toHaveCSS("display", "none");

  const specularStyle = await specular.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      width: Number.parseFloat(style.strokeWidth),
      opacity: Number.parseFloat(style.strokeOpacity),
      dash: style.strokeDasharray,
      cap: style.strokeLinecap,
    };
  });
  expect(specularStyle.width).toBeLessThanOrEqual(2.5);
  expect(specularStyle.opacity).toBeLessThanOrEqual(0.2);
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
  expect(glintStyle.width).toBeLessThanOrEqual(3);
  expect(glintStyle.opacity).toBeGreaterThanOrEqual(0.2);
  expect(glintStyle.opacity).toBeLessThanOrEqual(0.35);
  expect(glintStyle.dash).not.toBe("none");
  expect(glintStyle.cap).toBe("round");

  await expect(lightMobius.locator(".mob__cont")).toHaveCSS("display", "none");
  expect(await page.locator(".mob-ribbon__halo, .mob-ribbon__core, .mob-ribbon__dash").count()).toBe(0);

  const echo = page.locator(".mob:not(.mob--in) .mob__v--b").first();
  if (await echo.count()) {
    const echoOpacity = Number.parseFloat(await echo.evaluate((el) => getComputedStyle(el).opacity));
    expect(echoOpacity).toBeLessThanOrEqual(0.1);
  }

  const darkSpecular = page.locator("#contact .mob--in .mob__v--a .mob-ribbon__specular").first();
  const darkGlint = page.locator("#contact .mob--in .mob__v--a .mob-ribbon__glint").first();
  await expect(darkSpecular).toHaveCSS("stroke", "rgb(183, 231, 247)");
  await expect(darkGlint).toHaveCSS("stroke", "rgb(216, 248, 255)");
});
