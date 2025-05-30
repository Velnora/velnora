use crate::event::log_level::LogLevel;
use chrono::{DateTime, Local};

#[derive(Debug, Clone)]
pub struct LogEvent {
    pub timestamp: DateTime<Local>,
    pub module: Option<&'static str>,
    pub level: LogLevel,
    pub message: String,
}

impl LogEvent {
    pub fn new(level: LogLevel, module: Option<&'static str>, messages: Vec<&str>) -> Self {
        let message = messages.join(" ");

        Self {
            timestamp: Local::now(),
            module,
            level,
            message,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::event::log_level::LogLevel;

    #[test]
    fn creates_log_event_with_correct_fields() {
        let event = LogEvent::new(LogLevel::Info, Some("vite"), vec!["started"]);

        assert!(event.timestamp.timestamp() > 0);
        assert_eq!(event.level, LogLevel::Info);
        assert_eq!(event.module, Some("vite"));
        assert_eq!(event.message, vec!["started"].join(" "));
    }
}
