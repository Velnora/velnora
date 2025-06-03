use std::thread::sleep;
use std::time::Duration;
use grouped::GroupLogger;

fn main() {
    let mut logger = GroupLogger::new();
    logger.info("vite", None, vec!["started"]);
    sleep(Duration::from_secs(1));
    logger.info("server", None, vec!["listening on port 3000"]);
    logger.info("vite", None, vec!["building"]);
    sleep(Duration::from_secs(1));
    logger.error("vite", None, vec!["failed to build"]);

}