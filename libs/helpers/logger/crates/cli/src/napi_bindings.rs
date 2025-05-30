use crate::CliLogger as InnerCliLogger;
use napi_derive::napi;
use crate::cli_logger::LoggerOptions;

#[derive(Debug, Clone)]
#[napi]
pub struct CliLogger {
    inner: InnerCliLogger
}

#[napi]
impl CliLogger {
    #[napi(constructor)]
    pub fn new(options: LoggerOptions) -> Self {
        Self { inner: InnerCliLogger::new(options) }
    }

    #[napi]
    pub unsafe fn debug(&mut self, messages: Vec<&str>) -> Result<Self, napi::Error> {
        self.inner.debug(messages);
        Ok(self.clone())
    }

    #[napi]
    pub unsafe fn info(&mut self, messages: Vec<&str>) -> Result<Self, napi::Error> {
        self.inner.info(messages);
        Ok(self.clone())
    }

    #[napi]
    pub unsafe fn warn(&mut self, messages: Vec<&str>) -> Result<Self, napi::Error> {
        self.inner.warn(messages);
        Ok(self.clone())
    }

    #[napi]
    pub unsafe fn error(&mut self, messages: Vec<&str>) -> Result<Self, napi::Error> {
        self.inner.error(messages);
        Ok(self.clone())
    }

    #[napi]
    pub unsafe fn fatal(&mut self, messages: Vec<&str>) -> Result<Self, napi::Error> {
        self.inner.fatal(messages);
        Ok(self.clone())
    }
}
