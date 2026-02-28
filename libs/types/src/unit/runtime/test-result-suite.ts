/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */

/**
 * A single test suite's results within a test run.
 *
 * Each suite groups related test cases (e.g. a single test file or a
 * JUnit test class). Aggregate totals live in {@link TestResult}; this
 * interface provides the per-suite breakdown.
 */
export interface TestSuiteResult {
  /**
   * Human-readable name of the suite.
   *
   * Typically the file path or class name (e.g. `"auth.spec.ts"`,
   * `"com.acme.UserServiceTest"`).
   */
  name: string;

  /**
   * Ordered list of individual test outcomes within this suite.
   *
   * Each entry captures the test's display name, its pass/fail/skip
   * status, and an optional wall-clock duration in milliseconds.
   */
  tests: {
    /** Display name of the individual test case. */
    name: string;

    /** Terminal status of the test case. */
    status: "passed" | "failed" | "skipped";

    /** Wall-clock duration of the test case in milliseconds, if measured. */
    duration?: number;
  }[];
}
