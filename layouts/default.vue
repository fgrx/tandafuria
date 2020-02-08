<template>
  <v-app dark>
    <v-app-bar
      :clipped-left="clipped"
      absolute
      fixed
      class="d-xs-flex d-lg-none"
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :clipped="clipped" fixed app>
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

        <v-list-item to="/my-tandas" v-if="user.id">
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
          ><v-btn :to="{ name: 'tandaEditor' }" color="primary"
            >+ Create a tanda</v-btn
          ></v-list-item
        >
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <v-container fluid>
        <p class="text-right">
          <v-btn v-if="user.id" text small color="secondary" @click="logout()"
            ><v-icon>mdi-logout</v-icon> Logout {{ user.nickname }}</v-btn
          >

          <v-btn v-if="!user.id" to="create-account" text large color="primary"
            ><v-icon>mdi-account-plus</v-icon>Create your account</v-btn
          >

          <v-btn v-if="!user.id" to="signin" color="primary" text large
            ><v-icon>mdi-account-arrow-right</v-icon>Sign In</v-btn
          >
        </p>

        <nuxt />
      </v-container>
    </v-content>

    <SpotifyPlayer />
  </v-app>
</template>

<script>
// import { mapState } from 'vuex'
import SpotifyPlayer from '~/components/SpotifyPlayer'

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
  // computed: {
  //   user() {
  //     return this.$store.getters['authApp/getUser']
  //   }
  // },
  mounted() {
    // this.user = this.$store.getters['authApp/getUser']
    console.log('user', this.user)
  },
  methods: {
    logout() {
      localStorage.clear()
      this.$store.dispatch('authApp/clearUser')
      document.location.href = '/'
    }
  }
}
</script>
