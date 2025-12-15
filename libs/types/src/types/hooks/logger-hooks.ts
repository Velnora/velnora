export interface LoggerHooks {
  "logger:trace"(msg: unknown): void;
  "logger:debug"(msg: unknown): void;
  "logger:log"(msg: unknown): void;
  "logger:warn"(msg: unknown): void;
  "logger:error"(msg: unknown): void;
  "logger:fatal"(msg: unknown): void;
}
