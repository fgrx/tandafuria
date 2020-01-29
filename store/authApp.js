export const state = () => ({
  id: 1,
  name: 'Fabien'
})

export const mutations = {
  SET_USER(state, user) {
    state.name = user.name
    state.id = user.id
  }
}

export const getters = {
  getUser: (state) => {
    return { id: state.id, name: state.name }
  }
}

export const actions = {
  setUser({ commit }, user) {
    commit('SET_USER', user)
  }
}
