<template>
	<div class='nft'>
		<h2> token id: {{ nft.id }} </h2>
		<h4> {{ nft.creator }} </h4>
		<h6> {{ nft.tokenURI }} </h6>
		<h6> {{ nft.medatataURI }} </h6>
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