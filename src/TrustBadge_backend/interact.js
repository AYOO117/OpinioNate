const { Web3 } = require('web3'); //  web3.js has native ESM builds and (`import Web3 from 'web3'`)
const fs = require('fs');
const path = require('path');

// Set up a connection to the Ethereum network
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
web3.eth.Contract.handleRevert = true;

// Read the contract address from the file system
const deployedAddressPath = path.join(__dirname, 'OpinioNectAddress.bin');
const deployedAddress = fs.readFileSync(deployedAddressPath, 'utf8');

// Read the bytecode from the file system
const bytecodePath = path.join(__dirname, 'OpinioNectBytecode.bin');
const bytecode = fs.readFileSync(bytecodePath, 'utf8');

// Create a new contract object using the ABI and bytecode
const abi = require('./OpinioNectAbi.json');
const OpinioNect = new web3.eth.Contract(abi, deployedAddress);

async function interact() {
    const providersAccounts = await web3.eth.getAccounts();
    const defaultAccount = providersAccounts[0];

    try {
        // add an aricle
        const addArticleHash = await OpinioNect.methods.addArticle("article hash hu me").send({
            from: defaultAccount,
            gas: 1000000,
            gasPrice: 10000000000,
        });
        console.log('Transaction Hash: ' + addArticleHash.transactionHash);

        // Get article hash
        const gotArticleHash = await OpinioNect.methods.articleHash(0).call();
        console.log('Article Hash: ' + gotArticleHash);

        // Comment on article
        const addcommentOnArticle = await OpinioNect.methods.addComment("article hash hu me", "me ek comment huu").send({
            from: defaultAccount,
            gas: 1000000,
            gasPrice: 10000000000,
        });
        console.log('Transaction Hash: ' + addcommentOnArticle.transactionHash);

        // Get comments on article
        const gotCommentOnArticle = await OpinioNect.methods.getCommentsOnArticle("article hash hu me").call();
        console.log('Comments on article: ' + gotCommentOnArticle);
    } catch (error) {
        console.error(error);
    }
}

interact();
