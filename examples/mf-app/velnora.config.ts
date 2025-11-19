import { defineConfig } from "velnora";

import { nest } from "@velnora/integrations-nest";
import { react } from "@velnora/integrations-react";

export default defineConfig({
  integrations: [react(), nest()],
  experiments: { rolldown: true }
});
