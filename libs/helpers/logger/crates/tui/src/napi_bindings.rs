use crate::TuiLogger as InnerTuiLogger;
use napi_derive::napi;
use once_cell::sync::OnceCell;

static LOGGER_INSTANCE: OnceCell<TuiLogger> = OnceCell::new();

#[derive(Debug, Clone)]
#[napi]
pub struct TuiLogger {
    inner: InnerTuiLogger
}

#[napi]
impl TuiLogger {
    #[napi(factory)]
    pub async fn instance() -> Result<Self, napi::Error> {
        if let Some(existing) = LOGGER_INSTANCE.get() {
            return Ok(existing.clone());
        }

        let (mut inner, receiver) = InnerTuiLogger::new();
        inner.start(receiver).await?;

        let logger = Self { inner };
        LOGGER_INSTANCE.set(logger.clone()).unwrap();
        Ok(logger)
    }

    #[napi]
    pub unsafe fn stop(&mut self) {
        self.inner.stop();
    }

    #[napi]
    pub unsafe fn add_tab(&mut self, tab: String) -> Result<Self, napi::Error> {
        self.inner.add_tab(&tab);
        Ok(self.clone())
    }

    #[napi]
    pub unsafe fn add_item(&mut self, tab: String, item: String, section: Option<&str>) -> Result<Self, napi::Error> {
        self.inner.add_item(&tab, &item, section.as_deref());
        Ok(self.clone())
    }

    #[napi]
    pub unsafe fn debug(&mut self, item: String, section: Option<&str>, messages: Vec<&str>) -> Result<Self, napi::Error> {
        self.inner.debug(&item, section.as_deref(), messages);
        Ok(self.clone())
    }

    #[napi]
    pub unsafe fn info(&mut self, item: String, section: Option<&str>, messages: Vec<&str>) -> Result<Self, napi::Error> {
        self.inner.info(&item, section.as_deref(), messages);
        Ok(self.clone())
    }

    #[napi]
    pub unsafe fn warn(&mut self, item: String, section: Option<&str>, messages: Vec<&str>) -> Result<Self, napi::Error> {
        self.inner.warn(&item, section.as_deref(), messages);
        Ok(self.clone())
    }

    #[napi]
    pub unsafe fn error(&mut self, item: String, section: Option<&str>, messages: Vec<&str>) -> Result<Self, napi::Error> {
        self.inner.error(&item, section.as_deref(), messages);
        Ok(self.clone())
    }

    #[napi]
    pub unsafe fn fatal(&mut self, item: String, section: Option<&str>, messages: Vec<&str>) -> Result<Self, napi::Error> {
        self.inner.fatal(&item, section.as_deref(), messages);
        Ok(self.clone())
    }
}
