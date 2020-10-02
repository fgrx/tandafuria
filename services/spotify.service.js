import axios from "axios"

export const spotifyService = {
  async refreshTokenFromSpotify(refreshToken) {
    const serverUrl =
      process.env.NODE_ENV === "development"
        ? process.env.DEV_serverUrl
        : process.env.PROD_serverUrl

    const resultSpotify = await axios.get(
      `${serverUrl}/spotify/refresh_token/${refreshToken}`
    )

    return resultSpotify.data.body.access_token
  },
  async getTokenFromSpotify(code, state) {
    const serverUrl =
      process.env.NODE_ENV === "development"
        ? process.env.DEV_serverUrl
        : process.env.PROD_serverUrl

    let resultSpotify = ""
    try {
      resultSpotify = await axios.get(
        `${serverUrl}/spotify/callback/${code}?state=${state}`
      )
    } catch (e) {
      console.log("error default.vue", e)
    }

    const tokens = {
      accessToken: resultSpotify.data.access_token,
      refreshToken: resultSpotify.data.refresh_token
    }

    return tokens
  },
  async getPlayers(userRefreshToken) {
    const serverUrl = "https://api.spotify.com/v1"
    const url = `${serverUrl}/me/player/devices`

    let header = ""
    try {
      header = await this.getHeaderSpotify(userRefreshToken)
    } catch (e) {
      console.log("erreur de récupération du header", e)
    }

    try {
      const result = await axios.get(url, header)
      return result.data.devices
    } catch (e) {
      alert("error, please try reloading the page", e)
      return []
    }
  },
  async switchSpotifyPlayer(idPlayer, userRefreshToken) {
    const serverUrl = "https://api.spotify.com/v1"
    const header = await this.getHeaderSpotify(userRefreshToken)
    const url = `${serverUrl}/me/player`

    try {
      const result = await axios.put(
        url,
        { device_ids: [idPlayer], play: true },
        header
      )
      return result
    } catch (e) {
      console.log("error, please try reloading the page", e)
    }
  },
  async getHeaderSpotify(userRefreshToken) {
    const token = await this.refreshTokenFromSpotify(userRefreshToken)
    const header = { headers: { Authorization: "Bearer " + token } }
    return header
  }
}
