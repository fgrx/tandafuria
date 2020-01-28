import { tandaSamples } from '@/data/tandasExample'

export const state = () => ({
  tandas: []
})

export const mutations = {
  ADD_TANDA(state, tanda) {
    state.tandas.push(tanda)
  },
  DELETE_TANDA(state, tanda) {
    state.tandas.push(tanda)
  }
}

export const getters = {
  getTandas: (state) => {
    // return state.tandas
    return tandaSamples
  }
}

export const actions = {
  addTanda({ commit }, tanda) {
    commit('ADD_TANDA', tanda)
  }
}
