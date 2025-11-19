import { z } from "zod";

import { nullishObject } from "../../../utils/nullish-object";
import { type Integration, integrationSchema } from "../../integration";
import { type Experiments, experimentsSchema } from "./experiments.schema";
import { type Server, serverSchema } from "./server.schema";
import { type Workspace, workspaceSchema } from "./workspace.schema";

export const velnoraConfigSchema = z.object({
  mode: z.string().optional().default("development"),
  root: z.string().optional().default(process.cwd()),
  hostApp: z.string().optional().default("host"),
  server: z.preprocess(nullishObject, serverSchema),
  workspace: z.preprocess(nullishObject, workspaceSchema),
  integrations: z.array(integrationSchema).default([]),
  experiments: z.preprocess(nullishObject, experimentsSchema)
});

export const defaultVelnoraConfig = velnoraConfigSchema.parse({});

export interface VelnoraConfig {
  mode: string;
  root: string;
  hostApp: string;
  server: Server;
  workspace: Workspace;
  integrations: Array<Integration>;
  experiments: Experiments;
}
