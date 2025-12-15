import type { ZodError, z } from "zod";

export class VelnoraConfigError extends Error {
  readonly code = "VELNORA_CONFIG_INVALID" as const;

  constructor(
    public readonly app: string,
    public readonly error: ZodError
  ) {
    super(VelnoraConfigError.formatMessage(app, error.issues));
    this.name = "VelnoraConfigError";
  }

  private static formatMessage(app: string, issues: z.core.$ZodIssue[]) {
    const lines = issues.map(i => {
      const path = i.path.length ? i.path.join(".") : "<root>";
      return `- ${path}: ${i.message}`;
    });

    return [
      `Invalid Velnora config for app "${app}".`,
      ...(lines.length ? ["Issues:", ...lines] : ["Issues: <none>"])
    ].join("\n");
  }
}
