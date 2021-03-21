<template>
  <div id="app">
    <div data-collapse="medium" data-animation="default" data-duration="400" role="banner" class="navbar w-nav">
      <a aria-current="page" class="brand w-nav-brand w--current">
        <router-link to="/"><h1 class="logo">ANALOG</h1></router-link>
        <h2 class="logo subhead">NFT platform</h2>
      </a>
      <nav role="navigation" class="nav-menu w-nav-menu">
        <router-link v-if="authenticator.currentAccount !== null" to="/mint" class="button-light w-button">Mint NFT</router-link>
        <button @click="connectProvider" v-if="authenticator.currentAccount === null" class="button-light w-button" style="margin-right: 30px;">Connect to Metamask</button>
        <router-link v-if="authenticator.currentAccount !== null" v-bind:to="'/account/'+authenticator.currentAccount"  class="account-link w-inline-block">
            <div class="identicon" :style="'background-image: url(data:image/svg+xml;base64,'+authenticator.identicon+')'"></div>
            <div>{{ authenticator.currentAccount.substring(0,7)}}...{{authenticator.currentAccount.substr(authenticator.currentAccount.length - 5)}}</div>
        </router-link>
      </nav>
      <div class="menu-button w-nav-button"><img src="images/bx-menu-alt-right.svg" alt=""></div>
    </div>
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
    <!--<button @click="connectProvider" v-if="authenticator.currentAccount === null">Connect to Metamask</button>
    <p>Current account: {{authenticator.currentAccount}}</p>
    <div v-if="authenticator.currentAccount !== null">
      <img width=36 height=36 v-bind:src="'data:image/svg+xml;base64,'+authenticator.identicon">
    </div>
    
  </div>-->
</template>

<style>
@import './assets/normalize.css';
@import './assets/webflow.css';
@import './assets/style.css';

body { background-color: #000; }
</style>

<script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js" type="text/javascript"></script>
  <script type="text/javascript">WebFont.load({  google: {    families: ["IBM Plex Mono:regular,500,600,700"]  }});</script>

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
    store.dispatch('registerAuthenticator')
  } 
}
</script>
