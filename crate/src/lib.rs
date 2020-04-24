#![warn(clippy::all, clippy::pedantic)]
#![allow(clippy::doc_markdown)]

//! Cellular automaton simulation tools targeting
//! [WebAssembly](https://webassembly.org).

mod automaton;
pub use automaton::Automaton;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
