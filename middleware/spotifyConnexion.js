import { spotifyConnexionService } from '@/services/spotifyConnexion'

export default function({ store, route, redirect, app }) {
  reinitTokens(store)
  const user = store.getters['authApp/getUser']

  if (user.refreshToken) {
    store.dispatch('authSpotify/setRefreshToken', user.refreshToken)
  }

  if (user.spotify === true) initSpotifyTokens(store)(redirect)(app)
}

const initSpotifyTokens = (store) => (redirect) => async (app) => {
  const token =
    store.getters['authSpotify/getToken'] || app.$cookies.get('access_token')
  const refreshToken =
    store.getters['authSpotify/getRefreshToken'] ||
    app.$cookies.get('refresh_token')

  if (token) store.dispatch('authSpotify/setToken', token)
  if (refreshToken) store.dispatch('authSpotify/setRefreshToken', refreshToken)

  if (refreshToken == null) {
    askCodeFromSpotify(redirect)
  } else {
    const newToken = await spotifyConnexionService.refreshTokenFromSpotify(
      refreshToken
    )

    await store.dispatch('authSpotify/setToken', newToken)
    app.$cookies.get('access_token', newToken)
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
