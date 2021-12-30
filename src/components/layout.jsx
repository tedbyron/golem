import PropTypes from 'prop-types'
import React from 'react'

import Head from './head'

import 'normalize.css'
import '../styles/global.scss'

const Layout = ({
  title,
  description,
  pathname,
  children
}) => (
  <>
    <Head
      title={title}
      description={description}
      pathname={pathname}
    />

    <main>
      {children}
    </main>
  </>
)

export default Layout

Layout.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  pathname: PropTypes.string,
  children: PropTypes.node.isRequired
}

Layout.defaultProps = {
  title: null,
  description: null,
  pathname: null
}
