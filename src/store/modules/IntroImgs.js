const state = {
  intros: []
}
const getters = {
  getIntros(state) {
    return state.introImgs
  }
}
const mutations = {
  setIntros(state, payload) {
    state.intros=payload
  }
}
const actions = {
  setIntros({commit}, payload) {
    commit('setIntros',payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
