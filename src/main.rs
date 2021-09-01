#![warn(clippy::all, clippy::pedantic, clippy::nursery)]

mod components;

fn main() {
    wasm_logger::init(wasm_logger::Config::default());
    log::trace!("Initializing yew...");
    yew::start_app::<components::Golem>();
}
