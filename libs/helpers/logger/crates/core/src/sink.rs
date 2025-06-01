use crate::{LogLevel};

pub trait LogSink {
    fn log(&mut self, module: &str, section: Option<&str>, level: LogLevel, messages: Vec<&str>);
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::event::log_level::LogLevel;

    struct TestLogger {
        pub last: Option<(String, LogLevel, String)>,
    }

    impl TestLogger {
        fn new() -> Self {
            Self { last: None }
        }
    }

    impl LogSink for TestLogger {
        fn log(&mut self, module: &str, _section: Option<&str>, level: LogLevel, messages: Vec<&str>) {
            let joined = messages.iter().map(|m| m.to_string()).collect::<Vec<_>>().join(" ");
            self.last = Some((module.to_string(), level, joined));
        }
    }

    #[test]
    fn info_method_routes_to_log() {
        let mut logger = TestLogger::new();
        logger.log("vite", None, LogLevel::Info,vec!["started", "dev"]);

        let (module, level, msg) = logger.last.unwrap();
        assert_eq!(module, "vite");
        assert_eq!(level, LogLevel::Info);
        assert_eq!(msg, "started dev");
    }

    #[test]
    fn fatal_method_routes_to_log() {
        let mut logger = TestLogger::new();
        logger.log("vite", None,  LogLevel::Fatal, vec!["shutdown"]);

        let (_, level, msg) = logger.last.unwrap();
        assert_eq!(level, LogLevel::Fatal);
        assert_eq!(msg, "shutdown");
    }
}
