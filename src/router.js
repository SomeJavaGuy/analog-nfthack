import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from './views/Home.vue'
import Account from './views/Account.vue'
import Mint from './views/Mint.vue'

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        { name: 'root', path: '/', component: Home },
        { name: 'feed', path: '/account', component: Account },
        { name: 'mint', path: '/mint', component: Mint }
    ]
})

export { router }