use wasm_bindgen::prelude::wasm_bindgen;

/// A list containing values that represent the number of state-1 neighbors that
/// must exist for a state-1 cell to remain state-1.
pub type Survival = Vec<u8>;

/// A list containing values that represent the number of state-1 neighbors that
/// must exist for a state-0 cell to be become state-1.
pub type Birth = Vec<u8>;

/// The number of possible cell states.
pub type Generation = u8;

#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct Rules {
    #[wasm_bindgen(getter_with_clone)]
    pub survival: Survival,
    #[wasm_bindgen(getter_with_clone)]
    pub birth: Birth,
    pub generation: Generation,
}

#[wasm_bindgen]
impl Rules {
    #[wasm_bindgen(constructor)]
    #[must_use]
    pub fn new(s: &[u8], b: &[u8], c: u8) -> Self {
        #[cfg(debug_assertions)]
        console_error_panic_hook::set_once();

        Self {
            birth: b.to_vec(),
            survival: s.to_vec(),
            generation: c - 1,
        }
    }
}

impl Default for Rules {
    /// Rules from Conway's Game of Life.
    fn default() -> Self {
        Self {
            survival: vec![2, 3],
            birth: vec![3],
            generation: 1,
        }
    }
}
