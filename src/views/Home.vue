<template>
    <div>
        <h1>Home</h1>
        <button @click="connectProvider" v-if="authenticator.currentAccount === null">Connect to Metamask</button>
        <p>Current account: {{authenticator.currentAccount}}</p>
        <div>
            <input type="text" placeholder="Name" v-model="newNFT.name"><br><br>
            <textarea placeholder="Description" v-model="newNFT.description"></textarea><br><br>
            <button class="btn btn-info" @click="onPickFile">Upload profile picture</button><br><br>
            <input type="file" ref="fileInput" accept="image/jpeg" @change="onFilePicked" style="display: none;"/>
            <input type="number" placeholder="Creator Share" v-model="newNFT.creatorShare"><br><br>
            <input type="number" placeholder="Owner Share" v-model="newNFT.ownerShare"><br><br>
            <input type="number" placeholder="Previous Owner Share" v-model="newNFT.prevOwnerShare"><br><br>
            <button @click="mint">Mint</button>
        </div>
        <br>
        <br>
        Name: {{newNFT.name}}<br>
        Description: {{newNFT.description}}<br>
        Image: {{newNFT.image}}<br>
        Shares:
        CreatorShare: {{newNFT.creatorShare}}<br>
        OwnerShare: {{newNFT.ownerShare}}<br>
        prevOwnerShare: {{newNFT.prevOwnerShare}}<br>
        <ListNFTs/>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import store from '../store'
import {generateMetadata} from '@zoralabs/zdk'
import {getContentHashApi} from '../util/api'
import {uploadToIPFS} from '../util/storage'
import {Blob} from 'nft.storage'
import ListNFTs from '../components/ListNFTs.vue'

export default {
    components: { ListNFTs },
    name: 'Home',
    computed: mapState(['authenticator', 'zora']),
    data: function (){
        return {
            newNFT: { name: null, description: null, image: null, creatorShare: null, ownerShare: null, prevOwnerShare: null },
        }
    },
    methods: {
        connectProvider() {
            store.state.authenticator.connectProvider()
        },
        mint() {

            console.log('mint operation called')

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
        }
    },
    beforeCreate () {
        store.dispatch('registerAuthenticator')
    }
}
</script>