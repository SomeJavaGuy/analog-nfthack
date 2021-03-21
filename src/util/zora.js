import Promise from 'promise-polyfill'
import store from '../store'
import { constructAsk, Zora } from '@zoralabs/zdk'
import {
    constructBidShares,
    constructMediaData,
    Decimal
} from '@zoralabs/zdk'
import { formatUnits } from 'ethers/lib/utils'
import {addNFTtoFirestore} from './api'

export default class ZoraInstance {
    constructor(signer, chainId) {
        const mediaAddress = '0xB234eE08DB3b800FD1eEaFF3a01eA3509Cb5297F'
        const marketAddress = '0x7dF9B10A9dAeB86Eae91e9CDBB75BDc44437E7F4'
        const zora = new Zora(signer, chainId, mediaAddress, marketAddress)
        this.instance = zora
        this.currency = '0xd92e713d051c37ebb2561803a3b5fbabc4962431'
    }
    constructAsk(amount) {
        return constructAsk(this.currency, Decimal.new(amount).value)
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
    async isValidAsk(id, ask) {
        return await this.instance.isValidAsk(id, ask)
    }
    async setAsk(id, ask) {
        return await this.instance.setAsk(id, ask)
    }
    async fetchCurrentAsk(id) {
        const res = await this.instance.fetchCurrentAsk(id)
        return parseFloat(formatUnits(res.amount, 'wei'))
    }
}