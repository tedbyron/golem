#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::wasm_bindgen;

use crate::rule;

cfg_if::cfg_if! {
    if #[cfg(target_arch = "wasm32")] {
        /// A ruleset containing birth and survival (B/S) rules.
        #[wasm_bindgen]
        #[derive(Clone, Debug, PartialEq, PartialOrd)]
        pub struct BS {
            #[wasm_bindgen(getter_with_clone)]
            pub birth: rule::Birth,
            #[wasm_bindgen(getter_with_clone)]
            pub survival: rule::Survival,
        }
    } else {
        /// A ruleset containing birth and survival (B/S) rules.
        #[derive(Clone, Debug, PartialEq, PartialOrd)]
        pub struct BS {
            pub birth: rule::Birth,
            pub survival: rule::Survival,
        }
    }
}

#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
impl BS {
    /// Constructs a new ruleset containing birth, survival, and generation rules.
    ///
    /// # Examples
    ///
    /// ```
    /// todo!()
    /// ```
    #[cfg_attr(target_arch = "wasm32", wasm_bindgen(constructor))]
    #[must_use]
    pub fn new(b: &[u8], s: &[u8]) -> Self {
        #[cfg(all(debug_assertions, target_arch = "wasm32"))]
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
