import { expect, test } from "@playwright/test";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function px(value: string) {
  return Number.parseFloat(value || "0");
}

test("homepage panels use the transaction-network structural language instead of rounded glass cards", async ({ page }) => {
  await page.goto(`${basePath}/`);
  await page.waitForLoadState("networkidle");

  const heroPane = page.locator(".hero .pane--rows").first();
  await expect(heroPane).toBeVisible();
  const heroPaneStyle = await heroPane.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      topLeft: style.borderTopLeftRadius,
      topRight: style.borderTopRightRadius,
      backdrop: style.backdropFilter,
      shadow: style.boxShadow,
    };
  });
  expect(px(heroPaneStyle.topLeft)).toBeLessThanOrEqual(8);
  expect(px(heroPaneStyle.topRight)).toBeLessThanOrEqual(8);
  expect(heroPaneStyle.backdrop).toBe("none");
  expect(heroPaneStyle.shadow).toBe("none");

  const heroList = page.locator(".hero .ios-list").first();
  const listRail = await heroList.evaluate((el) => getComputedStyle(el, "::before").content);
  expect(listRail).not.toBe("none");

  const heroRow = page.locator(".hero .ios-row").first();
  const heroRowStyle = await heroRow.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      radius: style.borderTopLeftRadius,
      shadow: style.boxShadow,
    };
  });
  expect(px(heroRowStyle.radius)).toBeLessThanOrEqual(4);
  expect(heroRowStyle.shadow).toBe("none");

  const statsPane = page.locator(".hero .pane--stats");
  const statsStyle = await statsPane.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      radius: style.borderTopLeftRadius,
      top: style.borderTopWidth,
      bottom: style.borderBottomWidth,
      shadow: style.boxShadow,
    };
  });
  expect(px(statsStyle.radius)).toBeLessThanOrEqual(4);
  expect(px(statsStyle.top)).toBeGreaterThanOrEqual(1);
  expect(px(statsStyle.bottom)).toBeGreaterThanOrEqual(1);
  expect(statsStyle.shadow).toBe("none");

  const feature = page.locator("#weekly .card--feature");
  const featureStyle = await feature.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      radius: style.borderTopLeftRadius,
      shadow: style.boxShadow,
      leftBorder: style.borderLeftWidth,
    };
  });
  expect(px(featureStyle.radius)).toBeLessThanOrEqual(8);
  expect(featureStyle.shadow).toBe("none");
  expect(px(featureStyle.leftBorder)).toBeGreaterThanOrEqual(2);

  const eventCard = page.locator("#events .card--event").first();
  const eventStyle = await eventCard.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      display: style.display,
      radius: style.borderTopLeftRadius,
      shadow: style.boxShadow,
    };
  });
  expect(eventStyle.display).toBe("grid");
  expect(px(eventStyle.radius)).toBeLessThanOrEqual(4);
  expect(eventStyle.shadow).toBe("none");

  const contactPane = page.locator("#contact .pane--rows");
  const contactPaneStyle = await contactPane.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      radius: style.borderTopLeftRadius,
      backdrop: style.backdropFilter,
      shadow: style.boxShadow,
    };
  });
  expect(px(contactPaneStyle.radius)).toBeLessThanOrEqual(8);
  expect(contactPaneStyle.backdrop).toBe("none");
  expect(contactPaneStyle.shadow).toBe("none");

  const partner = page.locator("#partners .partner").first();
  const partnerStyle = await partner.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      radius: style.borderTopLeftRadius,
      shadow: style.boxShadow,
      background: style.backgroundColor,
    };
  });
  expect(px(partnerStyle.radius)).toBeLessThanOrEqual(2);
  expect(partnerStyle.shadow).toBe("none");
  expect(partnerStyle.background).toBe("rgba(0, 0, 0, 0)");
});
