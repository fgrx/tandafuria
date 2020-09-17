export const state = () => ({
  trackPlaying: {},
  playerId: null,
  playlistPlaying: []
})

export const mutations = {
  SET_TRACKPLAYING(state, track) {
    state.trackPlaying = track
  },

  SET_PLAYERID(state, playerId) {
    state.playerId = playerId
  },
  SET_PLAYLIST_PLAYING(state, playlist) {
    state.playlistPlaying = playlist
  }
}

export const getters = {
  getTrackPlaying: (state) => state.trackPlaying,
  getPlayerId: (state) => state.playerId,
  getplaylistPlaying: (state) => state.playlistPlaying
}

export const actions = {
  setTrackPlaying({ commit }, track) {
    commit("SET_TRACKPLAYING", track)
  },
  setPlayerId({ commit }, playerId) {
    commit("SET_PLAYERID", playerId)
  },
  setPlaylistPlaying({ commit }, playlist) {
    commit("SET_PLAYLIST_PLAYING", playlist)
  }
}
