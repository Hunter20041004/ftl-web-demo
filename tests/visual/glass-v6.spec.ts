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
    await expect(page.locator("#who, #schedule, #weekly, #projects, #partners, #contact")).toHaveCount(6);
    await expect(page.locator("#weekly .issue__cover")).toHaveCount(3);
    await expect(page.locator(".format")).toHaveCount(5);
  });

  test("week calendar shows the current Monday-to-Sunday week with today marked", async ({ page }) => {
    await page.clock.setFixedTime(new Date("2026-09-24T10:00:00+08:00")); // 週四
    await page.goto(`${basePath}/`);
    await page.waitForLoadState("networkidle");
    const week = page.locator("#schedule .week");
    await expect(week).toHaveAttribute("data-week-start", "9/21");
    await expect(week.locator(".week__day")).toHaveCount(7);
    await expect(week.locator(".week__day--today .week__head .num")).toHaveText("9/24");
    // 9/21 錄取公布、9/23 講座 都落在這一週
    await expect(week.locator(".week__items li")).toContainText(["公布專案生結果", "AI 時代商業模式創新"]);
    // 上一週：書審截止與週末面試的標籤要講清楚是什麼
    await week.locator("[data-week-nav=prev]").click();
    await expect(week).toHaveAttribute("data-week-start", "9/14");
    await expect(week.locator(".week__items li")).toContainText(["書審填寫截止", "公布書審結果並確認面試時間", "晚上面試", "晚上面試"]);
    await week.locator("[data-week-nav=next]").click();

    // 往後最多 6 週、往前最多 3 週；到邊界時按鈕失效
    const next = week.locator("[data-week-nav=next]");
    const prev = week.locator("[data-week-nav=prev]");
    await next.click();
    await expect(week).toHaveAttribute("data-week-start", "9/28");
    for (let i = 0; i < 5; i++) await next.click();
    await expect(week).toHaveAttribute("data-week-start", "11/02");
    await expect(next).toBeDisabled();
    await week.locator("[data-week-nav=today]").click();
    await expect(week).toHaveAttribute("data-week-start", "9/21");
    for (let i = 0; i < 3; i++) await prev.click();
    await expect(week).toHaveAttribute("data-week-start", "8/31");
    await expect(prev).toBeDisabled();
  });

  test("membership info switches between project member and auditor", async ({ page }) => {
    await page.goto(`${basePath}/about/`);
    await page.waitForLoadState("networkidle");
    const tabs = page.locator(".mtabs");
    await expect(tabs).toHaveAttribute("data-membership", "project");
    await expect(tabs.locator(".tstep")).toHaveCount(4);
    await expect(tabs.locator(".tiers")).toHaveCount(1);
    await tabs.locator("[data-membership-tab=auditor]").click();
    await expect(tabs).toHaveAttribute("data-membership", "auditor");
    await expect(tabs.locator(".tstep")).toHaveCount(0);
    await expect(tabs.locator(".tiers")).toHaveCount(0);
    await expect(tabs.locator("#payment h3")).toContainText("1,500");
  });

  test("events filter works and a session opens its details", async ({ page }) => {
    await page.goto(`${basePath}/events/`);
    await page.waitForLoadState("networkidle");
    await page.locator('.filter[data-filter="lecture"]').click();
    await expect(page.locator('#event-list [data-cat="lecture"]:visible')).toHaveCount(3);
    await expect(page.locator('#event-list [data-cat="workshop"]:visible')).toHaveCount(0);
    await page.locator('[data-event="3"]').click();
    const dialog = page.locator("dialog[open] .event-detail");
    await expect(dialog).toContainText("陳顯立");
    await expect(dialog).toContainText("生成式 AI");
    await page.keyboard.press("Escape");
    await page.locator('.filter[data-filter="reading"]').click();
    await page.locator('[data-event="4"]').click();
    await expect(page.locator("dialog[open] .event-detail .book__cover")).toBeVisible();
  });

  test("english mode does not flash chinese when navigating between pages", async ({ page }) => {
    await page.goto(`${basePath}/about/`);
    await page.locator('[data-set-lang="en"]').first().click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    // 進下一頁：第一次可見時就該是英文（body 在翻譯完成前是藏起來的）
    await page.goto(`${basePath}/events/`, { waitUntil: "commit" });
    await page.waitForFunction(() => !!document.body && !document.documentElement.classList.contains("lang-pending"));
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("h1")).toContainText("events");
  });

  test("resources page opened with #filter-book pre-selects the book filter", async ({ page }) => {
    await page.goto(`${basePath}/resources/#filter-book`);
    await page.waitForLoadState("networkidle");
    await expect(page.locator('.filter[data-filter="book"]')).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('.res-item[data-cat="job"]:visible')).toHaveCount(0);
    await expect(page.locator('.res-item[data-cat="book"]:visible')).toHaveCount(4);
  });

  test("resources filter by type and books show covers", async ({ page }) => {
    await page.goto(`${basePath}/resources/`);
    await page.waitForLoadState("networkidle");
    await expect(page.locator(".book__cover")).toHaveCount(4);
    await page.locator('.filter[data-filter="book"]').click();
    await expect(page.locator('.res-item[data-cat="book"]:visible')).toHaveCount(4);
    await expect(page.locator('.res-item[data-cat="job"]:visible')).toHaveCount(0);
    await page.locator('.filter[data-filter="job"]').click();
    await expect(page.locator('.res-item[data-cat="job"]:visible')).toHaveCount(1);
    await expect(page.locator('.filter[data-filter="news"]')).toHaveCount(0);
    // 職缺卡與旁邊的卡一樣高
    await page.locator('.filter[data-filter="all"]').click();
    if ((page.viewportSize()?.width ?? 0) >= 960) {
      const heights = await page.locator(".res-grid > .res-item").evaluateAll((els) => els.slice(0, 3).map((e) => Math.round(e.getBoundingClientRect().height)));
      expect(new Set(heights).size).toBe(1);
    }
  });

  test("english mode translates long-form content, including re-rendered parts", async ({ page }) => {
    await page.goto(`${basePath}/about/`);
    await page.waitForLoadState("networkidle");
    await page.locator('[data-set-lang="en"]').first().click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator(".mtabs #types .card__body").first()).toContainText("Written screening");
    await page.locator("[data-membership-tab=auditor]").click();
    await expect(page.locator(".mtabs #timeline h3")).toHaveText("No screening");
    await page.goto(`${basePath}/events/`);
    await page.waitForLoadState("networkidle");
    await expect(page.locator(".card--lecture .card__body").first()).toContainText("generative AI");
  });

  test("projects wall opens a deck in a dialog and pages with buttons and arrow keys", async ({ page }) => {
    await page.goto(`${basePath}/projects/`);
    await page.waitForLoadState("networkidle");
    await expect(page.locator(".project-teaser")).toHaveCount(3);
    await page.locator('[data-project="course-scheduler"]').click();
    const dialog = page.locator("dialog.project-dialog");
    await expect(dialog).toHaveAttribute("open", "");
    const deck = dialog.locator('[data-deck="course-scheduler"]');
    await expect(deck).toHaveAttribute("data-slide", "0");
    await deck.locator("[data-deck-nav=next]").click();
    await expect(deck).toHaveAttribute("data-slide", "1");
    await expect(deck.locator(".deck__title")).toContainText("選課要同時顧");
    await expect(deck.locator(".deck__stats li")).toHaveCount(3);
    await deck.focus();
    await page.keyboard.press("ArrowRight");
    await expect(deck).toHaveAttribute("data-slide", "2");
    await page.keyboard.press("Escape");
    await expect(dialog).not.toHaveAttribute("open", "");
    // 從首頁帶 #id 進來要直接打開
    await page.goto(`${basePath}/projects/#smart-album`);
    await expect(page.locator('dialog.project-dialog [data-deck="smart-album"]')).toBeVisible();
  });

  test("insights shows the latest weekly issue with sourced stories", async ({ page }) => {
    await page.goto(`${basePath}/insights/`);
    await page.waitForLoadState("networkidle");
    await expect(page.locator(".issue .issue__headlines li")).toHaveCount(3);
    await expect(page.locator(".issue__story")).toHaveCount(3);
    await expect(page.locator(".row--issue")).toHaveCount(2);
    await expect(page.locator("#research .paper")).toHaveCount(6);
    // 首頁連結帶 #vol-1 進來時，往期那一格要自動展開
    await page.goto(`${basePath}/insights/#vol-1`);
    await expect(page.locator("#vol-1")).toHaveAttribute("open", "");
    const links = page.locator(".issue__sources a");
    expect(await links.count()).toBeGreaterThanOrEqual(3);
    for (const href of await links.evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href))) expect(href).toMatch(/^https:\/\//);
  });

  test("logo draws in, then settles on the original image", async ({ page }) => {
    // 動畫在 HTML 一到就開始跑（純 CSS），所以用 commit 而不是 load 去抓「還在畫」的狀態
    await page.goto(`${basePath}/`, { waitUntil: "commit" });
    const logo = page.locator(".logo-draw");
    await expect(logo.locator(".logo-draw__brush")).toHaveCount(4);
    await expect(logo.locator("img")).toHaveCSS("opacity", "0");
    await expect(logo).toHaveAttribute("data-logo-state", "done", { timeout: 15000 });
    await expect(logo.locator("img")).toHaveCSS("opacity", "1");
  });

  test("cards and rows are separated by light, not by 1px lines", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${basePath}/`);
    await page.waitForLoadState("networkidle");
    const hardLines = await page.evaluate(() => {
      const selectors = ".card, .ios-row, .row, .partner, .principle, .tstep, .week__day, .deck__stage, .btn, .sec-head, .tag";
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
    await expect(page.locator(".hero__sub")).toHaveCSS("font-family", /Outfit/);
    const fontsReady = await page.evaluate(async () => {
      await document.fonts.ready;
      return document.fonts.check('16px "Outfit"') && document.fonts.check('16px "Huninn"');
    });
    expect(fontsReady).toBe(true);
  });
});
