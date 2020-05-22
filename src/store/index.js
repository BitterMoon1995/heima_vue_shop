import Vue from 'vue'
import Vuex from 'vuex'
//引入子模块
import IntroImgs from "./modules/IntroImgs";
import Postcard from "./modules/Postcard";
import Slider from "./modules/Slider";
import RichText from "./modules/RichText";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    num:17
  },
  mutations: {
    addNum(state,sum){
      state.num+=sum
    }
  },
  actions: {
  },
  modules: {
    IntroImgs,
    Postcard,
    Slider,
    RichText
  },
  getters: {
    getNum(state) {
      return state.num
    }
  }
})
