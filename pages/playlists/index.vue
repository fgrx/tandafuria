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
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="name"
              label="Playlist name"
              placeholder="example : My awesome milonga"
              :rules="[(v) => !!v || 'A playlist name is required']"
            ></v-text-field>
            <v-textarea
              v-model="description"
              label="Description"
              placeholder="Give a few words about your playlist"
              rows="4"
            ></v-textarea>
            <v-card-actions>
              <v-btn
                @click="createPlaylistAction()"
                :disabled="!valid"
                color="primary"
                >Create Playlist</v-btn
              >
              <v-btn ref="monBouton" @click="closeAction()">Back</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-content>
</template>

<script>
import { playlistService } from '@/services/playlistService'
export default {
  data() {
    return {
      dialogPlaylist: false,
      name: '',
      description: '',
      valid: true,
      currentUser: this.$store.getters['authApp/getUser'],
      playlists: null
    }
  },
  async mounted() {
    const reqPlaylists = await playlistService.getPlaylists(
      this.currentUser.id,
      this.currentUser.token
    )

    this.playlists = reqPlaylists.data
  },
  methods: {
    openDialogAction() {
      this.dialogPlaylist = true
    },
    closeAction() {
      this.dialogPlaylist = false
    },
    async createPlaylistAction() {
      const playlist = {
        name: this.name,
        description: this.description
      }
      const newPlaylist = await playlistService.save(
        playlist,
        this.currentUser.token
      )

      console.log(newPlaylist)
    }
  }
}
</script>

<style lang="scss" scoped></style>
