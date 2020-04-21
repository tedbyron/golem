/* tslint:disable */
/* eslint-disable */
export class Automaton {
  free(): void;
/**
* Constructs a new automaton with all cell states set to 0.
* @param {number} rows 
* @param {number} cols 
* @returns {Automaton} 
*/
  static new(rows: number, cols: number): Automaton;
/**
* Resizes the automaton so that `cols` is equal to `new_width`.
*
* If `new_width` is greater than `cols`, the automaton\'s rows are extended
* by the difference, with each additional column filled with 0. If
* `new_width` is less than `cols`, the automaton\'s rows are simply
* truncated.
* @param {number} new_width 
*/
  resize_width(new_width: number): void;
/**
* Resizes the automaton so that `rows` is equal to `new_height`.
*
* If `new_height` is greater than `rows`, the automaton\'s columns are
* extended by the difference, with each additional row filled with 0. If
* `new_height` is less than `rows`, the automaton\'s columns are simply
* truncated.
* @param {number} new_height 
*/
  resize_height(new_height: number): void;
/**
* Returns the automaton\'s cells as a raw pointer.
* @returns {number} 
*/
  cells(): number;
/**
* Toggles the state of a cell. If the cell state is 0, it is set to 1. If
* the cell is any other state, it is set to 0.
* @param {number} row 
* @param {number} col 
*/
  toggle_cell(row: number, col: number): void;
/**
* Sets the state of cells in `locations` to 1.
*
* `locations` is a list of alternating row and column coordinates.
* @param {Uint32Array} cells 
*/
  set_cells_on(cells: Uint32Array): void;
/**
* Sets the cell state of all the automaton\'s cells to `n`.
* @param {number} n 
*/
  set_all_cells(n: number): void;
/**
* Randomizes the cell state of all the automaton\'s cells.
*
* Loops through the automaton\'s cells and if `js_sys::Math::random` is
* less than the percentage `n`, the cell state is set to 1.
* @param {number} n 
*/
  randomize_cells(n: number): void;
/**
* Sets the survival rule to a different value.
* @param {Uint8Array} s 
*/
  set_survival_rule(s: Uint8Array): void;
/**
* Sets the birth rule to a different value.
* @param {Uint8Array} b 
*/
  set_birth_rule(b: Uint8Array): void;
/**
* Sets the generation rule to a different value.
* @param {number} c 
*/
  set_generation_rule(c: number): void;
/**
* Calculates and sets the next state of all cells in the automaton.
* @param {number} n 
*/
  step(n: number): void;
}
