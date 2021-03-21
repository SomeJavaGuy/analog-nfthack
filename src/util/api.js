import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from '../store'

Vue.use(VueAxios, axios)

function getContentHashApi(cid){
    let res = new Promise(function(resolve, reject){
        axios.get('/api/get-content-hash', {params: { cid: cid }})
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(new Error(error))
            })
    })

    return res
}

function addNFTtoFirestore(data){
    let res = new Promise(function(resolve, reject){
        axios.get('/api/add-nft', {params: {data: data}})
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(new Error(error))
            })
    })

    return res
}

function getNFTs(last, request){
    let res = new Promise(function(resolve, reject){
        var req = request
        if(req == "minted") req = store.state.authenticator.currentAccount
        axios.get('/api/get-nfts', {params: {last: last, request: req}})
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(new Error(error))
            })
    })

    return res
}

export { getContentHashApi, addNFTtoFirestore, getNFTs }