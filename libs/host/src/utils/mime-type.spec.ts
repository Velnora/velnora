/**
 * Unit tests for {@link MIME_TYPES}.
 *
 * Validates that every expected extension maps to its correct content type.
 */
import { describe, expect, it } from "vitest";

import { MIME_TYPES } from "./mime-type";

describe("MIME_TYPES", () => {
  it.each([
    [".html", "text/html"],
    [".css", "text/css"],
    [".js", "text/javascript"],
    [".mjs", "text/javascript"],
    [".json", "application/json"],
    [".png", "image/png"],
    [".jpg", "image/jpeg"],
    [".jpeg", "image/jpeg"],
    [".gif", "image/gif"],
    [".svg", "image/svg+xml"],
    [".ico", "image/x-icon"],
    [".woff", "font/woff"],
    [".woff2", "font/woff2"],
    [".ttf", "font/ttf"],
    [".txt", "text/plain"]
  ])("should map %s to %s", (ext, mime) => {
    expect(MIME_TYPES[ext]).toBe(mime);
  });

  it("should return undefined for an unknown extension", () => {
    expect(MIME_TYPES[".xyz"]).toBeUndefined();
  });
});
