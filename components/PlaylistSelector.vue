<template>
  <v-dialog ref="dialog" v-model="dialogPlaylistPicker" max-width="800px">
    <v-card>
      <v-card-title><h1 class="display-2">Choose a playlist</h1></v-card-title>

      <v-card-text>
        <LoaderCircular v-if="loading" />

        <p v-if="playlists.length === 0">
          You have not created any playlist. Please create a new one before
          adding tracks to it.<br />
          <v-btn to="playlists" color="primary">Create a playlist</v-btn>
        </p>

        <v-list
          v-if="playlists.length > 0"
          three-line
          subheader
          style="max-height: 500px"
          class="overflow-y-auto"
        >
          <v-list-item-group color="primary">
            <v-list-item
              v-for="playlist in playlists"
              :key="playlist._id"
              @click="addToPlaylist(playlist._id)"
            >
              <v-list-item-action>
                <v-icon>mdi-playlist-music</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ playlist.name }}</v-list-item-title>
                <v-list-item-subtitle v-if="playlist.countTracks"
                  >{{ playlist.countTracks }} tracks</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card-text>
    </v-card>
    <v-btn ref="monBouton" @click="closeDialog()" color="primary">Close</v-btn>
  </v-dialog>
</template>

<script>
import { playlistService } from '@/services/playlistService'
import LoaderCircular from '@/components/LoaderCircular'

export default {
  components: {
    LoaderCircular
  },
  data() {
    return {
      playlists: [],
      loading: false,
      dialogPlaylistPicker: false,
      currentUser: this.$store.getters['authApp/getUser'],
      tracks: []
    }
  },
  async mounted() {
    this.$bus.$on('openDialogPlaylistPicker', (tracks) => {
      this.dialogPlaylistPicker = true
      this.tracks = tracks
    })

    this.loading = true
    const reqPlaylists = await playlistService.getPlaylists(
      this.currentUser.id,
      this.currentUser.token
    )

    this.playlists = reqPlaylists.data.playlists
    this.loading = false
  },
  methods: {
    closeDialog() {
      this.dialogPlaylistPicker = false
    },
    async addToPlaylist(playlistId) {
      const result = await playlistService.addTracks(
        playlistId,
        this.tracks,
        this.currentUser.token
      )

      if (result) {
        this.$bus.$emit('flashMessage', {
          message: 'Tracks has been added to your playlist',
          status: 'success'
        })
      }

      this.closeDialog()
    }
  }
}
</script>

<style lang="scss" scoped></style>
