use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(inspectable)]
#[derive(Debug, Clone)]
pub struct Rules {
    /// A list containing values that represent the number of state-1 neighbors that
    /// must exist for a state-1 cell to remain state-1.
    #[wasm_bindgen(getter_with_clone)]
    pub survival: Vec<u8>,

    /// A list containing values that represent the number of state-1 neighbors that
    /// must exist for a state-0 cell to be become state-1.
    #[wasm_bindgen(getter_with_clone)]
    pub birth: Vec<u8>,

    /// The number of possible cell states.
    pub generation: u8,
}

impl Default for Rules {
    /// Rules from Conway's Game of Life.
    fn default() -> Self {
        Self {
            survival: vec![2, 3],
            birth: vec![3],
            generation: 2,
        }
    }
}

#[wasm_bindgen]
impl Rules {
    #[wasm_bindgen(constructor)]
    #[must_use]
    pub fn new(s: &[u8], b: &[u8], c: u8) -> Self {
        console_error_panic_hook::set_once();

        Self {
            birth: b.to_vec(),
            survival: s.to_vec(),
            generation: c,
        }
    }

    #[allow(clippy::inherent_to_string)] // wasm_bindgen doesn't support trait impls
    #[wasm_bindgen(js_name = toString)]
    #[must_use]
    pub fn to_string(&self) -> String {
        format!(
            "{}/{}/{}",
            self.survival
                .iter()
                .map(|&n| (b'0' + n) as char)
                .collect::<String>(),
            self.birth
                .iter()
                .map(|&n| (b'0' + n) as char)
                .collect::<String>(),
            self.generation
        )
    }
}
