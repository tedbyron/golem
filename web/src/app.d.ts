declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }
}

declare module 'tailwindcss/nesting' {
  import type { Plugin, Processor } from 'postcss'
  export default function (): Plugin | Processor
}
