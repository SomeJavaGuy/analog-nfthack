<template>
  <div id="app">
    <router-link to="/">Home</router-link><br>
    <router-link to="/account">Account</router-link><br>
    <router-link to="/mint">Mint</router-link><br><br>
    <button @click="connectProvider" v-if="authenticator.currentAccount === null">Connect to Metamask</button>
    <p>Current account: {{authenticator.currentAccount}}</p>
    <div v-if="authenticator.currentAccount !== null">
      <img width=36 height=36 v-bind:src="'data:image/svg+xml;base64,'+authenticator.identicon">
    </div>
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import store from './store'

export default {
  name: 'App',
  metaInfo: {
    title: 'ANALOG NFTs',
    viewport: 'width=device-width, initial-scale=1'
  },
  computed: mapState(['authenticator']),
  methods: {
    connectProvider() {
      store.state.authenticator.connectProvider()
    }
  },
  beforeCreate () {
    console.log('dispatch')
    store.dispatch('registerAuthenticator')
  } 
}
</script>
