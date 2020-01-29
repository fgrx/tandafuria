export const state = () => ({
  myTandas: [],
  allTandas: []
})

export const mutations = {
  ADD_TANDA(state, { target, tanda }) {
    if (target === 'allTandas') {
      state.allTandas.push(tanda)
    } else {
      state.myTandas.push(tanda)
    }
  },
  DELETE_TANDA(state, { target, tanda }) {
    if (target === 'allTandas') {
      state.allTandas.push(tanda)
    } else {
      state.myTandas.push(tanda)
    }
  }
}

export const getters = {
  getMyTandas: (state) => {
    return state.myTandas
  },
  getAllTandas: (state) => {
    return state.allTandas
  }
}

export const actions = {
  addTanda({ commit }, { target, tanda }) {
    commit('ADD_TANDA', { target, tanda })
  }
}
