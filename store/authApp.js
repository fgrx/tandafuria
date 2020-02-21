export const state = () => ({
  user: {}
})

export const mutations = {
  SET_USER(state, user) {
    state.user.username = user.username
    state.user.id = user.id
    state.user.token = user.token
    state.user.role = user.role
    state.user.nickname = user.nickname
    state.user.spotify = user.spotify
    state.user.link = user.link
    state.user.contactByMail = user.contactByMail
    state.user.countTanda = user.countTanda
  },
  CLEAR_USER(state) {
    state.user = {}
  }
}

export const getters = {
  getUser: (state) => state.user
}

export const actions = {
  setUser({ commit }, user) {
    commit('SET_USER', user)
  },
  clearUser({ commit }) {
    commit('CLEAR_USER')
  }
}
