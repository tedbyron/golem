/// Forwards panic messages to `console.error`
/// See [https://github.com/rustwasm/console_error_panic_hook#readme](https://github.com/rustwasm/console_error_panic_hook#readme).
pub fn set_panic_hook() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}
