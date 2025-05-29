#[macro_export]
macro_rules! impl_logger_helpers {
    ($ty:ty) => {
        impl $ty {
            pub fn info(&mut self, module: &str, section: Option<&str>, messages: &[impl ToString]) {
                self.log(module, LogLevel::Info, section, messages);
            }

            pub fn error(&mut self, module: &str, section: Option<&str>, messages: &[impl ToString]) {
                self.log(module, LogLevel::Error, section, messages);
            }

            pub fn warn(&mut self, module: &str, section: Option<&str>, messages: &[impl ToString]) {
                self.log(module, LogLevel::Warn, section, messages);
            }

            pub fn debug(&mut self, module: &str, section: Option<&str>, messages: &[impl ToString]) {
                self.log(module, LogLevel::Debug, section, messages);
            }

            pub fn fatal(&mut self, module: &str, section: Option<&str>, messages: &[impl ToString]) {
                self.log(module, LogLevel::Fatal, section, messages);
            }
        }
    };
}