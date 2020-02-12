<template>
  <div>
    <v-btn color="primary" fab x-small dark @click="playOrPause()">
      <v-icon>{{ icon }}</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    track: Object,
    refComponent: String
  },
  data() {
    return {
      icon: 'mdi-play-circle',
      activePlayer: false
    }
  },
  mounted() {
    this.$root.$on('isPlaying', (playingComponentRef) => {
      if (playingComponentRef !== this.refComponent) this.stop()
    })
  },
  methods: {
    playOrPause() {
      const paramsSpotify = this.getParamsSpotify()
      console.log(paramsSpotify)
      if (this.icon === 'mdi-pause-circle') {
        this.stop(paramsSpotify)
      } else {
        this.play(paramsSpotify)
        this.$root.$emit('isPlaying', this.refComponent)
      }
    },
    play(paramsSpotify) {
      this.icon = 'mdi-pause-circle'
      this.PlayFromSpotify(this.track, paramsSpotify)
    },
    stop(paramsSpotify) {
      this.icon = 'mdi-play-circle'
      this.StopFromSpotify(this.track, paramsSpotify)
    },
    PlayFromSpotify(track, paramsSpotify) {
      const urlSpotify = `https://api.spotify.com/v1/me/player/play?device_id=${paramsSpotify.deviceId}`

      const body = JSON.stringify({
        uris: [track.uri]
      })

      const headersApi = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${paramsSpotify.accessToken}`
      }

      this.$axios.put(urlSpotify, body, { headers: headersApi })
    },
    StopFromSpotify(track, paramsSpotify) {
      const urlSpotify = `https://api.spotify.com/v1/me/player/pause?device_id=${paramsSpotify.deviceId}`
      const headersApi = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${paramsSpotify.accessToken}`
      }

      this.$axios.put(urlSpotify, null, { headers: headersApi })
    },
    getParamsSpotify() {
      const accessToken = this.$store.getters['authSpotify/getToken']
      const deviceId = this.$store.getters['authSpotify/getDeviceId']
      return { accessToken, deviceId }
    }
  }
}
</script>

<style lang="scss" scoped></style>
