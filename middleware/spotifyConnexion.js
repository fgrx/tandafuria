import { spotifyConnexionService } from '@/services/spotifyConnexion'

export default function({ store, route, redirect }) {
  reinitTokens(store)
  const user = store.getters['authApp/getUser']

  if (user.refreshToken) {
    store.dispatch('authSpotify/setRefreshToken', user.refreshToken)
  }

  if (user.spotify === true) initSpotifyTokens(store)(redirect)(route)
}

const initSpotifyTokens = (store) => (redirect) => async (route) => {
  const token =
    store.getters['authSpotify/getToken'] ||
    localStorage.getItem('access_token')
  const refreshToken =
    store.getters['authSpotify/getRefreshToken'] ||
    localStorage.getItem('refresh_token')

  if (token) store.dispatch('authSpotify/setToken', token)
  if (refreshToken) store.dispatch('authSpotify/setRefreshToken', refreshToken)

  if (refreshToken == null) {
    askCodeFromSpotify(redirect)
  } else {
    const newToken = await spotifyConnexionService.refreshTokenFromSpotify(
      refreshToken
    )

    await store.dispatch('authSpotify/setToken', newToken)
    localStorage.setItem('access_token', newToken)
  }
}

const askCodeFromSpotify = (redirect) => {
  redirect('/connect-to-spotify')
}

const reinitTokens = (store) => {
  // const value = ''
  // localStorage.setItem('access_token', value)
  // localStorage.setItem('refresh_token', value)
  // store.dispatch('authSpotify/setToken', value)
  // store.dispatch('authSpotify/setRefreshToken', value)
}
