## ETHGlobal NFTHack Project
# ANALOG NFTs –  NFT platform designed for film photographers

![preview](https://user-images.githubusercontent.com/19251998/111911618-9cfc2680-8a66-11eb-98a0-3139380700df.jpg)

## Description

This platform developed using the Zora protocol enables film photographers from all around the world to store film scans as NFTs on the Ethereum blockchain. Just like how one frame captured on film is forever unique, its digital version will be equally unique on the blockchain.

## How It's Made

This Vue.js web app is using the Zora protocol to mint, sell and exchange NFT tokens. Accounts that minted through this NFT platform are stored in a Firebase Firestore database for indexing. After the NFT is minted, a webhook will be triggered by Parsiq's smart trigger which monitors the Transfer() events of the NFT smart contract and returns the newly minted token ID. This way, even if the user leaves the website before the transaction gets confirmed, the database will be updated with the newly created ID by a web hook.
