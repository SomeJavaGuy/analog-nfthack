import { sha256FromBuffer } from '@zoralabs/zdk'

var request = require('request')

module.exports = async (req, res) => {
    const { query: { cid } } = req
    request.get('https://gateway.pinata.cloud/ipfs/'+cid, function read(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.json(sha256FromBuffer(body))
        } else {
            res.status(400)
            res.json({error: 'Bad Request', timestamp: Date.now()})
        }
    })
}