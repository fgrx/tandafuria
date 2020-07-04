export const state = () => ({
  trackPlaying: {},
  playerId: null
})

export const mutations = {
  SET_TRACKPLAYING(state, track) {
    state.trackPlaying = track
  },

  SET_PLAYERID(state, playerId) {
    state.playerId = playerId
  }
}

export const getters = {
  getTrackPlaying: (state) => state.trackPlaying,
  getPlayerId: (state) => state.playerId
}

export const actions = {
  setTrackPlaying({ commit }, track) {
    commit("SET_TRACKPLAYING", track)
  },
  setPlayerId({ commit }, playerId) {
    commit("SET_PLAYERID", playerId)
  }
}
