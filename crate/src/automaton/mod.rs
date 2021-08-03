mod rules;
mod utils;

use std::cmp::Ordering;
use std::iter;
use std::mem;

use wasm_bindgen::prelude::wasm_bindgen;

/// A two-dimensional cellular automaton with a finite grid of cells.
#[wasm_bindgen]
#[derive(Clone)]
pub struct Automaton {
    rows: usize,
    cols: usize,
    cells: Vec<u8>,
    cells_step: Vec<u8>,
    rules: rules::Rules,
    neighbor_deltas: [[usize; 2]; 8],
}

#[wasm_bindgen]
impl Automaton {
    /// Constructs a new automaton with all cell states set to 0.
    #[must_use]
    pub fn new(rows: usize, cols: usize) -> Self {
        utils::set_panic_hook();

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
            rules: rules::Rules::default(),
            neighbor_deltas,
        }
    }

    /// Resizes the automaton so that `cols` is equal to `new_width`.
    ///
    /// If `new_width` is greater than `cols`, the automaton's rows are extended by
    /// the difference, with each additional column filled with 0. If `new_width` is
    /// less than `cols`, the automaton's rows are simply truncated.
    pub fn resize_width(&mut self, new_width: usize) {
        match new_width.cmp(&self.cols) {
            Ordering::Greater => {
                let width_diff = new_width - self.cols;
                let cols = self.cols;
                self.cells.reserve_exact(width_diff * self.rows);
                for i in (0..self.rows).rev().map(|n| n * cols + cols) {
                    self.cells.splice(i..i, iter::repeat(0).take(width_diff));
                }
                // TODO: benchmark against the following alternative
                // let width_diff = new_width - self.width;
                // for _ in 0..self.height {
                //     self.cells.extend(iter::repeat(0).take(width_diff));
                //     self.cells.rotate_right(new_width);
                // }
            }
            Ordering::Less => {
                let width_diff = self.cols - new_width;
                let cols = self.cols;
                for (start, end) in (1..=self.rows)
                    .rev()
                    .map(|n| (n * cols - width_diff, n * cols))
                {
                    self.cells.splice(start..end, iter::empty());
                }
                // TODO: benchmark against the following alternative
                // let width_diff = self.width - new_width;
                // for _ in 0..self.height {
                //     self.cells.truncate(self.cells.len() - width_diff);
                //     self.cells.rotate_right(new_width);
                // }
            }
            Ordering::Equal => (),
        }
        self.cells_step
            .resize_with(new_width * self.rows, Default::default);
        self.cols = new_width;
        self.set_neighbor_deltas(new_width, self.rows);
    }

    /// Resizes the automaton so that `rows` is equal to `new_height`.
    ///
    /// If `new_height` is greater than `rows`, the automaton's columns are extended
    /// by the difference, with each additional row filled with 0. If `new_height`
    /// is less than `rows`, the automaton's columns are simply truncated.
    pub fn resize_height(&mut self, new_height: usize) {
        self.cells
            .resize_with(self.cols * new_height, Default::default);
        self.cells_step
            .resize_with(self.cols * new_height, Default::default);
        self.rows = new_height;
        self.set_neighbor_deltas(self.cols, new_height);
    }

    /// Returns the automaton's cells as a raw pointer.
    #[must_use]
    pub fn cells(&self) -> *const u8 {
        self.cells.as_ptr()
    }

    /// Toggles the state of a cell. If the cell state is 0, it is set to 1. If the
    /// cell is any other state, it is set to 0.
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
    /// `locations` is a list of alternating row and column coordinates.
    pub fn set_cells_on(&mut self, cells: &[usize]) {
        for (&row, &col) in cells.iter().step_by(2).zip(cells.iter().skip(1).step_by(2)) {
            let idx = self.index(row, col);
            if let Some(cell) = self.cells.get_mut(idx) {
                *cell = 1;
            }
        }
    }

    /// Sets the cell state of all the automaton's cells to `n`.
    pub fn set_all_cells(&mut self, n: u8) {
        for cell in &mut self.cells {
            *cell = n;
        }
    }

    /// Randomizes the cell state of all the automaton's cells.
    ///
    /// Loops through the automaton's cells and if `rand::random()` is less
    /// than the percentage `n`, the cell state is set to 1.
    pub fn randomize_cells(&mut self, n: f64) {
        for cell in &mut self.cells {
            *cell = if rand::random::<f64>() < n / 100.0 {
                1
            } else {
                0
            };
        }
    }

    /// Sets the survival rule to a different value.
    pub fn set_survival_rule(&mut self, s: &[u8]) {
        self.rules.survival = s.to_vec();
    }

    /// Sets the birth rule to a different value.
    pub fn set_birth_rule(&mut self, b: &[u8]) {
        self.rules.birth = b.to_vec();
    }

    /// Sets the generation rule to a different value.
    pub fn set_generation_rule(&mut self, c: u8) {
        self.rules.generation = c;
    }

    /// Calculates and sets the next state of all cells in the automaton.
    pub fn step(&mut self, n: usize) {
        for _ in 0..n {
            for row in 0..self.rows {
                for col in 0..self.cols {
                    let idx = self.index(row, col);

                    self.cells_step[idx] = match (self.cells[idx], self.neighbors(row, col)) {
                        (0, n) => self.rules.birth.contains(&n).into(),
                        (1, n) if self.rules.survival.contains(&n) => 1,
                        (s, _) if s < self.rules.generation => s + 1,
                        _ => 0,
                    }
                }
            }

            mem::swap(&mut self.cells, &mut self.cells_step);
        }
    }

    /// Returns the index of a cell in the automaton.
    const fn index(&self, row: usize, col: usize) -> usize {
        row * self.cols + col
    }

    /// Returns the count of a cell's live, first-generation neighbors.
    fn neighbors(&self, row: usize, col: usize) -> u8 {
        self.neighbor_deltas.iter().fold(0, |count, delta| {
            match self
                .cells
                .get(self.index((row + delta[0]) % self.rows, (col + delta[1]) % self.cols))
                .unwrap_or(&count)
            {
                1 => count + 1,
                _ => count,
            }
        })
    }

    /// Returns the offsets of neighboring cell locations; these deltas are required
    /// for the automaton's `neighbors` method.
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

#[doc(hidden)]
impl Automaton {
    /// Function for integration tests.
    ///
    /// Get a clone of the automaton's cells.
    #[must_use]
    pub fn to_vec(&self) -> Vec<u8> {
        self.cells.clone()
    }
}
