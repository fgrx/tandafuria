import axios from 'axios'

export default async function({ store, route, redirect }) {
  reinitTokens(store)
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
      console.log('ask code')
      askCodeFromSpotify()
    } else {
      console.log('ask token')
      const resultTokensFromSpotify = await getTokenFromSpotify(code)(state)
      store.commit('authSpotify/SET_TOKEN', resultTokensFromSpotify.accessToken)
      localStorage.setItem('access_token', resultTokensFromSpotify.accessToken)
      store.commit(
        'authSpotify/SET_REFRESH_TOKEN',
        resultTokensFromSpotify.refreshToken
      )
      localStorage.setItem(
        'refresh_token',
        resultTokensFromSpotify.refreshToken
      )

      const userFromSpotify = await getUserFromSpotify(
        resultTokensFromSpotify.accessToken
      )
      console.log('email from spotify', userFromSpotify.data)
      store.commit('authSpotify/SET_USER', userFromSpotify.data)
      localStorage.setItem('userSpotify', userFromSpotify.data)
    }
  } else {
    console.log('ask refehs')
    const token = await refreshTokenFromSpotify(refreshToken)
    store.commit('authSpotify/SET_TOKEN', token)
    localStorage.setItem('access_token', token)
  }
}

const getUserFromSpotify = async (token) => {
  const userFromSpotify = await axios.get('https://api.spotify.com/v1/me', {
    params: {
      access_token: token
    }
  })
  console.log('user from spotify', userFromSpotify)
  return userFromSpotify
}

const getTokenFromSpotify = (code) => async (state) => {
  console.log('code', code)
  console.log('state', state)
  const resultSpotify = await axios.get(
    // 'https://tandafuria.herokuapp.com/spotify/callback',
    'https://tanda-furia.herokuapp.com/callback',
    {
      params: {
        code,
        state
      }
    }
  )

  console.log('datas spotify', resultSpotify.data)

  const tokens = {
    accessToken: resultSpotify.data.access_token,
    refreshToken: resultSpotify.data.refresh_token
  }

  return tokens
}

const refreshTokenFromSpotify = async (refresh_token) => {
  console.log('refresh token !', refresh_token)
  const resultSpotify = await axios.get(
    // 'https://tandafuria.herokuapp.com/spotify/refresh_token',
    'https://tanda-furia.herokuapp.com/callback',
    {
      params: {
        refresh_token
      }
    }
  )
  console.log('token refreshed', resultSpotify.data.access_token)
  return resultSpotify.data.access_token
}

const askCodeFromSpotify = () =>
  // window.location.href = 'https://tandafuria.herokuapp.com/spotify'
  'https://tanda-furia.herokuapp.com/callback'

const reinitTokens = (store) => {
  // const value = ''
  // localStorage.setItem('access_token', value)
  // localStorage.setItem('refresh_token', value)
  // store.commit('authSpotify/SET_TOKEN', value)
  // store.commit('authSpotify/SET_REFRESH_TOKEN', value)
}
