import { test, expect } from "@playwright/test";
import { TEST_ANON, TEST_URL, USERS, loginAs } from "./helpers";
import { admin, service } from "./entity-helpers";

// 極端案例：超長文字、特殊字元、壞檔案、重複、邊界數值。每一條都要「被擋下來或安全地存進去」，不能白畫面。
test.beforeEach(() => { test.skip(!TEST_URL() || !TEST_ANON() || !service(), "needs SUPABASE_TEST_*"); });
test.afterEach(async () => {
  await admin().from("partners").delete().like("data->>zh", "EDGE%");
  await admin().from("events").delete().like("data->>zh", "EDGE%");
  await admin().from("papers").delete().like("data->>title", "EDGE%");
});

test("very long text and special characters are stored verbatim", async ({ page }) => {
  const long = "EDGE 長文 " + "很長的句子，".repeat(400);   // ≈ 2,400 字
  const weird = `EDGE 特殊 <script>alert(1)</script> "引號" 'single' & emoji 🚀 \\ 反斜線`;
  await loginAs(page, USERS.editor);
  await page.getByRole("navigation").getByRole("link", { name: "合作對象" }).click();
  await page.getByRole("button", { name: "新增合作對象" }).click();
  await page.getByLabel("中文名稱").fill(weird);
  await page.getByLabel("英文名稱").fill(long);
  await page.getByLabel("連結").fill("https://example.com/?q=<b>&x=1");
  await page.getByRole("button", { name: "發布" }).click();
  await expect(page.getByText("已送出重建")).toBeVisible();
  const { data } = await admin().from("partners").select("data").like("data->>zh", "EDGE%").single();
  expect(data?.data.zh).toBe(weird);
  expect(data?.data.en).toBe(long);
  // 清單頁沒有橫向捲動、也沒有把 <script> 當 HTML
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)).toBe(false);
  expect(await page.locator("script:not([src])").filter({ hasText: "alert(1)" }).count()).toBe(0);
});

test("non-image file upload is refused with a message; huge image is downscaled", async ({ page }) => {
  await loginAs(page, USERS.editor);
  await page.getByRole("navigation").getByRole("link", { name: "合作對象" }).click();
  await page.getByRole("button", { name: "新增合作對象" }).click();
  await page.locator("#logo").setInputFiles({ name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("hello") });
  await expect(page.getByText("請選擇圖片檔（PNG、JPG 或 SVG）")).toBeVisible();
  // 4000×4000 的 PNG（瀏覽器端產生）
  const big = await page.evaluate(async () => {
    const c = document.createElement("canvas"); c.width = 4000; c.height = 4000;
    c.getContext("2d")!.fillRect(0, 0, 4000, 4000);
    const blob: Blob = await new Promise((r) => c.toBlob((b) => r(b!), "image/png"));
    return Array.from(new Uint8Array(await blob.arrayBuffer()));
  });
  await page.locator("#logo").setInputFiles({ name: "big.png", mimeType: "image/png", buffer: Buffer.from(big) });
  await expect(page.getByTestId("logo-preview")).toBeVisible();
  const dims = await page.getByTestId("logo-preview").evaluate((img: HTMLImageElement) => new Promise<[number, number]>((r) => { if (img.complete) r([img.naturalWidth, img.naturalHeight]); else img.onload = () => r([img.naturalWidth, img.naturalHeight]); }));
  expect(Math.max(...dims)).toBeLessThanOrEqual(400);
  await page.getByLabel("中文名稱").fill("EDGE 大圖");
  await page.getByLabel("英文名稱").fill("Big");
  await page.getByLabel("連結").fill("https://example.com/");
  await page.getByRole("button", { name: "存草稿" }).click();
  await expect(page.getByText("已存成草稿")).toBeVisible();
});

test("boundary values are blocked with field errors, duplicates get a friendly message", async ({ page }) => {
  await loginAs(page, USERS.editor);
  // 活動：週次 0
  await page.getByRole("navigation").getByRole("link", { name: "活動" }).click();
  await page.getByRole("button", { name: "新增活動" }).click();
  await page.getByLabel("週次").fill("0");
  await page.getByLabel("日期").fill("2026-09-30");
  await page.getByLabel("活動名稱（中文）").fill("EDGE 週次零");
  await page.getByLabel("活動名稱（英文）").fill("Week zero");
  await page.getByRole("button", { name: "發布" }).click();
  await expect(page.locator('[data-field="week"] .text-destructive')).toBeVisible();
  await page.keyboard.press("Escape");
  // 研究文章：年份非數字
  await page.getByRole("navigation").getByRole("link", { name: "研究文章" }).click();
  await page.getByRole("button", { name: "新增研究文章" }).click();
  await page.getByLabel("年份").fill("");
  await page.getByLabel("標題（中文）").fill("EDGE 年份");
  await page.getByRole("button", { name: "發布" }).click();
  await expect(page.locator('[data-field="year"] .text-destructive')).toBeVisible();
  await page.keyboard.press("Escape");
  // 週報：重複期數
  await page.getByRole("navigation").getByRole("link", { name: "週報" }).click();
  await page.getByRole("button", { name: "新增一期" }).click();
  await page.getByLabel("期數").fill("3");
  await page.getByRole("button", { name: "存草稿" }).click();
  await expect(page.getByText(/已經存在|已經有同樣/)).toBeVisible();
});
