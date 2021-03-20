import {getNFTs} from './api'
import Promise from 'promise-polyfill'

async function loadNFTs(last, request) {
	return await new Promise((resolve, reject) => {
		getNFTs(last, request).then((res) => {
			resolve(res)
		}).catch(() => reject(new Error('failed to fetch NFTs')))
	})
}

export default loadNFTs