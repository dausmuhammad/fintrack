import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 120000,
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:3000",
    channel: "msedge",
    trace: "retain-on-failure",
    actionTimeout: 10000,
  },
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true,
    timeout: 120000,
  },
});
