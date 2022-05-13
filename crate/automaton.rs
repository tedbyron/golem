//! Life-like cellular automata.

use rand::Rng;
use std::cmp::Ordering;
use std::{iter, mem};
use wasm_bindgen::prelude::*;

use crate::rules::Rules;

/// A two-dimensional cellular automaton with a finite number of cells.
#[wasm_bindgen(inspectable)]
#[derive(Clone, Debug, PartialEq, PartialOrd)]
pub struct Automaton {
    rows: usize,
    cols: usize,
    cells: Vec<u8>,
    cells_step: Vec<u8>,
    #[wasm_bindgen(getter_with_clone)]
    pub rules: Rules,
    neighbor_deltas: [[usize; 2]; 8],
}

#[wasm_bindgen]
impl Automaton {
    #[wasm_bindgen(constructor)]
    #[must_use]
    #[inline]
    pub fn new(rows: usize, cols: usize) -> Self {
        console_error_panic_hook::set_once();

        let neighbor_deltas = [
            [rows - 1, cols - 1],
            [rows - 1, 0],
            [rows - 1, 1],
            [0, cols - 1],
            [0, 1],
            [1, cols - 1],
            [1, 0],
            [1, 1],
        ];

        Self {
            rows,
            cols,
            cells: vec![0; cols * rows],
            cells_step: vec![0; cols * rows],
            rules: Rules::default(),
            neighbor_deltas,
        }
    }

    #[allow(clippy::missing_const_for_fn)] // can only wasm_bindgen non-const fn
    #[wasm_bindgen(getter)]
    #[must_use]
    #[inline]
    pub fn rows(&self) -> usize {
        self.rows
    }

    #[wasm_bindgen(setter = rows)]
    #[inline]
    pub fn set_rows(&mut self, new_rows: usize) {
        self.cells.resize_with(self.cols * new_rows, u8::default);
        self.cells_step
            .resize_with(self.cols * new_rows, u8::default);
        self.rows = new_rows;
        self.set_neighbor_deltas(self.cols, new_rows);
    }

    #[allow(clippy::missing_const_for_fn)] // can only wasm_bindgen non-const fn
    #[wasm_bindgen(getter)]
    #[must_use]
    #[inline]
    pub fn cols(&self) -> usize {
        self.cols
    }

    #[wasm_bindgen(setter = cols)]
    pub fn set_cols(&mut self, new_cols: usize) {
        match new_cols.cmp(&self.cols) {
            Ordering::Greater => {
                let diff = new_cols - self.cols;
                for _ in 0..self.rows {
                    self.cells.extend(iter::repeat(0).take(diff));
                    self.cells.rotate_right(new_cols);
                }
                // TODO: benchmark
                // let diff = new_cols - self.cols;
                // let cols = self.cols;
                // self.cells.reserve_exact(diff * self.rows);
                // for i in (0..self.rows).rev().map(|n| n * cols + cols) {
                //     self.cells.splice(i..i, iter::repeat(0).take(diff));
                // }
            }
            Ordering::Less => {
                let diff = self.cols - new_cols;
                for _ in 0..self.rows {
                    self.cells.truncate(self.cells.len() - diff);
                    self.cells.rotate_right(new_cols);
                }
                // TODO: benchmark
                // let diff = self.cols - new_cols;
                // let cols = self.cols;
                // for (start, end) in (1..=self.rows).rev().map(|n| (n * cols - diff, n * cols)) {
                //     self.cells.splice(start..end, iter::empty());
                // }
            }
            Ordering::Equal => (),
        }
        self.cells_step
            .resize_with(new_cols * self.rows, Default::default);
        self.cols = new_cols;
        self.set_neighbor_deltas(new_cols, self.rows);
    }

    /// Returns a raw pointer to the automaton's cells' buffer.
    #[wasm_bindgen(js_name = cellsPtr)]
    #[must_use]
    #[inline]
    pub fn cells_ptr(&self) -> *const u8 {
        self.cells.as_ptr()
    }

    #[wasm_bindgen(js_name = toggleCell)]
    #[inline]
    pub fn toggle_cell(&mut self, row: usize, col: usize) {
        let idx = self.index(row, col);
        if let Some(cell) = self.cells.get_mut(idx) {
            *cell = match cell {
                0 => 1,
                _ => 0,
            }
        }
    }

    #[wasm_bindgen(js_name = setCellsOn)]
    pub fn set_cells_on(&mut self, locations: &[usize]) {
        for (&row, &col) in locations
            .iter()
            .step_by(2)
            .zip(locations.iter().skip(1).step_by(2))
        {
            let idx = self.index(row, col);
            if let Some(cell) = self.cells.get_mut(idx) {
                *cell = 1;
            }
        }
    }

    #[wasm_bindgen(js_name = setAllCells)]
    #[inline]
    pub fn set_all_cells(&mut self, n: u8) {
        if n <= self.rules.generation {
            self.cells.fill(n);
        }
    }

    #[wasm_bindgen(js_name = randomizeCells)]
    pub fn randomize_cells(&mut self, mut n: f64) {
        // Ensure n is within bounds for comparison.
        if n < 0.0 {
            n = 0.0;
        } else if n > 1.0 {
            n = 1.0;
        }

        let mut rng = rand::thread_rng();

        for cell in &mut self.cells {
            *cell = if rng.gen::<f64>() < n { 1 } else { 0 };
        }
    }

