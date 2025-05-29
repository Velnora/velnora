use core::{format_event, LogEvent, LogLevel, LogSink, impl_logger_helpers};

pub struct CliLogger;

impl CliLogger {
    pub fn new() -> Self {
        Self
    }
}

impl LogSink for CliLogger {
    fn log(
        &mut self,
        module: &str,
        level: LogLevel,
        _section: Option<&str>,
        messages: Vec<&str>,
    ) {
        let msg = messages
            .iter()
            .map(|m| m.to_string())
            .collect::<Vec<_>>()
            .join(" ");
        let event = LogEvent::new(module, level, msg);
        println!("{}", format_event(&event));
    }
}

impl_logger_helpers!(CliLogger);

#[cfg(test)]
mod tests {
    use super::*;
    use core::LogLevel;
    use core::LogSink;

    #[test]
    fn cli_logger_can_be_created() {
        let _logger = CliLogger::new();
    }

    #[test]
    fn cli_logger_accepts_info_log() {
        let mut logger = CliLogger::new();
        logger.info("vite", None, vec!["started", "on", "port", "5173"]);
        // We can't assert stdout without capturing — this confirms no panic
    }

    #[test]
    fn cli_logger_accepts_fatal_log() {
        let mut logger = CliLogger::new();
        logger.fatal("vite", None, vec!["shutdown", "due", "to", "crash"]);
    }

    #[test]
    fn cli_logger_accepts_multiword_log() {
        let mut logger = CliLogger::new();
        logger.log("vite", LogLevel::Debug, None, vec!["hmr", "triggered", "update"]);
    }
}
