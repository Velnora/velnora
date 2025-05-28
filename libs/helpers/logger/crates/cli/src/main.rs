use core::LogSink;
use cli::CliLogger;

fn main() {
    let mut logger = CliLogger::new();
    logger.debug("cli", &["Logger initialized"]);
    logger.info("cli", &["Starting CLI application"]);
    logger.warn("cli", &["This is a warning message"]);
    logger.error("cli", &["An error occurred"]);
    logger.fatal("cli", &["Fatal error, shutting down"]);
}