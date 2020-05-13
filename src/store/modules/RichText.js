const state = {
  richText: null
}
const getters = {
  getRichText(state) {
    return state.richText
  }
}
const mutations = {
  setRichText(state, payload) {
    //richtext ✘ richText ✔   耐心、细致、冷静
    state.richText=payload
  }
}
const actions = {
  setRichText({commit}, payload) {
    commit('setRichText',payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
