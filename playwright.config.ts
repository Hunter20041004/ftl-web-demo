import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  // 後台 E2E 需要測試專案的鑰匙：本機從 .env.local 讀（dev server 也是），CI 由 secrets 提供
  globalSetup: "./tests/load-env.ts",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true,
  },
  projects: [
    { name: "desktop-1440", testDir: "./tests/visual", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "desktop-1280", testDir: "./tests/visual", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } },
    { name: "desktop-1024", testDir: "./tests/visual", use: { ...devices["Desktop Chrome"], viewport: { width: 1024, height: 768 } } },
    { name: "admin", testDir: "./tests/admin", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } },
    {
      name: "mobile-390",
      testDir: "./tests/visual",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
    // Safari 引擎（WebKit）：本機 macOS 14 跑不起 Playwright 1.63 的 WebKit，所以只在 CI（Linux）或 WEBKIT=1 時啟用。
    ...(process.env.CI || process.env.WEBKIT ? [
      { name: "webkit-desktop", testDir: "./tests/visual", use: { ...devices["Desktop Safari"], viewport: { width: 1280, height: 800 } } },
      { name: "webkit-mobile", testDir: "./tests/visual", use: { ...devices["iPhone 13"], deviceScaleFactor: 1 } },   // 3x 時整頁截圖會超過 32767px 上限
    ] : []),
  ],
});
