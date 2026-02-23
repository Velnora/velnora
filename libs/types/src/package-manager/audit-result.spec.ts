import { describe, expectTypeOf, it } from "vitest";

import type { AuditResult } from "./audit-result";
import type { Vulnerability } from "./vulnerability";

describe("AuditResult interface (type-level)", () => {
  it("has a `vulnerabilities` property typed as Vulnerability[]", () => {
    expectTypeOf<AuditResult["vulnerabilities"]>().toEqualTypeOf<Vulnerability[]>();
  });

  it("has a `summary` property with the correct shape", () => {
    expectTypeOf<AuditResult["summary"]>().toEqualTypeOf<{
      critical: number;
      high: number;
      moderate: number;
      low: number;
    }>();
  });

  it("summary.critical is a number", () => {
    expectTypeOf<AuditResult["summary"]["critical"]>().toEqualTypeOf<number>();
  });

  it("summary.high is a number", () => {
    expectTypeOf<AuditResult["summary"]["high"]>().toEqualTypeOf<number>();
  });

  it("summary.moderate is a number", () => {
    expectTypeOf<AuditResult["summary"]["moderate"]>().toEqualTypeOf<number>();
  });

  it("summary.low is a number", () => {
    expectTypeOf<AuditResult["summary"]["low"]>().toEqualTypeOf<number>();
  });

  it("has exactly the expected keys", () => {
    expectTypeOf<keyof AuditResult>().toEqualTypeOf<"vulnerabilities" | "summary">();
  });

  it("is assignable from a valid object literal", () => {
    type Valid = {
      vulnerabilities: Vulnerability[];
      summary: { critical: number; high: number; moderate: number; low: number };
    };

    expectTypeOf<Valid>().toExtend<AuditResult>();
  });
});
