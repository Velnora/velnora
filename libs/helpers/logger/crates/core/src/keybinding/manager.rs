use crate::keybinding::callback::CloneFnMut;
use crate::keybinding::keybinding::{Keybinding, KeybindingScope};
use crossterm::event::KeyCode;
use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct KeybindingManager {
    bindings: HashMap<KeyCode, Vec<Keybinding>>,
}

impl KeybindingManager {
    pub fn new() -> Self {
        let bindings = HashMap::new();
        let instance = Self { bindings };
        instance
    }

    pub fn register(
        &mut self,
        key: KeyCode,
        label: impl Into<String>,
        description: impl Into<String>,
        scope: KeybindingScope,
        callback: Box<dyn CloneFnMut>,
    ) {
        let binding = Keybinding {
            key,
            label: label.into(),
            description: description.into(),
            scope,
            callback: Box::new(callback),
        };
        self.bindings.entry(key).or_default().push(binding);
    }

    pub fn handle(&mut self, key: KeyCode, context: &[KeybindingScope]) -> bool {
        if let Some(candidates) = self.bindings.get_mut(&key) {
            for scope in context {
                if let Some(binding) = candidates.iter_mut().find(|b| &b.scope == scope) {
                    (binding.callback)();
                    return true;
                }
            }
        }
        false
    }

    pub fn all(&self) -> Vec<&Keybinding> {
        self.bindings.values().flat_map(|b| b.iter()).collect()
    }
}
