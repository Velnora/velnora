import type { TestSuiteResult } from "./test-result-suite";

export interface TestResult {
  success: boolean;
  total: number;
  passed: number;
  failed: number;
  skipped?: number;
  duration?: number; // ms
  suites?: TestSuiteResult[]; // optional structured breakdown
}
