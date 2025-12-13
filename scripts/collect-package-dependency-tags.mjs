import { glob } from "glob";

export const collectPackageDependencyTags = async root => {
  const projectJsons = await glob("**/project.json", { cwd: root, ignore: ["node_modules/**", "examples/**"] });
  const projects = [];

  for (const path of projectJsons) {
    const { default: project } = await import(`${root}/${path}`, { with: { type: "json" } });
    const currentScope = project.tags?.find(tag => tag.startsWith("scope:"))?.split(":")[1];
    if (!currentScope) {
      throw new Error(`Project at ${path} is missing a scope tag.`);
    }

    const dependencies = project.dependencies;
    const ignoredDependencies = project.ignoredDependencies;
    projects.push({
      sourceTag: `scope:${currentScope}`,
      onlyDependOnLibsWithTags: dependencies ? dependencies : [],
      notDependOnLibsWithTags: ignoredDependencies ? ignoredDependencies : []
    });
  }

  return projects.filter(a => !!a);
};
