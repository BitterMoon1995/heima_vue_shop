const state = {
  swiper: null
}
const getters = {
  getSwiper(state) {
    return state.swiper
  }
}
const mutations = {
  setSwiper(state, payload) {
    state.swiper=payload
  }
}
const actions = {
  setSwiper({commit}, payload) {
    commit('setSwiper',payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
