<template>
  <v-app light>
    <v-app-bar
      :clipped-left="clipped"
      color="transparent"
      flat
      absolute
      fixed
      class=""
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="d-lg-none" />

      <v-toolbar-title centered
        ><v-spacer></v-spacer>

        <img
          src="~/static/logo.png"
          alt="Tanda Furia"
          class="mt-8 mx-auto"
          height="40em"
          centered
      /></v-toolbar-title>

      <v-spacer></v-spacer>

      <div class="d-none d-lg-flex">
        <v-menu v-if="user.id" transition="slide-y-transition" bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" text color="primary" dark>
              <v-icon>mdi-account</v-icon>
              {{ user.nickname }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-btn outlined block color="primary" to="/manage-account"
                ><v-icon>mdi-account</v-icon>Manage your account</v-btn
              >
            </v-list-item>
            <v-list-item>
              <v-btn @click="logout()" outlined block color="primary"
                ><v-icon>mdi-logout</v-icon> Logout</v-btn
              >
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn
          v-if="!user.id"
          to="create-account"
          outlined
          large
          color="primary"
          ><v-icon>mdi-account-plus</v-icon>Create your account</v-btn
        >&nbsp;

        <v-btn v-if="!user.id" to="signin" color="primary" outlined large
          ><v-icon>mdi-account-arrow-right</v-icon>Sign In</v-btn
        >
      </div>
    </v-app-bar>
    <v-content class="base">
      <v-navigation-drawer
        v-model="drawer"
        dark
        fixed
        app
        class="navigationDrawer"
      >
        <v-list>
          <v-list-item to="/">
            <v-list-item-action>
              <v-icon>mdi-home</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/all-tandas">
            <v-list-item-action>
              <v-icon>mdi-earth</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>All Tandas</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="user.id" to="/my-tandas">
            <v-list-item-action>
              <v-icon>mdi-library-music</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>My Tandas</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/about">
            <v-list-item-action>
              <v-icon>mdi-information-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>About</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            ><v-btn :to="{ name: 'tanda-editor' }" block color="primary"
              >+ Create a tanda</v-btn
            ></v-list-item
          >

          <v-list-item v-if="!user.id" class="d-flex d-lg-none">
            <v-btn block to="signin" color="primary" text large
              ><v-icon>mdi-account-arrow-right</v-icon>Sign In</v-btn
            >
          </v-list-item>

          <v-list-item v-if="!user.id" class="d-flex d-lg-none">
            <v-btn block to="create-account" text large color="primary"
              ><v-icon>mdi-account-plus</v-icon>Create your account</v-btn
            >
          </v-list-item>

          <div class="d-flex d-lg-none">
            <v-menu v-if="user.id" transition="slide-y-transition" bottom>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" text color="primary" block dark>
                  <v-icon>mdi-account</v-icon> {{ user.nickname }}
                </v-btn>
              </template>
              <v-list>
                <v-list-item class="d-flex d-lg-none">
                  <v-btn text block color="primary" to="/manage-account"
                    ><v-icon>mdi-account</v-icon>Manage your account</v-btn
                  >
                </v-list-item>
                <v-list-item class="d-flex d-lg-none">
                  <v-btn @click="logout()" text block color="primary"
                    ><v-icon>mdi-logout</v-icon> Logout
                    {{ user.nickname }}</v-btn
                  >
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </v-list>
      </v-navigation-drawer>

      <v-snackbar v-model="flash.display" :color="flash.color">
        <v-icon>{{ flash.icon }}</v-icon
        >{{ flash.message }}
        <v-btn @click="snackbar = false" text>
          Close
        </v-btn>
      </v-snackbar>

      <v-container fluid>
        <nuxt />
      </v-container>
      <PlaylistPlayer />
    </v-content>
  </v-app>
</template>

<script>
import { userService } from '@/services/users.service'
import PlaylistPlayer from '~/components/PlaylistPlayer'

export default {
  components: {
    PlaylistPlayer
  },
  middleware: ['initializeAppData'],
  data() {
    return {
      clipped: false,
      drawer: !this.$vuetify.breakpoint.mdAndDown,
      fixed: false,
      user: this.$store.getters['authApp/getUser'],
      device: null,
      accessToken: this.$store.getters['authSpotify/getToken'],
      flash: { message: '', display: false, icon: 'mdi-check-circle-outline' },
      flashMessage: false,
      textFlashMessage: '',
      items: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/'
        },
        {
          icon: 'mdi-earth',
          title: 'All tandas',
          to: '/all-tandas'
        },
        {
          icon: 'mdi-library-music',
          title: 'My tandas',
          to: '/my-tandas'
        },
        {
          icon: 'mdi-information-outline',
          title: 'About',
          to: '/about'
        }
      ],
      miniVariant: false,
      title: 'TandaFuria',
      subtitle: 'The tanda creation tool'
    }
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'authSpotify/SET_TOKEN') {
        this.accessToken = state.authSpotify.token
      }
    })
  },
  async mounted() {
    const code = this.$route.query.code
    const state = this.$route.query.state
    if (code) {
      await this.initializeSpotifyTokens(code, state)
    }

    this.$bus.$on('flashMessage', (params) => {
      this.displayFlashMessage(params.message, params.status)
    })

    //refresh user infos if credentials are too old
    try {
      if (this.user.token) await userService.getUser(this.user)
    } catch (e) {
      this.$router.replace({ path: 'signin' })
    }
  },
  methods: {
    logout() {
      userService.logout()
      this.$store.dispatch('authApp/clearUser')
      document.location.href = '/'
    },
    async initializeSpotifyTokens(code, state) {
      const resultTokensFromSpotify = await this.getTokenFromSpotify(
        code,
        state
      )

      if (resultTokensFromSpotify.accessToken)
        this.memorizeTokenFromSpotify(resultTokensFromSpotify)
    },
    async getTokenFromSpotify(code, state) {
      const serverUrl =
        process.env.NODE_ENV === 'development'
          ? process.env.DEV_serverUrl
          : process.env.PROD_serverUrl
      const resultSpotify = await this.$axios.get(
        `${serverUrl}/spotify/callback/${code}?state=${state}`
      )

      const tokens = {
        accessToken: resultSpotify.data.access_token,
        refreshToken: resultSpotify.data.refresh_token
      }

      return tokens
    },
    async memorizeTokenFromSpotify(resultTokensFromSpotify) {
      await this.$store.dispatch(
        'authSpotify/setToken',
        resultTokensFromSpotify.accessToken
      )
      localStorage.setItem('access_token', resultTokensFromSpotify.accessToken)

      await this.$store.dispatch(
        'authSpotify/setRefreshToken',
        resultTokensFromSpotify.refreshToken
      )
      localStorage.setItem(
        'refresh_token',
        resultTokensFromSpotify.refreshToken
      )

      const userUpdated = JSON.parse(JSON.stringify(this.user))
      userUpdated.refreshToken = resultTokensFromSpotify.refreshToken

      await userService.updateUser(userUpdated, this.user.token)
    },
    displayFlashMessage(message, status) {
      const color = status === 'success' ? 'primary' : 'info'
      this.flash = {
        color,
        message,
        display: true,
        icon: 'mdi-check-circle-outline'
      }
    }
  }
}
</script>

<style lang="scss">
h1,
h2,
h3 {
  color: #4527a0;
  font-family: 'Overpass' !important;
}
</style>
