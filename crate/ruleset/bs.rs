use wasm_bindgen::prelude::wasm_bindgen;

use crate::rule;

/// A ruleset containing birth and survival (B/S) rules.
#[wasm_bindgen]
#[derive(Clone, Debug, PartialEq, PartialOrd)]
pub struct BS {
    #[wasm_bindgen(getter_with_clone)]
    pub birth: rule::Birth,
    #[wasm_bindgen(getter_with_clone)]
    pub survival: rule::Survival,
}

#[wasm_bindgen]
impl BS {
    /// Constructs a new ruleset containing birth, survival, and generation rules.
    ///
    /// # Examples
    ///
    /// ```
    /// todo!()
    /// ```
    #[wasm_bindgen(constructor)]
    #[must_use]
    pub fn new(b: &[u8], s: &[u8]) -> Self {
        #[cfg(debug_assertions)]
        console_error_panic_hook::set_once();

        Self {
            birth: b.to_vec(),
            survival: s.to_vec(),
        }
    }
}

impl Default for BS {
    /// Rules from Conway's Game of Life.
    fn default() -> Self {
        Self {
            birth: vec![3],
            survival: vec![2, 3],
        }
    }
}
