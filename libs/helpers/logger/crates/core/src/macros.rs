#[macro_export]
macro_rules! impl_logger_helpers {
    ($ty:ty) => {
        impl $ty {
            pub fn info(&mut self, module: &str, messages: &[impl ToString]) {
                self.log(module, LogLevel::Info, messages);
            }

            pub fn error(&mut self, module: &str, messages: &[impl ToString]) {
                self.log(module, LogLevel::Error, messages);
            }

            pub fn warn(&mut self, module: &str, messages: &[impl ToString]) {
                self.log(module, LogLevel::Warn, messages);
            }

            pub fn debug(&mut self, module: &str, messages: &[impl ToString]) {
                self.log(module, LogLevel::Debug, messages);
            }

            pub fn fatal(&mut self, module: &str, messages: &[impl ToString]) {
                self.log(module, LogLevel::Fatal, messages);
            }
        }
    };
}