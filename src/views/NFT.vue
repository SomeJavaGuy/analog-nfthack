<template>
	<div>
		<h1>NFT {{id}}</h1>
		<h4>{{ creator }}</h4>
		<h6>{{ tokenURI }}</h6>
		<h6>{{ metadataURI }}</h6>
		<h6>{{ timestamp }}</h6>
	</div>
</template>

<script>
import {tokenCreators,tokenURI,tokenMetadataURI,ensureContractIsSet} from '../util/mediaContract'

export default {
    name: 'NFT',
    metaInfo: {
        title: 'ANALOG NFTs — NFT',
        viewport: 'width=device-width, initial-scale=1'
    },
	data () {
		return {
			id: null,
			creator: null,
			tokenURI: null,
			metadataURI: null,
			timestamp: null
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
			})
        })
    }
}
</script>