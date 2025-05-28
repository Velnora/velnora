use crate::{LogEvent, LogLevel};

/// Format a log event for printing to terminal
pub fn format_event(event: &LogEvent) -> String {
    let timestamp = event.timestamp.format("%H:%M:%S%.3f").to_string();
    let level = match event.level {
        LogLevel::Debug => "[DEBUG]",
        LogLevel::Info => "[INFO] ",
        LogLevel::Warn => "[WARN] ",
        LogLevel::Error => "[ERROR]",
        LogLevel::Fatal => "[FATAL]",
    };

    format!(
        "{} {} {}: {}",
        timestamp, level, event.module, event.message
    )
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::event::log_event::LogEvent;
    use crate::event::log_level::LogLevel;
    use chrono::Local;

    #[test]
    fn format_event_output_contains_all_fields() {
        let now = Local::now();
        let event = LogEvent {
            timestamp: now,
            module: "vite".into(),
            level: LogLevel::Info,
            message: "started".into(),
        };

        let output = format_event(&event);

        assert!(output.contains("vite"));
        assert!(output.contains("started"));
        assert!(output.contains("[INFO]"));
    }
}
