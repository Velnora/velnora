/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import { createJiti } from "jiti";

export const jiti = createJiti(process.env.PROJECT_CWD || process.cwd());
