export const state = () => ({
  token: "",
  user: "",
  refreshToken: ""
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
  }
}

export const actions = {
  setToken({ commit }, token) {
    commit("SET_TOKEN", token)
  },
  setRefreshToken({ commit }, refreshToken) {
    commit("SET_REFRESH_TOKEN", refreshToken)
  },
  setUser({ commit }, user) {
    commit("SET_USER", user)
  }
}
