import { describe, expect, it } from "vitest";

import * as main from "./main";

describe("main exports", () => {
  it("should export findWorkspaceRoot", () => {
    expect(main.detectWorkspace).toBeDefined();
    expect(typeof main.detectWorkspace).toBe("function");
  });
});
