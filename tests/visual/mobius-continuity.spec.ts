import { expect, test } from "@playwright/test";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

test("mobius trace stays visible from page top to bottom and uses brand blue", async ({ page }) => {
  await page.goto(`${basePath}/`);
  await page.waitForLoadState("networkidle");

  const trace = page.locator(".mob:not(.mob--in) .mob__v--a .pulse").first();
  await expect(trace).toBeVisible();

  const result = await trace.evaluate((el) => {
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const page = document.querySelector<HTMLElement>("main#main")!;
    const pageRect = page.getBoundingClientRect();
    return {
      stroke: style.stroke,
      dash: style.strokeDasharray,
      topGap: Math.abs(rect.top - pageRect.top),
      bottomGap: Math.abs(rect.bottom - pageRect.bottom),
    };
  });

  expect(result.stroke).toBe("rgb(22, 104, 227)");
  expect(result.dash).toBe("none");
  expect(result.topGap).toBeLessThan(32);
  expect(result.bottomGap).toBeLessThan(32);

  const darkTrace = page.locator("#contact .mob--in .mob__v--a .pulse").first();
  await expect(darkTrace).toBeVisible();
  await expect(darkTrace).toHaveCSS("stroke", "rgb(96, 208, 240)");
});
