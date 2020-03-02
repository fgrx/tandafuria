<template>
  <v-dialog
    ref="dialog"
    v-model="dialogPlaylistPicker"
    @input="initSpotifyBrowser()"
    max-width="800px"
  >
    <v-card>
      <v-card-title><h1 class="display-2">Select a playlist</h1></v-card-title>

      <v-card-text>
        <loader v-if="loading" />
        <v-list
          v-if="playlists.length > 0"
          two-line
          subheader
          style="max-height: 500px"
          class="overflow-y-auto"
        >
          <template v-for="(playlist, index) in playlists">
            {{ playlist.name }}
            <v-divider
              v-if="index + 1 < playlists.length"
              :key="index"
            ></v-divider>
          </template>
        </v-list>
      </v-card-text>
    </v-card>
    <v-btn ref="monBouton" @click="closeDialog()" color="primary">Close</v-btn>
  </v-dialog>
</template>

<script>
import { playlistService } from '@/services/playlistService'
import Loader from '@/components/Loader'

export default {
  components: {
    Loader
  },
  data() {
    return {
      playlists: [],
      loading: false,
      dialogPlaylistPicker: false,
      currentUser: this.$store.getters['authApp/getUser']
    }
  },
  async mounted() {
    this.loading = true
    const reqPlaylists = await playlistService.getPlaylists(
      this.currentUser.id,
      this.currentUser.token
    )

    this.playlists = reqPlaylists.data
    this.loading = false
  },
  methods: {
    closeDialog() {
      this.dialogPlaylistPicker = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
