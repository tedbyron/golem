/// A ruleset consisting of survival, birth, and generation rules.
#[derive(Clone)]
pub struct Rules {
    pub survival: Vec<u8>,
    pub birth: Vec<u8>,
    pub generation: u8,
}

// impl Rules {
//     /// Constructs a new ruleset for an automaton.
//     ///
//     /// - `s`: survival rule
//     /// - `b`: birth rule
//     /// - `c`: maximum number of possible cell states
//     pub fn new(s: &[u8], b: &[u8], c: u8) -> Self {
//         Self {
//             survival: s.to_vec(),
//             birth: b.to_vec(),
//             generation: c - 1, // E.g. if `c` is 2, cells in the automaton have
//                                // 2 possible states (0..=c - 1), the maximum of
//                                // which is 1.
//         }
//     }
// }

impl Default for Rules {
    /// Returns a ruleset using rules from Conway's Game of Life.
    fn default() -> Self {
        Self {
            survival: vec![2, 3],
            birth: vec![3],
            generation: 1,
        }
    }
}
