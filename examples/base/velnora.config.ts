import { defineConfig } from "velnora";

export default defineConfig({
  server: { port: 3500 },
  projectStructure: {
    apps: {
      hostAppName: "landing"
    }
  }
});
