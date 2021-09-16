//! Life-like cellular automata.

use std::{cmp::Ordering, iter, mem};
#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::wasm_bindgen;

use crate::ruleset;

cfg_if::cfg_if! {
    if #[cfg(target_arch = "wasm32")] {
        /// A two-dimensional cellular automaton with a finite number of cells.
        #[wasm_bindgen(inspectable)]
        #[derive(Clone, Debug, PartialEq, PartialOrd)]
        pub struct Automaton {
            rows: usize,
            cols: usize,
            cells: Vec<u8>,
            cells_step: Vec<u8>,
            #[wasm_bindgen(getter_with_clone)]
            pub rules: ruleset::BSC,
            neighbor_deltas: [[usize; 2]; 8],
        }
    } else {
        /// A two-dimensional cellular automaton with a finite number of cells.
        #[derive(Clone, Debug, PartialEq, PartialOrd)]
        pub struct Automaton {
            rows: usize,
            cols: usize,
            cells: Vec<u8>,
            cells_step: Vec<u8>,
            pub rules: ruleset::BSC,
            neighbor_deltas: [[usize; 2]; 8],
        }
    }
}

#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
impl Automaton {
    /// Constructs a new automaton with all cell states set to 0. Defaults to rules
    /// from Conway's Game of Life.
    ///
    /// # Examples
    ///
    /// ```
    /// todo!();
    /// ```
    #[cfg_attr(target_arch = "wasm32", wasm_bindgen(constructor))]
    #[must_use]
    pub fn new(rows: usize, cols: usize) -> Self {
        #[cfg(all(debug_assertions, target_arch = "wasm32"))]
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
            rules: ruleset::BSC::default(),
            neighbor_deltas,
        }
    }

    /// Resizes the automaton so that `cols` is equal to `width`.
    ///
    /// If `width` is greater than `cols`, the automaton's rows are extended by the
    /// difference, with each additional column filled with 0. If `width` is less
    /// than `cols`, the automaton's rows are simply truncated.
    ///
    /// # Examples
    ///
    /// ```
    /// todo!();
    /// ```
    #[cfg_attr(target_arch = "wasm32", wasm_bindgen(setter = cols, js_name = resizeWidth))]
    pub fn resize_width(&mut self, width: usize) {
        match width.cmp(&self.cols) {
            Ordering::Greater => {
                let width_diff = width - self.cols;
                let cols = self.cols;
                self.cells.reserve_exact(width_diff * self.rows);
                for i in (0..self.rows).rev().map(|n| n * cols + cols) {
                    self.cells.splice(i..i, iter::repeat(0).take(width_diff));
                }
                // TODO: benchmark against the following alternative
                // let width_diff = width - self.width;
                // for _ in 0..self.height {
                //     self.cells.extend(iter::repeat(0).take(width_diff));
                //     self.cells.rotate_right(width);
                // }
            }
            Ordering::Less => {
                let width_diff = self.cols - width;
                let cols = self.cols;
                for (start, end) in (1..=self.rows)
                    .rev()
                    .map(|n| (n * cols - width_diff, n * cols))
                {
                    self.cells.splice(start..end, iter::empty());
                }
                // TODO: benchmark against the following alternative
                // let width_diff = self.width - width;
                // for _ in 0..self.height {
                //     self.cells.truncate(self.cells.len() - width_diff);
                //     self.cells.rotate_right(width);
                // }
            }
            Ordering::Equal => (),
        }
        self.cells_step
            .resize_with(width * self.rows, Default::default);
        self.cells_step.shrink_to_fit();
        self.cols = width;
        self.set_neighbor_deltas(width, self.rows);
    }

    /// Resizes the automaton so that `rows` is equal to `height`.
    ///
    /// If `height` is greater than `rows`, the automaton's columns are extended by
    /// the difference, with each additional row filled with 0. If `height` is less
    /// than `rows`, the automaton's columns are simply truncated.
    ///
    /// # Examples
    ///
    /// ```
    /// todo!();
    /// ```
    #[cfg_attr(target_arch = "wasm32", wasm_bindgen(setter = rows, js_name = resizeHeight))]
    pub fn resize_height(&mut self, height: usize) {
        self.cells.resize_with(self.cols * height, Default::default);
        self.cells.shrink_to_fit();
        self.cells_step
            .resize_with(self.cols * height, Default::default);
        self.cells_step.shrink_to_fit();
        self.rows = height;
        self.set_neighbor_deltas(self.cols, height);
    }

    /// Returns a raw pointer to the automaton cells' buffer.
    ///
    /// # Examples
    ///
    /// ```
    /// todo!();
    /// ```
    #[cfg_attr(target_arch = "wasm32", wasm_bindgen(js_name = getCellsPtr))]
    #[must_use]
    pub fn cells_ptr(&self) -> *const u8 {
        self.cells.as_ptr()
    }

    /// Toggles the state of a cell. If the cell state is 0, it is set to 1. If the
    /// cell is any other state, it is set to 0.
    ///
    /// # Examples
    /// ```
    /// todo!();
    /// ```
    #[cfg_attr(target_arch = "wasm32", wasm_bindgen(js_name = toggleCell))]
    pub fn toggle_cell(&mut self, row: usize, col: usize) {
        let idx = self.index(row, col);
        if let Some(cell) = self.cells.get_mut(idx) {
            *cell = match cell {
                0 => 1,
                _ => 0,
            }
        }
    }

    /// Sets the state of cells in `locations` to 1.
    ///
    /// `locations` is a list of alternating row and column coordinates. This
    /// function is implemented with an array as the parameter because
    /// `wasm_bindgen` does not support nested arrays.
    ///
    /// # Examples
    /// ```
    /// todo!();
    /// ```
    #[cfg_attr(target_arch = "wasm32", wasm_bindgen(js_name = setCellsOn))]
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

    /// Sets the cell state of all the automaton's cells to `n`.
    ///
    /// Only changes the automaton if `n` is less than or equal to the generation
    /// rule.
    ///
    /// # Examples
    /// ```
    /// todo!();
    /// ```
    #[cfg_attr(target_arch = "wasm32", wasm_bindgen(js_name = setAllCells))]
    pub fn set_all_cells(&mut self, n: u8) {
        if n <= self.rules.generation {
            self.cells.fill(n);
        }
    }

    /// Randomizes the cell state of all the automaton's cells.
    ///
    /// Loops through the automaton's cells and if `rand::random()` is less than the
    /// percentage `n`, the cell state is set to 1.
    ///
    /// # Examples
    /// ```
    /// todo!();
    /// ```
    #[cfg_attr(target_arch = "wasm32", wasm_bindgen(js_name = randomizeCells))]
    pub fn randomize_cells(&mut self, n: f64) {
        for cell in &mut self.cells {
            *cell = if rand::random::<f64>() < n / 100.0 {
                1
            } else {
                0
            };
        }
    }

    /// Calculates and the state of all cells in the automaton after `n` generations
    ///
    /// # Examples
    /// ```
    /// todo!();
    /// ```
    pub fn step(&mut self) {
        for row in 0..self.rows {
            for col in 0..self.cols {
                let idx = self.index(row, col);

                // TODO: only modify cells that change
                // TODO: get all neighbor counts first and only update cells with state > 0 or neighbors
                self.cells_step[idx] = match (self.cells[idx], self.neighbors(row, col)) {
                    (0, n) => self.rules.birth.contains(&n) as u8,
                    (1, n) => self.rules.survival.contains(&n) as u8,
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

    // Returns the index of a cell in the automaton.
    const fn index(&self, row: usize, col: usize) -> usize {
        row * self.cols + col
    }

    // Returns the count of a cell's live, first-generation neighbors.
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

    // Returns the offsets of neighboring cell locations; these deltas are required
    // for the automaton's `neighbors` method.
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

#[cfg(test)]
mod tests {
    use super::*;

    cfg_if::cfg_if! {
        if #[cfg(target_arch = "wasm32")] {
            use wasm_bindgen_test::{wasm_bindgen_test, wasm_bindgen_test_configure};

            wasm_bindgen_test_configure!(run_in_browser);
        }
    }

    // flatten a slice of tuples that contain (x, y) locations of cells
    fn flatten_locations(locations: &[(usize, usize)]) -> Vec<usize> {
        locations
            .iter()
            .flat_map(|&(x, y)| iter::once(x).chain(iter::once(y)))
            .collect()
    }

    // build an automaton with width, height, and locations of live cells
    fn build_automaton(width: usize, height: usize, locations: &[(usize, usize)]) -> Automaton {
        let mut a = Automaton::new(width, height);
        a.set_cells_on(&flatten_locations(locations));
        a
    }

    #[test]
    #[cfg_attr(target_arch = "wasm32", wasm_bindgen_test)]
    fn automaton_new() {
        let a = Automaton::new(64, 64);
        assert_eq!(a.cells, vec![0; 64 * 64]);
    }

    #[test]
    #[cfg_attr(target_arch = "wasm32", wasm_bindgen_test)]
    fn automaton_set_cells_on() {
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
        assert_eq!(a.cells, vec![1, 1, 1, 1, 1, 1, 1, 1, 1]);
    }

    #[test]
    #[cfg_attr(target_arch = "wasm32", wasm_bindgen_test)]
    fn automaton_new_rect() {
        let mut a = Automaton::new(2, 3);
        a.set_cells_on(&flatten_locations(&[(1, 1)]));
        assert_eq!(a.cells, vec![0, 0, 0, 0, 1, 0]);
    }

    #[test]
    #[cfg_attr(target_arch = "wasm32", wasm_bindgen_test)]
    fn automaton_set_all_cells() {
        let mut a = Automaton::new(3, 3);
        a.set_all_cells(1);
        assert_eq!(a.cells, vec![1, 1, 1, 1, 1, 1, 1, 1, 1]);
        a.set_all_cells(0);
        assert_eq!(a.cells, vec![0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }

    #[test]
    #[cfg_attr(target_arch = "wasm32", wasm_bindgen_test)]
    fn automaton_resize_width_larger() {
        let mut a = Automaton::new(3, 3);
        a.set_all_cells(1);
        a.resize_width(5);
        assert_eq!(a.cells, vec![1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0]);
    }

    #[test]
    #[cfg_attr(target_arch = "wasm32", wasm_bindgen_test)]
    fn automaton_resize_width_smaller() {
        let mut a = Automaton::new(3, 3);
        a.set_all_cells(1);
        a.resize_width(2);
        assert_eq!(a.cells, vec![1, 1, 1, 1, 1, 1]);
    }

    #[test]
    #[cfg_attr(target_arch = "wasm32", wasm_bindgen_test)]
    fn automaton_resize_height_larger() {
        let mut a = Automaton::new(3, 3);
        a.set_all_cells(1);
        a.resize_height(5);
        assert_eq!(a.cells, vec![1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0]);
    }

    #[test]
    #[cfg_attr(target_arch = "wasm32", wasm_bindgen_test)]
    fn automaton_resize_height_smaller() {
        let mut a = Automaton::new(3, 3);
        a.set_all_cells(1);
        a.resize_height(2);
        assert_eq!(a.cells, vec![1, 1, 1, 1, 1, 1]);
    }

    #[test]
    #[cfg_attr(target_arch = "wasm32", wasm_bindgen_test)]
    fn automaton_wrapping() {
        let mut a = build_automaton(2, 2, &[(0, 0), (0, 1)]);
        let a_1 = build_automaton(2, 2, &[(0, 0), (0, 1)]);

        a.step();
        assert_eq!(a.cells, a_1.cells);
    }

    #[test]
    #[cfg_attr(target_arch = "wasm32", wasm_bindgen_test)]
    fn automaton_step() {
        let mut a = build_automaton(6, 6, &[(1, 2), (2, 3), (3, 1), (3, 2), (3, 3)]);
        let a_1 = build_automaton(6, 6, &[(2, 1), (2, 3), (3, 2), (3, 3), (4, 2)]);

        a.step();
        assert_eq!(a.cells, a_1.cells);
    }
}
