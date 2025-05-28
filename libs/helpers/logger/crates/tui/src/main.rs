use std::io;
use std::thread::sleep;
use std::time::Duration;
use tui::TuiLogger;

#[tokio::main]
async fn main() -> io::Result<()> {
    let (mut tui, receiver) = TuiLogger::new();

    let mut cloned = tui.clone(); // Clone Arc parts
    let handle = tokio::spawn(async move {
        cloned.start(receiver).await.unwrap();
    });

    tui.add_tab("Applications")
        .add_item("Applications", "App A", None)
        .add_item("Applications", "App B", Some("Build"))
        .add_tab("Libraries")
        .add_item("Libraries", "Lib Alpha", None)
        .add_item("Libraries", "Lib Beta", None)
        .add_log("App A", None, "Started")
        .add_log("App B", Some("Build"), "Built successfully")
        .add_log("Lib Alpha", None, "Loaded");

    sleep(Duration::from_millis(500));
    tui.add_log("App B", Some("Build"), "Finished (1)");
    sleep(Duration::from_secs(2));
    tui.add_log("App B", Some("Build"), "Finished (2)");

    handle.await.unwrap();
    Ok(())
}
