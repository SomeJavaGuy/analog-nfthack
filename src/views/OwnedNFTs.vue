<template>
    <div>
        <h3>Owned NFTs</h3>
        <NFTComponent v-if="nfts[0].loading != 0" v-for="(nft, index) in nfts" :nft="nft" :index="index" :key="nft.id"/>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import NFTComponent from '../components/NFTComponent.vue'

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
        returnId(index) {
            return new Promise(function(resolve, reject){
                resolve(index)
            })
        },
        tokenOfOwnerByIndex(address, index) {
            return new Promise((resolve) => {
                this.authenticator.mediaContract.tokenOfOwnerByIndex(address, index).then(res => resolve(res.toNumber()))
            })
        },
        tokenCreators(id) {
            return new Promise((resolve) => {
                this.authenticator.mediaContract.tokenCreators(id).then(res => resolve(res))
            })
        },
        tokenMetadataURI(id) {
            return new Promise((resolve) => {
                this.authenticator.mediaContract.tokenMetadataURI(id).then(res => resolve(res))
            })
        },
        tokenURI(id) {
            return new Promise((resolve) => {
                this.authenticator.mediaContract.tokenURI(id).then(res => resolve(res))
            })
        },
        fetchOwnedNFTs(ids) {
            const promises = []
            for(var i=0; i<ids.length; i++) {
                promises.push(this.returnId(ids[i]))
                promises.push(this.tokenCreators(ids[i]))
                promises.push(this.tokenURI(ids[i]))
                promises.push(this.tokenMetadataURI(ids[i]))
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
                Object.assign(nft, {medatataURI: arr[i]})
                i=i-4
                nfts.push(nft)
            }
            this.nfts = nfts
        }
    },
    mounted() {
        const ensureContractIsSet = (timeout) => {
            var start = Date.now()
            const waitForContract = (resolve, reject) => {
                if (this.authenticator.mediaContract != null)
                    resolve(this.authenticator.mediaContract)
                else if (timeout && (Date.now() - start) >= timeout)
                    reject(new Error("timeout"))
                else
                    setTimeout(waitForContract.bind(this, resolve, reject), 30)
            }
            return new Promise(waitForContract)
        }

        ensureContractIsSet(1000000).then(() => {
            var getBalance = this.authenticator.mediaContract.balanceOf(this.authenticator.currentAccount)
            getBalance.then((res) => {
                const balance = res.toNumber()
                const promises = []
                for (let i = 0; i < balance; ++i) promises.push(this.tokenOfOwnerByIndex(this.authenticator.currentAccount, i))
                Promise.all(promises).then((ids) => this.fetchOwnedNFTs(ids))
            })
        })

    }
}
</script>