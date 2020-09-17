<template>
  <div></div>
</template>

<script>
export default {
  async mounted() {
    if (this.user.spotify && !this.tandaFuryPlayer) {
      this.spotifyPlayer = await this.initiatePlayerSpotifyPlayer()
    }

    await this.waitForSpotifyWebPlaybackSDKToLoad()

    const sleep = (milliseconds) => {
      const date = Date.now()
      let currentDate = null
      do {
        currentDate = Date.now()
      } while (currentDate - date < milliseconds)
    }

    sleep(500)

    const spotifyPlayersLoaded = await this.detectActualPlayers(
      this.user.refreshToken
    )

    const findSpotifyPlayerInPlayersList = (players) =>
      players.find((player) => player.name === "TandaFury")

    if (this.user.refreshToken) {
      this.tandaFuryPlayer = findSpotifyPlayerInPlayersList(
        spotifyPlayersLoaded
      )
    }
  }
}
</script>

<style lang="scss" scoped></style>
