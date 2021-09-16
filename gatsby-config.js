module.exports = {
  siteMetadata: {
    defaultTitle: 'Golem',
    defaultAuthor: 'Teddy Byron',
    defaultDescription: 'A cellular automaton simulator.',
    siteUrl: 'https://teds.netlify.app',
    referrer: 'no-referrer-when-downgrade',
    colorScheme: 'only dark'
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: 'https://teds.netlify.app',
        stripQueryString: true
      }
    },
    {
      resolve: 'gatsby-plugin-html-attributes',
      options: {
        lang: 'en'
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Golem',
        short_name: 'Golem',
        description: 'A cellular automaton simulator.',
        lang: 'en',
        display: 'minimal-ui',
        start_url: '/',
        background_color: '#212121',
        theme_color: '#ffd600',
        icon: 'src/images/favicon.png'
      }
    },
    'gatsby-plugin-netlify',
    'gatsby-plugin-offline',
    'gatsby-plugin-preload-fonts',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-purgecss',
      options: {
        whitelist: ['___gatsby', 'gatsby-focus-wrapper']
      }
    }
  ]
}
