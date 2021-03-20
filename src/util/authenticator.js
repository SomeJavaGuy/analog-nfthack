import { ethers } from 'ethers'
import store from '../store'

export default class Authenticator {
    constructor() {
        this.currentAccount = null
        this.provider = null
        this.signer = null
        this.initialize()
    }
    initialize() {
        if(!window.ethereum) return
        window.ethereum.on('accountsChanged', (accounts) => this.handleAccountsChanged(accounts))
        window.ethereum.request({ method: 'eth_accounts' })
            .then((accounts) => this.handleAccountsChanged(accounts))
            .catch((err) => { console.error(err) })
        window.ethereum.on('chainChanged', (_chainId) => this.handleChainChanged(_chainId))
    }
    async getChainId() {
        return parseInt(await window.ethereum.request({ method: 'eth_chainId' }), 16)
    }
    handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
            this.currentAccount = null
            // MetaMask is locked or the user has not connected any accounts
            console.log('Please connect to MetaMask.')
        } else if (accounts[0] !== this.currentAccount) {
            this.currentAccount = accounts[0]
            this.provider = new ethers.providers.Web3Provider(window.ethereum)
            this.signer = this.provider.getSigner()
            this.getChainId().then(chainId => {
                store.dispatch('registerZora', {signer: this.signer, chainId: chainId})
            })
        }
    }
    connectProvider() {
        window.ethereum.request({ method: 'eth_requestAccounts' })
            .then((accounts) => this.handleAccountsChanged(accounts))
            .catch((err) => {
                if (err.code === 4001) {
                    console.log('Please connect to MetaMask.')
                } else {
                    console.error(err)
                }
            })
    }
    handleChainChanged(_chainId) {
        window.location.reload()
    }
}