export const state = () => ({
  favoritesPlaylists: []
})

export const getters = {
  getterFavoritesPlaylists: (state) => {
    return state.favoritesPlaylists
  }
}

export const mutations = {
  updateFavoritesPlaylists: (state, payload) => {
    state.favoritesPlaylists = payload
  }
}

export const actions = {
  updateActionFavoritesPlaylists({ commit, payload }) {
    commit("updateFavoritesPlaylists", payload)
  }
}
