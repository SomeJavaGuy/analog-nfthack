<template>
    <div>
        <ListNFTs request="all"/>
    </div>

</template>

<script>
import ListNFTs from '../components/ListNFTs.vue'

export default {
    components: { ListNFTs },
    name: 'Home',
    metaInfo: {
        title: 'ANALOG NFTs — Feed',
        viewport: 'width=device-width, initial-scale=1'
    }
}
</script>