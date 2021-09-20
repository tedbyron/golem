//! Rules for cellular automata.

/// A list containing values that represent the number of state-1 neighbors that
/// must exist for a state-0 cell to be become state-1.
pub type Birth = Vec<u8>;

/// The number of possible cell states.
pub type Generation = u8;

/// A list containing values that represent the number of state-1 neighbors that
/// must exist for a state-1 cell to remain state-1.
pub type Survival = Vec<u8>;
