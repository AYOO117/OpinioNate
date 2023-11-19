const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 3000
const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');
const pinataSDK = require('@pinata/sdk');
const axios = require('axios')
const FormData = require('form-data')
const { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction } = require("@hashgraph/sdk");
require('dotenv').config();
const { PINATA_API_KEY, PINATA_SECRET_KEY } = process.env;

let articleHashes = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const pinata = new pinataSDK( PINATA_API_KEY, PINATA_SECRET_KEY );
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkNGRhM2NjNS1hNTdkLTQyOTYtOTAxNC0xNzc4NTEyNWQ1OGIiLCJlbWFpbCI6ImZveWlraTg4MzlAcmVjdXR2LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI1NTczOTlkMTZiYjBkMzNiZjUzNSIsInNjb3BlZEtleVNlY3JldCI6IjhlODc0NWJhYTMxMDM3OGMzNjQ4MzljNmVlYmQ1YTAzNGZkNmE0OTFjZjdiMzUyNjFhZDBjYTRiY2I5NGJmMzgiLCJpYXQiOjE2OTQ3NzQyNjV9.iI_sKi7qgiFUkbtddsPOtaST5upzQ4JcyLdtXba6m0A'

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

// API calls
const newsAPIURL = 'https://newsapi.org/v2/everything?' +
    'q=Apple&' +
    'from=2023-10-28&' +
    'sortBy=popularity&' +
    'apiKey=8dca11ae84984fadb3facafbcacadc74';

let newsAPIReq = new Request(newsAPIURL);

// IPFS Interaction
const articlesUpload = async () => {
    const response = await fetch(newsAPIReq);
    const newsJson = await response.json();
    const fetchedArticlesFromAPI = newsJson.articles;
    console.log(fetchedArticlesFromAPI);
    
    for(i=0; i<fetchedArticlesFromAPI.length; i++){

        const articleName = fetchedArticlesFromAPI[i].title;
        const body = {
            title: fetchedArticlesFromAPI[i].title,
            content: fetchedArticlesFromAPI[i].content,
            source: fetchedArticlesFromAPI[i].source.name,
            author: fetchedArticlesFromAPI[i].author,
            publishedAt: fetchedArticlesFromAPI[i].publishedAt,
        };
        const options = {
            pinataMetadata: {
                name: articleName,
                keyvalues: {
                    
                }
            },
            pinataOptions: {
                cidVersion: 0
            }
        };
        const pinJSONFile = async () => {
            try{
                const res = await pinata.pinJSONToIPFS(body, options);
                console.log(res);
            }
            catch(error){
                console.log(error);
            }
        }
        pinJSONFile();
    }
};
// articlesUpload();

const articlesFetch = async () => {
    const filters = {
        status: 'pinned',
        pageLimit: 1000
    };
    const getPinList = async () => {
        try{
            const res = await pinata.pinList(filters);
            console.log(res.rows[0]);
        }
        catch(error){
            console.log(error);
        }
    
    }
    getPinList();
};
// articlesFetch();

const articleFetch = async (articleHash) => {
    const filters = {
        status: 'pinned',
        hashContains: articleHash,
    };
    const getPinList = async () => {
        try{
            const res = await pinata.pinList(filters);
            console.log(res);
        }
        catch(error){
            console.log(error);
        }
    
    }
    getPinList();
}
// articleFetch("QmbdaBsJUbdDQkWw1VjxqXw2tyotdDHgoZRWkr6AjPD6uK");

// Smart Contract Interaction
const getArticleHashes = async () => {
    const length = await OpinioNect.methods.articleHashLength().call();
    console.log(length)
    for(let i = 0; i < length; i++){
        const articleHash = await OpinioNect.methods.articleHash(i).call();
        articleHashes.push(articleHash);
        console.log(articleHash);
    }
};
// getArticleHashes();

const getArticle = async (i) => {
    const article = await OpinioNect.methods.getArticle(i).call();
    console.log(article);
}
// getArticle(i);

const getCommentsOnArticle = async (articleHash) => {
    const comments = await OpinioNect.methods.getCommentsOnArticle(articleHash).call();
    console.log(comments);
}
// getCommentsOnArticle("article hash hu me");

const addArticleHash = async (articleHash) => {
    const providersAccounts = await web3.eth.getAccounts();
    const defaultAccount = providersAccounts[0];
    const addArticleHash = await OpinioNect.methods.addArticle(articleHash).send({
        from: defaultAccount,
        gas: 1000000,
        gasPrice: 10000000000,
    });
    console.log('Transaction Hash: ' + addArticleHash.transactionHash);
}
// addArticleHash("article hash hu me");

const addComment = async (articleHash, comment) => {
    const providersAccounts = await web3.eth.getAccounts();
    const defaultAccount = providersAccounts[0];
    const addcommentOnArticle = await OpinioNect.methods.addComment(articleHash, comment).send({
        from: defaultAccount,
        gas: 1000000,
        gasPrice: 10000000000,
    });
    console.log('Transaction Hash: ' + addcommentOnArticle.transactionHash);
}
// addComment("article hash hu me", "me ek comment huu");

// Express
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.route('/articles')
    .get((req, res) => {
        res.send("Hello World");
    })
    .post((req, res) => {
        res.send("Hello World");
    });
    // articles array from ipfs taking all the hashes from blockchain
    // return object with key as article hash and value as article object

app.get('/article/:articleName', (req, res) => {
    res.send('Hello World!')
})

app.get('/comments/:articleHash', (req, res) => {
    res.send('Hello World!');
    // comments of an article from blockchain
})

app.post('/comment/:commentHash', (req, res) => {
    res.send('Hello World!')
    // post a comment on blockchain
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
