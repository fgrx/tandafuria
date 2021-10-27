import colors from "vuetify/es5/util/colors"

import axios from "axios"

import { orchestras } from "./data/orchestras"

const generateRoutes = async () => {
  const routes = []

  orchestras.forEach((orchestra) => {
    const route = [
      { url: "/tango-orchestras/" + orchestra.slug },
      { url: `/tango-orchestras/${orchestra.slug}/tango` },
      { url: `/tango-orchestras/${orchestra.slug}/vals` },
      { url: `/tango-orchestras/${orchestra.slug}/milonga` },
    ]
    routes.push(...route)
  })

  const urlApiTandas = "https://tandafuria.herokuapp.com/tandas/allId"
  const tandaIds = await axios.get(urlApiTandas)
  tandaIds.data.forEach((id) => {
    const route = { url: "/tanda/" + id }
    routes.push(route)
  })

  const urlApiPlaylists = "https://tandafuria.herokuapp.com/playlists/allId"
  const playlistsIds = await axios.get(urlApiPlaylists)
  playlistsIds.data.forEach((playlist) => {
    const route = { url: "/playlists/" + playlist._id }
    routes.push(route)
  })

  return routes
}

export default {
  /*
   ** Headers of the page
   */

  target: "static",
  generate: {
    fallback: true,
  },
  env: {
    //DEV_serverUrl: "http://localhost:4000",
    DEV_serverUrl: "https://tandafuria.herokuapp.com",
    PROD_serverUrl: "https://tandafuria.herokuapp.com",
    DEV_clientUrl: "http://localhost:3000",
    PROD_clientUrl: "https://tandafury.com",
    numberOfItemsToDisplay: 12,
  },
  head: {
    titleTemplate: "%s - " + process.env.npm_package_name,
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
      {
        name: "google-site-verification",
        content: "j0TfbxpdSM5_oV_dazaWsNkhoMZA4h6kER3KPBUCIvA",
      },
      { name: "theme-color", content: "#1A237E" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-touch-fullscreen", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
    ],
    // script: [{ src: ' https://sdk.scdn.co/spotify-player.js' }],
    link: [
      { rel: "shortcut icon", type: "image/x-icon", href: "/favicon.ico" },
      // apple
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/icons/apple-icon-180.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "167x167",
        href: "/icons/apple-icon-167.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "152x152",
        href: "/icons/apple-icon-152.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "120x120",
        href: "/icons/apple-icon-120.png",
      },
      {
        rel: "apple-touch-startup-image",
        href: "/splash/apple-splash-2048-2732.png",
        media:
          "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        rel: "apple-touch-startup-image",
        href: "/splash/apple-splash-1136-640.png",
        media:
          "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/draggable",
    "~/plugins/vue-plyr",
    "~/plugins/bus",
    "~/plugins/virtual-scroller",
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    "@nuxtjs/eslint-module",
    "@nuxtjs/vuetify",
    "@nuxtjs/moment",
  ],
  /*
   ** Nuxt.js modules
   */

  serverMiddleware: [
    // To redirect with heroku http -> https
    "redirect-ssl",
  ],
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    ["@bazzite/nuxt-netlify", {}],
    [
      "nuxt-twa-module",
      {
        /* module options */
        defaultUrl: "https://tandafury.com",
        hostName: "tandafury.com",
        applicationId: "com.tandayfury.tandafury",
        launcherName: "Tanda Fury",
        versionCode: 1,
        versionName: "1.0",
        statusBarColor: "#311B92",
        distFolder: "/.nuxt/dist/client",
        // The sha256Fingerprints by is an array with one SHA-256 key string.
        // But if you have multiple you can add them to the array. More information about the website asociation:
        // https://developer.android.com/training/app-links/verify-site-associations#web-assoc
        sha256Fingerprints: [
          "D8:D5:3D:55:78:44:4C:64:89:77:AC:E6:CD:83:85:1F:99:59:3D:75:B3:D5:BC:E0:43:79:B2:91:FF:0C:E3:6C",
        ],
        /* optional */
        iconPath: "/static/icon.png",
      },
    ],
    "@nuxtjs/axios",
    "@nuxtjs/pwa",
    "nuxt-clipboard2",
    "cookie-universal-nuxt",
    "nuxt-webfontloader",
    [
      "@nuxtjs/google-analytics",
      {
        id: "UA-141104841-3",
        // debug: {
        //   enabled: true,
        //   sendHitTask: true,
        //   trace: true
        // }
      },
    ],
    "@nuxtjs/sitemap",
  ],
  sitemap: {
    hostname: "https://tandafury.com",
    gzip: true,
    routes: generateRoutes,
  },
  pwa: {
    manifest: {
      name: "Tanda Fury",
      short_name: "TandaFury",
      lang: "en",
      description:
        "Discover new tango tandas, build your own and create your playlists",
      theme_color: "#1A237E",
      background_color: "#F2F2F2",
      ogImage: `http://tandafury.com/icon.png`,
    },
  },

  webfontloader: {
    google: {
      families: ["Fjalla One", "Overpass"],
    },
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
    customVariables: ["~/assets/variables.scss"],
    theme: {
      light: true,
      themes: {
        light: {
          navigationDrawer: colors.deepPurple.darken4,
          primary: colors.purple.lighten1,
          // navigationDrawer: colors.indigo.darken4,

          base: colors.blueGrey.lighten5,
          element: colors.white,

          accent: colors.grey.darken3,
          secondary: colors.cyan.lighten1,
          info: colors.teal.lighten1,
          warning: colors.red.lighten1,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? "source-map" : "inline-source-map"
      }
    },
  },
}
