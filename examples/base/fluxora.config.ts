import { defineConfig } from "fluxora";

export default defineConfig({
  server: { port: 3500 },
  projectStructure: {
    apps: {
      hostAppName: "profile"
    }
  }
});
