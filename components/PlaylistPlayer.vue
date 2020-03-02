<template>
  <div class="">
    <script
      v-if="user.spotify"
      src="https://sdk.scdn.co/spotify-player.js"
    ></script>
    <div
      v-if="display"
      tabindex="-1"
      class="v-dialog__content v-dialog__content--active"
      style="z-index: 202; height:auto; bottom:0"
    >
      <div
        class="v-dialog v-bottom-sheet v-bottom-sheet--inset v-dialog--active v-dialog--persistent"
      >
        <v-list dark>
          <v-list-item>
            <v-list-item-icon>
              <v-btn @click="close()" color="primary">Close</v-btn>
            </v-list-item-icon>
            <v-list-item-content v-if="currentTrack">
              <v-slider
                v-model="playingPosition"
                v-if="user && user.spotify"
                @click="changeTiming()"
                :max="duration"
                min="0"
                track-color="primary"
              ></v-slider>

              <v-list-item-title>{{ currentTrack.name }}</v-list-item-title>

              <v-list-item-subtitle
                ><span
                  v-for="(artist, index) in currentTrack.artists"
                  :key="index"
                  >{{ artist.name }}
                </span></v-list-item-subtitle
              >
            </v-list-item-content>

            <v-spacer></v-spacer>

            <v-list-item-icon>
              <v-btn @click="previous()" icon>
                <v-icon>mdi-skip-previous</v-icon>
              </v-btn>
            </v-list-item-icon>

            <v-list-item-icon>
              <v-btn v-if="!isPlaying" @click="undoPause()" value="favorites">
                <v-icon>mdi-play-circle-outline</v-icon>
              </v-btn>
              <v-btn v-if="isPlaying" @click="pause()" value="favorites">
                <v-icon>mdi-pause-circle-outline</v-icon>
              </v-btn>
            </v-list-item-icon>

            <v-list-item-icon class="ml-0">
              <v-btn
                v-if="currentTrackPosition + 1 < playlist.length"
                @click="next()"
                icon
              >
                <v-icon>mdi-skip-next</v-icon>
              </v-btn>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </div>
    </div>
    <vue-plyr ref="bottomPlayer" class="hide">
      <audio>
        <source :src="playTrack" type="audio/mp3" />
      </audio>
    </vue-plyr>
  </div>
</template>

