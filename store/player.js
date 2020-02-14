export const state = () => ({
  trackPlaying: {}
})

export const mutations = {
  SET_TRACKPLAYING(state, track) {
    state.trackPlaying = track
  }
}

export const getters = {
  getTrackPlaying: (state) => state.trackPlaying
}

export const actions = {
  setTrackPlaying({ commit }, track) {
    commit('SET_TRACKPLAYING', track)
  }
}
