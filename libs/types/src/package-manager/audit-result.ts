import type { Vulnerability } from "./vulnerability";

/**
 * The output of a security audit run against project dependencies.
 *
 * Returned by {@link PackageManager.audit} after scanning the dependency tree
 * for known vulnerabilities. Contains the full list of advisories together with
 * an aggregated severity breakdown in {@link AuditResult.summary | summary}.
 *
 * @see {@link Vulnerability} for the shape of individual advisories.
 * @see {@link PackageManager.audit} for the method that produces this result.
 *
 * @example
 * ```typescript
 * const result: AuditResult = await pm.audit();
 *
 * if (result.summary.critical > 0) {
 *   throw new Error(`${result.summary.critical} critical vulnerabilities found`);
 * }
 * ```
 */
export interface AuditResult {
  /** The complete list of vulnerabilities discovered during the audit. */
  vulnerabilities: Vulnerability[];
  /**
   * Aggregated severity counts across all discovered vulnerabilities.
   *
   * Each key represents a severity level and its value is the number of
   * advisories that fall into that category.
   */
  summary: { critical: number; high: number; moderate: number; low: number };
}
