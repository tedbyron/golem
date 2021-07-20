use std::iter;
use wasm_bindgen_test::wasm_bindgen_test;

use golem::Automaton;

/// flatten a slice of tuples that contain (x, y) locations of cells
#[cfg(test)]
fn flatten_locations(locations: &[(usize, usize)]) -> Vec<usize> {
    locations
        .iter()
        .flat_map(|&(x, y)| iter::once(x).chain(iter::once(y)))
        .collect()
}

/// build an automaton with width, height, and locations of live cells
#[cfg(test)]
fn build_automaton(width: usize, height: usize, locations: &[(usize, usize)]) -> Automaton {
    let mut a = Automaton::new(width, height);
    a.set_cells_on(&flatten_locations(locations));
    a
}

#[cfg(test)]
mod tests {
    use super::*;

    #[wasm_bindgen_test]
    pub fn automaton_new() {
        let a = Automaton::new(64, 64);
        assert_eq!(a.to_vec(), vec![0; 64 * 64]);
    }

    #[wasm_bindgen_test]
    pub fn automaton_set_cells_on() {
        let mut a = Automaton::new(3, 3);
        a.set_cells_on(&flatten_locations(&[
            (0, 0),
            (0, 1),
            (0, 2),
            (1, 0),
            (1, 1),
            (1, 2),
            (2, 0),
            (2, 1),
            (2, 2),
        ]));
        assert_eq!(a.to_vec(), vec![1, 1, 1, 1, 1, 1, 1, 1, 1]);
    }

    #[wasm_bindgen_test]
    pub fn automaton_new_rect() {
        let mut a = Automaton::new(2, 3);
        a.set_cells_on(&flatten_locations(&[(1, 1)]));
        assert_eq!(a.to_vec(), vec![0, 0, 0, 0, 1, 0]);
    }

    #[wasm_bindgen_test]
    pub fn automaton_set_all_cells() {
        let mut a = Automaton::new(3, 3);
        a.set_all_cells(1);
        assert_eq!(a.to_vec(), vec![1, 1, 1, 1, 1, 1, 1, 1, 1]);
        a.set_all_cells(0);
        assert_eq!(a.to_vec(), vec![0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }

    #[wasm_bindgen_test]
    pub fn automaton_resize_width_larger() {
        let mut a = Automaton::new(3, 3);
        a.set_all_cells(1);
        a.resize_width(5);
        assert_eq!(
            a.to_vec(),
            vec![1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0]
        );
    }

    #[wasm_bindgen_test]
    pub fn automaton_resize_width_smaller() {
        let mut a = Automaton::new(3, 3);
        a.set_all_cells(1);
        a.resize_width(2);
        assert_eq!(a.to_vec(), vec![1, 1, 1, 1, 1, 1]);
    }

    #[wasm_bindgen_test]
    pub fn automaton_resize_height_larger() {
        let mut a = Automaton::new(3, 3);
        a.set_all_cells(1);
        a.resize_height(5);
        assert_eq!(
            a.to_vec(),
            vec![1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0]
        );
    }

    #[wasm_bindgen_test]
    pub fn automaton_resize_height_smaller() {
        let mut a = Automaton::new(3, 3);
        a.set_all_cells(1);
        a.resize_height(2);
        assert_eq!(a.to_vec(), vec![1, 1, 1, 1, 1, 1]);
    }

    #[wasm_bindgen_test]
    pub fn automaton_wrapping() {
        let mut a = build_automaton(2, 2, &[(0, 0), (0, 1)]);
        let a_1 = build_automaton(2, 2, &[(0, 0), (0, 1)]);

        a.step(1);
        assert_eq!(a.to_vec(), a_1.to_vec());
    }

    #[wasm_bindgen_test]
    pub fn automaton_step() {
        let mut a = build_automaton(6, 6, &[(1, 2), (2, 3), (3, 1), (3, 2), (3, 3)]);
        let a_1 = build_automaton(6, 6, &[(2, 1), (2, 3), (3, 2), (3, 3), (4, 2)]);

        a.step(1);
        assert_eq!(a.to_vec(), a_1.to_vec());
    }
}
