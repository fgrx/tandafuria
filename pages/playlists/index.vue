<template>
  <v-layout>
    <v-flex>
      <v-card class="mx-auto mb-4 mt-4" max-width="850">
        <v-card-title>
          <h1>Playlists</h1>
          <v-spacer></v-spacer>
          <v-btn @click="openDialogAction()" color="primary" large
            >+ New playlist</v-btn
          >
        </v-card-title>

        <v-card-text>
          <div v-for="(playlist, index) in playlists" :key="playlist._id">
            <v-list-item>
              <v-list-item-icon
                ><v-btn
                  @click="editPlaylistAction(playlist)"
                  color="primary"
                  fab
                  x-small
                  dark
                  ><v-icon>mdi-pencil</v-icon></v-btn
                >
              </v-list-item-icon>
              <v-list-item-content
                :to="{ name: 'playlists-id', params: { id: playlist._id } }"
              >
                <v-list-item-title
                  :to="{ name: 'playlists-id', params: { id: playlist._id } }"
                  two-line
                  class="headline mb-1"
                >
                  <v-btn
                    :to="{
                      name: 'playlists-id',
                      params: { id: playlist._id }
                    }"
                    text
                    >{{ playlist.name }}</v-btn
                  >
                </v-list-item-title>

                <v-list-item-subtitle v-if="playlist.countTracks">
                  {{ playlist.countTracks }} tracks
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider
              v-if="index + 1 < playlists.length"
              :key="index"
            ></v-divider>
          </div>
        </v-card-text>
      </v-card>

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
                  v-if="mode === 'create'"
                  @click="createPlaylistAction()"
                  :disabled="!valid"
                  color="primary"
                  >Create Playlist</v-btn
                >
                <v-btn
                  v-if="mode === 'edit'"
                  @click="saveEditAction(playlist)"
                  :disabled="!valid"
                  color="primary"
                  >Save modifications</v-btn
                >
                <v-btn
                  v-if="mode === 'edit'"
                  @click="deleteAction()"
                  color="warning"
                  >Delete</v-btn
                >
                <v-btn @click="closeAction()">Back</v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import { playlistService } from '@/services/playlistService'
export default {
  data() {
    return {
      dialogPlaylist: false,
      name: '',
      description: '',
      playlist: {},
      valid: true,
      currentUser: this.$store.getters['authApp/getUser'],
      playlists: null,
      mode: 'create'
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
      this.mode = 'create'
      this.dialogPlaylist = true
    },
    closeAction() {
      this.dialogPlaylist = false
    },
    editPlaylistAction(playlist) {
      this.mode = 'edit'
      this.dialogPlaylist = true
      this.name = playlist.name
      this.description = playlist.description
      this.playlist = playlist
    },
    saveEditAction() {
      this.playlist.name = this.name
      this.playlist.description = this.description

      playlistService.update(this.playlist, this.currentUser.token)
      this.$bus.$emit('flashMessage', {
        message: 'Your playlist has been saved',
        status: 'success'
      })
      this.dialogPlaylist = false
    },
    deleteAction() {
      if (window.confirm('Do you really want to delete this playlist ?')) {
        playlistService.delete(this.playlist, this.currentUser.token)

        this.$bus.$emit('flashMessage', {
          message: 'Your playlist has been deleted',
          status: 'success'
        })

        this.playlists = this.playlists.filter(
          (playlist) => playlist._id !== this.playlist._id
        )
      }
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
      this.$bus.$emit('flashMessage', {
        message: 'Your playlist has been saved',
        status: 'success'
      })

      this.playlists.unshift(newPlaylist.data)
      this.dialogPlaylist = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
