use std::collections::HashMap;
use ratatui::style::{Modifier, Style};
use ratatui::text::{Line, Span};
use ratatui::widgets::{List, ListItem, ListState, Paragraph, Tabs};
use ratatui::{
    backend::Backend,
    layout::{Constraint, Direction, Layout, Rect},
    widgets::{Block, Borders},
    Frame, Terminal,
};

#[derive(Clone)]
struct Item {
    name: String,
    section: Option<String>,
}

pub struct TuiLogger {
    selected_tab: usize,
    selected_item: usize,
    tabs: Vec<String>,
    items: HashMap<String, Vec<Item>>,
    logs: HashMap<(String, Option<String>), Vec<String>>,
}

impl TuiLogger {
    pub fn new() -> Self {
        Self {
            selected_tab: 0,
            selected_item: 0,
            tabs: Vec::new(),
            items: HashMap::new(),
            logs: HashMap::new(),
        }
    }

    pub fn add_tab(mut self, tab: &str) -> Self {
        if !self.tabs.contains(&tab.to_string()) {
            self.tabs.push(tab.to_string());
        }
        self
    }

    pub fn add_item(mut self, tab: &str, item: &str, section: Option<&str>) -> Self {
        let entry = self.items.entry(tab.to_string()).or_default();
        entry.push(Item {
            name: item.to_string(),
            section: section.map(|s| s.to_string()),
        });
        self
    }

    pub fn add_log(&mut self, item: &str, section: Option<&str>, message: &str) {
        let key = (item.to_string(), section.map(|s| s.to_string()));
        self.logs.entry(key).or_default().push(message.to_string());
    }

    pub fn start<B: Backend>(&mut self, terminal: &mut Terminal<B>) -> std::io::Result<()> {
        terminal.draw(|f| self.render(f))?;
        Ok(())
    }

    pub fn render(&self, f: &mut Frame) {
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

        self.render_info_pane(f, chunks[0]);
        self.render_logger_pane(f, chunks[1]);
    }

    fn render_info_pane(&self, f: &mut Frame, area: Rect) {
        let vertical_chunks = Layout::default()
            .direction(Direction::Vertical)
            .constraints([
                Constraint::Length(3),
                Constraint::Length(3),
                Constraint::Min(0),
            ])
            .split(area);

        // Header
        let header = Paragraph::new(Line::from(vec![
            Span::styled("Velnora", Style::default().add_modifier(Modifier::BOLD)),
        ]));
        f.render_widget(header, vertical_chunks[0]);

        // Tabs
        let titles: Vec<Span> = ["Applications", "Libraries"]
            .iter()
            .map(|t| Span::styled(*t, Style::default()))
            .collect();

        let tabs = Tabs::new(titles)
            .select(self.selected_tab)
            .highlight_style(Style::default().add_modifier(Modifier::REVERSED));

        f.render_widget(tabs, vertical_chunks[1]);

        let current_tab_name = self.tabs.get(self.selected_tab)
            .cloned()
            .unwrap_or_else(|| "".to_string()); // Now a real String

        let empty_vec = vec![];
        let current_items = self.items
            .get(&current_tab_name)
            .unwrap_or(&empty_vec);

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

        f.render_stateful_widget(list, vertical_chunks[2], &mut self.get_list_state(current_items.len()));    }

    fn get_list_state(&self, len: usize) -> ListState {
        let mut state = ListState::default();
        if len > 0 {
            state.select(Some(self.selected_item.min(len - 1)));
        }
        state
    }

    pub fn next_item(&mut self) {
        if let Some(tab) = self.tabs.get(self.selected_tab) {
            if let Some(items) = self.items.get(tab) {
                if !items.is_empty() {
                    self.selected_item = (self.selected_item + 1) % items.len();
                }
            }
        }
    }


    pub fn prev_item(&mut self) {
        if let Some(tab) = self.tabs.get(self.selected_tab) {
            if let Some(items) = self.items.get(tab) {
                if !items.is_empty() {
                    if self.selected_item == 0 {
                        self.selected_item = items.len() - 1;
                    } else {
                        self.selected_item -= 1;
                    }
                }
            }
        }
    }

    pub fn next_tab(&mut self) {
        self.selected_tab = (self.selected_tab + 1) % 2;
    }

    pub fn prev_tab(&mut self) {
        if self.selected_tab == 0 {
            self.selected_tab = 1;
        } else {
            self.selected_tab -= 1;
        }
    }

    fn render_logger_pane(&self, f: &mut Frame, area: Rect) {
        let current_tab_name = self.tabs.get(self.selected_tab)
            .cloned()
            .unwrap_or_else(|| "".to_string()); // Now a real String

        let empty_vec = vec![];
        let current_items = self.items
            .get(&current_tab_name)
            .unwrap_or(&empty_vec);

        let item = current_items.get(self.selected_item);

        let key = item.map(|i| (i.name.clone(), i.section.clone()));
        let log_lines = key.clone()
            .and_then(|k| self.logs.get(&k))
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

        let list = List::new(list_items)
            .block(Block::default().title(title).borders(Borders::ALL));

        f.render_widget(list, area);
    }

}
