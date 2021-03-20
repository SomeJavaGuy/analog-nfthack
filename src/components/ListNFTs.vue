<template>
	<div id="infinite-list" class='scrolling-component' ref='scrollComponent'>
        <NFTComponent v-if="index != 0" v-for="(nft, index) in nfts"
            v-bind:nft="nft"
            v-bind:index="index"
            v-bind:key="nft.id"/>
	</div>
</template>

<style scoped>
.scrolling-component { height: 300px; overflow-y: scroll; }
</style>

<script>
import loadNFTs from '../util/nftLoader'
import NFTComponent from './NFTComponent.vue'

export default {
    components: { NFTComponent },
    data: function (){
        return {
            nfts: [Object()],
            last: null,
            listEl: null,
            handleEvent: null
        }
    },
    methods: {
        loadMoreNFTs(last) {
            (async (last) => {
                loadNFTs(last).then((docs) => {
                    this.nfts.push(...docs.docs)
                    this.last = docs.lastItem
                    this.listEl.addEventListener('scroll', this.handleEvent)
                })
            })(last)
        },
    },
    mounted() {
        this.listEl = document.querySelector('#infinite-list')
        this.handleEvent = (e) => {
            if(this.listEl.scrollTop + this.listEl.clientHeight >= this.listEl.scrollHeight - 0.5) {
                this.loadMoreNFTs(this.last.id)
                console.log("loading more...")
                this.listEl.removeEventListener('scroll', this.handleEvent)
            }
        }
        this.listEl.addEventListener('scroll', this.handleEvent)
        this.loadMoreNFTs(0)
    }
}
</script>