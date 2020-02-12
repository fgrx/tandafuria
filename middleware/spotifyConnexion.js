import axios from 'axios'

export default function({ store, route }) {
  //reinitTokens(store)

  if (localStorage.getItem('access_token') == null) reinitTokens(store)

  const user = store.getters['authApp/getUser']

  if (user.spotify === true) initSpotifyTokens(store)(route)
}

const initSpotifyTokens = (store) => async (route) => {
  const token =
    store.getters['authSpotify/getToken'] ||
    localStorage.getItem('access_token')
  const refreshToken =
    store.getters['authSpotify/getRefreshToken'] ||
    localStorage.getItem('refresh_token')
  const code = route.query.code
  const state = route.query.state

  console.log('token in memory', token)
  console.log('refresh token in memory', refreshToken)

  if (!token || !refreshToken) {
    if (!code) {
      askCodeFromSpotify()
    } else {
      console.log('ask token')
      const resultTokensFromSpotify = await getTokenFromSpotify(code)(state)
      await store.dispatch(
        'authSpotify/setToken',
        resultTokensFromSpotify.accessToken
      )
      localStorage.setItem('access_token', resultTokensFromSpotify.accessToken)
      store.commit(
        'authSpotify/SET_REFRESH_TOKEN',
        resultTokensFromSpotify.refreshToken
      )
      localStorage.setItem(
        'refresh_token',
        resultTokensFromSpotify.refreshToken
      )
    }
  } else {
    const newToken = await refreshTokenFromSpotify(refreshToken)
    console.log('refreshed', newToken)
    await store.dispatch('authSpotify/setToken', newToken)
    localStorage.setItem('access_token', newToken)
  }

  const deviceId = await getDeviceFromSpotify(
    localStorage.getItem('access_token')
  )
  console.log('init device id', deviceId)
  await store.dispatch('authSpotify/setDeviceId', deviceId.id)
}

const getDeviceFromSpotify = async (token) => {
  const devices = await axios.get(
    'https://api.spotify.com/v1/me/player/devices',
    {
      params: {
        access_token: token
      }
    }
  )
  return devices.data.devices[0]
}

const getTokenFromSpotify = (code) => async (state) => {
  console.log('code', code)
  console.log('state', state)
  const resultSpotify = await axios.get(
    //'https://tandafuria.herokuapp.com/spotify/callback',
    `http://localhost:4000/spotify/callback/${code}?state=${state}`
  )

  console.log('datas spotify', resultSpotify.data)

  const tokens = {
    accessToken: resultSpotify.data.access_token,
    refreshToken: resultSpotify.data.refresh_token
  }

  return tokens
}

const refreshTokenFromSpotify = async (refresh_token) => {
  const resultSpotify = await axios.get(
    // 'https://tandafuria.herokuapp.com/spotify/refresh_token',
    `http://localhost:4000/spotify/refresh_token/${refresh_token}`
  )

  return resultSpotify.data.body.access_token
}

const askCodeFromSpotify = () =>
  (window.location.href = 'http://localhost:4000/spotify/askcode')

const reinitTokens = (store) => {
  const value = ''
  localStorage.setItem('access_token', value)
  localStorage.setItem('refresh_token', value)
  store.dispatch('authSpotify/setToken', value)
  store.dispatch('authSpotify/setRefreshToken', value)
}
