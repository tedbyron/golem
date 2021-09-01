#![warn(clippy::all, clippy::pedantic, clippy::nursery)]

mod components;

fn main() {
    yew::start_app::<components::Golem>();
}
