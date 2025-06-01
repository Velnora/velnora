use crate::event::log_level::LogLevel;
use chrono::{DateTime, Local};

#[derive(Debug, Clone)]
pub struct LogEvent {
    pub timestamp: DateTime<Local>,
    pub module: Option<&'static str>,
    pub section: Option<&'static str>,
    pub level: LogLevel,
    pub message: String,
}

impl LogEvent {
    pub fn new(level: LogLevel, module: Option<&'static str>, section: Option<&'static str>, messages: Vec<&str>) -> Self {
        let message = messages
            .into_iter()
            .map(|msg| msg.to_string())
            .collect::<Vec<String>>()
            .join(" ");

        Self {
            timestamp: Local::now(),
            module,
            section,
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
        let event = LogEvent::new(LogLevel::Info, Some("vite"), Some("client"), vec!["started"]);

        assert!(event.timestamp.timestamp() > 0);
        assert_eq!(event.level, LogLevel::Info);
        assert_eq!(event.module, Some("vite"));
        assert_eq!(event.section, Some("client"));
        assert_eq!(event.message, vec!["started"].join(" "));
    }
}
