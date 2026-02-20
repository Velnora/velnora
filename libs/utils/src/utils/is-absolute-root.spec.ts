import { describe, expect, it } from "vitest";

import { isAbsoluteRoot } from "./is-absolute-root";

describe("isAbsoluteRoot", () => {
  it('should return true for "/"', () => {
    expect(isAbsoluteRoot("/")).toBe(true);
  });

  it('should return false for "/home"', () => {
    expect(isAbsoluteRoot("/home")).toBe(false);
  });

  it('should return false for "/home/user"', () => {
    expect(isAbsoluteRoot("/home/user")).toBe(false);
  });

  it("should return false for an empty string", () => {
    expect(isAbsoluteRoot("")).toBe(false);
  });

  it('should return false for "."', () => {
    expect(isAbsoluteRoot(".")).toBe(false);
  });

  it('should return false for "./"', () => {
    expect(isAbsoluteRoot("./")).toBe(false);
  });
});
