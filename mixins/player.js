import { spotifyService } from "@/services/spotify.service"

export default {
  data() {
    return {
      tandaFuryPlayer: false
    }
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
    waitUntilUserHasSelectedPlayer(sdk) {
      return new Promise((resolve) => {
        const interval = setInterval(async () => {
          const state = await sdk.getCurrentState()
          if (state !== null) {
            resolve(state)
            clearInterval(interval)
          }
        })
      })
    },

    async initiatePlayerSpotifyPlayer() {
      const { Player } = await this.waitForSpotifyWebPlaybackSDKToLoad()

      // if (!this.accessToken) {
      //   this.accessToken = await spotifyService.refreshTokenFromSpotify(
      //     this.user.refreshToken
      //   )
      // }

      // const token = this.accessToken

      // console.log('init', token)
      this.sdk = new Player({
        name: "TandaFury",
        volume: 1.0,
        getOAuthToken: async (callback) => {
          const token = await spotifyService.refreshTokenFromSpotify(
            this.user.refreshToken
          )
          callback(token)
        }
      })

      await this.sdk.connect()

      // await this.waitUntilUserHasSelectedPlayer()

      // Error handling
      this.sdk.addListener("initialization_error", ({ message }) => {
        // console.log('Initialization_error: ' + message)
      })
      this.sdk.addListener("authentication_error", ({ message }) => {
        // console.log('Authentication_error: ' + message)
      })
      this.sdk.addListener("account_error", ({ message }) => {
        // console.log('Account_error: ' + message)
      })
      this.sdk.addListener("playback_error", ({ message }) => {
        // console.log('Playback_error: ' + message)
      })
      // Playback status updates
      this.sdk.addListener("player_state_changed", (state) => {
        // Update UI information on player state changed
        // console.log('state changed')
      })
      // Ready
      this.sdk.addListener("ready", ({ deviceId }) => {
        //this.deviceId = deviceId
        // console.log('Ready with Device Id: ', device_id)
      })
      // Not Ready
      this.sdk.addListener("not_ready", ({ deviceId }) => {
        // console.log('Not ready with device Id: ', device_id)
      })

      return this.sdk
    }
  }
}
