import { expect, test } from "@playwright/test";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

test("new architecture renders the original v1 homepage contract", async ({ page }) => {
  await page.goto(`${basePath}/`);
  await page.waitForLoadState("networkidle");

  const main = page.locator("main#main");
  await expect(main).toHaveAttribute("data-visual-baseline", "v1-main-fa033f0");

  await expect(page.locator(".hero")).toBeVisible();
  await expect(page.locator("#weekly .weekly")).toBeVisible();
  await expect(page.locator("#mission .numlist")).toBeVisible();
  await expect(page.locator("#events .agenda")).toBeVisible();
  await expect(page.locator("#partners .marquee")).toBeVisible();
  await expect(page.locator("#contact.slab")).toBeVisible();

  await expect(page.locator(".hero .hero__cta .btn")).toHaveCount(2);
  await expect(page.locator("#contact .hero__cta .btn")).toHaveCount(2);
  await expect(page.locator(".home-v4, .home-v5, .mobius-field-v5, .v4-continuous-field")).toHaveCount(0);

  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  expect(overflow).toBe(false);
});
