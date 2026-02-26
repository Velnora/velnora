import { createJiti } from "jiti";

export const jiti = createJiti(process.env.PROJECT_CWD || process.cwd());
