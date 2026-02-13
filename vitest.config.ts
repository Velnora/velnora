import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      reportsDirectory: "./coverage",
      reporter: ["text", "json", "html"],
      provider: "v8",
      include: ["libs/**/src/**/*.ts", "packages/**/src/**/*.ts"],
      exclude: ["**/*.spec.ts", "**/*.test.ts", "**/*.d.ts", "**/*.config.ts", "**/dist/**", "**/build/**"]
    },
    projects: ["libs/*", "packages/*"]
  }
});
