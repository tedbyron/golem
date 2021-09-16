<div align="center">
  <h1><code>cellular-automaton</code></h1>

  <p>
    <strong>A cellular automaton simulation library with support for WebAssembly.</strong>
  </p>

  <p>
    <a href="https://crates.io/crates/cellular-automaton"><img alt="Crates.io version" src="https://img.shields.io/crates/v/cellular-automaton?style=flat-square&logo=rust"></a>
    <a href="https://crates.io/crates/cellular-automaton"><img alt="Crates.io downloads" src="https://img.shields.io/crates/d/cellular-automaton?style=flat-square&label=crates.io downloads"></a>
    <a href="https://docs.rs/cellular-automaton"><img src="https://img.shields.io/badge/docs.rs-latest-blue.svg?style=flat-square" alt="docs.rs docs" /></a>
  </p>
</div>

## 1. Install

```toml
# Cargo.toml
[dependencies]
cellular-automaton = "0.1.8"
```

## 2. Compile

- Compile, generate `.js` and `.d.ts` bindings, and generate an `npm` package with [`wasm-pack`](https://github.com/rustwasm/wasm-pack)

  ```sh
  wasm-pack build
  ```

- Compile and generate `.js` and `.d.ts` bindings with [`wasm-bindgen-cli`](https://rustwasm.github.io/wasm-bindgen/reference/cli.html)

    1. Install the `wasm32-unknown-unknown` compilation target

        ```sh
        rustup target add wasm32-unknown-unknown
        ```

    2. Build

        ```sh
        cargo build --target wasm32-unknown-unknown
        ```

    3. Run

        ```sh
        wasm-bindgen --out-dir pkg/ ./target/wasm32-unknown-unknown/release/cellular_automaton.wasm
        ```

## 3. Optimize

Optimize for binary size with [`wasm-opt`](https://github.com/WebAssembly/binaryen) using `-Os` or `-Oz`

```sh
wasm-opt -Os ./pkg/cellular_automaton_bg.wasm -o ./pkg/cellular_automaton_bg.wasm
```
