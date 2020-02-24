<template>
  <div>
    <v-btn @click="playOrPause()" color="primary" fab x-small dark>
      <v-icon>{{ icon }}</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    track: {
      type: Object,
      default: null
    },
    playerId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      icon: 'mdi-play-circle',
      activePlayer: false,
      refComponent: null,
      deviceId: this.$store.getters['authSpotify/getDeviceId'],
      accessToken: this.$store.getters['authSpotify/getToken']
    }
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'authSpotify/SET_DEVICE_ID') {
        this.deviceId = state.authSpotify.deviceId
      }
      if (mutation.type === 'authSpotify/SET_TOKEN') {
        this.accessToken = state.authSpotify.token
      }
    })
  },
  mounted() {
    this.refComponent = this.track.id

    this.$root.$on('stopPlaying', (playingComponentRef) => {
      if (playingComponentRef === this.refComponent) {
        this.stop()
      }
    })

    this.$root.$on('changeTrack', (playingComponentRef) => {
      if (playingComponentRef === this.refComponent) {
        this.icon = 'mdi-play-circle'
      }
    })
  },
  beforeDestroy() {
    this.stop()
  },
  methods: {
    playOrPause() {
      if (this.icon === 'mdi-pause-circle') {
        this.stop()
      } else {
        this.play()
      }
    },
    async play() {
      const currentTrackPlaying = this.$store.getters['player/getTrackPlaying']

      this.icon = 'mdi-pause-circle'
      await this.PlayFromSpotify(this.track)

      if (currentTrackPlaying.id !== this.track.id)
        this.$root.$emit('changeTrack', currentTrackPlaying.id)

      this.$store.dispatch('player/setTrackPlaying', this.track)
    },
    async stop() {
      this.icon = 'mdi-play-circle'
      await this.StopFromSpotify(this.track)
    },
    async PlayFromSpotify(track) {
      if (this.deviceId == null) {
        alert(
          'Listening to full length track is only available for Spotify Premium users. If you do not have a premium account you should disable this functionnality in your preference panel. Thank you !'
        )
      }
      const urlSpotify = `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`

      const body = JSON.stringify({
        uris: [track.uri]
      })

      const headersApi = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`
      }

      const responseFromSpotify = await this.$axios.put(urlSpotify, body, {
        headers: headersApi
      })
      return responseFromSpotify
    },
    async StopFromSpotify(track) {
      const urlSpotify = `https://api.spotify.com/v1/me/player/pause?device_id=${this.deviceId}`
      const headersApi = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`
      }

      await this.$axios.put(urlSpotify, null, { headers: headersApi })
    }
  }
}
</script>

<style lang="scss" scoped></style>
