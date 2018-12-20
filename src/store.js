import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authorizationToken: "",
    sessionId: ""
  },
  mutations: {
    setAuthorizationToken(state, token) {
      state.authorizationToken = token
    },
    setSessionId(state, sessionId) {
      state.sessionId = sessionId
    }
  },
  actions: {
    updateAuthorizationToken(context, newToken) {
      context.commit("setAuthorizationToken", newToken)
    },
    updateSessionId(context, newSessionId) {
      context.commit("setSessionId", newSessionId)
    }
  }
})
