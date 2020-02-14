<template>
  <v-app dark>
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
      <v-toolbar-title v-text="title" />
      <v-spacer></v-spacer>

      <div class="d-none d-lg-flex">
        <v-menu v-if="user.id" transition="slide-y-transition" bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" text color="secondary" dark>
              <v-icon>mdi-account</v-icon>
              {{ user.nickname }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-btn text small color="secondary" to="/manage-account"
                ><v-icon>mdi-account</v-icon>Manage your account</v-btn
              >
            </v-list-item>
            <v-list-item>
              <v-btn @click="logout()" text small color="secondary"
                ><v-icon>mdi-logout</v-icon> Logout</v-btn
              >
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn v-if="!user.id" to="create-account" text large color="secondary"
          ><v-icon>mdi-account-plus</v-icon>Create your account</v-btn
        >

        <v-btn v-if="!user.id" to="signin" color="secondary" text large
          ><v-icon>mdi-account-arrow-right</v-icon>Sign In</v-btn
        >
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" fixed app>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title v-text="title" class="title">
            </v-list-item-title>
            <v-list-item-subtitle v-text="subtitle"> </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>

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
          <v-btn block to="signin" color="secondary" text large
            ><v-icon>mdi-account-arrow-right</v-icon>Sign In</v-btn
          >
        </v-list-item>

        <v-list-item v-if="!user.id" class="d-flex d-lg-none">
          <v-btn block to="create-account" text large color="secondary"
            ><v-icon>mdi-account-plus</v-icon>Create your account</v-btn
          >
        </v-list-item>

        <div class="d-flex d-lg-none">
          <v-menu v-if="user.id" transition="slide-y-transition" bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" text color="secondary" block dark>
                <v-icon>mdi-account</v-icon> {{ user.nickname }}
              </v-btn>
            </template>
            <v-list>
              <v-list-item class="d-flex d-lg-none">
                <v-btn text small color="secondary" to="/manage-account"
                  ><v-icon>mdi-account</v-icon>Manage your account</v-btn
                >
              </v-list-item>
              <v-list-item class="d-flex d-lg-none">
                <v-btn @click="logout()" text small color="secondary"
                  ><v-icon>mdi-logout</v-icon> Logout {{ user.nickname }}</v-btn
                >
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-list>
    </v-navigation-drawer>

    <SpotifyPlayer v-if="user.spotify && accessToken" />
    <v-content>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
// import { mapState } from 'vuex'
import SpotifyPlayer from '~/components/SpotifyPlayer'
import { userService } from '@/services/users.service'

export default {
  components: {
    SpotifyPlayer
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
      const resultSpotify = await this.$axios.get(
        `https://tandafuria.herokuapp.com/spotify/callback/${code}?state=${state}`
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
    }
  }
}
</script>
