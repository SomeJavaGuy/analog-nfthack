<template>
<div class="hero_home v2">
    <div class="hero_content v2 no-bottom-border">
        <div class="form-block w-form">
        <form id="email-form" name="email-form" data-name="Email Form" class="form-3">
            <input v-model="newNFT.name" type="text" class="text-field w-input" autofocus="true" maxlength="256" name="title" data-name="title" placeholder="Title" id="title">
            <textarea v-model="newNFT.description" placeholder="Description..." maxlength="5000" id="field" name="field" class="text-field description w-input"></textarea>
            <input v-model="newNFT.creatorShare" type="text" class="text-field small w-input" maxlength="256" name="creator-share" data-name="creator-share" placeholder="Creator share" id="creator-share">
            <input v-model="newNFT.ownerShare" type="text" class="text-field small w-input" maxlength="256" name="owner-share" data-name="owner-share" placeholder="Owner share" id="owner-share">
            <input v-model="newNFT.prevOwnerShare" type="text" class="text-field small w-input" maxlength="256" name="prev-owner-share" data-name="prev-owner-share" placeholder="Previous owner share" id="prev-owner-share">
        </form>
        </div>
        <a @click="onPickFile" class="button v3 w-inline-block">
        <div class="button_textlink v3">SELECT IMAGE</div>
        </a>
        <a @click="mint" class="button v2 w-inline-block">
        <div class="button_textlink">MINT NFT</div>
        </a>
        <input type="file" ref="fileInput" accept="image/jpeg" @change="onFilePicked" style="display: none;"/>
    </div>
    <div class="hero_content"><img v-show="previewImg === null" src="../assets/image_preview.svg" loading="lazy" alt="" class="image-3"><img v-show="previewImg !== null" :src="previewImg" loading="lazy" alt="" class="image-3"></div>
</div>
</template>

<script>
import {mapState} from 'vuex'
import store from '../store'
import {generateMetadata} from '@zoralabs/zdk'
import {getContentHashApi} from '../util/api'
import {uploadToIPFS} from '../util/storage'
import {Blob} from 'nft.storage'
import {router} from '../router'

export default {
    name: 'Mint',
    metaInfo: {
        title: 'ANALOG NFTs — Mint new NFT',
        viewport: 'width=device-width, initial-scale=1'
    },
    computed: mapState(['authenticator', 'zora']),
    data: function (){
        return {
            newNFT: { name: null, description: null, image: null, creatorShare: null, ownerShare: null, prevOwnerShare: null, imgName: '' },
            uploadBtnText: 'Upload image',
            previewImg: null
        }
    },
    methods: {
        mint() {
            if(!this.authenticator.currentAccount) {
                console.log('Metamask not connected')
                return
            }
            if(this.newNFT.name === '' || this.newNFT.name === null || this.newNFT.name.value === 0) return
            if(this.newNFT.description === '' || this.newNFT.description === null || this.newNFT.description.value === 0) return
            if(this.newNFT.image === '' || this.newNFT.image === null || this.newNFT.image.value === 0) return
            if(this.newNFT.creatorShare === '' || this.newNFT.creatorShare === null || this.newNFT.creatorShare.value === 0) return
            if(this.newNFT.ownerShare === '' || this.newNFT.ownerShare === null || this.newNFT.ownerShare.value === 0) return
            if(this.newNFT.prevOwnerShare === '' || this.newNFT.prevOwnerShare === null || this.newNFT.prevOwnerShare.value === 0) return
            const metadataJSON = generateMetadata('zora-20210101', {
                description: this.newNFT.description,
                name: this.newNFT.name,
                mimeType: 'image/jpeg',
                version: 'zora-20210101',
            })
            uploadToIPFS(this.newNFT.image).then(cid => {
                console.log('img uploaded')
                return new Promise(function(resolve, reject){
                    getContentHashApi(cid)
                        .then(contentHash => resolve({cid: cid, contentHash: contentHash}))
                        .catch(error => reject(new Error(error)))
                })
            })
            .then(({cid, contentHash}) => {
                return new Promise(function(resolve, reject){
                    uploadToIPFS(new Blob([metadataJSON])).then(cidMeta => {
                        console.log('metadata uploaded')
                        getContentHashApi(cidMeta)
                            .then(metadataHash => resolve({cid: cid, contentHash: contentHash, cidMeta: cidMeta, metadataHash: metadataHash}))
                            .catch(error => reject(new Error(error)))
                    })
                    .catch(error => reject(new Error(error)))
                })
            })
            .then(({cid, contentHash, cidMeta, metadataHash}) => {
                store.state.zora.mintNFT(cid, cidMeta, contentHash, metadataHash, {creatorShare: Number(this.newNFT.creatorShare), ownerShare: Number(this.newNFT.ownerShare), prevOwnerShare: Number(this.newNFT.prevOwnerShare)})
                    .then(tx => router.push('feed'))
            })
        },
        onPickFile () {
            this.$refs.fileInput.click()
        },
        onFilePicked (event) {
            const files = event.target.files
            this.newNFT.image = files[0]
            this.newNFT.imgName = files[0].name
            this.previewImg = URL.createObjectURL(files[0])
        }
    }
}
</script>