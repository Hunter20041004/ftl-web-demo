import { expect, test } from "@playwright/test";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

test("transaction network replaces the mobius with sparse relationship topology", async ({ page }) => {
  await page.goto(`${basePath}/`);
  await page.waitForLoadState("networkidle");

  const networks = page.locator("[data-transaction-network]");
  await expect(networks).toHaveCount(4);

  const hero = page.locator('[data-transaction-network="hero"]');
  const events = page.locator('[data-transaction-network="events"]');
  const contact = page.locator('[data-transaction-network="contact"]');
  const partners = page.locator('[data-transaction-network="partners"]');

  await expect(hero).toBeVisible();
  await expect(events).toBeAttached();
  await expect(contact).toBeAttached();
  await expect(partners).toBeAttached();

  for (const network of [hero, events, contact, partners]) {
    const nodeCount = await network.locator("[data-network-node]").count();
    const edgeCount = await network.locator("[data-network-edge]").count();
    const flowCount = await network.locator("[data-network-flow]").count();

    expect(nodeCount).toBeGreaterThanOrEqual(5);
    expect(nodeCount).toBeLessThanOrEqual(9);
    expect(edgeCount).toBeGreaterThanOrEqual(5);
    expect(edgeCount).toBeLessThanOrEqual(11);
    expect(flowCount).toBeLessThanOrEqual(3);
  }

  const heroStyle = await hero.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      position: style.position,
      pointerEvents: style.pointerEvents,
      overflow: style.overflow,
    };
  });
  expect(heroStyle.position).toBe("absolute");
  expect(heroStyle.pointerEvents).toBe("none");
  expect(heroStyle.overflow).toBe("hidden");

  const heroEdge = hero.locator("[data-network-edge]").first();
  const heroNode = hero.locator(".transaction-network__node-ring").first();
  await expect(heroEdge).toHaveCSS("stroke", "rgb(19, 64, 116)");
  await expect(heroNode).toHaveCSS("stroke", "rgb(19, 64, 116)");

  const contactEdge = contact.locator("[data-network-edge]").first();
  const contactCore = contact.locator(".transaction-network__node-core").first();
  await expect(contactEdge).toHaveCSS("stroke", "rgb(126, 220, 250)");
  await expect(contactCore).toHaveCSS("fill", "rgb(126, 220, 250)");

  expect(await page.locator(".mob, .mob-bg, .mob-fg").count()).toBe(0);
  expect(await page.locator("#legacy-mobius-runtime").count()).toBe(0);
});
