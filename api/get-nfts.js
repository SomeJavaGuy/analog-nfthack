const firebase = require('firebase/app')
require('firebase/firestore')

var firebaseConfig = {
    apiKey: process.env.FB_APP_API_KEY,
    authDomain: process.env.FB_APP_AUTH_DOMAIN,
    projectId: process.env.FB_APP_PROJECT_ID,
    storageBucket: process.env.FB_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.FB_APP_MESSAGING_SENDER_ID,
    appId: process.env.FB_APP_ID
}

firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()

module.exports = async (req, res) => {
    const { query: { last, request } } = req
    let snapshot = null
    
    if(request == "all") {
        if(last == 0) {
            snapshot = await db.collection('nfts').orderBy('id', 'desc').limit(2).get()
        } else {
            snapshot = await db.collection('nfts').orderBy('id', 'desc').startAfter(parseInt(last)).limit(2).get()
        }
        const docs = snapshot.docs.map(doc => doc.data())
        const lastItem = docs[docs.length - 1]
        res.json({docs, lastItem})
    } else {
        if(last == 0) {
            console.log(request)
            snapshot = await db.collection('nfts').where("creator", "==", request).orderBy('id', 'desc').limit(2).get()
        } else {
            snapshot = await db.collection('nfts').where("creator", "==", request).orderBy('id', 'desc').startAfter(parseInt(last)).limit(2).get()
        }
        const docs = snapshot.docs.map(doc => doc.data())
        const lastItem = docs[docs.length - 1]
        res.json({docs, lastItem})
    }
}