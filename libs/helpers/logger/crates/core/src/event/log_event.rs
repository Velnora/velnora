use chrono::{DateTime, Local};
use crate::event::log_level::LogLevel;

#[derive(Debug, Clone)]
pub struct LogEvent {
    pub timestamp: DateTime<Local>,
    pub module: String,
    pub level: LogLevel,
    pub message: String,
}

impl LogEvent {
    pub fn new(module: impl Into<String>, level: LogLevel, message: impl Into<String>) -> Self {
        Self {
            timestamp: Local::now(),
            module: module.into(),
            level,
            message: message.into(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::event::log_level::LogLevel;

    #[test]
    fn creates_log_event_with_correct_fields() {
        let event = LogEvent::new("vite", LogLevel::Info, "started");

        assert_eq!(event.module, "vite");
        assert_eq!(event.level, LogLevel::Info);
        assert_eq!(event.message, "started");
    }
}
