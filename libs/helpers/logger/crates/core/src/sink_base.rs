use crate::LogLevel;

pub trait LogSinkBase {
    fn log(&mut self, level: LogLevel, messages: Vec<&str>);

    fn debug(&mut self, messages: Vec<&str>) {
        self.log(LogLevel::Debug, messages);
    }

    fn info(&mut self, messages: Vec<&str>) {
        self.log(LogLevel::Info, messages);
    }

    fn warn(&mut self, messages: Vec<&str>) {
        self.log(LogLevel::Warn, messages);
    }

    fn error(&mut self, messages: Vec<&str>) {
        self.log(LogLevel::Error, messages);
    }

    fn fatal(&mut self, messages: Vec<&str>) {
        self.log(LogLevel::Fatal, messages);
    }
}