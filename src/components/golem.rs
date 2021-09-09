use cellular_automaton::automaton_life_like::Automaton;
use yew::{html, Component, ComponentLink, Html, ShouldRender};

#[derive(Debug)]
pub struct Golem {
    automaton: Automaton,
}

impl Component for Golem {
    type Message = ();
    type Properties = ();

    fn create(_props: Self::Properties, _link: ComponentLink<Self>) -> Self {
        Self {
            automaton: Automaton::new(500, 500),
        }
    }

    fn update(&mut self, _msg: Self::Message) -> ShouldRender {
        unimplemented!()
    }

    fn change(&mut self, _props: Self::Properties) -> ShouldRender {
        false
    }

    fn view(&self) -> Html {
        html! {
            <main>
                <img class="logo" src="https://yew.rs/img/logo.png" alt="Yew logo" />
                <h1>{ "Hello World!" }</h1>
                <span class="subtitle">{ "from Yew with " }<i class="heart" /></span>
            </main>
        }
    }
}