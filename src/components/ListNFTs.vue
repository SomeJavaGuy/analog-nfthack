<template>
	<!--<div id="infinite-list" class='scrolling-component' ref='scrollComponent'>  
	</div>-->
    <div class="w-dyn-list">
        <div role="list" class="w-dyn-items w-row scrolling-component" id="infinite-list" ref='scrollComponent'>
            <NFTComponent v-if="index != 0" v-for="(nft, index) in nfts" :nft="nft" :index="index" :key="nft.id"/>
        </div>
    </div>
</template>

<style scoped>
.scrolling-component { 
    height: calc(100vh - 62px);
    overflow-y: scroll;
    overflow-x: hidden; }
</style>

<script>
import loadNFTs from '../util/nftLoader'
import NFTComponent from './NFTComponent.vue'
import {ensureContractIsSet} from '../util/mediaContract'

export default {
    components: { NFTComponent },
    props: {
		request: String
	},
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
                loadNFTs(last, this.request).then((docs) => {
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
        if(this.request == "all") {
            this.loadMoreNFTs(0)
        } else {
            ensureContractIsSet().then(() => {
            this.loadMoreNFTs(0)
        })
        }
    }
}
</script>