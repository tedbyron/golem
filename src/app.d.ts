declare module 'tailwindcss/nesting' {
  import type { Plugin, Processor } from 'postcss'
  export default function (): Plugin | Processor
}
