import { useStaticQuery, graphql } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import { Helmet } from 'react-helmet'

const Head = ({
  title,
  description,
  pathname
}) => {
  const { site } = useStaticQuery(graphql`
    query HeadQuery {
      site {
        siteMetadata {
          defaultTitle
          defaultAuthor
          defaultDescription
          siteUrl
          referrer
          colorScheme
        }
      }
    }
  `)

  const data = {
    title: title
      ? `${site.siteMetadata.defaultTitle} | ${title}`
      : site.siteMetadata.defaultTitle,
    author: site.siteMetadata.defaultAuthor,
    description: description ||
      site.siteMetadata.defaultDescription,
    url: pathname
      ? `${site.siteMetadata.siteUrl}/${pathname}`
      : site.siteMetadata.siteUrl,
    referrer: site.siteMetadata.referrer,
    colorScheme: site.siteMetadata.colorScheme
  }

  return (
    <Helmet
      title={data.title}
      meta={[
        {
          name: 'author',
          content: data.author
        },
        {
          name: 'description',
          content: data.description
        },
        {
          name: 'url',
          content: data.url
        },
        {
          name: 'referrer',
          content: data.referrer
        },
        {
          name: 'color-scheme',
          content: data.colorScheme
        },
        {
          name: 'og:title',
          content: data.title
        },
        {
          name: 'og:description',
          content: data.description
        },
        {
          name: 'og:url',
          content: data.url
        },
        {
          name: 'og:type',
          content: 'website'
        },
        {
          name: 'og:locale',
          content: 'en_US'
        }
      ]}
    />
  )
}

export default Head

Head.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  pathname: PropTypes.string
}

Head.defaultProps = {
  title: null,
  description: null,
  pathname: null
}
