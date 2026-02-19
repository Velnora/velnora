export interface TestSuiteResult {
  name: string;
  tests: { name: string; status: "passed" | "failed" | "skipped"; duration?: number }[];
}
