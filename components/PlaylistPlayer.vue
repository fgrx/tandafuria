<template>
  <div class="playerGeneral">
    <div v-if="user.spotify" class="importCdn"></div>
    <client-only>
      <script
        v-if="user.spotify && !tandaFuryPlayer"
        src="https://sdk.scdn.co/spotify-player.js"
      ></script>
    </client-only>
    <div
      v-if="display"
      role="document"
      class="v-dialog__content v-dialog__content--active"
      style="top:auto;height:auto;bottom:0px;z-index:202;"
      tabindex="0"
    >
      <!-- <div
        class="v-dialog v-dialog--active v-dialog--persistent v-bottom-sheet v-bottom-sheet--inset"
        style="max-width:70%;margin-bottom:0"
      > -->
      <div
        class="v-dialog v-dialog--active v-dialog--persistent v-bottom-sheet"
        style="margin-bottom:0"
      >
        <v-list dark>
          <v-row class="pa-2" dark>
            <v-col cols="3" sm="1">
              <v-btn @click="close()" color="primary">Close</v-btn>
            </v-col>
            <v-col cols="9" sm="6">
              <v-slider
                v-model="playingPosition"
                @click="changeTiming()"
                :max="duration"
                min="0"
                track-color="primary"
              ></v-slider>
              <p v-if="!currentTrack.preview_url" class="error">
                No preview available
              </p>

              <v-list-item-title
                >{{ currentTrack.name }}
                <span
                  v-for="(artist, index) in currentTrack.artists"
                  :key="index"
                >
                  - {{ artist.name }}
                </span>
              </v-list-item-title>
            </v-col>
            <v-col>
              <v-slider
                v-model="volume"
                @click="changeVolume()"
                max="100"
                min="0"
                track-color="primary"
                class="volumeSlider"
                prepend-icon="mdi-volume-source"
              ></v-slider>
            </v-col>
            <v-col cols="6" sm="3">
              <div v-if="currentTrack" class="controls">
                <v-btn @click="previous()" icon>
                  <v-icon>mdi-skip-previous</v-icon>
                </v-btn>

                <v-btn v-if="!isPlaying" @click="undoPause()" value="favorites">
                  <v-icon>mdi-play-circle-outline</v-icon>
                </v-btn>
                <v-btn v-if="isPlaying" @click="pause()" value="favorites">
                  <v-icon>mdi-pause-circle-outline</v-icon>
                </v-btn>

                <v-btn
                  v-if="playlist && currentTrackPosition + 1 < playlist.length"
                  @click="next()"
                  icon
                >
                  <v-icon>mdi-skip-next</v-icon>
                </v-btn>
              </div></v-col
            >
          </v-row>
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
      volume: 100,
      currentTrack: null,
      isPlaying: false,
      user: this.$store.getters['authApp/getUser'],
      accessToken: this.$store.getters['authSpotify/getToken'],
      spotifyPlayer: null,
      mode: 'classic',
      timing: 0,
      playingPosition: 0,
      duration: 30000,
      sdk: null,
      tandaFuryPlayer: false
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

  async mounted() {
    if (this.user.refreshToken) {
      const spotifyPlayersLoaded = await this.detectActualPlayers()

      this.tandaFuryPlayer = spotifyPlayersLoaded.find(
        (player) => player.name === 'TandaFury'
      )
    }

    if (this.user.spotify && !this.tandaFuryPlayer)
      await this.initiatePlayerSpotifyPlayer()

    this.$bus.$on('playlistPlayer', (params) => {
      this.display = true
      this.playlist = params.playlist
      this.playTrack = this.playlist[0].preview_url
      this.isPlaying = true
      this.currentTrackPosition = 0
      this.playingPosition = 0
      this.position = 0

      let modeInStore = 'classic'

      const device = this.$store.getters['authSpotify/getDeviceId']

      device === 'classic'
        ? (modeInStore = 'classic')
        : (modeInStore = 'spotify')

      if (this.user.spotify && this.accessToken && modeInStore !== 'classic') {
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
      if (this.isPlaying) {
        if (this.isPlaying) this.playingPosition = this.playingPosition + 1000
        if (this.playingPosition >= this.duration + 1000) this.next()
        //console.log({ duration: this.duration, position: this.playingPosition })
      }
    },
    initClassicPlaylist() {
      const playerComponentRef = this.player

      playerComponentRef.on('ended', (event) => {
        this.next()
      })
    },
    async changeTiming() {
      if (this.mode === 'spotify') {
        //this.spotifyPlayer.seek(this.playingPosition)
        const urlSpotify = `https://api.spotify.com/v1/me/player/seek?position_ms=${this.playingPosition}`

        const headersApi = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`
        }

        const body = { position_ms: this.playingPosition }

        await this.$axios.put(urlSpotify, body, {
          headers: headersApi
        })
      } else {
        const playerComponentRef = this.player
        const position = Math.round(this.playingPosition / 1000)
        playerComponentRef.currentTime = position
      }
    },
    async close() {
      this.display = false
      this.position = 0
      this.playingPosition = 0
      this.isPlaying = false

      await this.pause()

      this.$bus.$emit('playingTrack', {
        trackId: ''
      })

      this.isPlaying = false
    },
    async pause() {
      if (this.mode === 'spotify') {
        //this.spotifyPlayer.pause()
        const urlSpotify = `https://api.spotify.com/v1/me/player/pause`

        const headersApi = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`
        }
        const body = { device_id: this.deviceId }
        await this.$axios.put(urlSpotify, body, {
          headers: headersApi
        })
      } else {
        const playerComponentRef = this.player
        playerComponentRef.pause()
      }
      this.isPlaying = false
    },
    async undoPause() {
      if (this.mode === 'spotify') {
        //this.spotifyPlayer.resume()
        const urlSpotify = `https://api.spotify.com/v1/me/player/play`

        const headersApi = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`
        }
        const body = { device_id: this.deviceId }
        await this.$axios.put(urlSpotify, body, {
          headers: headersApi
        })
      } else {
        const playerComponentRef = this.player
        playerComponentRef.play()
      }
      this.isPlaying = true
    },
    async changeVolume() {
      if (this.mode === 'spotify') {
        const urlSpotify = `https://api.spotify.com/v1/me/player/volume?volume_percent=${this.volume}`

        const headersApi = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`
        }

        const body = { device_id: this.deviceId, volume_percent: this.volume }

        await this.$axios.put(urlSpotify, body, {
          headers: headersApi
        })
      } else {
        const playerComponentRef = this.player
        playerComponentRef.volume = this.volume / 100
      }
    },
    next() {
      this.position = 0
      this.playingPosition = 0
      if (
        this.playlist &&
        this.currentTrackPosition + 1 < this.playlist.length
      ) {
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
      this.playingPosition = 0
      if (this.currentTrackPosition - 1 >= 0) {
        this.currentTrackPosition--
        this.mode === 'classic'
          ? this.playClassicPlayer(this.playlist[this.currentTrackPosition])
          : this.playSpotifyPlayer(this.playlist[this.currentTrackPosition])
        this.isPlaying = true
      } else {
        this.mode === 'classic'
          ? this.playClassicPlayer(this.playlist[0])
          : this.playSpotifyPlayer(this.playlist[0])
        this.isPlaying = true
      }
    },
    eventIsPlaying(id) {
      this.$bus.$emit('playingTrack', {
        trackId: id
      })
    },
    playClassicPlayer(track) {
      this.playingPosition = 0
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

      this.duration = track.duration_ms

      //If device_id bug appened, renew the device_id
      if (!this.deviceId) {
        const delay = (milliseconds) => {
          return new Promise((resolve) => setTimeout(resolve, milliseconds))
        }
        await this.initiatePlayerSpotifyPlayer()
        await delay(500)
      }

      const deviceChoosen = this.$store.getters['authSpotify/getDeviceId']

      let deviceToLaunch = this.deviceId
      if (deviceChoosen) deviceToLaunch = deviceChoosen

      const urlSpotify = `https://api.spotify.com/v1/me/player/play?device_id=${deviceToLaunch}`

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

      let responseFromSpotify = await this.$axios.put(urlSpotify, body, {
        headers: headersApi
      })

      this.renewSpotifyToken()

      if (
        responseFromSpotify.status === 401 ||
        responseFromSpotify.status === 403 ||
        responseFromSpotify.status === 404
      ) {
        const headersApi = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`
        }

        responseFromSpotify = await this.$axios.put(urlSpotify, body, {
          headers: headersApi
        })
      }

      return responseFromSpotify
    },
    async renewSpotifyToken() {
      const newToken = await spotifyConnexionService.refreshTokenFromSpotify(
        this.user.refreshToken
      )

      this.$store.dispatch('authSpotify/setToken', newToken)
      this.$cookies.get('access_token', newToken)
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
    async detectActualPlayers() {
      const token = await spotifyConnexionService.refreshTokenFromSpotify(
        this.user.refreshToken
      )
      const header = { headers: { Authorization: 'Bearer ' + token } }

      const serverUrl = 'https://api.spotify.com/v1'

      const url = `${serverUrl}/me/player/devices`

      try {
        const result = await this.$axios.get(url, header)

        return result.data.devices
      } catch (e) {
        alert('error, please try reloading the page', e)
      }
    },
    async initiatePlayerSpotifyPlayer() {
      const { Player } = await this.waitForSpotifyWebPlaybackSDKToLoad()

      if (!this.accessToken) {
        this.accessToken = await spotifyConnexionService.refreshTokenFromSpotify(
          this.user.refreshToken
        )
      }
      const token = this.accessToken

      this.sdk = new Player({
        name: 'TandaFury',
        volume: 1.0,
        getOAuthToken: (callback) => {
          callback(token)
        }
      })

      this.spotifyPlayer = this.sdk
      // console.log('player', this.spotifyPlayer)
      // Error handling
      this.sdk.addListener('initialization_error', ({ message }) => {
        // console.log('Initialization_error: ' + message)
      })
      this.sdk.addListener('authentication_error', ({ message }) => {
        // console.log('Authentication_error: ' + message)
      })
      this.sdk.addListener('account_error', ({ message }) => {
        // console.log('Account_error: ' + message)
      })
      this.sdk.addListener('playback_error', ({ message }) => {
        // console.log('Playback_error: ' + message)
      })
      // Playback status updates
      this.sdk.addListener('player_state_changed', (state) => {
        // Update UI information on player state changed
        //console.log('state changed')
      })
      // Ready
      this.sdk.addListener('ready', ({ device_id }) => {
        this.deviceId = device_id

        //console.log('Ready with Device Id: ', device_id)
      })
      // Not Ready
      this.sdk.addListener('not_ready', ({ device_id }) => {
        // console.log('Not ready with device Id: ', device_id)
      })
      this.sdk.connect()
    }
  }
}
</script>

<style lang="scss">
.hide {
  display: none;
}
.volumeSlider {
  max-width: 150px;
}

.volumeSlider {
  text-align: left;
}

.controls {
  text-align: right;
}
</style>
