/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import type { TestSuiteResult } from "./test-result-suite";

/**
 * Aggregate test-run outcome returned by {@link Toolchain.test}.
 *
 * Provides top-level pass/fail counts and an optional per-suite breakdown
 * via {@link suites}.
 *
 * @see {@link TestSuiteResult} for the per-suite structure.
 */
export interface TestResult {
  /** Whether the entire test run passed (zero failures). */
  success: boolean;

  /** Total number of test cases that were discovered. */
  total: number;

  /** Number of test cases that passed. */
  passed: number;

  /** Number of test cases that failed. */
  failed: number;

  /** Number of test cases that were skipped or marked as pending. */
  skipped?: number;

  /** Total wall-clock duration of the test run in milliseconds. */
  duration?: number;

  /**
   * Optional structured breakdown of results by test suite.
   *
   * When provided, the sum of all suite-level counts should match the
   * top-level {@link total}, {@link passed}, {@link failed}, and
   * {@link skipped} values.
   */
  suites?: TestSuiteResult[];
}
