import { describe, expectTypeOf, it } from "vitest";

import type { OutdatedResult } from "./outdated-result";

describe("OutdatedResult interface (type-level)", () => {
  it("has a `packages` property typed as an array of package info objects", () => {
    expectTypeOf<OutdatedResult["packages"]>().toEqualTypeOf<
      { name: string; current: string; latest: string; wanted: string }[]
    >();
  });

  it("packages element has a string `name`", () => {
    expectTypeOf<OutdatedResult["packages"][number]["name"]>().toEqualTypeOf<string>();
  });

  it("packages element has a string `current`", () => {
    expectTypeOf<OutdatedResult["packages"][number]["current"]>().toEqualTypeOf<string>();
  });

  it("packages element has a string `latest`", () => {
    expectTypeOf<OutdatedResult["packages"][number]["latest"]>().toEqualTypeOf<string>();
  });

  it("packages element has a string `wanted`", () => {
    expectTypeOf<OutdatedResult["packages"][number]["wanted"]>().toEqualTypeOf<string>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof OutdatedResult>().toEqualTypeOf<"packages">();
  });

  it("is assignable from a valid object literal", () => {
    type Valid = {
      packages: { name: string; current: string; latest: string; wanted: string }[];
    };

    expectTypeOf<Valid>().toExtend<OutdatedResult>();
  });
});
