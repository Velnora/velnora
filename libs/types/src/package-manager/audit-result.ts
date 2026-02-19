import type { Vulnerability } from "./vulnerability";

export interface AuditResult {
  vulnerabilities: Vulnerability[];
  summary: { critical: number; high: number; moderate: number; low: number };
}
