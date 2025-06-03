use crossterm::event::{Event, KeyCode};
use crossterm::{
    event,
    event::{DisableMouseCapture, EnableMouseCapture},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use ratatui::backend::CrosstermBackend;
use ratatui::style::{Modifier, Style};
use ratatui::text::{Line, Span};
use ratatui::widgets::{List, ListItem, ListState, Paragraph, Tabs};
use ratatui::{
    layout::{Constraint, Direction, Layout, Rect}, widgets::{Block, Borders},
    Frame,
    Terminal,
};
use std::collections::HashMap;
use std::io::stdout;
use std::io::Result;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use tokio::sync::mpsc::{unbounded_channel, UnboundedReceiver, UnboundedSender};
use tokio::time::{sleep, Duration};
use velnora_logger_core::{impl_logger_helpers, KeybindingManager, LogLevel, LogSink};

#[derive(Debug, Clone)]
struct Item {
    name: String,
    section: Option<String>,
}

#[derive(Debug, Clone)]
pub struct TuiLogger {
    state: Arc<Mutex<LoggerState>>,
    sender: UnboundedSender<LogMessage>,
    should_stop: Arc<AtomicBool>,
    keybindings: KeybindingManager,
}

#[derive(Debug, Clone)]
struct LoggerState {
    tabs: Vec<String>,
    items: HashMap<String, Vec<Item>>,
    logs: HashMap<(String, Option<String>), Vec<String>>,
    selected_tab: usize,
    selected_item: usize,
}

pub struct LogMessage {
    pub item: String,
    pub section: Option<String>,
    pub message: String,
}

impl TuiLogger {
    pub fn new() -> (Self, UnboundedReceiver<LogMessage>) {
        let state = Arc::new(Mutex::new(LoggerState {
            tabs: vec![],
            items: HashMap::new(),
            logs: HashMap::new(),
            selected_tab: 0,
            selected_item: 0,
        }));

        let (sender, receiver) = unbounded_channel();

        (
            Self {
                state,
                sender,
                should_stop: Arc::new(AtomicBool::new(false)),
                keybindings: KeybindingManager::new(),
            },
            receiver,
        )
    }

    pub fn add_tab(&mut self, tab: &str) -> &mut Self {
        {
            let mut state = self.state.lock().unwrap();
            if !state.tabs.contains(&tab.to_string()) {
                state.tabs.push(tab.to_string());
            }
        }
        self
    }

    pub fn add_item(&mut self, tab: &str, item: &str, section: Option<&str>) -> &mut Self {
        {
            let mut state = self.state.lock().unwrap();
            let entry = state.items.entry(tab.to_string()).or_default();
            entry.push(Item {
                name: item.to_string(),
                section: section.map(|s| s.to_string()),
            });
        }
        self
    }

    pub fn add_log(&mut self, item: &str, section: Option<&str>, message: &str) -> &mut Self {
        {
            let _ = self.sender.send(LogMessage {
                item: item.to_string(),
                section: section.map(|s| s.to_string()),
                message: message.to_string(),
            });
        }
        self
    }

    pub async fn start(&mut self, mut receiver: UnboundedReceiver<LogMessage>) -> Result<()> {
        enable_raw_mode()?;
        let mut stdout = stdout();
        execute!(stdout, EnterAlternateScreen, EnableMouseCapture)?;
        let backend = CrosstermBackend::new(stdout);
        let mut terminal = Terminal::new(backend)?;

        loop {
            if self.should_stop.load(Ordering::Relaxed) {
                break;
            }

            if event::poll(Duration::from_millis(0))? {
                if let Event::Key(key) = event::read()? {
                    self.handle_key_event(key.code);
                }
            }

            tokio::select! {
                Some(msg) = receiver.recv() => {
                    let mut state = self.state.lock().unwrap();
                    state.logs
                        .entry((msg.item, msg.section))
                        .or_default()
                        .push(msg.message);
                }

                _ = sleep(Duration::from_millis(100)) => {
                    terminal.draw(|f| {
                        let state = self.state.lock().unwrap();
                        self.render(f, &state);
                    })?;
                }
            }
        }

        disable_raw_mode()?;
        execute!(
            terminal.backend_mut(),
            LeaveAlternateScreen,
            DisableMouseCapture
        )?;
        terminal.show_cursor()?;

        Ok(())
    }

    pub fn stop(&mut self) {
        self.should_stop.store(true, Ordering::Relaxed);
    }

    fn handle_key_event(&mut self, key: KeyCode) {
        match key {
            KeyCode::Char('q') | KeyCode::Esc => {
                self.stop();
            }
            KeyCode::Left => self.prev_tab(),
            KeyCode::Right => self.next_tab(),
            KeyCode::Up => self.prev_item(),
            KeyCode::Down => self.next_item(),
            _ => {}
        }
    }

    fn render(&self, f: &mut Frame, state: &LoggerState) {
        let size = f.area();
        let direction = if size.width > 120 {
            Direction::Horizontal
        } else {
            Direction::Vertical
        };

        let chunks = Layout::default()
            .direction(direction)
            .constraints([Constraint::Percentage(33), Constraint::Percentage(67)])
            .split(size);

        self.render_info_pane(f, chunks[0], state);
        self.render_logger_pane(f, chunks[1], state);
    }

    fn render_info_pane(&self, f: &mut Frame, area: Rect, state: &LoggerState) {
        let vertical_chunks = Layout::default()
            .direction(Direction::Vertical)
            .constraints([
                Constraint::Length(3),
                Constraint::Length(3),
                Constraint::Min(0),
            ])
            .split(area);

        // Header
        let header = Paragraph::new(Line::from(vec![Span::styled(
            "Velnora",
            Style::default().add_modifier(Modifier::BOLD),
        )]));
        f.render_widget(header, vertical_chunks[0]);

        // Tabs
        let titles: Vec<Span> = ["Applications", "Libraries"]
            .iter()
            .map(|t| Span::styled(*t, Style::default()))
            .collect();

        let tabs = Tabs::new(titles)
            .select(state.selected_tab)
            .highlight_style(Style::default().add_modifier(Modifier::REVERSED));

        f.render_widget(tabs, vertical_chunks[1]);

        let current_tab_name = state
            .tabs
            .get(state.selected_tab)
            .cloned()
            .unwrap_or_else(|| "".to_string()); // Now a real String

        let empty_vec = vec![];
        let current_items = state.items.get(&current_tab_name).unwrap_or(&empty_vec);

        // List of items
        let list_items: Vec<ListItem> = current_items
            .iter()
            .map(|item| {
                let label = match &item.section {
                    Some(section) => format!("{} / {}", item.name, section),
                    None => item.name.clone(),
                };
                ListItem::new(label)
            })
            .collect();

        let list = List::new(list_items)
            .block(Block::default().title("Items").borders(Borders::ALL))
            .highlight_symbol(">> ")
            .highlight_style(Style::default().add_modifier(Modifier::REVERSED));

        let mut list_state = self.get_list_state(state);
        f.render_stateful_widget(list, vertical_chunks[2], &mut list_state);
    }

    fn get_list_state(&self, state: &LoggerState) -> ListState {
        let mut stateful = ListState::default();

        let tab_name = state
            .tabs
            .get(state.selected_tab)
            .map(String::as_str)
            .unwrap_or("");
        let empty_vec = vec![];
        let items = state.items.get(tab_name).unwrap_or(&empty_vec);

        if !items.is_empty() {
            stateful.select(Some(state.selected_item.min(items.len() - 1)));
        }

        stateful
    }

    fn next_item(&mut self) {
        let mut state = self.state.lock().unwrap();

        if let Some(tab) = state.tabs.get(state.selected_tab) {
            if let Some(items) = state.items.get(tab) {
                if !items.is_empty() {
                    state.selected_item = (state.selected_item + 1) % items.len();
                }
            }
        }
    }

    fn prev_item(&mut self) {
        let mut state = self.state.lock().unwrap();

        if let Some(tab) = state.tabs.get(state.selected_tab) {
            if let Some(items) = state.items.get(tab) {
                if !items.is_empty() {
                    if state.selected_item == 0 {
                        state.selected_item = items.len() - 1;
                    } else {
                        state.selected_item -= 1;
                    }
                }
            }
        }
    }

    fn next_tab(&mut self) {
        let mut state = self.state.lock().unwrap();
        if !state.tabs.is_empty() {
            state.selected_tab = (state.selected_tab + 1) % state.tabs.len();
            state.selected_item = 0;
        }
    }

    fn prev_tab(&mut self) {
        let mut state = self.state.lock().unwrap();
        if !state.tabs.is_empty() {
            if state.selected_tab == 0 {
                state.selected_tab = state.tabs.len() - 1;
            } else {
                state.selected_tab -= 1;
            }
            state.selected_item = 0;
        }
    }

    fn render_logger_pane(&self, f: &mut Frame, area: Rect, state: &LoggerState) {
        let current_tab_name = state
            .tabs
            .get(state.selected_tab)
            .cloned()
            .unwrap_or_else(|| "".to_string()); // Now a real String

        let empty_vec = vec![];
        let current_items = state.items.get(&current_tab_name).unwrap_or(&empty_vec);

        let item = current_items.get(state.selected_item);

        let key = item.map(|i| (i.name.clone(), i.section.clone()));
        let log_lines = key
            .clone()
            .and_then(|k| state.logs.get(&k))
            .cloned()
            .unwrap_or_default();

        let list_items: Vec<ListItem> = log_lines
            .iter()
            .map(|line| ListItem::new(line.clone()))
            .collect();

        let title = key
            .map(|(name, section)| match section {
                Some(s) => format!("{name} / {s}"),
                None => name,
            })
            .unwrap_or_else(|| "Logs".to_string());

        let list = List::new(list_items).block(Block::default().title(title).borders(Borders::ALL));

        f.render_widget(list, area);
    }
}

impl LogSink for TuiLogger {
    fn log(&mut self, module: &str, section: Option<&str>, _level: LogLevel, messages: Vec<&str>) {
        let msg = messages
            .into_iter()
            .map(|m| m.to_string())
            .collect::<Vec<String>>()
            .join("\n");

        self.add_log(module, section, &msg);
    }
}

impl_logger_helpers!(TuiLogger);
