import { readFile } from "fs/promises";

import fg from "fast-glob";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { findProjects } from "./discovery";

vi.mock("fast-glob");
vi.mock("fs/promises");

describe("findProjects", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should find projects with project.json", async () => {
    vi.mocked(fg).mockResolvedValue(["/root/packages/app/project.json"]);
    vi.mocked(readFile).mockResolvedValue(JSON.stringify({ name: "my-app", type: "app" }));

    const projects = await findProjects("/root");

    expect(projects).toHaveLength(1);
    expect(projects[0]).toEqual({
      name: "my-app",
      root: "/root/packages/app",
      configFile: "/root/packages/app/project.json",
      config: { name: "my-app", type: "app" }
    });
  });
  it("should find projects with package.json", async () => {
    vi.mocked(fg).mockResolvedValue(["/root/packages/legacy/package.json"]);
    vi.mocked(readFile).mockResolvedValue(JSON.stringify({ name: "legacy-pkg", version: "1.0.0" }));

    const projects = await findProjects("/root");

    expect(projects).toHaveLength(1);
    expect(projects[0]!.name).toBe("legacy-pkg");
    expect(projects[0]!.configFile).toBe("/root/packages/legacy/package.json");
  });
});
