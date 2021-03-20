<template>
	<div>
		<h1>NFT {{id}}</h1>
		<h4>{{ creator }}</h4>
		<h6>{{ tokenURI }}</h6>
		<h6>{{ medatataURI }}</h6>
		<h6>{{ timestamp }}</h6>
	</div>
</template>

<script>
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
			medatataURI: null,
			timestamp: null
		}
	},
	created() {
		this.id = this.$route.params.id
	}
}
</script>