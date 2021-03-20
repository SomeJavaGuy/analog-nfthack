import Vue from 'vue'
import App from './App.vue'
import {router} from './router'
import store from './store'

import VueMeta from 'vue-meta'

Vue.use(VueMeta)

Vue.config.productionTip = false

let app

app = new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')