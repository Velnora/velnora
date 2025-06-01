use velnora_logger_core::{LogEvent, LogLevel, LogSink, impl_logger_helpers};
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
    fn log(&mut self, _module: &str, _section: Option<&str>, _level: LogLevel, _messages: Vec<&str>) {
        // let event = LogEvent::new(level, Option::from(module), Option::from(section), messages);
        // self.logs.entry(module.to_string()).or_default().push(event);
    }
}

impl_logger_helpers!(GroupLogger);

#[cfg(test)]
mod tests {
    use super::*;
    use velnora_logger_core::{LogLevel};

    #[test]
    fn group_logger_stores_logs_correctly() {
        let mut logger = GroupLogger::new();
        logger.info("vite", None,vec!["started"]);

        let logs = logger.get_logs("vite").unwrap();
        assert_eq!(logs.len(), 1);
        assert_eq!(logs[0].message, "started");
        assert_eq!(logs[0].level, LogLevel::Info);
    }

    #[test]
    fn group_logger_separates_by_module() {
        let mut logger = GroupLogger::new();
        logger.info("vite", None, vec!["msg1"]);
        logger.info("auth", None, vec!["msg2"]);

        assert_eq!(logger.get_logs("vite").unwrap().len(), 1);
        assert_eq!(logger.get_logs("auth").unwrap().len(), 1);
    }

    #[test]
    fn group_logger_clear_works() {
        let mut logger = GroupLogger::new();
        logger.info("vite", None,vec!["msg"]);
        logger.clear();
        assert!(logger.get_logs("vite").is_none());
    }
}
