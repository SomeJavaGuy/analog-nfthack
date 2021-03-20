<template>
    <div>
        <h3>Owned NFTs</h3>
        <NFTComponent v-if="nfts[0].loading != 0" v-for="(nft, index) in nfts" :nft="nft" :index="index" :key="nft.id"/>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import NFTComponent from '../components/NFTComponent.vue'
import {balanceOf,returnId,tokenOfOwnerByIndex,tokenCreators,tokenURI,tokenMetadataURI,ensureContractIsSet} from '../util/mediaContract'

export default {
    name: 'OwnedNFTs',
    metaInfo: {
        title: 'ANALOG NFTs — Account',
        viewport: 'width=device-width, initial-scale=1'
    },
    components: { NFTComponent },
    computed: mapState(['authenticator', 'zora']),
    data: function (){
        return {
            nfts: [Object({loading: 0})]
        }
    },
    methods: {
        fetchOwnedNFTs(ids) {
            const promises = []
            for(var i=0; i<ids.length; i++) {
                promises.push(returnId(ids[i]))
                promises.push(tokenCreators(ids[i]))
                promises.push(tokenURI(ids[i]))
                promises.push(tokenMetadataURI(ids[i]))
            }
            Promise.all(promises).then((ids) => this.groupFetchedArray(ids))
        },
        groupFetchedArray(arr) {
            let nfts = []
            var i = arr.length;
            for(i=arr.length-1; i>=0;) {
                var nft = Object()
                Object.assign(nft, {id: arr[i-3]})
                Object.assign(nft, {creator: arr[i-2]})
                Object.assign(nft, {tokenURI: arr[i-1]})
                Object.assign(nft, {metadataURI: arr[i]})
                i=i-4
                nfts.push(nft)
            }
            this.nfts = nfts
        }
    },
    mounted() {
        ensureContractIsSet().then(() => {
            var getBalance = balanceOf(this.authenticator.currentAccount)
            getBalance.then((res) => {
                const balance = res.toNumber()
                const promises = []
                for (let i = 0; i < balance; ++i) promises.push(tokenOfOwnerByIndex(this.authenticator.currentAccount, i))
                Promise.all(promises).then((ids) => this.fetchOwnedNFTs(ids))
            })
        })
    }
}
</script>