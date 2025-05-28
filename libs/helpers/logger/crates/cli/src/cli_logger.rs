use core::{format_event, LogEvent, LogLevel, LogSink};

pub struct CliLogger;

impl CliLogger {
    pub fn new() -> Self {
        Self
    }
}

impl LogSink for CliLogger {
    fn log(&mut self, module: &str, level: LogLevel, messages: &[impl ToString]) {
        let msg = messages
            .iter()
            .map(|m| m.to_string())
            .collect::<Vec<_>>()
            .join(" ");
        let event = LogEvent::new(module, level, msg);
        println!("{}", format_event(&event));
    }
}

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
        logger.info("vite", &["started", "on", "port", "5173"]);
        // We can't assert stdout without capturing — this confirms no panic
    }

    #[test]
    fn cli_logger_accepts_fatal_log() {
        let mut logger = CliLogger::new();
        logger.fatal("vite", &["shutdown", "due", "to", "crash"]);
    }

    #[test]
    fn cli_logger_accepts_multiword_log() {
        let mut logger = CliLogger::new();
        logger.log("vite", LogLevel::Debug, &["hmr", "triggered", "update"]);
    }
}
