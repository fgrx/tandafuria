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
    }
  },
  data() {
    return {
      icon: 'mdi-play-circle',
      activePlayer: false,
      refComponent: null,
      paramsSpotify: {},
      deviceId: null,
      accessToken: null
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
  },
  methods: {
    playOrPause() {
      if (this.icon === 'mdi-pause-circle') {
        this.stop()
      } else {
        this.play()
      }
    },
    play(paramsSpotify) {
      const currentTrackPlaying = this.$store.getters['player/getTrackPlaying']

      if (currentTrackPlaying.id)
        this.$root.$emit('stopPlaying', currentTrackPlaying.id)

      this.icon = 'mdi-pause-circle'
      this.PlayFromSpotify(this.track)

      this.$store.dispatch('player/setTrackPlaying', this.track)
      //console.log('is playing', this.track.id)
    },
    stop(paramsSpotify) {
      this.icon = 'mdi-play-circle'
      this.StopFromSpotify(this.track)
    },
    PlayFromSpotify(track) {
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

      this.$axios.put(urlSpotify, body, { headers: headersApi })
    },
    StopFromSpotify(track) {
      const urlSpotify = `https://api.spotify.com/v1/me/player/pause?device_id=${this.deviceId}`
      const headersApi = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`
      }

      this.$axios.put(urlSpotify, null, { headers: headersApi })
    }
  }
}
</script>

<style lang="scss" scoped></style>
