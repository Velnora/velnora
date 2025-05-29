use cli::CliLogger;

fn main() {
    let mut logger = CliLogger::new();
    logger.debug("cli", None, vec!["Logger initialized"]);
    logger.info("cli", None, vec!["Starting CLI application"]);
    logger.warn("cli", None, vec!["This is a warning message"]);
    logger.error("cli", None, vec!["An error occurred"]);
    logger.fatal("cli", None, vec!["Fatal error, shutting down"]);
}