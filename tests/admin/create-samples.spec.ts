import { test, expect } from "@playwright/test";
import { TEST_ANON, TEST_URL, USERS, loginAs } from "./helpers";
import { service } from "./entity-helpers";

// 只在 INTEGRATION=1 時跑：透過後台畫面在測試專案建立六類各一筆（標記 ITG），
// 之後由 scripts 端拉資料＋build，驗證真的出現在前台 HTML。不清理（由整合腳本清）。
test.beforeEach(() => { test.skip(!process.env.INTEGRATION || !TEST_URL() || !TEST_ANON() || !service(), "integration only"); });

test("create one published item per category via the admin UI", async ({ page }) => {
  test.setTimeout(120_000);
  await loginAs(page, USERS.editor);
  const nav = (n: string) => page.getByRole("navigation").getByRole("link", { name: n }).click();
  const publish = async () => { await page.getByRole("button", { name: "發布" }).click(); await expect(page.getByText("已送出重建")).toBeVisible(); };

  await nav("合作對象"); await page.getByRole("button", { name: "新增合作對象" }).click();
  await page.getByLabel("中文名稱").fill("ITG 合作夥伴"); await page.getByLabel("英文名稱").fill("ITG Partner"); await page.getByLabel("連結").fill("https://itg.example.com/");
  await publish();

  await nav("研究文章"); await page.getByRole("button", { name: "新增研究文章" }).click();
  await page.getByLabel("標題（中文）").fill("ITG 研究文章"); await page.getByLabel("作者（中文）").fill("ITG 作者"); await page.getByLabel("出處（中文）").fill("ITG 期刊");
  await page.getByLabel("年份").fill("2026"); await page.getByLabel("摘要（中文）").fill("摘要"); await page.getByLabel("摘要（英文）").fill("Summary"); await page.getByLabel("連結").fill("https://itg.example.com/paper");
  await publish();

  await nav("資源"); await page.getByRole("button", { name: "新增資源" }).click();
  await page.getByLabel("類型").selectOption("job");
  await page.getByLabel("標題（中文）").fill("ITG 職缺"); await page.getByLabel("標題（英文）").fill("ITG Job"); await page.getByLabel("單位（中文）").fill("ITG 公司"); await page.getByLabel("單位（英文）").fill("ITG Corp");
  await page.getByLabel("說明（中文）").fill("說明"); await page.getByLabel("說明（英文）").fill("Summary"); await page.getByLabel("截止日").fill("2099-12-31");
  await publish();

  await nav("專案"); await page.getByRole("button", { name: "新增專案" }).click();
  await page.getByLabel("網址代號").fill("itg-project");
  await page.getByLabel("名稱（中文）").fill("ITG 專案"); await page.getByLabel("名稱（英文）").fill("ITG Project");
  await page.getByLabel("一句話（中文）").fill("一句話"); await page.getByLabel("一句話（英文）").fill("One line");
  await page.getByLabel("負責人（中文）").fill("社員專案"); await page.getByLabel("負責人（英文）").fill("Member project");
  await page.getByLabel("標籤（中文）").fill("AI"); await page.getByLabel("標籤（英文）").fill("AI"); await page.getByLabel("GitHub").fill("https://github.com/x/itg");
  await page.locator("#cover").setInputFiles("assets/projects/hextech.jpg"); await expect(page.getByTestId("cover-preview")).toBeVisible();
  for (let i = 0; i < 4; i += 1) { const s = page.getByTestId(`slide-${i}`); await s.getByLabel("標題（中文）").fill(`ITG 投影片 ${i + 1}`); await s.getByLabel("標題（英文）").fill(`Slide ${i + 1}`); await s.getByLabel("內文（中文）").fill("內文"); await s.getByLabel("內文（英文）").fill("Body"); await s.getByLabel("清單（中文）").fill("a"); await s.getByLabel("清單（英文）").fill("a"); }
  await publish();

  await nav("活動"); await page.getByRole("button", { name: "新增活動" }).click();
  await page.getByLabel("類型").selectOption("social"); await page.getByLabel("週次").fill("17"); await page.getByLabel("日期").fill("2026-12-30");
  await page.getByLabel("活動名稱（中文）").fill("ITG 期末活動"); await page.getByLabel("活動名稱（英文）").fill("ITG Finale");
  await publish();

  await nav("週報"); await page.getByRole("button", { name: "新增一期" }).click();
  await page.getByLabel("期數").fill("98");
  await page.getByLabel("本期一句話（中文）").fill("ITG 導語"); await page.getByLabel("本期一句話（英文）").fill("ITG lede");
  for (let i = 0; i < 3; i += 1) {
    const s = page.getByTestId(`story-${i}`);
    for (const [label, v] of [["短標（中文）", `ITG 短標 ${i + 1}`], ["短標（英文）", `ITG H${i + 1}`], ["標題（中文）", `ITG 標題 ${i + 1}`], ["標題（英文）", `ITG T${i + 1}`], ["一句話（中文）", "x"], ["一句話（英文）", "x"], ["背景（中文）", "x"], ["背景（英文）", "x"], ["為什麼重要（中文）", "x"], ["為什麼重要（英文）", "x"], ["台灣視角（中文）", "x"], ["台灣視角（英文）", "x"], ["重點（中文）", "a"], ["重點（英文）", "a"], ["接下來（中文）", "b"], ["接下來（英文）", "b"]]) await s.getByLabel(label).fill(v);
    await s.getByLabel("來源").fill("來源｜Source｜https://itg.example.com/s｜一手");
  }
  await publish();
});
