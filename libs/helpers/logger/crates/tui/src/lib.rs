mod tui_logger;

#[cfg(feature = "napi")]
mod napi_bindings;

pub use tui_logger::TuiLogger;
