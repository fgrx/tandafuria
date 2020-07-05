import { spotifyConnexionService } from "@/services/spotifyConnexion"

export default {
  data() {
    return {
      deviceId: null
    }
  },

  methods: {
    async detectActualPlayers(userRefreshToken) {
      const header = await this.getHeaderSpotify(userRefreshToken)

      const serverUrl = "https://api.spotify.com/v1"

      const url = `${serverUrl}/me/player/devices`

      try {
        const result = await this.$axios.get(url, header)
        this.players = result.data.devices
        return result.data.devices
      } catch (e) {
        alert("error, please try reloading the page", e)
      }
    },

    async getHeaderSpotify(userRefreshToken) {
      const token = await spotifyConnexionService.refreshTokenFromSpotify(
        userRefreshToken
      )
      const header = { headers: { Authorization: "Bearer " + token } }
      return header
    },
    findSpotifyPlayerInPlayersList(players) {
      return players.find((player) => player.name === "TandaFury")
    }
  }
}
