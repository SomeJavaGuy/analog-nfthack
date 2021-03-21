<template>
	<div>
		<h1>NFT {{id}}</h1>
		<h4>{{ creator }}</h4>
		<h6>{{ tokenURI }}</h6>
		<h6>{{ metadataURI }}</h6>
		<h6>{{ timestamp }}</h6>
		<div v-if="authenticator.currentAccount == creator.toLowerCase()">
			<input type="number" placeholder="Set ask" v-model="setAskPrice"><br>
			<button @click="setAskBtn">Set Ask</button><br><br>
			{{currentAskPrice}}
		</div>
	</div>
</template>

<script>
import {tokenCreators,tokenURI,tokenMetadataURI,ensureContractIsSet} from '../util/mediaContract'
import {mapState} from 'vuex'
import store from '../store'

export default {
    name: 'NFT',
    metaInfo: {
        title: 'ANALOG NFTs — NFT',
        viewport: 'width=device-width, initial-scale=1'
    },
	computed: mapState(['authenticator', 'zora']),
	data () {
		return {
			id: null,
			creator: '',
			tokenURI: null,
			metadataURI: null,
			timestamp: null,
			setAskPrice: null,
			currentAskPrice: ''
		}
	},
	created() {
		this.id = this.$route.params.id
	},
	mounted() {
        ensureContractIsSet().then(() => {
			const promises = []
			promises.push(tokenCreators(this.id))
			promises.push(tokenURI(this.id))
			promises.push(tokenMetadataURI(this.id))
			Promise.all(promises).then((data) => {
				this.creator = data[0]
				this.tokenURI = data[1]
				this.metadataURI = data[2]
				store.state.zora.fetchCurrentAsk(this.id).then(res => { 
					if(res != 0) this.currentAskPrice=String(res/(Math.pow(10, 18)))+' ETH'
				})
			})
        })
    },
	methods: {
		async setAsk() {
			const askPrice = Number(this.setAskPrice)
			const ask = store.state.zora.constructAsk(askPrice)
			return await new Promise((resolve, reject) => {
				store.state.zora.isValidAsk(this.id, ask).then(res => resolve(res))
			})
			.then(res => {
				if(res) {
					return new Promise((resolve, reject) => {
						store.state.zora.setAsk(this.id, ask).then(res => resolve(res))
					})
				} else {
					reject(new Error('Ask price is not valid'))
				}
			})

		},
		setAskBtn() {
			this.setAsk().then(tx => {
				tx.wait(1).then(() => window.location.reload())
			})
		}
	}
}
</script>