<template>
  <div>
    <v-bottom-navigation
      fixed
      dark
      color="pink accent-2"
      background-color="navigationDrawer"
      class="d-lg-none"
    >
      <v-btn :to="{ name: 'tango-orchestras' }" value="tango-orchestras">
        <span>Orchestras</span>
        <v-icon>mdi-account-group</v-icon>
      </v-btn>

      <v-btn to="/all-tandas" value="all-tandas">
        <span>All tandas</span>
        <v-icon>mdi-music</v-icon>
      </v-btn>

      <v-btn v-if="user.id" to="/my-tandas" color="" value="my-tandas">
        <span>My Tandas</span>
        <v-icon>mdi-music</v-icon>
      </v-btn>

      <v-btn to="/playlists/all-playlists" value="playlists/all-playlists">
        <span>All playlists</span>
        <v-icon>mdi-playlist-music</v-icon>
      </v-btn>

      <v-btn
        v-if="user.id"
        to="/playlists/my-playlists"
        color=""
        value="playlists/my-playlists"
      >
        <span>My Playlists</span>
        <v-icon>mdi-playlist-music</v-icon>
      </v-btn>

      <v-btn v-if="!user.id" to="/signin" color="" value="signin">
        <span>Account</span>
        <v-icon>mdi-account-arrow-right</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
}
</script>

<style lang="scss" scoped></style>
