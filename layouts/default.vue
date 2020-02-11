<template>
  <v-app dark>
    <v-app-bar :clipped-left="clipped" absolute fixed class="" app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="d-lg-none" />
      <v-toolbar-title v-text="title" />
      <v-spacer></v-spacer>

      <div class="d-none d-lg-flex">
        <v-menu v-if="user.id" transition="slide-y-transition" bottom>
          <template v-slot:activator="{ on }">
            <v-btn text color="secondary" dark v-on="on">
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
              <v-btn text small color="secondary" @click="logout()"
                ><v-icon>mdi-logout</v-icon> Logout {{ user.nickname }}</v-btn
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
          ><v-btn block="true" :to="{ name: 'tanda-editor' }" color="primary"
            >+ Create a tanda</v-btn
          ></v-list-item
        >

        <v-list-item v-if="!user.id" class="d-flex d-lg-none">
          <v-btn block="true" to="signin" color="secondary" text large
            ><v-icon>mdi-account-arrow-right</v-icon>Sign In</v-btn
          >
        </v-list-item>

        <v-list-item v-if="!user.id" class="d-flex d-lg-none">
          <v-btn block="true" to="create-account" text large color="secondary"
            ><v-icon>mdi-account-plus</v-icon>Create your account</v-btn
          >
        </v-list-item>

        <div class="d-flex d-lg-none">
          <v-menu v-if="user.id" transition="slide-y-transition" bottom>
            <template v-slot:activator="{ on }">
              <v-btn text color="secondary" block="true" dark v-on="on">
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
                <v-btn text small color="secondary" @click="logout()"
                  ><v-icon>mdi-logout</v-icon> Logout {{ user.nickname }}</v-btn
                >
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-content>

    <SpotifyPlayer />
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
  mounted() {},
  methods: {
    logout() {
      userService.logout()
      this.$store.dispatch('authApp/clearUser')
      document.location.href = '/'
    }
  }
}
</script>
