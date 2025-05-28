// This is temporary type. Gonna be grabbed from napi-rs output later.

export interface Logger {
  // debugging
  debug(...args: any[]): void;
  // default log output
  info(...args: any[]): void;
  // same as info
  log(...args: any[]): void;
  // warning
  warn(...args: any[]): void;
  // something went wrong, but not critical
  error(...args: any[]): void;
  // more critical than error
  fatal(...args: any[]): void;
}
