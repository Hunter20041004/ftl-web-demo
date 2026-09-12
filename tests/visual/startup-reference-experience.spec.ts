import { expect, test } from "@playwright/test";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function ms(value: string) {
  const first = value.split(",")[0]?.trim() ?? "0s";
  return first.endsWith("ms") ? Number.parseFloat(first) : Number.parseFloat(first) * 1000;
}

test("homepage adopts a reference-inspired data stage and state-driven showcases", async ({ page }) => {
  await page.goto(`${basePath}/`);
  await page.waitForLoadState("networkidle");

  const hero = page.locator(".hero");
  const heroStage = page.locator('[data-reference-stage="hero"]');
  await expect(heroStage).toBeVisible();

  const navCta = page.locator(".nav__cta");
  await expect(navCta).toBeAttached();
  if ((page.viewportSize()?.width ?? 0) > 900) await expect(navCta).toBeVisible();

  const heroNetwork = hero.locator('[data-transaction-network="hero"]');
  await expect(heroNetwork).toBeVisible();

  const heroRows = heroStage.locator(".ios-row");
  await expect(heroRows).toHaveCount(4);
  await heroRows.nth(2).hover();
  await expect(hero).toHaveAttribute("data-hero-focus", "2");
  await expect(heroNetwork).toHaveAttribute("data-focus", "2");
  await expect(heroRows.nth(2)).toHaveAttribute("data-active", "true");

  const weekly = page.locator("#weekly .weekly");
  await expect(weekly).toHaveAttribute("data-startup-carousel", "true");
  const weeklyCards = weekly.locator(".card");
  await expect(weeklyCards).toHaveCount(3);
  await expect(weekly).toHaveAttribute("data-active-card", "0");
  await weeklyCards.nth(1).hover();
  await expect(weekly).toHaveAttribute("data-active-card", "1");

  const weeklyStyle = await weekly.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      transitionDuration: style.transitionDuration,
      transitionTimingFunction: style.transitionTimingFunction,
    };
  });
  expect(ms(weeklyStyle.transitionDuration)).toBeGreaterThanOrEqual(400);
  expect(weeklyStyle.transitionTimingFunction).toContain("cubic-bezier");

  const mission = page.locator("#mission .numlist");
  await expect(mission).toHaveAttribute("data-layer-stack", "true");
  const missionRows = mission.locator(":scope > .nl");
  await expect(missionRows).toHaveCount(3);
  await expect(mission).toHaveAttribute("data-active-layer", "0");
  await missionRows.nth(1).hover();
  await expect(mission).toHaveAttribute("data-active-layer", "1");
  await expect(missionRows.nth(1)).toHaveAttribute("data-active", "true");

  const stageStyle = await heroStage.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      position: style.position,
      overflow: style.overflow,
      background: style.backgroundImage,
    };
  });
  expect(stageStyle.position).toBe("relative");
  expect(stageStyle.overflow).toBe("hidden");
  expect(stageStyle.background).not.toBe("none");
});
