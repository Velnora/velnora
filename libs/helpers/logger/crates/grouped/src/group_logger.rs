use velnora_logger_core::{LogEvent, LogLevel, LogSink};
use std::collections::HashMap;

pub struct GroupLogger {
    logs: HashMap<String, Vec<LogEvent>>,
}

impl GroupLogger {
    pub fn new() -> Self {
        Self {
            logs: HashMap::new(),
        }
    }

    pub fn get_logs(&self, module: &str) -> Option<&[LogEvent]> {
        self.logs.get(module).map(|v| v.as_slice())
    }

    pub fn all_modules(&self) -> Vec<&str> {
        self.logs.keys().map(String::as_str).collect()
    }

    pub fn all_logs(&self) -> &HashMap<String, Vec<LogEvent>> {
        &self.logs
    }

    pub fn clear(&mut self) {
        self.logs.clear();
    }
}

impl LogSink for GroupLogger {
    fn log(&mut self, module: &str, level: LogLevel, messages: &[impl ToString]) {
        let msg = messages
            .iter()
            .map(|m| m.to_string())
            .collect::<Vec<_>>()
            .join(" ");
        let event = LogEvent::new(module, level, msg);
        self.logs.entry(module.to_string()).or_default().push(event);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use core::{LogLevel, LogSink};

    #[test]
    fn group_logger_stores_logs_correctly() {
        let mut logger = GroupLogger::new();
        logger.info("vite", &["started"]);

        let logs = logger.get_logs("vite").unwrap();
        assert_eq!(logs.len(), 1);
        assert_eq!(logs[0].message, "started");
        assert_eq!(logs[0].level, LogLevel::Info);
    }

    #[test]
    fn group_logger_separates_by_module() {
        let mut logger = GroupLogger::new();
        logger.info("vite", &["msg1"]);
        logger.info("auth", &["msg2"]);

        assert_eq!(logger.get_logs("vite").unwrap().len(), 1);
        assert_eq!(logger.get_logs("auth").unwrap().len(), 1);
    }

    #[test]
    fn group_logger_clear_works() {
        let mut logger = GroupLogger::new();
        logger.info("vite", &["msg"]);
        logger.clear();
        assert!(logger.get_logs("vite").is_none());
    }
}
