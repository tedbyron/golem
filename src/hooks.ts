import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  // disable SSR for all pages
  return await resolve(event, { ssr: false })
}
