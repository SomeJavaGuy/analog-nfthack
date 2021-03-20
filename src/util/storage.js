import {NFTStorage} from "nft.storage"
const client = new NFTStorage({ token: process.env.VUE_APP_NFT_STORAGE })

async function uploadToIPFS(file) {
    return await client.storeBlob(file)
}

export {uploadToIPFS}