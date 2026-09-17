import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

// 2026-09-17 健檢拍板的三項：專案空狀態、聯絡頁外連開新分頁、手機語言切換鈕高度。
const snap = JSON.parse(readFileSync(new URL("../../src/lib/content.snapshot.json", import.meta.url), "utf8"));
const noProjects = snap.projectDecks.length === 0;

test("home and projects page show an empty state only when there are no projects", async ({ page }) => {
  for (const route of ["/", "/projects/"]) {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    const empty = page.locator('[data-projects-empty][data-show="true"]');
    if (noProjects) { await expect(empty).toHaveCount(1); await expect(empty).toContainText("籌備中"); }
    else await expect(empty).toHaveCount(0);
  }
});

test("contact page external links open in a new tab", async ({ page }) => {
  await page.goto("/contact/");
  await page.waitForLoadState("networkidle");
  const bad = await page.$$eval("main a[href^='http']", (as) => (as as HTMLAnchorElement[]).filter((a) => !a.href.includes(location.host) && (a.target !== "_blank" || !/noopener/.test(a.rel))).map((a) => a.href));
  expect(bad).toEqual([]);
});

test("language toggle is at least 40px tall on phones", async ({ page, viewport }) => {
  test.skip(!viewport || viewport.width > 560, "只驗手機寬度");
  await page.goto("/");
  const h = await page.locator(".lang__btn").first().evaluate((el) => el.getBoundingClientRect().height);
  expect(h).toBeGreaterThanOrEqual(40);
});

// 活動頁的講座／工作坊／讀書會詳情卡預設收合（使用者 2026-09-17 拍板）：手機不用滑 16 屏；點標題列才展開內容。
test("event detail cards are collapsed by default and expand on tap", async ({ page, viewport }) => {
  await page.goto("/events/");
  await page.waitForLoadState("networkidle");
  const cards = page.locator("#lectures details.card, #workshops details.card, #reading details.card");
  expect(await cards.count()).toBeGreaterThan(0);
  for (let i = 0; i < await cards.count(); i++) expect(await cards.nth(i).evaluate((d) => (d as HTMLDetailsElement).open), `第 ${i + 1} 張卡預設應收合`).toBe(false);
  if (viewport && viewport.width <= 560) {
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    expect(h, "手機活動頁收合後不該超過 10 屏（收合前約 15 屏）").toBeLessThan(812 * 10);
  }
  const first = cards.first();
  await expect(first.locator("h3")).toBeVisible();                    // 標題列永遠看得到
  await expect(first.locator(".card__body").first()).toBeHidden();    // 內容收著
  await first.locator("summary").click();
  await expect(first.locator(".card__body").first()).toBeVisible();
});
