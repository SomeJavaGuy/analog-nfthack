import Vue from 'vue'
import App from './App.vue'
import {router} from './router'
import store from './store'
import LoadScript from 'vue-plugin-load-script';

import VueMeta from 'vue-meta'

Vue.use(VueMeta)
Vue.use(LoadScript)
Vue.loadScript('https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js')
.then(() => {
  WebFont.load({ google: { families: ["Space Mono:regular,italic,700,700italic","IBM Plex Mono:regular,500,600,700"]  }})
})
.catch(() => {
  // Failed to fetch script
});

Vue.config.productionTip = false

let app

app = new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')