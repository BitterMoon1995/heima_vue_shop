const state = {
  postcard: null
}
const getters = {
  getPostcard(state) {
    return state.postcard
  }
}
const mutations = {
  setPostcard(state, payload) {
    state.postcard=payload
  }
}
const actions = {
  setPostcard({commit}, payload) {
    commit('setPostcard',payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
