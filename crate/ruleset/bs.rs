use wasm_bindgen::prelude::wasm_bindgen;

use crate::rule;

#[wasm_bindgen]
#[derive(Clone, Debug, PartialEq, PartialOrd)]
pub struct Bs {
    #[wasm_bindgen(getter_with_clone)]
    pub birth: rule::Birth,
    #[wasm_bindgen(getter_with_clone)]
    pub survival: rule::Survival,
}

#[wasm_bindgen]
impl Bs {
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

impl Default for Bs {
    /// Rules from Conway's Game of Life.
    fn default() -> Self {
        Self {
            birth: vec![3],
            survival: vec![2, 3],
        }
    }
}
