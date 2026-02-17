import { describe, expect, it } from "vitest";

import { buildCommand, devCommand, doctorCommand, graphCommand, initCommand, listCommand, program } from "./main";

describe("commands", () => {
  it("should export program instance", () => {
    expect(program).toBeDefined();
    // Program class doesn't expose public getters for name/description easily via yargs chain,
    // but we can check it's an object with expected methods
    expect(typeof program.command).toBe("function");
  });

  it("should export configured commands", () => {
    expect(initCommand).toBeDefined();
    expect(devCommand).toBeDefined();
    expect(buildCommand).toBeDefined();
    expect(listCommand).toBeDefined();
    expect(graphCommand).toBeDefined();
    expect(doctorCommand).toBeDefined();

    // Verify basic properties if accessible, or just existence
    expect(initCommand.name).toBe("init");
    expect(devCommand.name).toBe("dev");
    expect(buildCommand.name).toBe("build");
    expect(listCommand.name).toBe("list");
    expect(graphCommand.name).toBe("graph");
    expect(doctorCommand.name).toBe("doctor");
  });

  it("should configure dev command options", () => {
    const options = devCommand.options;
    const optionNames = options.flatMap(o => o.longs);
    expect(optionNames).toContain("host");
    expect(optionNames).toContain("port");
    expect(optionNames).toContain("watch");
    expect(optionNames).toContain("mode");
    expect(optionNames).toContain("root");
  });

  it("should configure init command positional args", () => {
    const positionalNames = initCommand.positionalArgs.map(p => p.name);
    expect(positionalNames).toContain("cwd");
  });
});