    pub fn step(&mut self) {
        for row in 0..self.rows {
            for col in 0..self.cols {
                let idx = self.index(row, col);

                // TODO: only modify hot cells
                // TODO: get neighbor counts then update cells with state > 0 or neighbors
                self.cells_step[idx] = match (self.cells[idx], self.neighbors(row, col)) {
                    (0, n) => u8::from(self.rules.birth.contains(&n)),
                    (1, n) => u8::from(self.rules.survival.contains(&n)),
                    (s, _) => {
                        if s < self.rules.generation {
                            s + 1
                        } else {
                            0
                        }
                    }
                }
            }
        }

        mem::swap(&mut self.cells, &mut self.cells_step);
    }

    #[inline]
    const fn index(&self, row: usize, col: usize) -> usize {
        row * self.cols + col
    }

    #[inline]
    fn neighbors(&self, row: usize, col: usize) -> u8 {
        self.neighbor_deltas
            .iter()
            .fold(0, |count, &[row_delta, col_delta]| {
                match self
                    .cells
                    .get(self.index((row + row_delta) % self.rows, (col + col_delta) % self.cols))
                    .unwrap()
                {
                    1 => count + 1,
                    _ => count,
                }
            })
    }

    #[inline]
    fn set_neighbor_deltas(&mut self, rows: usize, cols: usize) {
        self.neighbor_deltas = [
            [rows - 1, cols - 1],
            [rows - 1, 0],
            [rows - 1, 1],
            [0, cols - 1],
            [0, 1],
            [1, cols - 1],
            [1, 0],
            [1, 1],
        ];
    }
}

impl From<&Automaton> for Vec<u8> {
    #[inline]
    fn from(a: &Automaton) -> Self {
        a.cells.clone()
    }
}

impl From<&Automaton> for Vec<Vec<u8>> {
    #[inline]
    fn from(a: &Automaton) -> Self {
        a.cells.chunks_exact(a.cols).map(<[u8]>::to_vec).collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use wasm_bindgen_test::{wasm_bindgen_test, wasm_bindgen_test_configure};

    wasm_bindgen_test_configure!(run_in_browser);

    fn flatten_locations(locations: &[[usize; 2]]) -> Vec<usize> {
        locations.iter().copied().flatten().collect()
    }

    fn build_automaton(rows: usize, cols: usize, locations: &[[usize; 2]]) -> Automaton {
        let mut a = Automaton::new(rows, cols);
        a.set_cells_on(&flatten_locations(locations));
        a
    }

    #[test]
    #[wasm_bindgen_test]
    fn automaton_new() {
        let a = Automaton::new(64, 64);
        assert_eq!(a.cells, vec![0; 64 * 64]);
    }

    #[test]
    #[wasm_bindgen_test]
    fn automaton_set_cells_on() {
        let mut a = Automaton::new(3, 3);
        a.set_cells_on(&flatten_locations(&[
            [0, 1],
            [0, 2],
            [1, 0],
            [1, 2],
            [2, 0],
            [2, 1],
        ]));
        assert_eq!(a.cells, vec![0, 1, 1, 1, 0, 1, 1, 1, 0]);
    }

    #[test]
    #[wasm_bindgen_test]
    fn automaton_new_rect() {
        let mut a = Automaton::new(2, 3);
        a.set_cells_on(&flatten_locations(&[[1, 1]]));
        assert_eq!(a.cells, vec![0, 0, 0, 0, 1, 0]);
    }

    #[test]
    #[wasm_bindgen_test]
    fn automaton_set_all_cells() {
        let mut a = Automaton::new(3, 3);
        a.set_all_cells(1);
        assert_eq!(a.cells, vec![1, 1, 1, 1, 1, 1, 1, 1, 1]);
        a.set_all_cells(0);
        assert_eq!(a.cells, vec![0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }

    #[test]
    #[wasm_bindgen_test]
    fn automaton_set_cols_larger() {
        let mut a = Automaton::new(3, 3);
        a.set_all_cells(1);
        a.set_cols(5);
        assert_eq!(a.cells, vec![1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0]);
    }

    #[test]
    #[wasm_bindgen_test]
    fn automaton_set_cols_smaller() {
        let mut a = Automaton::new(3, 3);
        a.set_all_cells(1);
        a.set_cols(2);
        assert_eq!(a.cells, vec![1, 1, 1, 1, 1, 1]);
    }

    #[test]
    #[wasm_bindgen_test]
    fn automaton_set_rows_larger() {
        let mut a = Automaton::new(3, 3);
        a.set_all_cells(1);
        a.set_rows(5);
        assert_eq!(a.cells, vec![1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0]);
    }

    #[test]
    #[wasm_bindgen_test]
    fn automaton_set_rows_smaller() {
        let mut a = Automaton::new(3, 3);
        a.set_all_cells(1);
        a.set_rows(2);
        assert_eq!(a.cells, vec![1, 1, 1, 1, 1, 1]);
    }

    #[test]
    #[wasm_bindgen_test]
    fn automaton_wrapping() {
        let mut a = build_automaton(2, 2, &[[0, 0], [0, 1]]);
        let a_1 = build_automaton(2, 2, &[[0, 0], [0, 1]]);

        a.step();
        assert_eq!(a.cells, a_1.cells);
    }

    #[test]
    #[wasm_bindgen_test]
    fn automaton_step() {
        let mut a = build_automaton(6, 6, &[[1, 2], [2, 3], [3, 1], [3, 2], [3, 3]]);
        let a_1 = build_automaton(6, 6, &[[2, 1], [2, 3], [3, 2], [3, 3], [4, 2]]);

        a.step();
        assert_eq!(a.cells, a_1.cells);
    }
}
