#![warn(clippy::all, clippy::pedantic, clippy::nursery)]

//! A cellular automaton simulation library with support for `WebAssembly`.

pub mod automaton_life_like;
pub mod rule;
pub mod ruleset;
