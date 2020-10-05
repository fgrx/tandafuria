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
      class="dialog__player v-dialog__content v-dialog__content--active"
      style="top:auto;height:auto;z-index:202;bottom:0px"
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
            <v-col cols="1" class="d-none d-md-flex">
              <v-img
                v-if="currentTrack && currentTrack.album"
                :src="currentTrack.album.images[1].url"
                class="img-player"
              ></v-img>
            </v-col>
            <v-col cols="7" sm="4">
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

              <v-slider
                v-model="playingPosition"
                @click="changeTiming()"
                :max="duration"
                v-if="
                  (currentTrack.preview_url && mode === 'classic') ||
                    mode !== 'classic'
                "
                min="0"
                track-color="primary"
              ></v-slider>
            </v-col>
            <v-col cols="5" sm="2">
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
                  v-if="
                    playlist &&
                      currentTrackPosition + 1 < playlist.tracks.length
                  "
                  @click="next()"
                  icon
                >
                  <v-icon>mdi-skip-next</v-icon>
                </v-btn>
              </div>
            </v-col>
            <v-col cols="3" sm="1">
              <v-btn @click="close()" color="primary">Close</v-btn>
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
import { spotifyService } from "@/services/spotify.service"
import deviceMixin from "@/mixins/device"
import playerMixin from "@/mixins/player"

export default {
  mixins: [deviceMixin, playerMixin],

  data() {
    return {
      display: false,
      playTrack: this.$store.state.player.trackPlaying,
      playerComponentRef: null,
      volume: 100,
      isPlaying: false,
      user: this.$store.getters["authApp/getUser"],
      accessToken: "",
      spotifyPlayer: null,
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
    },
    playlist() {
      return this.$store.state.player.playlistPlaying
    },
    currentTrack() {
      return this.$store.state.player.trackPlaying
    },
    currentTrackPosition() {
      return this.playlist.tracks.findIndex(
        (track) => track.id === this.currentTrack.id
      )
    },
    deviceId() {
      return this.$store.state.player.playerId
    },
    mode() {
      if (
        this.$store.state.player.playerId === "classic" ||
        this.$store.state.player.playerId == null ||
        this.$store.state.player.playerId === ""
      ) {
        return "classic"
      }

      return "spotify"
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
      this.playTrack = this.playlist.tracks[0].preview_url
      this.isPlaying = true
      this.playingPosition = 0
      this.position = 0
      this.accessToken = this.user.token

      if (this.user.spotify && this.accessToken && this.mode !== "classic") {
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
        this.playSpotifyPlayer(this.playlist.tracks[this.currentTrackPosition])
      } else {
        this.playClassicPlayer(this.playlist.tracks[this.currentTrackPosition])
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

        try {
          await this.$axios.put(urlSpotify, body, {
            headers: headersApi
          })
        } catch (e) {
          console.log("error playlistplayer.vue", e)
        }
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

        try {
          await this.$axios.put(urlSpotify, null, {
            headers: headersApi
          })
        } catch (e) {
          console.log("error playlistplayer.vue", e)
        }
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
        try {
          await this.$axios.put(urlSpotify, body, {
            headers: headersApi
          })
        } catch (e) {
          console.log("error playlistplayer.vue", e)
        }
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

        try {
          await this.$axios.put(urlSpotify, body, {
            headers: headersApi
          })
        } catch (e) {
          console.log("error playlistplayer.vue", e)
        }
      } else {
        const playerComponentRef = this.player
        playerComponentRef.volume = this.volume / 100
      }
    },
    next() {
      this.position = 0
      this.playingPosition = 0
      if (
        this.playlist.tracks &&
        this.currentTrackPosition + 1 < this.playlist.tracks.length
      ) {
        this.$store.dispatch(
          "player/setTrackPlaying",
          this.playlist.tracks[this.currentTrackPosition + 1]
        )

        this.mode === "classic"
          ? this.playClassicPlayer(
              this.playlist.tracks[this.currentTrackPosition]
            )
          : this.playSpotifyPlayer(
              this.playlist.tracks[this.currentTrackPosition]
            )
        this.isPlaying = true
      } else {
        this.close()
      }
    },
    previous() {
      this.position = 0
      this.playingPosition = 0
      if (this.currentTrackPosition - 1 >= 0) {
        this.$store.dispatch(
          "player/setTrackPlaying",
          this.playlist.tracks[this.currentTrackPosition - 1]
        )
        this.mode === "classic"
          ? this.playClassicPlayer(
              this.playlist.tracks[this.currentTrackPosition]
            )
          : this.playSpotifyPlayer(
              this.playlist.tracks[this.currentTrackPosition]
            )
        this.isPlaying = true
      } else {
        this.mode === "classic"
          ? this.playClassicPlayer(this.playlist.tracks[0])
          : this.playSpotifyPlayer(this.playlist.tracks[0])
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
      this.eventIsPlaying(track.id)
    },
    async playSpotifyPlayer(track) {
      this.isPlaying = true

      this.duration = track.duration_ms

      const urlSpotify = `https://api.spotify.com/v1/me/player/play?device_id=${this.$store.state.player.playerId}`

      const body = JSON.stringify({
        uris: [track.uri]
      })

      await this.renewSpotifyToken()

      const headersApi = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`
      }

      this.eventIsPlaying(track.id)
      this.isPlaying = true

      let responseFromSpotify = ""

      try {
        responseFromSpotify = await this.$axios.put(urlSpotify, body, {
          headers: headersApi
        })
      } catch (e) {
        console.log("error playlistplayer.vue", e)
      }

      if (
        responseFromSpotify.status === 401 ||
        responseFromSpotify.status === 403 ||
        responseFromSpotify.status === 404
      ) {
        const headersApi = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`
        }

        try {
          responseFromSpotify = await this.$axios.put(urlSpotify, body, {
            headers: headersApi
          })
        } catch (e) {
          console.log("error playlistplayer.vue", e)
        }
      }

      return responseFromSpotify
    },
    async renewSpotifyToken() {
      const newToken = await spotifyService.refreshTokenFromSpotify(
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

<style lang="scss" scoped>
.dialog__player {
  @media (max-width: 768px) {
    bottom: 56px !important;
  }
}

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
