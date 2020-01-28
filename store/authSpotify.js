export const state = () => ({
  token: '',
  user: '',
  refreshToken: '',
  deviceId: ''
})

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_REFRESH_TOKEN(state, refreshToken) {
    state.refreshToken = refreshToken
  },
  SET_DEVICE_ID(state, deviceId) {
    state.deviceId = deviceId
  }
}

export const getters = {
  getUser: (state) => {
    return state.user
  },
  getToken: (state) => {
    return state.token
  },
  getRefreshToken: (state) => {
    return state.refreshToken
  },
  getDeviceId: (state) => {
    return state.deviceId
  }
}

export const actions = {
  setToken({ commit }, token) {
    commit('SET_TOKEN', token)
  },
  setRefreshToken({ commit }, refreshToken) {
    commit('SET_REFRESH_TOKEN', refreshToken)
  },
  setDeviceId({ commit }, deviceId) {
    commit('SET_DEVICE_ID', deviceId)
  },
  setUser({ commit }, user) {
    commit('SET_USER', user)
  }
}
