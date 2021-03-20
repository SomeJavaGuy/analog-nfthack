<template>
    <div>
        <h1>Account</h1>
        <router-link :to="'/account/'+authenticator.currentAccount+'/'">Minted</router-link><br>
        <router-link :to="'/account/'+authenticator.currentAccount+'/collection'">Owned</router-link><br><br>
        <router-view></router-view>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import store from '../store'

export default {
    name: 'Account',
    metaInfo: {
        title: 'ANALOG NFTs — Account',
        viewport: 'width=device-width, initial-scale=1'
    },
    computed: mapState(['authenticator'])
}
</script>