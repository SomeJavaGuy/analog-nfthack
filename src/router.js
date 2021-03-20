import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from './views/Home.vue'
import Account from './views/Account.vue'
import Mint from './views/Mint.vue'
import MintedNFTs from './views/MintedNFTs.vue'
import OwnedNFTs from './views/OwnedNFTs.vue'
import NFT from './views/NFT.vue'

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        { name: 'root', path: '/', component: Home },
        { name: 'feed', path: '/account/:address', component: Account,
            children: [
                {
                    path: '',
                    component: MintedNFTs
                },
                {
                    path: 'collection',
                    component: OwnedNFTs
                }
            ]},
        { name: 'mint', path: '/mint', component: Mint },
        { name: 'nft', path: '/nft/:id', component: NFT }
    ]
})

export { router }