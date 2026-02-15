/**
 * Unit tests for the {@link Project} class.
 *
 * Validates that all getters expose the correct values and that
 * derived properties (`displayName`, `path`) are computed from `packageJson`.
 */
import { describe, expect, it } from "vitest";

import { Project } from "./project";

const options = {
  name: "apps/web",
  root: "/workspace/apps/web",
  packageJson: { name: "@acme/web" },
  config: {}
};

describe("Project", () => {
  it("should expose the project name", () => {
    const project = new Project(options);

    expect(project.name).toBe("apps/web");
  });

  it("should derive displayName from packageJson.name", () => {
    const project = new Project(options);

    expect(project.displayName).toBe("@acme/web");
  });

  it("should expose the root path", () => {
    const project = new Project(options);

    expect(project.root).toBe("/workspace/apps/web");
  });

  it("should derive path from packageJson.name", () => {
    const project = new Project(options);

    expect(project.path).toBe("/@acme/web");
  });

  it("should expose packageJson", () => {
    const project = new Project(options);

    expect(project.packageJson).toEqual({ name: "@acme/web" });
  });

  it("should expose config", () => {
    const project = new Project(options);

    expect(project.config).toEqual({});
  });

  it("should handle config with environments", () => {
    const project = new Project({
      ...options,
      config: { environments: { dev: {}, prod: {} } }
    });

    expect(project.config.environments).toEqual({ dev: {}, prod: {} });
  });
});
