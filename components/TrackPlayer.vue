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
      spotifyPlayerId: '',
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
      // Stop every player before playing a song

      if (this.icon === 'mdi-pause-circle') {
        this.stop()
      } else {
        this.play()
        this.$root.$emit('isPlaying', this.refComponent)
      }
    },
    play() {
      this.icon = 'mdi-pause-circle'
      this.PlayFromSpotify(this.track)
    },
    stop() {
      this.icon = 'mdi-play-circle'
      this.StopFromSpotify(this.track)
    },
    PlayFromSpotify(track) {
      const accessToken = this.$store.getters['authSpotify/getToken']

      const urlSpotify = `https://api.spotify.com/v1/me/player/play?device_id=${this.spotifyPlayerId}`

      const body = JSON.stringify({
        uris: [track.uri]
      })

      const headersApi = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }

      this.$axios.put(urlSpotify, body, { headers: headersApi })
    },
    StopFromSpotify(track) {
      const accessToken = this.$store.getters['authSpotify/getToken']
      const urlSpotify = `https://api.spotify.com/v1/me/player/pause?device_id=${this.spotifyPlayerId}`
      const headersApi = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }

      this.$axios.put(urlSpotify, null, { headers: headersApi })
    }
  }
}
</script>

<style lang="scss" scoped></style>
