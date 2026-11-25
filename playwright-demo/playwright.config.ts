import { defineConfig, devices } from "@playwright/test";
import process from "node:process";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }]
  ],
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  projects: [
    {
      name: "backend",
      testDir: "./tests/backend",
      use: {
        baseURL: "http://127.0.0.1:5080"
      }
    },
    {
      name: "frontend",
      testDir: "./tests/frontend",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://127.0.0.1:5173"
      }
    },
    {
      name: "integration",
      testDir: "./tests/integration",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://127.0.0.1:5173"
      }
    }
  ],
  webServer: [
    {
      command: "dotnet run --no-launch-profile --project backend/ProductApi/ProductApi.csproj --urls http://127.0.0.1:5080",
      url: "http://127.0.0.1:5080/api/health",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000
    },
    {
      command: "npm run dev",
      url: "http://127.0.0.1:5173",
      reuseExistingServer: !process.env.CI,
      timeout: 30_000
    }
  ]
});
