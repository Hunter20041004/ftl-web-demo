import { expect, test } from "@playwright/test";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Glass V6 contract (docs/specs/2026-09-12-glass-v6-redesign-design.md):
// 零硬線、一個主角動畫（logo）、字體換成 Outfit + Huninn、四個視口無橫向捲軸。
test.describe("glass-v6 homepage", () => {
  test("declares the baseline and drops the transaction network / question list / stats", async ({ page }) => {
    await page.goto(`${basePath}/`);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("main#main")).toHaveAttribute("data-visual-baseline", "glass-v6");
    await expect(page.locator("[data-transaction-network], .pane--rows, .stats, .numlist")).toHaveCount(0);
    await expect(page.locator("#mission, #weekly, #events, #contact, #partners")).toHaveCount(5);
  });

  test("logo draws in, then settles on the original image", async ({ page }) => {
    // 動畫在 HTML 一到就開始跑（純 CSS），所以用 commit 而不是 load 去抓「還在畫」的狀態
    await page.goto(`${basePath}/`, { waitUntil: "commit" });
    const logo = page.locator(".logo-draw");
    await expect(logo.locator("path")).toHaveCount(3);
    await expect(logo.locator("img")).toHaveCSS("opacity", "0");
    await expect(logo).toHaveAttribute("data-logo-state", "done", { timeout: 15000 });
    await expect(logo.locator("img")).toHaveCSS("opacity", "1");
  });

  test("cards and rows are separated by light, not by 1px lines", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${basePath}/`);
    await page.waitForLoadState("networkidle");
    const hardLines = await page.evaluate(() => {
      const selectors = ".card, .ios-row, .partner, .principle, .btn, .sec-head, .tag";
      return Array.from(document.querySelectorAll<HTMLElement>(selectors)).filter((el) => {
        const cs = getComputedStyle(el);
        const solidBorder = ["Top", "Right", "Bottom", "Left"].some((side) =>
          cs.getPropertyValue(`border-${side.toLowerCase()}-style`) === "solid" &&
          parseFloat(cs.getPropertyValue(`border-${side.toLowerCase()}-width`)) > 0,
        );
        return solidBorder;
      }).map((el) => el.className);
    });
    expect(hardLines).toEqual([]);
  });

  test("uses the V6 type system", async ({ page }) => {
    await page.goto(`${basePath}/`);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toHaveCSS("font-family", /Huninn/);
    await expect(page.locator(".eyebrow").first()).toHaveCSS("font-family", /Outfit/);
    const fontsReady = await page.evaluate(async () => {
      await document.fonts.ready;
      return document.fonts.check('16px "Outfit"') && document.fonts.check('16px "Huninn"');
    });
    expect(fontsReady).toBe(true);
  });

  test("fill-text words light up on scroll", async ({ page }) => {
    await page.goto(`${basePath}/`);
    await page.waitForLoadState("networkidle");
    const words = page.locator(".fill-text .w");
    await expect(words.first()).not.toHaveClass(/in/);
    await page.locator(".fill-text").scrollIntoViewIfNeeded();
    await expect(words.last()).toHaveClass(/in/, { timeout: 4000 });
  });
});
