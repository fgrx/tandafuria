import { spotifyService } from "@/services/spotify.service"

export default {
  methods: {
    async detectActualPlayers(userRefreshToken) {
      this.players = await spotifyService.getPlayers(userRefreshToken)
      return this.players
    },
    findSpotifyPlayerInPlayersList(players) {
      return players.find((player) => player.name === "TandaFury")
    }
  }
}