<script>
import { spotifyConnexionService } from '@/services/spotifyConnexion'
export default {
  data() {
    return {
      display: false,
      playlist: null,
      playTrack: null,
      playerComponentRef: null,
      currentTrackPosition: 0,
      currentTrack: null,
      isPlaying: false,
      user: this.$store.getters['authApp/getUser'],
      accessToken: this.$store.getters['authSpotify/getToken'],
      spotifyPlayer: null,
      mode: 'classic',
      timing: 0,
      playingPosition: 0,
      duration: 0
    }
  },
  computed: {
    player() {
      const playerRef = 'bottomPlayer'
      const domRefPlayer = this.$refs[playerRef].player
      return domRefPlayer
    }
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'authSpotify/SET_TOKEN') {
        this.accessToken = state.authSpotify.token
      }
    })
  },

  mounted() {
    if (this.user.spotify) this.initiatePlayerSpotifyPlayer()

    this.$bus.$on('playlistPlayer', (params) => {
      this.display = true
      this.playlist = params.playlist
      this.playTrack = this.playlist[0].preview_url
      this.isPlaying = true
      this.currentTrackPosition = 0
      if (this.user.spotify && this.accessToken) {
        this.mode = 'spotify'
        this.playSpotifyPlayer(this.playlist[this.currentTrackPosition])
        this.watchSpotifyWebPlayer()
      } else {
        this.mode = 'classic'
        this.playClassicPlayer(this.playlist[this.currentTrackPosition])
        this.initClassicPlaylist()
      }
    })

    setInterval(() => {
      this.refreshTiming()
    }, 1000)
  },
  methods: {
    watchSpotifyWebPlayer() {
      this.spotifyPlayer.addListener('player_state_changed', (state) => {
        if (
          this.state &&
          !this.state.paused &&
          state.paused &&
          state.restrictions.disallow_resuming_reasons &&
          state.restrictions.disallow_resuming_reasons[0] === 'not_paused' &&
          this.currentTrack &&
          this.isPlaying === true
        ) {
          this.next()
        }
        this.state = state
      })
    },
    refreshTiming(conext) {
      if (this.spotifyPlayer) {
        this.spotifyPlayer.addListener('player_state_changed', (state) => {
          this.duration = state.duration
          this.playingPosition = state.position
        })

        if (this.isPlaying) this.playingPosition = this.playingPosition + 1000
      }
    },
    initClassicPlaylist() {
      const playerComponentRef = this.player

      playerComponentRef.on('ended', (event) => {
        this.next()
      })
    },
    changeTiming() {
      this.spotifyPlayer.seek(this.playingPosition)
    },
    close() {
      this.display = false

      if (this.mode === 'spotify') {
        this.spotifyPlayer.pause()
      } else {
        const playerComponentRef = this.player
        playerComponentRef.pause()
      }

      this.$bus.$emit('playingTrack', {
        trackId: ''
      })

      this.isPlaying = false
    },
    pause() {
      if (this.mode === 'spotify') {
        this.spotifyPlayer.pause()
      } else {
        const playerComponentRef = this.player
        playerComponentRef.pause()
      }
      this.isPlaying = false
    },
    undoPause() {
      if (this.mode === 'spotify') {
        this.spotifyPlayer.resume()
      } else {
        const playerComponentRef = this.player
        playerComponentRef.play()
      }
      this.isPlaying = true
    },
    next() {
      this.position = 0
      console.log({
        'position+1': this.currentTrackPosition + 1,
        length: this.playlist.length
      })
      if (this.currentTrackPosition + 1 < this.playlist.length) {
        this.currentTrackPosition++
        this.mode === 'classic'
          ? this.playClassicPlayer(this.playlist[this.currentTrackPosition])
          : this.playSpotifyPlayer(this.playlist[this.currentTrackPosition])
        this.isPlaying = true
      } else {
        this.close()
      }
    },
    previous() {
      this.position = 0
      if (this.currentTrackPosition - 1 >= 0) {
        this.currentTrackPosition--
        this.mode === 'classic'
          ? this.playClassicPlayer(this.playlist[this.currentTrackPosition])
          : this.playSpotifyPlayer(this.playlist[this.currentTrackPosition])
        this.isPlaying = true
      }
    },
    eventIsPlaying(id) {
      this.$bus.$emit('playingTrack', {
        trackId: id
      })
    },
    playClassicPlayer(track) {
      const playerComponentRef = this.player
      playerComponentRef.source = this.setSource(track)
      playerComponentRef.on('ready', (event) => {
        playerComponentRef.play()
      })
      this.isPlaying = true
      this.currentTrack = track
      this.eventIsPlaying(track.id)
    },
    async playSpotifyPlayer(track) {
      this.isPlaying = true
      const urlSpotify = `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`

      const body = JSON.stringify({
        uris: [track.uri]
      })

      const headersApi = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`
      }

      this.currentTrack = track
      this.eventIsPlaying(track.id)
      this.isPlaying = true

      const responseFromSpotify = await this.$axios.put(urlSpotify, body, {
        headers: headersApi
      })

      return responseFromSpotify
    },
    setSource(track) {
      return {
        type: 'audio',
        sources: [
          {
            src: track.preview_url,
            type: 'audio/mp3'
          }
        ]
      }
    },
    waitForSpotifyWebPlaybackSDKToLoad() {
      return new Promise((resolve) => {
        if (window.Spotify) {
          resolve(window.Spotify)
        } else {
          window.onSpotifyWebPlaybackSDKReady = () => {
            resolve(window.Spotify)
          }
        }
      })
    },
    async initiatePlayerSpotifyPlayer() {
      const { Player } = await this.waitForSpotifyWebPlaybackSDKToLoad()

      if (!this.accessToken) {
        this.accessToken = await spotifyConnexionService.refreshTokenFromSpotify(
          this.user.refreshToken
        )
      }
      const token = this.accessToken

      const sdk = new Player({
        name: 'TandaFuria',
        volume: 1.0,
        getOAuthToken: (callback) => {
          callback(token)
        }
      })

      this.spotifyPlayer = sdk
      // console.log('player', this.spotifyPlayer)
      // Error handling
      sdk.addListener('initialization_error', ({ message }) => {
        // console.log('Initialization_error: ' + message)
      })
      sdk.addListener('authentication_error', ({ message }) => {
        // console.log('Authentication_error: ' + message)
      })
      sdk.addListener('account_error', ({ message }) => {
        // console.log('Account_error: ' + message)
      })
      sdk.addListener('playback_error', ({ message }) => {
        // console.log('Playback_error: ' + message)
      })
      // Playback status updates
      sdk.addListener('player_state_changed', (state) => {
        // Update UI information on player state changed
        //console.log('state changed')
      })
      // Ready
      sdk.addListener('ready', ({ device_id }) => {
        this.deviceId = device_id

        //console.log('Ready with Device Id: ', device_id)
      })
      // Not Ready
      sdk.addListener('not_ready', ({ device_id }) => {
        // console.log('Not ready with device Id: ', device_id)
      })
      sdk.connect()
    }
  }
}
</script>

<style lang="scss" scoped>
.hide {
  display: none;
}
</style>
