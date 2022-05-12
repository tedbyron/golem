use wasm_bindgen::prelude::wasm_bindgen;

use crate::rule;

#[wasm_bindgen]
#[derive(Clone, Debug, PartialEq, PartialOrd)]
pub struct Bsc {
    #[wasm_bindgen(getter_with_clone)]
    pub birth: rule::Birth,
    #[wasm_bindgen(getter_with_clone)]
    pub survival: rule::Survival,
    pub generation: rule::Generation,
}

#[wasm_bindgen]
impl Bsc {
    #[wasm_bindgen(constructor)]
    #[must_use]
    pub fn new(b: &[u8], s: &[u8], c: u8) -> Self {
        #[cfg(debug_assertions)]
        console_error_panic_hook::set_once();

        Self {
            birth: b.to_vec(),
            survival: s.to_vec(),
            generation: c - 1,
        }
    }
}

impl Default for Bsc {
    /// Rules from Conway's Game of Life.
    fn default() -> Self {
        Self {
            birth: vec![3],
            survival: vec![2, 3],
            generation: 1,
        }
    }
}
