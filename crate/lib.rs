#![warn(
    clippy::all,
    clippy::cargo,
    clippy::nursery,
    clippy::pedantic,
    rust_2018_idioms
)]
// https://github.com/rust-lang/rust-clippy/issues/6902
// https://github.com/rust-lang/rust/issues/84122
#![allow(clippy::use_self)]
#![doc = include_str!("../README.md")]

pub mod automaton;
pub mod rules;
