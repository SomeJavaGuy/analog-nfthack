<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>


export default {
  name: 'App',
  metaInfo: {
    title: 'NFT Marketplace',
    viewport: 'width=device-width, initial-scale=1'
  }
}
</script>
