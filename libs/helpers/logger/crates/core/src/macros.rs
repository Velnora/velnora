#[macro_export]
macro_rules! impl_logger_helpers {
    ($ty:ty) => {
        impl $ty {
            pub fn debug(&mut self, module: &str, section: Option<&str>, messages: Vec<&str>) {
                self.log(module, section, LogLevel::Debug, messages);
            }

            pub fn info(&mut self, module: &str, section: Option<&str>, messages: Vec<&str>) {
                self.log(module, section, LogLevel::Info, messages);
            }

            pub fn warn(&mut self, module: &str, section: Option<&str>, messages: Vec<&str>) {
                self.log(module, section, LogLevel::Warn, messages);
            }

            pub fn error(&mut self, module: &str, section: Option<&str>, messages: Vec<&str>) {
                self.log(module, section, LogLevel::Error, messages);
            }

            pub fn fatal(&mut self, module: &str, section: Option<&str>, messages: Vec<&str>) {
                self.log(module, section, LogLevel::Fatal, messages);
            }
        }
    };
}

#[macro_export]
macro_rules! impl_simple_logger_helpers {
    ($ty:ty) => {
        impl $ty {
            pub fn debug(&mut self, messages: Vec<&str>) {
                self.log(LogLevel::Debug, messages);
            }

            pub fn info(&mut self, messages: Vec<&str>) {
                self.log(LogLevel::Info, messages);
            }

            pub fn warn(&mut self, messages: Vec<&str>) {
                self.log(LogLevel::Warn, messages);
            }

            pub fn error(&mut self, messages: Vec<&str>) {
                self.log(LogLevel::Error, messages);
            }

            pub fn fatal(&mut self, messages: Vec<&str>) {
                self.log(LogLevel::Fatal, messages);
            }
        }
    };
}
