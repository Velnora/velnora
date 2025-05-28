#[derive(Debug, Clone, Copy, PartialEq)]
pub enum LogLevel {
    Debug,
    Info,
    Warn,
    Error,
    Fatal,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn loglevel_debug_formatting() {
        assert_eq!(format!("{:?}", LogLevel::Debug), "Debug");
    }

    #[test]
    fn loglevel_info_formatting() {
        assert_eq!(format!("{:?}", LogLevel::Info), "Info");
    }

    #[test]
    fn loglevel_warn_formatting() {
        assert_eq!(format!("{:?}", LogLevel::Warn), "Warn");
    }

    #[test]
    fn loglevel_error_formatting() {
        assert_eq!(format!("{:?}", LogLevel::Error), "Error");
    }

    #[test]
    fn loglevel_fatal_formatting() {
        assert_eq!(format!("{:?}", LogLevel::Fatal), "Fatal");
    }
}
