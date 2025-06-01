use std::fmt;
use crossterm::event::KeyCode;
use crate::keybinding::callback::CloneFnMut;

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum KeybindingScope {
    Global,
    Module(String),
    Section(String),
    Custom(String),
}

pub struct Keybinding {
    pub key: KeyCode,
    pub label: String,
    pub description: String,
    pub scope: KeybindingScope,
    pub callback: Box<dyn CloneFnMut>,
}

impl fmt::Debug for Keybinding {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("Keybinding")
            .field("key", &self.key)
            .field("label", &self.label)
            .field("description", &self.description)
            .field("scope", &self.scope)
            .finish()
    }
}

impl Clone for Keybinding {
    fn clone(&self) -> Self {
        Keybinding {
            key: self.key,
            label: self.label.clone(),
            description: self.description.clone(),
            scope: self.scope.clone(),
            callback: self.callback.clone(),
        }
    }
}