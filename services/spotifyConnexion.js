import axios from "axios"

export const spotifyConnexionService = {
  async refreshTokenFromSpotify(refreshToken) {
    const serverUrl =
      process.env.NODE_ENV === "development"
        ? process.env.DEV_serverUrl
        : process.env.PROD_serverUrl
    const resultSpotify = await axios.get(
      `${serverUrl}/spotify/refresh_token/${refreshToken}`
    )
    return resultSpotify.data.body.access_token
  }
}
