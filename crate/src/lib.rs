#![warn(clippy::all, clippy::pedantic, clippy::nursery)]

//! A cellular automaton simulator written in Rust and compiled to
// `WebAssembly`.

mod automaton;
pub use automaton::Automaton;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
