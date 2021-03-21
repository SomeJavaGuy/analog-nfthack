<template>
    <div>
        <ListNFTs request="minted"/>
    </div>
</template>

<script>
import ListNFTs from '../components/ListNFTs.vue'

export default {
    name: 'MintedNFTs',
    components: { ListNFTs },
    metaInfo: {
        title: 'ANALOG NFTs — Account',
        viewport: 'width=device-width, initial-scale=1'
    }
}
</script>