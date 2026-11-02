const ENV_FILE_SEGMENT = /^\.env([.*].*)?$/;

/**
 * True when a file path or glob points at `.env` or a variant such as `.env.local` or `.env*`.
 * `.env.example` is public by design, so it never counts.
 */
export const pathTargetsEnvFile = value => {
  return value.split(/[\\/]/).some(segment => ENV_FILE_SEGMENT.test(segment) && segment !== ".env.example");
};
