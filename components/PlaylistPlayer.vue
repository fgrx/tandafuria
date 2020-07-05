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
      >-->
      <div
        class="v-dialog v-dialog--active v-dialog--persistent v-bottom-sheet"
        style="margin-bottom:0"
      >
        <v-list dark>
          <v-row class="pa-2" dark>
            <v-col cols="3" sm="1">
              <v-btn @click="close()" color="primary">Close</v-btn>
            </v-col>
            <v-col cols="3" sm="1" class="d-none d-sm-flex">
              <v-img
                v-if="currentTrack && currentTrack.album"
                :src="currentTrack.album.images[1].url"
                class="img-player"
              ></v-img>
            </v-col>
            <v-col cols="6" sm="6">
              <v-slider
                v-model="playingPosition"
                @click="changeTiming()"
                :max="duration"
                min="0"
                track-color="primary"
              ></v-slider>
              <p v-if="currentTrack && !currentTrack.preview_url" class="error">
                No preview available
              </p>

              <v-list-item-title v-if="currentTrack">
                {{ currentTrack.name }}
                <span
                  v-for="(artist, index) in currentTrack.artists"
                  :key="index"
                  >- {{ artist.name }}</span
                >
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
              </div>
            </v-col>
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
import { spotifyConnexionService } from "@/services/spotifyConnexion"
import deviceMixin from "@/mixins/device"
import playerMixin from "@/mixins/player"

