export const state = () => ({
  token: "",
  user: "",
  refreshToken: "",
  deviceId: "",
  player: null,
  mode: ""
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
  },
  SET_PLAYER(state, player) {
    state.player = player
  },
  SET_MODE(state, mode) {
    state.mode = mode
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
  },
  getPlayer: (state) => {
    return state.player
  },
  getMode: (state) => {
    return state.mode
  }
}

export const actions = {
  setToken({ commit }, token) {
    commit("SET_TOKEN", token)
  },
  setRefreshToken({ commit }, refreshToken) {
    commit("SET_REFRESH_TOKEN", refreshToken)
  },
  setDeviceId({ commit }, deviceId) {
    commit("SET_DEVICE_ID", deviceId)
  },
  setUser({ commit }, user) {
    commit("SET_USER", user)
  },
  setPlayer({ commit }, player) {
    commit("SET_PLAYER", player)
  },
  setMode({ commit }, mode) {
    commit("SET_MODE", mode)
  }
}
