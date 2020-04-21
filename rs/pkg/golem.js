import * as wasm from './golem_bg.wasm';

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? require('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let cachegetUint32Memory0 = null;
function getUint32Memory0() {
    if (cachegetUint32Memory0 === null || cachegetUint32Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory0;
}

let WASM_VECTOR_LEN = 0;

function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4);
    getUint32Memory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

const lTextEncoder = typeof TextEncoder === 'undefined' ? require('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }
/**
* A two-dimensional cellular automaton with a finite grid of cells.
*/
export class Automaton {

    static __wrap(ptr) {
        const obj = Object.create(Automaton.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_automaton_free(ptr);
    }
    /**
    * Constructs a new automaton with all cell states set to 0.
    * @param {number} rows
    * @param {number} cols
    * @returns {Automaton}
    */
    static new(rows, cols) {
        var ret = wasm.automaton_new(rows, cols);
        return Automaton.__wrap(ret);
    }
    /**
    * Resizes the automaton so that `cols` is equal to `new_width`.
    *
    * If `new_width` is greater than `cols`, the automaton\'s rows are extended
    * by the difference, with each additional column filled with 0. If
    * `new_width` is less than `cols`, the automaton\'s rows are simply
    * truncated.
    * @param {number} new_width
    */
    resize_width(new_width) {
        wasm.automaton_resize_width(this.ptr, new_width);
    }
    /**
    * Resizes the automaton so that `rows` is equal to `new_height`.
    *
    * If `new_height` is greater than `rows`, the automaton\'s columns are
    * extended by the difference, with each additional row filled with 0. If
    * `new_height` is less than `rows`, the automaton\'s columns are simply
    * truncated.
    * @param {number} new_height
    */
    resize_height(new_height) {
        wasm.automaton_resize_height(this.ptr, new_height);
    }
    /**
    * Returns the automaton\'s cells as a raw pointer.
    * @returns {number}
    */
    cells() {
        var ret = wasm.automaton_cells(this.ptr);
        return ret;
    }
    /**
    * Toggles the state of a cell. If the cell state is 0, it is set to 1. If
    * the cell is any other state, it is set to 0.
    * @param {number} row
    * @param {number} col
    */
    toggle_cell(row, col) {
        wasm.automaton_toggle_cell(this.ptr, row, col);
    }
    /**
    * Sets the state of cells in `locations` to 1.
    *
    * `locations` is a list of alternating row and column coordinates.
    * @param {Uint32Array} cells
    */
    set_cells_on(cells) {
        var ptr0 = passArray32ToWasm0(cells, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.automaton_set_cells_on(this.ptr, ptr0, len0);
    }
    /**
    * Sets the cell state of all the automaton\'s cells to `n`.
    * @param {number} n
    */
    set_all_cells(n) {
        wasm.automaton_set_all_cells(this.ptr, n);
    }
    /**
    * Randomizes the cell state of all the automaton\'s cells.
    *
    * Loops through the automaton\'s cells and if `js_sys::Math::random` is
    * less than the percentage `n`, the cell state is set to 1.
    * @param {number} n
    */
    randomize_cells(n) {
        wasm.automaton_randomize_cells(this.ptr, n);
    }
    /**
    * Sets the survival rule to a different value.
    * @param {Uint8Array} s
    */
    set_survival_rule(s) {
        var ptr0 = passArray8ToWasm0(s, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.automaton_set_survival_rule(this.ptr, ptr0, len0);
    }
    /**
    * Sets the birth rule to a different value.
    * @param {Uint8Array} b
    */
    set_birth_rule(b) {
        var ptr0 = passArray8ToWasm0(b, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.automaton_set_birth_rule(this.ptr, ptr0, len0);
    }
    /**
    * Sets the generation rule to a different value.
    * @param {number} c
    */
    set_generation_rule(c) {
        wasm.automaton_set_generation_rule(this.ptr, c);
    }
    /**
    * Calculates and sets the next state of all cells in the automaton.
    * @param {number} n
    */
    step(n) {
        wasm.automaton_step(this.ptr, n);
    }
}

export const __wbg_new_59cb74e423758ede = function() {
    var ret = new Error();
    return addHeapObject(ret);
};

export const __wbg_stack_558ba5917b466edd = function(arg0, arg1) {
    var ret = getObject(arg1).stack;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export const __wbg_error_4bb6c2a97407129a = function(arg0, arg1) {
    try {
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(arg0, arg1);
    }
};

export const __wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

export const __wbg_random_c39492311093f0a8 = typeof Math.random == 'function' ? Math.random : notDefined('Math.random');

export const __wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

