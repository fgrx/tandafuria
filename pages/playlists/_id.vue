<template>
  <v-flex>
    <loader v-if="loading" />
    <v-card v-if="playlist" class="mx-auto mb-4 mt-4" max-width="850">
      <v-card-title>
        <h1 class="display-1 text--primary">{{ playlist.name }}</h1>
      </v-card-title>

      <v-card-subtitle v-if="playlist.author">
        <span v-if="playlist.isPublic">Public</span>
        <span v-if="!playlist.isPublic">Private</span> playlist by
        {{ playlist.author.name }}</v-card-subtitle
      >

      {{ playlist.description }}
      <v-card-text>
        <v-btn v-if="tracks.length > 0" @click="play()" block
          ><v-icon>mdi-play</v-icon>Start playlist</v-btn
        >
      </v-card-text>

      <v-card-text v-if="tracks.length === 0">
        Your playlist doesn't have any track to play. Click on the button bellow
        to add your first one !
      </v-card-text>

      <draggable
        v-model="tracks"
        class="list-group"
        tag="ul"
        v-bind="dragOptions"
        @start="isDragging = true"
        @end="isDragging = false"
        handle=".handle"
      >
        <transition-group type="transition" name="flip-list">
          <div v-for="track in tracks" :key="track.id">
            <v-list-item
              :class="[
                { playing: track.id === trackPlaying },
                { isCortina: track.isCortina === true }
              ]"
              draggable
              three-line
              class="ml-n4"
            >
              <TrackItem :track="track" />

              <v-list-item-action>
                <v-btn class="handle" icon>
                  <v-icon color="grey lighten-1">mdi-drag-variant</v-icon>
                </v-btn>
                <v-btn @click="setAsCortina(track)" icon
                  ><v-icon>mdi-party-popper</v-icon>
                </v-btn>
                <v-btn @click="deleteTrack(track.id)" icon>
                  <v-icon color="danger">mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-divider></v-divider>
          </div>
        </transition-group>
      </draggable>
      <v-row v-if="playlist.author && currentUser.id === playlist.author.id">
        <v-col class="text-center">
          <v-btn @click="openSpotifyBrowser()" color="secondary">
            <v-icon>mdi-plus</v-icon>Add track
          </v-btn>
        </v-col>
      </v-row>

      <v-card-actions class="justify-center">
        <v-btn
          v-if="playlist.author && currentUser.id === playlist.author.id"
          @click="savePlaylist()"
          color="primary"
        >
          <v-icon>mdi-content-save</v-icon>Save
        </v-btn>
        <v-btn
          v-if="
            currentUser.spotify &&
              playlist.author &&
              currentUser.id === playlist.author.id
          "
          @click="savePlaylistSpotify()"
          color="secondary"
        >
          <v-icon>mdi-spotify</v-icon>Sync Spotify
        </v-btn>
        <v-btn @click="back"> back </v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog ref="dialog" v-model="dialogBrowserSpotify" max-width="800px">
      <SpotifyBrowser @clicked="addTrack" />

      <v-btn ref="monBouton" @click="browserClose" color="primary">Close</v-btn>
    </v-dialog>
  </v-flex>
</template>

<script>
import draggable from 'vuedraggable'
import { playlistService } from '@/services/playlistService'
import Loader from '@/components/Loader'
import SpotifyBrowser from '@/components/SpotifyBrowser'
import TrackItem from '~/components/TrackItem'

export default {
  components: {
    Loader,
    SpotifyBrowser,
    draggable,
    TrackItem
  },
  middleware: ['spotifyConnexion'],
  data() {
    return {
      playlist: {},
      loading: false,
      dialogBrowserSpotify: false,
      tracks: [],
      trackPlaying: '',
      currentUser: this.$store.getters['authApp/getUser'],
      modified: false
    }
  },
  async mounted() {
    this.loading = true
    const idPlaylist = this.$route.params.id
    const resultFindPlaylist = await playlistService.findOne(idPlaylist)
    this.playlist = resultFindPlaylist.data
    if (this.playlist.tracks) this.tracks = this.playlist.tracks
    this.loading = false

    this.$bus.$on('playingTrack', (idTrackPlaying) => {
      this.trackPlaying = idTrackPlaying.trackId
    })
  },
  beforeDestroy() {
    // if (this.modified) this.savePlaylist()
  },
  methods: {
    play() {
      const playlist = this.tracks
      this.$bus.$emit('playlistPlayer', {
        display: true,
        playlist
      })
    },
    openSpotifyBrowser() {
      this.dialogBrowserSpotify = true
      //this.initSpotifyBrowser()
    },
    browserClose() {
      this.dialogBrowserSpotify = false
    },
    addTrack(track) {
      this.tracks.push(track)
      this.browserClose()
      this.modified = true
    },
    back() {
      this.$router.back()
    },
    deleteTrack(trackId) {
      if (window.confirm('Do you really want to delete this track ?')) {
        const indexToDelete = this.tracks.findIndex(
          (track) => track.id === trackId
        )
        this.tracks.splice(indexToDelete, 1)
      }
    },
    setAsCortina(track) {
      this.tracks = this.tracks.map((trackItem) => {
        if (trackItem.id === track.id) {
          trackItem.isCortina
            ? (trackItem.isCortina = false)
            : (trackItem.isCortina = true)

          playlistService.setAsCortina(
            this.playlist._id,
            trackItem,
            this.currentUser.token
          )
        }
        return trackItem
      })
    },
    async savePlaylist() {
      this.playlist.tracks = this.tracks
      this.playlist.countTracks = this.tracks ? this.tracks.length : 0

      try {
        await playlistService.update(this.playlist, this.currentUser.token)

        this.$bus.$emit('flashMessage', {
          message: 'Your playlist has been saved',
          status: 'success'
        })
      } catch (e) {
        this.$bus.$emit('flashMessage', {
          message: 'An error has occured',
          status: 'error'
        })
      }
      this.modified = false
    },
    async savePlaylistSpotify() {
      let playlistSpotifyId = ''

      if (!this.playlist.spotifySync) {
        const resultCreationPlaylist = await playlistService.createPlaylistSpotify(
          this.playlist,
          this.currentUser
        )

        playlistSpotifyId = resultCreationPlaylist.data.id
        this.playlist.spotifySync = playlistSpotifyId
      } else {
        playlistSpotifyId = this.playlist.spotifySync
      }

      await playlistService.updatePlaylistSpotify(
        playlistSpotifyId,
        this.currentUser,
        this.tracks
      )

      this.savePlaylist()
    }
  }
}
</script>

<style lang="scss" scoped>
.playing {
  background: #e3cdf7;
}

.isCortina {
  background: #79f8e1;
}

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>
