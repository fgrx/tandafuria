import { spotifyService } from "@/services/spotify.service"

export default function({ store, route, redirect, app }) {
  reinitTokens(store)
  const user = store.getters["authApp/getUser"]

  askSpotifyCodeForSpotifyUsersWithoutTokens(user, redirect)

  if (user.spotify) initSpotifyTokens(store)(redirect)(app)
}

const initSpotifyTokens = (store) => (redirect) => async (app) => {
  const {
    token: tokenFromCookies,
    refreshToken: refreshTokenFromCookies
  } = getTokensFromCookies(store, app)

  savecTokensFromCookiesToStore(
    tokenFromCookies,
    store,
    refreshTokenFromCookies
  )

  if (refreshTokenFromCookies == null || refreshTokenFromCookies === "") {
    askCodeFromSpotify(redirect)
  } else {
    const newToken = await spotifyService.refreshTokenFromSpotify(
      refreshTokenFromCookies
    )

    saveTokenToStoreAndCookie(store, newToken, app)
  }
}

const askCodeFromSpotify = (redirect) => {
  redirect("/connect-to-spotify")
}

const reinitTokens = (store) => {
  // const value = ""
  // localStorage.setItem("access_token", value)
  // localStorage.setItem("refresh_token", value)
  // store.dispatch("authSpotify/setToken", value)
  // store.dispatch("authSpotify/setRefreshToken", value)
}
function saveTokenToStoreAndCookie(store, newToken, app) {
  store.dispatch("authSpotify/setToken", newToken)
  app.$cookies.get("access_token", newToken)
}

function savecTokensFromCookiesToStore(
  tokenFromCookies,
  store,
  refreshTokenFromCookies
) {
  if (tokenFromCookies) store.dispatch("authSpotify/setToken", tokenFromCookies)
  if (refreshTokenFromCookies)
    store.dispatch("authSpotify/setRefreshToken", refreshTokenFromCookies)
}

function askSpotifyCodeForSpotifyUsersWithoutTokens(user, redirect) {
  const isSpotifyUserWithEmptyToken =
    user.spotify && (user.refreshToken === "" || user.refreshToken == null)

  if (isSpotifyUserWithEmptyToken) askCodeFromSpotify(redirect)
}

function getTokensFromCookies(app) {
  const token = app.$cookies.get("access_token")
  const refreshToken = app.$cookies.get("refresh_token")
  return { token, refreshToken }
}
