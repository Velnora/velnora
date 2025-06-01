use crate::LogLevel;

pub trait LogSinkBase {
    fn log(&mut self, level: LogLevel, messages: Vec<&str>);
}