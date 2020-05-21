import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    version: 1.0,
    assets: [],
    isLandscape: false
  },
  mutations: {
    changeIsLandscape(state, value){
        state.isLandscape = value
    },
    changeVersion(state, value){
      state.version = value;
    },
    changeAssets(state, value){
      state.assets = value;
    }
  },
  actions: {

  },
  modules: {

  }
})
