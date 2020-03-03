<template>
  <v-flex>
    <loader v-if="loading" />
    <v-card v-if="playlist" class="mx-auto mb-4 mt-4" max-width="850">
      <v-btn @click="openSpotifyBrowser()" absolute top right color="secondary">
        <v-icon>mdi-plus</v-icon>Add track
      </v-btn>

      <v-card-title>
        <h1 class="display-1 text--primary">{{ playlist.name }}</h1>
      </v-card-title>
      <v-card-text>
        <v-card-subtitle v-if="playlist.author"
          >Playlist by {{ playlist.author.name }}</v-card-subtitle
        >

        {{ playlist.description }}
        <v-card-text>
          <v-btn v-if="tracks.length" @click="play()" block
            ><v-icon>mdi-play</v-icon>Play tanda</v-btn
          >
        </v-card-text>
        <v-card-text v-if="!tracks.length">
          Your playlist doesn't have any track to play. Click on the button
          bellow to add your first one !
        </v-card-text>

        <draggable v-model="tracks">
          <transition-group>
            <div v-for="track in tracks" :key="track.id">
              <v-list-item
                :class="[
                  { playing: track.id === trackPlaying },
                  { isCortina: track.isCortina === true }
                ]"
                draggable
                two-line
              >
                <TrackItem :track="track" />
                <v-btn @click="setAsCortina(track)" text small
                  ><span v-if="!track.isCortina">Set as a cortina</span
                  ><span v-if="track.isCortina">unset cortina</span></v-btn
                >

                <v-list-item-action>
                  <v-btn icon>
                    <v-icon color="grey lighten-1">mdi-drag-variant</v-icon>
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
      </v-card-text>
      <v-card-actions>
        <v-btn @click="openSpotifyBrowser()" color="secondary">
          <v-icon>mdi-plus</v-icon>Add track
        </v-btn>
        <v-btn @click="savePlaylist()" color="primary">
          <v-icon>mdi-content-save</v-icon>Save the playlist
        </v-btn>
        <v-btn to="/playlists"> back </v-btn>
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
  data() {
    return {
      playlist: {},
      loading: false,
      dialogBrowserSpotify: false,
      tracks: [],
      trackPlaying: '',
      currentUser: this.$store.getters['authApp/getUser']
    }
  },
  async mounted() {
    this.loading = true
    const idPlaylist = this.$route.params.id
    const resultFindPlaylist = await playlistService.findOne(idPlaylist)
    this.playlist = resultFindPlaylist.data
    this.tracks = this.playlist.tracks
    this.loading = false

    this.$bus.$on('playingTrack', (idTrackPlaying) => {
      this.trackPlaying = idTrackPlaying.trackId
    })
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
      this.playlist.countTracks = this.tracks.length
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
</style>
