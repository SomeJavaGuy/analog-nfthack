import Promise from 'promise-polyfill'
import store from '../store'
import { Zora } from '@zoralabs/zdk'
import {
    constructBidShares,
    constructMediaData,
    isMediaDataVerified
} from '@zoralabs/zdk'
import {addNFTtoFirestore} from './api'

export default class ZoraInstance {
    constructor(signer, chainId) {
        const mediaAddress = '0xB234eE08DB3b800FD1eEaFF3a01eA3509Cb5297F'
        const marketAddress = '0x7dF9B10A9dAeB86Eae91e9CDBB75BDc44437E7F4'
        const zora = new Zora(signer, chainId, mediaAddress, marketAddress)
        this.instance = zora
    }
    async mint(mediaData, bidShares) {
        return await this.instance.mint(mediaData, bidShares)
    }
    async mintNFT(tokenCID, metadataCID, contentHash, metadataHash, {creatorShare, ownerShare, prevOwnerShare}) {

        const tokenURI = 'https://ipfs.io/ipfs/' + tokenCID
        const metadataURI = 'https://ipfs.io/ipfs/' + metadataCID

        const mediaData = constructMediaData(
            tokenURI,
            metadataURI,
            contentHash,
            metadataHash
        )
        
        const bidShares = constructBidShares(
            creatorShare, // creator share
            ownerShare, // owner share
            prevOwnerShare // prevOwner share
        )

        let tx = await new Promise(function(resolve, reject) {
            this.mint(mediaData, bidShares)
                .then(tx => resolve(tx))
                .catch(error => reject(new Error(error)))
        }.bind(this))
        .then((tx) => {
            return new Promise(function(resolve, reject){
                const data = {
                    id: null,
                    creator: store.state.authenticator.currentAccount,
                    metadataURI: 'https://gateway.pinata.cloud/ipfs/' + metadataCID,
                    tokenURI: 'https://gateway.pinata.cloud/ipfs/' + tokenCID,
                    timestamp: null
                }
                console.log(data)
                addNFTtoFirestore(data).then((res) =>{ 
                    resolve(res)
                })
            })
        })
        
        return tx
    }
}