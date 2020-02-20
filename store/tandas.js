export const state = () => ({
  myTandas: [],
  allTandas: []
})

export const mutations = {
  ADD_TANDA(state, { target, tanda, order }) {
    if (target === 'allTandas') {
      order === 'end'
        ? state.allTandas.push(tanda)
        : state.allTandas.unshift(tanda)
    } else {
      order === 'end'
        ? state.myTandas.push(tanda)
        : state.myTandas.unshift(tanda)
    }
  },
  DELETE_TANDA(state, idTanda) {
    const indexToDeleteInMyTandas = state.myTandas.findIndex(
      (tanda) => tanda._id === idTanda
    )
    state.myTandas.splice(indexToDeleteInMyTandas, 1)

    const indexToDeleteInAllTandas = state.allTandas.findIndex(
      (tanda) => tanda._id === idTanda
    )
    state.allTandas.splice(indexToDeleteInAllTandas, 1)
  },
  UPDATE_TANDA(state, tanda) {
    state.allTandas = state.allTandas.map((tandaItem) => {
      if (tandaItem._id === tanda._id)
        return Object.assign({}, tandaItem, tanda)
      return tandaItem
    })

    state.myTandas = state.myTandas.map((tandaItem) => {
      if (tandaItem._id === tanda._id)
        return Object.assign({}, tandaItem, tanda)
      return tandaItem
    })
  },
  CLEAR_TANDAS(state, target) {
    if (target === 'allTandas') {
      state.allTandas = []
    } else {
      state.myTandas = []
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
  addTanda({ commit }, { target, tanda, order }) {
    commit('ADD_TANDA', { target, tanda, order })
  },
  updateTanda({ commit }, tanda) {
    commit('UPDATE_TANDA', tanda)
  },
  deleteTanda({ commit }, idTanda) {
    commit('DELETE_TANDA', idTanda)
  },
  clearTandas({ commit }, target) {
    commit('CLEAR_TANDAS', target)
  }
}
