module.exports = {
  siteMetadata: {
    defaultTitle: 'Golem',
    defaultAuthor: 'Teddy Byron',
    defaultDescription: 'A cellular automaton simulator written in Rust, compiled to WebAssembly, and rendered with PixiJS.',
    siteUrl: 'https://teds.netlify.app',
    referrer: 'no-referrer-when-downgrade',
    colorScheme: 'only dark',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: 'https://teds.netlify.app',
        stripQueryString: true,
      },
    },
    'gatsby-plugin-eslint',
    {
      resolve: 'gatsby-plugin-html-attributes',
      options: {
        lang: 'en',
      },
    },
    'gatsby-plugin-netlify',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Golem',
        short_name: 'Golem',
        description: 'A cellular automaton simulator written in Rust, compiled to WebAssembly, and rendered with PixiJS.',
        lang: 'en',
        display: 'minimal-ui',
        start_url: '/',
        background_color: '#212121',
        theme_color: '#ffd600',
        include_favicon: false,
      },
    },
    'gatsby-plugin-preload-fonts',
    {
      resolve: 'gatsby-plugin-purgecss',
      options: {
        whitelist: [
          '___gatsby',
          'gatsby-focus-wrapper',
        ],
      },
    },
    'gatsby-plugin-offline',
  ],
};
