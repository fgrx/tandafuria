import axios from 'axios'

export default function({ store, route, redirect }) {
  reinitTokens(store)
  // if (localStorage.getItem('access_token') == null) reinitTokens(store)

  const user = store.getters['authApp/getUser']
  if (user.spotify === true) initSpotifyTokens(store)(redirect)(route)
}

const initSpotifyTokens = (store) => (redirect) => async (route) => {
  const token =
    store.getters['authSpotify/getToken'] ||
    localStorage.getItem('access_token')
  const refreshToken =
    store.getters['authSpotify/getRefreshToken'] ||
    localStorage.getItem('refresh_token')

  if (
    token == null ||
    refreshToken == null ||
    token === 'undefined' ||
    token === ''
  ) {
    askCodeFromSpotify(redirect)
  } else {
    const newToken = await refreshTokenFromSpotify(refreshToken)
    await store.dispatch('authSpotify/setToken', newToken)
    localStorage.setItem('access_token', newToken)
  }

  initializeDevice(store)
}

const initializeDevice = (store) => {
  const retryFindDeviceTimeout = (i) => {
    setTimeout(function() {
      findSpotiyDevice()
    }, 500 * i)
  }
  for (let i = 0; i < 5; i++) {
    retryFindDeviceTimeout(i)
  }

  const findSpotiyDevice = async () => {
    const device = await getDeviceFromSpotify(
      store.getters['authSpotify/getToken']
    )

    //console.log('find', device)
    if (device) {
      await store.dispatch('authSpotify/setDeviceId', device.id)
      localStorage.setItem('deviceId', device.id)
    }
  }
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

  const players = devices.data.devices
  const tandaFuriaPlayer = players.filter(
    (player) => player.name === 'TandaFuria'
  )

  return tandaFuriaPlayer[0]
}

const refreshTokenFromSpotify = async (refresh_token) => {
  const resultSpotify = await axios.get(
    `https://tandafuria.herokuapp.com/spotify/refresh_token/${refresh_token}`
  )

  return resultSpotify.data.body.access_token
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
