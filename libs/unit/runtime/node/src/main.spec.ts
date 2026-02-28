import { describe, expect, it } from "vitest";

import nodeRuntime from "./main";

describe("@velnora/runtime-node", () => {
  it("should export a runtime definition", () => {
    expect(nodeRuntime).toBeDefined();
  });

  it("should have the correct name", () => {
    expect(nodeRuntime.name).toBe("node");
  });

  it("should target the node runtime", () => {
    expect(nodeRuntime.runtime).toBe("node");
  });

  it("should declare javascript and node capabilities", () => {
    expect(nodeRuntime.capabilities).toEqual(["javascript", "node"]);
  });

  it("should have a detect function", () => {
    expect(typeof nodeRuntime.detect).toBe("function");
  });

  it("should have a resolve function", () => {
    expect(typeof nodeRuntime.resolve).toBe("function");
  });

  it("should have a configure function", () => {
    expect(typeof nodeRuntime.configure).toBe("function");
  });

  it("should have a resolvePackageManager function", () => {
    expect(typeof nodeRuntime.resolvePackageManager).toBe("function");
  });
});
