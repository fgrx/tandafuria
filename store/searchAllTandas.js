export const state = () => ({
  search: {}
})

export const mutations = {
  SET_SEARCH(state, search) {
    state.search = search
  }
}

export const getters = {
  getSearch: (state) => state.search
}

export const actions = {
  setSearchState({ commit }, search) {
    commit('SET_SEARCH', search)
  }
}
