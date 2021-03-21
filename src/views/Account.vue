<template>
    <div>
        <div class="hero_home">
            <div class="hero_content">
                <router-link :to="'/account/'+authenticator.currentAccount+'/'" class="largeheading">Minted</router-link>
                <a class="largeheading">/</a>
                <router-link :to="'/account/'+authenticator.currentAccount+'/collection'" href="#" class="largeheading">Owned</router-link>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
    name: 'Account',
    metaInfo: {
        title: 'ANALOG NFTs — Account',
        viewport: 'width=device-width, initial-scale=1'
    },
    computed: mapState(['authenticator'])
}
</script>