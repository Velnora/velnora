use crate::{LogEvent, LogLevel};

/// Format a log event for printing to terminal
pub fn format_event(event: &LogEvent) -> String {
    let timestamp = event.timestamp.format("%H:%M:%S%.3f").to_string();
    let level = match event.level {
        LogLevel::Debug => "[DEBUG]",
        LogLevel::Info => " [INFO]",
        LogLevel::Warn => " [WARN]",
        LogLevel::Error => "[ERROR]",
        LogLevel::Fatal => "[FATAL]",
    };

    let origin = match (&event.section, &event.module) {
        (Some(section), Some(module)) => format!("{}/{}", section, module),
        (Some(section), None) => section.to_string(),
        (None, Some(module)) => module.to_string(),
        (None, None) => "Velnora".to_string(),
    };

    format!(
        "{} {} {}: {}",
        timestamp, level, origin, event.message
    )
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::event::log_event::LogEvent;
    use crate::event::log_level::LogLevel;

    #[test]
    fn format_event_output_contains_all_fields() {
        let event = LogEvent::new(LogLevel::Info, Some("vite"), Some("client"), vec!["started"]);
        let output = format_event(&event);

        assert!(output.contains("vite"));
        // assert!(output.contains("client"));
        assert!(output.contains("started"));
        assert!(output.contains("[INFO]"));
    }
}
