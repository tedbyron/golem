//! Life-like cellular automata.

use rand::Rng;
use std::{cmp::Ordering, iter, mem};
use wasm_bindgen::prelude::wasm_bindgen;

use crate::ruleset;

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

#[wasm_bindgen]
impl Automaton {
    /// Constructs a new automaton with all cell states set to 0. Defaults to rules
    /// from Conway's Game of Life.
    ///
    /// # Examples
    ///
    /// ```
    /// use cellular_automaton::life_like::Automaton;
    /// use cellular_automaton::ruleset::BSC;
    ///
    /// let a = Automaton::new(5, 10);
    /// assert_eq!(a.rows(), 5);
    /// assert_eq!(a.cols(), 10);
    /// assert_eq!(a.rules, BSC::default());
    /// assert_eq!(<Vec<Vec<_>>>::from(&a), vec![[0; 10]; 5]);
    /// ```
    #[wasm_bindgen(constructor)]
    #[must_use]
    pub fn new(rows: usize, cols: usize) -> Self {
        #[cfg(debug_assertions)]
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

    /// Returns the number of rows in the automaton.
    ///
    /// # Examples
    ///
    /// ```
    /// use cellular_automaton::life_like::Automaton;
    ///
    /// let a = Automaton::new(5, 10);
    /// assert_eq!(a.rows(), 5);
    /// ```
    #[allow(clippy::missing_const_for_fn)] // can only wasm_bindgen non-const fn
    #[wasm_bindgen(getter)]
    #[must_use]
    pub fn rows(&self) -> usize {
        self.rows
    }

    /// Resizes the automaton so that `rows` is equal to `new_rows`.
    ///
    /// If `new_rows > rows`, the automaton's columns are extended by the
    /// difference, with each additional row filled with `0`. If `new_rows < rows`,
    /// the automaton's columns are simply truncated.
    ///
    /// # Examples
    ///
    /// ```
    /// use cellular_automaton::life_like::Automaton;
    ///
    /// let mut a = Automaton::new(5, 10);
    /// assert_eq!(a.rows(), 5);
    ///
    /// a.set_rows(6);
    /// assert_eq!(a.rows(), 6);
    /// assert_eq!(<Vec<Vec<_>>>::from(&a), vec![[0; 10]; 6]);
    /// ```
    #[wasm_bindgen(setter = rows)]
    pub fn set_rows(&mut self, new_rows: usize) {
        self.cells
            .resize_with(self.cols * new_rows, Default::default);
        self.cells_step
            .resize_with(self.cols * new_rows, Default::default);
        self.rows = new_rows;
        self.set_neighbor_deltas(self.cols, new_rows);
    }

    /// Returns the number of columns in the automaton.
    ///
    /// # Examples
    ///
    /// ```
    /// use cellular_automaton::life_like::Automaton;
    ///
    /// let a = Automaton::new(5, 10);
    /// assert_eq!(a.cols(), 10);
    /// ```
    #[allow(clippy::missing_const_for_fn)] // can only wasm_bindgen non-const fn
    #[wasm_bindgen(getter)]
    #[must_use]
    pub fn cols(&self) -> usize {
        self.cols
    }

    /// Resizes the automaton so that `cols` is equal to `new_cols`.
    ///
    /// If `new_cols > cols`, the automaton's rows are extended by the difference,
    /// with each additional column filled with 0. If `new_cols < cols`, the
    /// automaton's rows are simply truncated.
    ///
    /// # Examples
    ///
    /// ```
    /// use cellular_automaton::life_like::Automaton;
    ///
    /// let mut a = Automaton::new(5, 10);
    /// assert_eq!(a.cols(), 10);
    ///
    /// a.set_cols(9);
    /// assert_eq!(a.cols(), 9);
    /// assert_eq!(<Vec<Vec<_>>>::from(&a), vec![[0; 9]; 5]);
    /// ```
    #[wasm_bindgen(setter = cols)]
    pub fn set_cols(&mut self, new_cols: usize) {
        match new_cols.cmp(&self.cols) {
            Ordering::Greater => {
                let diff = new_cols - self.cols;
                for _ in 0..self.rows {
                    self.cells.extend(iter::repeat(0).take(diff));
                    self.cells.rotate_right(new_cols);
                }
                // TODO: benchmark against the following alternative
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
                // TODO: benchmark against the following alternative
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

    /// Returns a raw pointer to the automaton's cells' memory buffer.
    #[wasm_bindgen(js_name = getCellsPtr)]
    #[must_use]
    pub fn cells_ptr(&self) -> *const u8 {
        self.cells.as_ptr()
    }

    /// Toggles the state of a cell. If the cell state is 0, it is set to 1. If the
    /// cell is any other state, it is set to 0.
    ///
    /// # Examples
    ///
    /// ```
    /// use cellular_automaton::life_like::Automaton;
    ///
    /// let mut a = Automaton::new(2, 3);
    /// a.toggle_cell(1, 1);
    /// assert_eq!(<Vec<Vec<_>>>::from(&a), vec![[0, 0, 0], [0, 1, 0]]);
    /// ```
    #[wasm_bindgen(js_name = toggleCell)]
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
    ///
    /// ```
    /// use cellular_automaton::life_like::Automaton;
    ///
    /// let mut a = Automaton::new(2, 3);
    /// let coords = [[0, 1], [1, 1]];
    /// let coords: Vec<usize> = coords.iter().copied().flatten().collect();
    ///
    /// a.set_cells_on(&coords);
    /// assert_eq!(<Vec<Vec<_>>>::from(&a), vec![[0, 1, 0], [0, 1, 0]]);
    /// ```
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

    /// Sets the cell state of all the automaton's cells to `n`.
    ///
    /// Only changes the automaton if `n` is less than or equal to the generation
    /// rule.
    ///
    /// # Examples
    ///
    /// ```
    /// use cellular_automaton::life_like::Automaton;
    ///
    /// let mut a = Automaton::new(5, 10);
    /// a.set_all_cells(1);
    /// assert_eq!(<Vec<Vec<_>>>::from(&a), vec![[1; 10]; 5]);
    /// ```
    #[wasm_bindgen(js_name = setAllCells)]
    pub fn set_all_cells(&mut self, n: u8) {
        if n <= self.rules.generation {
            self.cells.fill(n);
        }
    }

    /// Randomizes the cell state of all the automaton's cells.
    ///
    /// Loops through the automaton's cells and if `rand::random()` is less than the
    /// decimal fraction `n`, the cell state is set to 1. If `n > 1`, `n` is set to
    /// `1.0`; if `n < 0`, `n` is set to `0.0`. Provides no guarantee that the
    /// actual ratio of live cells to dead cells is equal to `n`.
    ///
    /// # Examples
    ///
    /// ```
    /// use cellular_automaton::life_like::Automaton;
    ///
    /// let mut a = Automaton::new(5, 10);
    /// a.randomize_cells(0.5);
    /// ```
    #[wasm_bindgen(js_name = randomizeCells)]
    pub fn randomize_cells(&mut self, mut n: f64) {
        // Ensure n is within bounds for comparison.
        if n < 0.0 {
            n = 0.0;
        } else if n > 1.0 {
            n = 1.0;
        }

        // Cache the RNG.
        let mut rng = rand::thread_rng();

        // For every cell, generate and compare a random number to `n`.
        for cell in &mut self.cells {
            *cell = if rng.gen::<f64>() < n { 1 } else { 0 };
        }
    }

    /// Calculates next state of all cells in the automaton into `cells_next`,
    /// and swaps `cells_next` with `cells`.
    ///
    /// # Examples
    ///
    /// ```
    /// use cellular_automaton::life_like::Automaton;
    ///
    /// let mut a = Automaton::new(6, 6);
    /// let coords = [[1, 2], [2, 3], [3, 1], [3, 2], [3, 3]];
    /// let coords: Vec<usize> = coords.iter().copied().flatten().collect();
    /// a.set_cells_on(&coords);
    /// //       0  0  0  0  0  0
    /// //       0  0  1  0  0  0
    /// //       0  0  0  1  0  0
    /// //       0  1  0  0  0  0
    /// //       0  0  1  1  0  0
    /// //       0  0  0  0  0  0
    ///
    /// a.step();
    /// assert_eq!(
    ///     <Vec<Vec<_>>>::from(&a),
    ///     vec![
    ///         [0, 0, 0, 0, 0, 0],
    ///         [0, 0, 0, 0, 0, 0],
    ///         [0, 1, 0, 1, 0, 0],
    ///         [0, 0, 1, 1, 0, 0],
    ///         [0, 0, 1, 0, 0, 0],
    ///         [0, 0, 0, 0, 0, 0],
    ///     ],
    /// );
    /// ```
    pub fn step(&mut self) {
        // Loop through every col of every row.
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

        // Swap the values of `cells` and `cells_step`. For a `Vec`, this means the
        // pointers, lengths, and capacities are swapped.
        mem::swap(&mut self.cells, &mut self.cells_step);
    }

    // Returns the index of a cell from `row` and `col`.
    #[inline]
    const fn index(&self, row: usize, col: usize) -> usize {
        row * self.cols + col
    }

    // Returns the count of a cell's live, first-generation neighbors.
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

    // Returns the offsets of neighboring cell locations. These deltas are required
    // for the automaton's `neighbors` method.
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

// Implements `Vec<u8>::from<Automaton>` and `Automaton::into<Vec<u8>>`. Public
// fields in `#[wasm_bindgen]` structs must be `Copy` and the `cells` field of
// `Automaton` is a `Vec`, which is not `Copy`, so this function may be used to
// retrieve `cells`.
impl From<&Automaton> for Vec<u8> {
    #[inline]
    fn from(a: &Automaton) -> Self {
        a.cells.clone()
    }
}

// Implements `Vec<Vec<u8>>::from<&Automaton>` and
// `Automaton::into<Vec<Vec<u8>>`
impl From<&Automaton> for Vec<Vec<u8>> {
    #[inline]
    fn from(a: &Automaton) -> Self {
        a.cells.chunks_exact(a.cols).map(|c| c.to_vec()).collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use wasm_bindgen_test::{wasm_bindgen_test, wasm_bindgen_test_configure};

    wasm_bindgen_test_configure!(run_in_browser);

    // Flatten a slice of tuples that contain (x, y) locations of cells.
    fn flatten_locations(locations: &[[usize; 2]]) -> Vec<usize> {
        locations.iter().copied().flatten().collect()
    }

    // Build an automaton from rows, cols, and locations of live cells.
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
