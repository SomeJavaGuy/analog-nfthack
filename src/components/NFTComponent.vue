<template>
	<div class='nft'>
		<router-link :to="{name: 'nft', params: { id: nft.id }}">token id: {{ nft.id }}</router-link><br>
		<h4> {{ nft.creator }} </h4>
		<h6> {{ nft.tokenURI }} </h6>
		<h6> {{ nft.metadataURI }} </h6>
		<h6> {{nft.timestamp}} </h6>
	</div>
</template>

<script>
export default {
	props: {
		nft: Object
	}
}
</script>