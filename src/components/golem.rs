use cellular_automaton::automaton_life_like::Automaton;
use yew::{html, Component, ComponentLink, Html, ShouldRender};

#[derive(Debug)]
pub struct Golem {
    automaton: Automaton,
    link: ComponentLink<Self>,
}

impl Component for Golem {
    type Message = ();
    type Properties = ();

    fn create(_: Self::Properties, link: ComponentLink<Self>) -> Self {
        Self {
            automaton: Automaton::new(500, 500),
            link,
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
            <main role="main">
                <section>
                    <div class="golem-heading-wrapper">
                        <h1 class="golem-heading">{ "Golem" }</h1>
                    </div>
                    <div className="golem-control">
                        <GolemStats />
                        <GolemOptions />
                    </div>
                </section>
            </main>
        }
    }
}
