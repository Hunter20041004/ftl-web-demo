import { test, expect } from "@playwright/test";
import { TEST_ANON, TEST_URL, USERS, loginAs } from "./helpers";
import { admin, deleteAndRestore, service } from "./entity-helpers";

test.beforeEach(() => { test.skip(!TEST_URL() || !TEST_ANON() || !service(), "needs SUPABASE_TEST_*"); });
test.afterEach(async () => { await admin().from("projects").delete().eq("id", "e2e-project"); });

test("projects: slug, cover upload, four slides with visuals, publish", async ({ page }) => {
  await loginAs(page, USERS.editor);
  await page.getByRole("navigation").getByRole("link", { name: "專案" }).click();
  await expect(page.getByTestId("entity-row")).toHaveCount(3);
  await page.getByRole("button", { name: "新增專案" }).click();
  await page.getByLabel("網址代號").fill("E2E Project!");
  await expect(page.getByLabel("網址代號")).toHaveValue("e2e-project");
  await page.getByLabel("名稱（中文）").fill("E2E 專案");
  await page.getByLabel("名稱（英文）").fill("E2E Project");
  await page.getByLabel("一句話（中文）").fill("一句話");
  await page.getByLabel("一句話（英文）").fill("One line");
  await page.getByLabel("負責人（中文）").fill("社員專案");
  await page.getByLabel("負責人（英文）").fill("Member project");
  await page.getByLabel("標籤（中文）").fill("AI\n開源");
  await page.getByLabel("標籤（英文）").fill("AI\nOpen source");
  await page.getByLabel("GitHub").fill("https://github.com/x/y");
  await page.locator("#cover").setInputFiles("assets/projects/hextech.jpg");
  await expect(page.getByTestId("cover-preview")).toBeVisible();
  for (let i = 0; i < 4; i += 1) {
    const slide = page.getByTestId(`slide-${i}`);
    await slide.getByLabel("標題（中文）").fill(`第 ${i + 1} 張`);
    await slide.getByLabel("標題（英文）").fill(`Slide ${i + 1}`);
    await slide.getByLabel("內文（中文）").fill("內文");
    await slide.getByLabel("內文（英文）").fill("Body");
  }
  // 第二張改成「數字」視覺
  const s1 = page.getByTestId("slide-1");
  await s1.getByLabel("視覺類型").selectOption("stats");
  await s1.getByLabel("數字").fill("3｜個步驟｜steps\n2｜種語言｜languages");
  // 第一張用圖片：把封面路徑當投影片圖
  const s0 = page.getByTestId("slide-0");
  await s0.getByLabel("視覺類型").selectOption("image");
  await s0.getByRole("button", { name: "用封面圖" }).click();
  await page.getByRole("button", { name: "發布" }).click();
  await expect(page.getByText("已送出重建")).toBeVisible();
  await expect(page.getByTestId("entity-row")).toHaveCount(4);
  const { data } = await admin().from("projects").select("id,status,data").eq("id", "e2e-project").single();
  expect(data?.status).toBe("published");
  expect(data?.data.slides[1].visual).toEqual({ kind: "stats", items: [["3", "個步驟", "steps"], ["2", "種語言", "languages"]] });
  expect(data?.data.slides[0].visual.kind).toBe("image");
  expect(data?.data.cover).toMatch(/^\/media\/projects\//);
  await deleteAndRestore(page, "專案", "E2E 專案");
});
