import { expect, test } from "@playwright/test";

// 手機版面契約（2026-09-17 健檢抓到的）：內容欄不能被固定寬度的標籤／日期欄擠成一小條。
test.describe("mobile layout", () => {
  test.beforeEach(async ({ viewport }) => { test.skip(!viewport || viewport.width > 560, "只驗手機寬度"); });

  test("event rows give the title most of the row width", async ({ page }) => {
    await page.goto("/events/");
    await page.waitForLoadState("networkidle");
    const ratios = await page.$$eval("#event-list .row", (rows) => rows.slice(0, 6).map((r) => {
      const t = r.querySelector<HTMLElement>(".row__title")!;
      return t.getBoundingClientRect().width / r.getBoundingClientRect().width;
    }));
    for (const ratio of ratios) expect(ratio, "活動標題欄至少佔列寬 60%").toBeGreaterThan(0.6);
  });

  test("info rows stack label above value", async ({ page }) => {
    await page.goto("/about/");
    await page.waitForLoadState("networkidle");
    const ratios = await page.$$eval(".info-list .info", (rows) => rows.slice(0, 6).map((r) => {
      const dd = r.querySelector<HTMLElement>("dd")!;
      return dd.getBoundingClientRect().width / r.getBoundingClientRect().width;
    }));
    for (const ratio of ratios) expect(ratio, "資訊列的值至少佔列寬 75%").toBeGreaterThan(0.75);
  });

  test("page titles do not break inside a word", async ({ page }) => {
    // 「政大金融科技創新實驗室」在 375px 要一行放得下；有頓號的標題只在頓號後換行
    await page.goto("/about/");
    await page.waitForLoadState("networkidle");
    const lines = await page.$eval(".pagehead .h1", (h) => Math.round(h.getBoundingClientRect().height / parseFloat(getComputedStyle(h).lineHeight)));
    expect(lines).toBe(1);
    await page.goto("/resources/");
    await page.waitForLoadState("networkidle");
    const wb = await page.$eval(".pagehead .h1", (h) => getComputedStyle(h).wordBreak);
    expect(wb).toBe("keep-all");
  });
});

// 手指點擊目標：主要內容與導覽列裡每個可點元素高度 ≥ 40px（頁尾的文字連結除外）。
test("every tappable element in main content is at least 40px tall on phones", async ({ page, viewport }) => {
  test.skip(!viewport || viewport.width > 560, "只驗手機寬度");
  for (const route of ["/", "/about/", "/events/", "/projects/", "/insights/", "/resources/", "/contact/"]) {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    await page.evaluate(async () => { for (let y = 0; y <= document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } });
    const small = await page.$$eval("main a[href], main button, main summary, header a, header button", (els) => els
      .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 40 && !el.closest(".story, .article-body, .card__body, p, li"); })
      .map((el) => `${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 20)}" ${Math.round(el.getBoundingClientRect().height)}px`));
    expect(small, `${route} 有太小的點擊目標`).toEqual([]);
  }
});
