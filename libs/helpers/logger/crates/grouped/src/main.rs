use std::thread::sleep;
use std::time::Duration;
use velnora_logger_core::LogSink;
use grouped::GroupLogger;

fn main() {
    let mut logger = GroupLogger::new();
    logger.info("vite", &["started"]);
    sleep(Duration::from_secs(1));
    logger.info("server", &["listening on port 3000"]);
    logger.info("vite", &["building"]);
    sleep(Duration::from_secs(1));
    logger.error("vite", &["failed to build"]);

}