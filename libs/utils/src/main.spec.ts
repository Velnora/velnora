import { describe, expect, it } from "vitest";

import * as main from "./main";

describe("main exports", () => {
  it("should export findWorkspaceRoot", () => {
    expect(main.findWorkspaceRoot).toBeDefined();
    expect(typeof main.findWorkspaceRoot).toBe("function");
  });
});
