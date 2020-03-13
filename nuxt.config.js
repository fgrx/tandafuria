import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  env: {
    DEV_serverUrl: 'http://localhost:4000',
    PROD_serverUrl: 'https://tandafuria.herokuapp.com',
    DEV_clientUrl: 'http://localhost:3000',
    PROD_clientUrl: 'https://tandafuria.com',
    numberOfItemsToDisplay: 12
  },
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    script: [],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/draggable', '~/plugins/vue-plyr', '~/plugins/bus'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/moment'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    ['@bazzite/nuxt-netlify', {}],
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'nuxt-clipboard2',
    'nuxt-webfontloader',
    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-141104841-2'
        // debug: {
        //   enabled: true,
        //   sendHitTask: true,
        //   trace: true
        // }
      }
    ],
    '@nuxtjs/sitemap'
  ],
  sitemap: {
    hostname: 'https://tandafuria.com'
  },
  webfontloader: {
    google: {
      families: ['Fjalla One', 'Overpass']
    }
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      light: true,
      themes: {
        light: {
          navigationDrawer: colors.deepPurple.darken4,
          primary: colors.purple.lighten1,
          //navigationDrawer: colors.indigo.darken4,

          base: colors.blueGrey.lighten5,
          element: colors.white,

          accent: colors.grey.darken3,
          secondary: colors.cyan.lighten1,
          info: colors.teal.lighten1,
          warning: colors.red.lighten1,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