export default {
  mixins: [deviceMixin, playerMixin],

  data() {
    return {
      display: false,
      playlist: null,
      playTrack: null,
      playerComponentRef: null,
      currentTrackPosition: 0,
      volume: 100,
      currentTrack: {},
      isPlaying: false,
      user: this.$store.getters["authApp/getUser"],
      accessToken: "",
      spotifyPlayer: null,
      mode: "classic",
      timing: 0,
      playingPosition: 0,
      duration: 30000,
      sdk: null
    }
  },
  computed: {
    player() {
      const playerRef = "bottomPlayer"
      const domRefPlayer = this.$refs[playerRef].player
      return domRefPlayer
    }
  },
  head() {
    if (this.user.spotify) {
      return {
        script: [{ src: "https://sdk.scdn.co/spotify-player.js" }]
      }
    }
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "authSpotify/SET_TOKEN") {
        this.accessToken = state.authSpotify.token
      }
    })
  },

  mounted() {
    this.$bus.$on("playlistPlayer", async (params) => {
      this.display = true
      this.playlist = params.playlist
      this.playTrack = this.playlist[0].preview_url
      this.isPlaying = true
      this.currentTrackPosition = 0
      this.playingPosition = 0
      this.position = 0
      this.accessToken = this.user.token

      let modeInStore = "classic"

      const device = this.$store.getters["authSpotify/getDeviceId"]

      device === "classic"
        ? (modeInStore = "classic")
        : (modeInStore = "spotify")

      if (this.user.spotify && this.accessToken && modeInStore !== "classic") {
        if (this.user.spotify && !this.tandaFuryPlayer) {
          const spotifyPlayersLoaded = await this.detectActualPlayers(
            this.user.refreshToken
          )

          if (this.user.refreshToken) {
            this.tandaFuryPlayer = this.findSpotifyPlayerInPlayersList(
              spotifyPlayersLoaded
            )
          }
        }
        this.mode = "spotify"
        this.playSpotifyPlayer(this.playlist[this.currentTrackPosition])
      } else {
        this.mode = "classic"
        this.playClassicPlayer(this.playlist[this.currentTrackPosition])
        this.initClassicPlaylist()
      }
    })

    setInterval(() => {
      this.refreshTiming()
    }, 1000)
  },
  methods: {
    refreshTiming(conext) {
      if (this.isPlaying) {
        if (this.isPlaying) this.playingPosition = this.playingPosition + 1000
        if (this.playingPosition >= this.duration + 1000) this.next()
        // console.log({ duration: this.duration, position: this.playingPosition })
      }
    },
    initClassicPlaylist() {
      const playerComponentRef = this.player

      playerComponentRef.on("ended", (event) => {
        this.next()
      })
    },
    async changeTiming() {
      if (this.mode === "spotify") {
        // this.spotifyPlayer.seek(this.playingPosition)
        const urlSpotify = `https://api.spotify.com/v1/me/player/seek?position_ms=${this.playingPosition}`

        const headersApi = {
          "Content-Type": "application/json",
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

      this.$bus.$emit("playingTrack", {
        trackId: ""
      })

      this.isPlaying = false
    },
    async pause() {
      if (this.mode === "spotify") {
        const urlSpotify = "https://api.spotify.com/v1/me/player/pause"

        const headersApi = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`
        }

        await this.$axios.put(urlSpotify, null, {
          headers: headersApi
        })
      } else {
        const playerComponentRef = this.player
        playerComponentRef.pause()
      }
      this.isPlaying = false
    },
    async undoPause() {
      if (this.mode === "spotify") {
        const urlSpotify = "https://api.spotify.com/v1/me/player/play"

        const headersApi = {
          "Content-Type": "application/json",
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
      if (this.mode === "spotify") {
        const urlSpotify = `https://api.spotify.com/v1/me/player/volume?volume_percent=${this.volume}`

        const headersApi = {
          "Content-Type": "application/json",
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
        this.mode === "classic"
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
        this.mode === "classic"
          ? this.playClassicPlayer(this.playlist[this.currentTrackPosition])
          : this.playSpotifyPlayer(this.playlist[this.currentTrackPosition])
        this.isPlaying = true
      } else {
        this.mode === "classic"
          ? this.playClassicPlayer(this.playlist[0])
          : this.playSpotifyPlayer(this.playlist[0])
        this.isPlaying = true
      }
    },
    eventIsPlaying(id) {
      this.$bus.$emit("playingTrack", {
        trackId: id
      })
    },
    playClassicPlayer(track) {
      this.playingPosition = 0
      const playerComponentRef = this.player
      playerComponentRef.source = this.setSource(track)
      playerComponentRef.on("ready", (event) => {
        playerComponentRef.play()
      })
      this.isPlaying = true
      this.currentTrack = track
      this.eventIsPlaying(track.id)
    },
    async playSpotifyPlayer(track) {
      this.isPlaying = true

      this.duration = track.duration_ms

      const deviceChoosen = this.$store.getters["authSpotify/getDeviceId"]

      const deviceToLaunch = this.tandaFuryPlayer
        ? this.tandaFuryPlayer.id
        : deviceChoosen

      // console.log({
      //   player: this.tandaFuryPlayer,
      //   devicechoosen: deviceChoosen
      // })

      const urlSpotify = `https://api.spotify.com/v1/me/player/play?device_id=${deviceToLaunch}`

      const body = JSON.stringify({
        uris: [track.uri]
      })

      await this.renewSpotifyToken()

      const headersApi = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`
      }

      this.currentTrack = track
      this.eventIsPlaying(track.id)
      this.isPlaying = true

      let responseFromSpotify = await this.$axios.put(urlSpotify, body, {
        headers: headersApi
      })

      if (
        responseFromSpotify.status === 401 ||
        responseFromSpotify.status === 403 ||
        responseFromSpotify.status === 404
      ) {
        const headersApi = {
          "Content-Type": "application/json",
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

      this.accessToken = newToken
      this.$store.dispatch("authSpotify/setToken", newToken)
      this.$cookies.get("access_token", newToken)
    },
    setSource(track) {
      return {
        type: "audio",
        sources: [
          {
            src: track.preview_url,
            type: "audio/mp3"
          }
        ]
      }
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

.img-player {
  max-height: 80px;
  max-width: 80px;
  margin: none;
  padding: none;
}
</style>
