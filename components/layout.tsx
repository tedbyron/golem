import Head from 'next/head'

import type { NextPage } from 'next'
import type { PropsWithChildren } from 'react'

const Layout = ({ children }: PropsWithChildren): NextPage => (
  <>
    <Head>
      <meta charSet='utf-8' key='charset' />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no'
        key='viewport'
      />
    </Head>

    <main role='main'>
      {children}
    </main>
  </>
)

export default Layout
