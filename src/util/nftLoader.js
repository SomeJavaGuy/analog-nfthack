import {getNFTs} from './api'
import Promise from 'promise-polyfill'

async function loadNFTs(last) {
	return await new Promise((resolve, reject) => {
		getNFTs(last).then((res) => {
			resolve(res)
		}).catch(() => reject(new Error('failed to fetch NFTs')))
	})
}

export default loadNFTs