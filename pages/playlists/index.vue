<template>
  <v-content>
    <h1>Playlists</h1>
    <v-btn @click="openDialogAction()" color="primary" large
      >+ New playlist</v-btn
    >

    <v-dialog ref="dialog" v-model="dialogPlaylist" max-width="800px">
      <v-card>
        <v-card-title><h1>New Playlist</h1></v-card-title>

        <v-card-text>
          <form action="">
            <v-text-field
              v-model="playlistName"
              label="Playlist name"
              placeholder="example : My awesome milonga"
            ></v-text-field>
            <v-btn @click="createPlaylistAction()" color="primary"
              >Create Playlist</v-btn
            >
            <v-btn ref="monBouton" @click="closeAction()">Close</v-btn>
          </form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-content>
</template>

<script>
export default {
  data() {
    return {
      dialogPlaylist: false,
      playlistName: ''
    }
  },
  methods: {
    openDialogAction() {
      this.dialogPlaylist = true
    },
    closeAction() {
      this.dialogPlaylist = false
    },
    createPlaylistAction() {}
  }
}
</script>

<style lang="scss" scoped></style>
