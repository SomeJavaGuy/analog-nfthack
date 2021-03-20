<template>
    <div>
        <h1>Mint</h1>
        <div>
            <input type="text" placeholder="Name" v-model="newNFT.name"><br><br>
            <textarea placeholder="Description" v-model="newNFT.description"></textarea><br><br>
            <button class="btn btn-info" @click="onPickFile">{{uploadBtnText}}</button>{{newNFT.imgName}}<br><br>
            <input type="file" ref="fileInput" accept="image/jpeg" @change="onFilePicked" style="display: none;"/>
            <input type="number" placeholder="Creator Share" v-model="newNFT.creatorShare"><br><br>
            <input type="number" placeholder="Owner Share" v-model="newNFT.ownerShare"><br><br>
            <input type="number" placeholder="Previous Owner Share" v-model="newNFT.prevOwnerShare"><br><br>
            <button @click="mint">Mint</button>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import store from '../store'
import {generateMetadata} from '@zoralabs/zdk'
import {getContentHashApi} from '../util/api'
import {uploadToIPFS} from '../util/storage'
import {Blob} from 'nft.storage'

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
            uploadBtnText: 'Upload image'
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
                    .then(tx => console.log(tx))
            })
        },
        onPickFile () {
            this.$refs.fileInput.click()
        },
        onFilePicked (event) {
            const files = event.target.files
            this.newNFT.image = files[0]
            this.newNFT.imgName = files[0].name
            this.uploadBtnText = 'Change image'
        }
    }
}
</script>