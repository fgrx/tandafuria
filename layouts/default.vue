<template>
  <v-app dark>
    <v-app-bar
      :clipped-left="clipped"
      absolute
      fixed
      class="d-none d-md-flex d-lg-none"
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title v-text="title" class="title">
            </v-list-item-title>
            <v-list-item-subtitle v-text="subtitle"> </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          ><v-btn to="/tandaEditor" color="primary"
            >+ New tanda</v-btn
          ></v-list-item
        >
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer app>
      <span
        ><a href="https://www.developpeurfullstack.fr">Fabien Grignoux</a></span
      >
    </v-footer>
    <SpotifyPlayer />
  </v-app>
</template>

<script>
import SpotifyPlayer from '~/components/SpotifyPlayer'
export default {
  components: {
    SpotifyPlayer
  },
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      title: 'TandaFuria',
      subtitle: 'A tanda creator tool'
    }
  }
}
</script>
