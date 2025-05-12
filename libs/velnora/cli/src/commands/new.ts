import { project } from "./generate/project";

export const newCommand: typeof project = {
  ...project,
  command: "new",
  description: `${project.description}. (Alias of "generate project" command)`
};
