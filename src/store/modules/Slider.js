const state = {
  slider: null
}
const getters = {
  getSlider(state) {
    return state.slider
  }
}
const mutations = {
  setSlider(state, payload) {
    state.slider=payload
  }
}
const actions = {
  setSlider({commit}, payload) {
    commit('setSlider',payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
