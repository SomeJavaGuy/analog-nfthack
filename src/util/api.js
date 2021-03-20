import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

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

export { getContentHashApi }