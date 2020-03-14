<template>
  <v-layout>
    <v-flex>
      <v-card class="mx-auto mb-4 mt-4" max-width="850">
        <v-card-title>
          <h1>My playlists</h1>
        </v-card-title>

        <v-card-text>
          <LoaderCircular v-if="loading" />

          <v-card-title v-if="!loading"
            ><h2>{{ countPlaylists }} tandas</h2></v-card-title
          >

          <div
            v-for="(playlistItem, index) in playlists"
            :key="playlistItem._id"
          >
            <v-list-item>
              <v-list-item-icon
                ><v-btn
                  @click="editPlaylistAction(playlistItem)"
                  color="primary"
                  fab
                  x-small
                  dark
                  ><v-icon>mdi-pencil</v-icon></v-btn
                >
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title two-line class="headline mb-1">
                  <v-btn
                    :to="{
                      name: 'playlists-id',
                      params: { id: playlistItem._id }
                    }"
                    text
                    >{{ playlistItem.name }}</v-btn
                  >
                </v-list-item-title>

                <v-list-item-subtitle v-if="playlistItem.countTracks">
                  {{ playlistItem.countTracks }} tracks
                  <span v-if="playlistItem.isPublic"> - public playlist</span>
                  <span v-if="!playlistItem.isPublic"> - private playlist</span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider
              v-if="index + 1 < playlists.length"
              :key="index"
            ></v-divider>
          </div>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn @click="openDialogAction()" color="primary"
            >+ New playlist</v-btn
          >
          <v-btn
            v-if="user.spotify"
            @click="openDialogImportAction()"
            color="secondary"
            class="ml-4"
            ><v-icon>mdi-spotify</v-icon> Import Spotify</v-btn
          >
        </v-card-actions>
      </v-card>

      <v-dialog ref="dialog" v-model="dialogPlaylist" max-width="800px">
        <v-card>
          <v-card-title><h1>New Playlist</h1></v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="name"
                :rules="[(v) => !!v || 'A playlist name is required']"
                label="Playlist name"
                placeholder="example : My awesome milonga"
              ></v-text-field>
              <v-textarea
                v-model="description"
                label="Description"
                placeholder="Give a few words about your playlist"
                rows="4"
              ></v-textarea>
              <v-switch
                v-model="isPublic"
                class="ma-2"
                label="My playlist is public (other users will be able to see your playlist)"
              ></v-switch>
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

      <v-dialog ref="dialog" v-model="dialogPlaylistImport" max-width="800px">
        <v-card>
          <v-card-title><h1>Import a Spotify Playlist</h1></v-card-title>

          <v-list>
            <div
              v-for="playlistFromSpotify in usersPlaylistsFromSpotify"
              :key="playlistFromSpotify.id"
            >
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ playlistFromSpotify.name }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    @click="importPlaylistAction(playlistFromSpotify)"
                    color="primary"
                    small
                    ><v-icon>mdi-application-import</v-icon> Import</v-btn
                  >
                </v-list-item-action>
              </v-list-item>
              <v-divider></v-divider>
            </div>
          </v-list>

          <v-card-text>
            <v-card-actions>
              <v-btn @click="closeImportPlaylistAction()">Back</v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import { playlistService } from '@/services/playlistService'
import LoaderCircular from '@/components/LoaderCircular'

export default {
  middleware: ['spotifyConnexion'],
  components: {
    LoaderCircular
  },
  data() {
    return {
      dialogPlaylist: false,
      name: '',
      description: '',
      isPublic: true,
      playlist: {},
      valid: true,
      currentUser: this.$store.getters['authApp/getUser'],
      playlists: null,
      mode: 'create',
      user: this.$store.getters['authApp/getUser'],
      dialogPlaylistImport: false,
      loading: false,
      usersPlaylistsFromSpotify: [],
      countPlaylists: 0
    }
  },
  head() {
    return {
      title: 'Browse your playlists',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Welcome to the tango playlist editor. Create your own playlists and play it in milongas!'
        }
      ]
    }
  },
  async mounted() {
    this.loading = true
    const reqPlaylists = await playlistService.getPlaylists(
      this.currentUser.id,
      this.currentUser.token
    )

    const result = reqPlaylists.data

    this.playlists = result.playlists
    this.countPlaylists = result.countTotalResults

    this.loading = false
  },
  methods: {
    openDialogAction() {
      this.mode = 'create'
      this.dialogPlaylist = true
    },
    async openDialogImportAction() {
      const playlistsFromSpotify = await playlistService.getUserPlaylistsFromSpotify(
        this.user
      )

      this.usersPlaylistsFromSpotify = playlistsFromSpotify.data.items

      this.dialogPlaylistImport = true
    },

    closeAction() {
      this.dialogPlaylist = false
    },
    closeImportPlaylistAction() {
      this.dialogPlaylistImport = false
    },

    editPlaylistAction(playlist) {
      this.mode = 'edit'
      this.dialogPlaylist = true
      this.name = playlist.name
      this.description = playlist.description
      this.isPublic = playlist.isPublic
      this.playlist = playlist
    },
    saveEditAction() {
      this.playlist.name = this.name
      this.playlist.description = this.description
      this.playlist.isPublic = this.isPublic
      delete this.playlist.tracks

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
        description: this.description,
        isPublic: this.isPublic
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
    },
    async importPlaylistAction(playlistToImport) {
      const tracksData = await playlistService.getTrackFromSpotifyPlaylist(
        playlistToImport,
        this.currentUser
      )

      const tracks = []
      tracksData.data.items.forEach((trackItem) => tracks.push(trackItem.track))

      const playlist = {
        name: playlistToImport.name,
        description: playlistToImport.description,
        spotifySync: playlistToImport.id,
        countTracks: tracks.length,
        tracks
      }

      const newPlaylist = await playlistService.save(
        playlist,
        this.currentUser.token
      )

      newPlaylist.id = newPlaylist._id

      this.playlists.unshift(newPlaylist.data)

      this.closeImportPlaylistAction()
    }
  }
}
</script>

<style lang="scss" scoped></style>
