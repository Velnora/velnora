use std::io;
use std::thread::sleep;
use std::time::Duration;
use crossterm::{
    event::{self, DisableMouseCapture, EnableMouseCapture, Event, KeyCode},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};

use ratatui::backend::CrosstermBackend;
use ratatui::Terminal;

use tui::TuiLogger;

fn main() -> io::Result<()> {
    enable_raw_mode()?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen, EnableMouseCapture)?;

    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;

    let mut tui = TuiLogger::new()
        .add_tab("Applications")
        .add_item("Applications", "App A", None)
        .add_item("Applications", "App B", Some("Build"))
        .add_tab("Libraries")
        .add_item("Libraries", "Lib Alpha", None)
        .add_item("Libraries", "Lib Beta", None);

    tui.add_log("App A", None, "Started");
    tui.add_log("App B", Some("Build"), "Built successfully");
    tui.add_log("Lib Alpha", None, "Loaded");

    loop {
        terminal.draw(|f| {
            tui.render(f);
        })?;

        if event::poll(std::time::Duration::from_millis(250))? {
            if let Event::Key(key) = event::read()? {
                match key.code {
                    KeyCode::Char('q') => break,
                    KeyCode::Left => {
                        tui.prev_tab();
                    }
                    KeyCode::Right => {
                        tui.next_tab();
                    }
                    KeyCode::Down => tui.next_item(),
                    KeyCode::Up => tui.prev_item(),
                    _ => {}
                }
            }
        }
    }
    
    sleep(Duration::from_millis(500));
    tui.add_log("App B", None, "Finished (1)");
    sleep(Duration::from_secs(2));
    tui.add_log("App B", None, "Finished (2)");

    disable_raw_mode()?;
    execute!(
        terminal.backend_mut(),
        LeaveAlternateScreen,
        DisableMouseCapture
    )?;
    terminal.show_cursor()?;

    Ok(())
}
