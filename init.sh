#!/usr/bin/env bash
# JS package requires a local dependency which must be built before other
# packages can be installed.

wasm-pack build --release --out-name lib --scope tedbyron
yarn
yarn gatsby telemetry --disable
