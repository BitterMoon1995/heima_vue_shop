const state = {
  sceneIntros: []
}
const getters = {
  getIntros(state) {
    return state.introImgs
  }
}
const mutations = {
  setSceneIntros(state, payload) {
    state.sceneIntros=payload
  }
}
const actions = {
  setSceneIntros({commit}, payload) {
    commit('setSceneIntros',payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
