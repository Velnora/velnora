import { defineConfig } from "velnora";

import { nest } from "@velnora/integrations-nest";
import { react } from "@velnora/integrations-react";

export default defineConfig({
  integrations: [react(), nest()],
  apps: {
    csrAppRedirectToIndexHtml: false
  },
  experiments: { rolldown: true }
});
