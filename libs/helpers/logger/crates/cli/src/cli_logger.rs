use napi_derive::napi;
use velnora_logger_core::{format_event, impl_simple_logger_helpers, LogEvent, LogLevel, LogSinkBase};

#[napi(object)]
#[derive(Debug, Clone)]
pub struct LoggerOptions {
    pub name: String,
}

#[derive(Debug, Clone)]
pub struct CliLogger {
    options: LoggerOptions,
}

impl CliLogger {
    pub fn new(options: LoggerOptions) -> Self {
        Self { options }
    }
}

impl LogSinkBase for CliLogger {
    fn log(&mut self, level: LogLevel, messages: Vec<&str>) {
        let event = LogEvent::new(level, None, messages);
        println!("{}", format_event(&event));
    }
}

impl_simple_logger_helpers!(CliLogger);

#[cfg(test)]
mod tests {
    use super::*;
    use velnora_logger_core::LogLevel;

    #[test]
    fn cli_logger_can_be_created() {
        let _logger = CliLogger::new(LoggerOptions {
            name: "test_logger".to_string(),
        });
    }

    #[test]
    fn cli_logger_accepts_info_log() {
        let mut logger = CliLogger::new(LoggerOptions {
            name: "test_logger".to_string(),
        });
        logger.info(vec!["started", "on", "port", "5173"]);
        // We can't assert stdout without capturing — this confirms no panic
    }

    #[test]
    fn cli_logger_accepts_fatal_log() {
        let mut logger = CliLogger::new(LoggerOptions {
            name: "test_logger".to_string(),
        });
        logger.fatal(vec!["shutdown", "due", "to", "crash"]);
    }

    #[test]
    fn cli_logger_accepts_multiword_log() {
        let mut logger = CliLogger::new(LoggerOptions {
            name: "test_logger".to_string(),
        });
        logger.log(
            LogLevel::Debug,
            vec!["hmr", "triggered", "update"],
        );
    }
}
