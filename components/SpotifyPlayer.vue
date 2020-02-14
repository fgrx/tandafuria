<template>
  <div>
    <script src="https://sdk.scdn.co/spotify-player.js"></script>
  </div>
</template>

<script>
export default {
  mounted() {
    //const user = this.$store.getters['authApp/getUser']
    //if (user.spotify) {
    //window.onSpotifyWebPlaybackSDKReady = () => {}
    this.initiatePlayer()
    //}
  },
  methods: {
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
    async initiatePlayer() {
      const { Player } = await this.waitForSpotifyWebPlaybackSDKToLoad()
      const token = this.$store.getters['authSpotify/getToken']

      //console.log('Token 4 the player', token)

      const sdk = new Player({
        name: 'TandaFuria',
        volume: 1.0,
        getOAuthToken: (callback) => {
          callback(token)
        }
      })

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
      })
      // Ready
      sdk.addListener('ready', ({ device_id }) => {
        this.$store.dispatch('authSpotify/setDeviceId', device_id)
        // console.log('Ready with Device Id: ', device_id)
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

<style lang="scss" scoped></style>
