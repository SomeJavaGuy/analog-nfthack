import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from './views/Home.vue'
import MyFeed from './views/MyFeed.vue'

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        { name: 'root', path: '/', component: Home },
        { name: 'feed', path: '/my', component: MyFeed }
    ]
})

export { router }