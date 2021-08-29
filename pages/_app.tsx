import 'normalize.css'
import '../fonts/fonts.css'
import '../styles/global.scss'

import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

import Layout from '../components/layout'

const Golem = ({ Component, pageProps }: AppProps): NextPage => (
  <Layout>
    <Component {...pageProps} />
  </Layout>
)

export default Golem
