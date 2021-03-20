import Vue from 'vue'
import Vuex from 'vuex'
import Authenticator from './util/authenticator'
import ZoraInstance from './util/zora'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        authenticator: null,
        zora: null
    },
    mutations: {
        registerAuthenticatorInstance(state, val) {
            state.authenticator = val
        },
        registerZoraInstance(state, val) {
            state.zora = val
            console.log(state.zora)
        }
    },
    actions: {
        registerAuthenticator({commit}) {
            const authenticator = new Authenticator()
            commit('registerAuthenticatorInstance', authenticator)
        },
        registerZora({commit}, {signer, chainId}) {
            console.log('registerZora triggered')
            const zora = new ZoraInstance(signer, chainId)
            commit('registerZoraInstance', zora)
        }
    }
})

export default store