const pinataSDK = require('@pinata/sdk');
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const { Web3 } = require('web3'); //  web3.js has native ESM builds and (`import Web3 from 'web3'`)
const path = require('path');
const { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction, FileCreateTransaction, ContractCreateFlow, ContractCallQuery, ContractExecuteTransaction, ContractFunctionParameters } = require("@hashgraph/sdk");
require('dotenv').config();
const { PINATA_API_KEY, PINATA_SECRET_KEY } = process.env;

const pinata = new pinataSDK(PINATA_API_KEY, PINATA_SECRET_KEY);

var url = 'https://newsapi.org/v2/everything?' +
    'q=Apple&' +
    'from=2023-09-10&' +
    'sortBy=popularity&' +
    'apiKey=8dca11ae84984fadb3facafbcacadc74';

var req = new Request(url);

// fetch(req)
//     .then(function (response) {
//         return response.json(); // This returns a Promise
//     })
//     .then(function (data) {
//         console.log(data); // Log the data to the console
//     })
//     .catch(function (error) {
//         console.error('Error:', error);
//     });


// sapphire-polite-goldfish-433.mypinata.cloud
// API Key: 557399d16bb0d33bf535
// API Secret: 8e8745baa310378c364839c6eebd5a034fd6a491cf7b35261ad0ca4bcb94bf38
// JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkNGRhM2NjNS1hNTdkLTQyOTYtOTAxNC0xNzc4NTEyNWQ1OGIiLCJlbWFpbCI6ImZveWlraTg4MzlAcmVjdXR2LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI1NTczOTlkMTZiYjBkMzNiZjUzNSIsInNjb3BlZEtleVNlY3JldCI6IjhlODc0NWJhYTMxMDM3OGMzNjQ4MzljNmVlYmQ1YTAzNGZkNmE0OTFjZjdiMzUyNjFhZDBjYTRiY2I5NGJmMzgiLCJpYXQiOjE2OTQ3NzQyNjV9.iI_sKi7qgiFUkbtddsPOtaST5upzQ4JcyLdtXba6m0A

// pinata.testAuthentication().then((result) => {
//     //handle successful authentication here
//     console.log(result);
// }).catch((err) => {
//     //handle error here
//     console.log(err);
// });

const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkNGRhM2NjNS1hNTdkLTQyOTYtOTAxNC0xNzc4NTEyNWQ1OGIiLCJlbWFpbCI6ImZveWlraTg4MzlAcmVjdXR2LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI1NTczOTlkMTZiYjBkMzNiZjUzNSIsInNjb3BlZEtleVNlY3JldCI6IjhlODc0NWJhYTMxMDM3OGMzNjQ4MzljNmVlYmQ1YTAzNGZkNmE0OTFjZjdiMzUyNjFhZDBjYTRiY2I5NGJmMzgiLCJpYXQiOjE2OTQ3NzQyNjV9.iI_sKi7qgiFUkbtddsPOtaST5upzQ4JcyLdtXba6m0A'

const pinFileToIPFS = async () => {
    const formData = new FormData();
    const src = "path/to/file.png";

    const file = fs.createReadStream(src)
    formData.append('file', file)

    const pinataMetadata = JSON.stringify({
        name: 'File name',
    });
    formData.append('pinataMetadata', pinataMetadata);

    const pinataOptions = JSON.stringify({
        cidVersion: 0,
    })
    formData.append('pinataOptions', pinataOptions);

    try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            maxBodyLength: "Infinity",
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                Authorization: JWT
            }
        });
        console.log(res.data);
    } catch (error) {
        console.log(error);
    }
}

// pinFileToIPFS();
const MyCustomName = "MyCustomName";
const body = {
    message: 'Pinatas are awesome'
};
const options = {
    pinataMetadata: {
        name: MyCustomName,
        keyvalues: {
            customKey: 'customValue',
            customKey2: 'customValue2'
        }
    },
    pinataOptions: {
        cidVersion: 0
    }
};
const pinJSONFile = async () => {
    try {
        const res = await pinata.pinJSONToIPFS(body, options);
        console.log(res);
    }
    catch (error) {
        console.log(error);
    }
}
// pinJSONFile();
const filters = {
    status: 'pinned',
    pageLimit: 1000
};
const getPinList = async () => {
    try {
        const res = await pinata.pinList(filters);
        console.log(res);
    }
    catch (error) {
        console.log(error);
    }

}
// getPinList();

// pinata.pinList(filters).then((result) => {
//     //handle results here
//     console.log(result);
// }).catch((err) => {
//     //handle error here
//     console.log(err);
// });


// const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/your-infura-project-id')); // Replace with your Ethereum node URL
// const contractAbi = []; // ABI of the deployed FileHashStorage contract
// const contractAddress = '0xContractAddress'; // Address of the deployed contract
// const privateKey = 'your-private-key'; // Your private key

// const contract = new web3.eth.Contract(contractAbi, contractAddress);
// const fileHash = 'your-file-hash';

// // Sign the transaction
// const signTheTransaction = async () => {
//     const account = web3.eth.accounts.privateKeyToAccount(privateKey);
//     const nonce = await web3.eth.getTransactionCount(account.address);
//     const gasPrice = await web3.eth.getGasPrice();
//     const gasLimit = 300000; // Adjust gas limit as needed
// }
// signTheTransaction();

// const transactionData = contract.methods.storeFileHash(fileHash).encodeABI();
// const rawTransaction = {
//     nonce: nonce,
//     to: contractAddress,
//     gasPrice: gasPrice,
//     gasLimit: gasLimit,
//     data: transactionData,
// };
// const getSignedTransaction = async () => {
//     const signedTransaction = await web3.eth.accounts.signTransaction(rawTransaction, privateKey);
// }

// // Send the transaction
// web3.eth.sendSignedTransaction(signedTransaction.rawTransaction, (error, txHash) => {
//     if (!error) {
//         console.log(`Transaction hash: ${txHash}`);
//     } else {
//         console.error(`Error sending transaction: ${error}`);
//     }
// });
// Set up a connection to the Ganache network
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

// Log the current block number to the console
// web3.eth
//     .getBlockNumber()
//     .then(result => {
//         console.log('Current block number: ' + result);
//     })
//     .catch(error => {
//         console.error(error);
//     });


// For simplicity we use `web3` package here. However, if you are concerned with the size,
//  you may import individual packages like 'web3-eth', 'web3-eth-contract' and 'web3-providers-http'.


// Set up a connection to the Ethereum network
web3.eth.Contract.handleRevert = true;

// Read the bytecode from the file system
const bytecodePath = path.join(__dirname, 'OpinioNectBytecode.bin');
const bytecode = fs.readFileSync(bytecodePath, 'utf8');

// Create a new contract object using the ABI and bytecode
const abi = require('./OpinioNectAbi.json');
const MyContract = new web3.eth.Contract(abi);

async function deploy() {
    const providersAccounts = await web3.eth.getAccounts();
    const defaultAccount = providersAccounts[0];
    console.log('deployer account:', defaultAccount);

    const myContract = MyContract.deploy({
        data: '0x' + bytecode,
        arguments: [],
    });

    // optionally, estimate the gas that will be used for development and log it
    const gas = await myContract.estimateGas({
        from: defaultAccount,
    });
    console.log('estimated gas:', gas);

    try {
        // Deploy the contract to the Ganache network
        const tx = await myContract.send({
            from: defaultAccount,
            gas,
            gasPrice: 10000000000,
        });
        console.log('Contract deployed at address: ' + tx.options.address);

        // Write the Contract address to a new file
        const deployedAddressPath = path.join(__dirname, 'OpinioNectAddress.bin');
        fs.writeFileSync(deployedAddressPath, tx.options.address);
    } catch (error) {
        console.error(error);
    }
}

deploy();

async function environmentSetup() {

    //Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;

    // If we weren't able to grab it, we should throw a new error
    if (!myAccountId || !myPrivateKey) {
        throw new Error("Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be present");
    }

    //Create your Hedera Testnet client
    const client = Client.forTestnet();

    //Set your account as the client's operator
    client.setOperator(myAccountId, myPrivateKey);

    //Set the default maximum transaction fee (in Hbar)
    client.setDefaultMaxTransactionFee(new Hbar(100));

    //Set the maximum payment for queries (in Hbar)
    client.setMaxQueryPayment(new Hbar(50));

    //Create new keys
    const newAccountPrivateKey = PrivateKey.generateED25519();
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    //Create a new account with 1,000 tinybar starting balance
    const newAccount = await new AccountCreateTransaction()
        .setKey(newAccountPublicKey)
        .setInitialBalance(Hbar.fromTinybars(1000))
        .execute(client);

    // Get the new account ID
    const getReceipt = await newAccount.getReceipt(client);
    const newAccountId = getReceipt.accountId;

    //Log the account ID
    console.log("The new account ID is: " + newAccountId);

    //Verify the account balance
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log("The new account balance is: " + accountBalance.hbars.toTinybars() + " tinybar.");

    //Create the transfer transaction
    const sendHbar = await new TransferTransaction()
        .addHbarTransfer(myAccountId, Hbar.fromTinybars(-1000)) //Sending account
        .addHbarTransfer(newAccountId, Hbar.fromTinybars(1000)) //Receiving account
        .execute(client);

    //Verify the transaction reached consensus
    const transactionReceipt = await sendHbar.getReceipt(client);
    console.log("The transfer transaction from my account to the new account was: " + transactionReceipt.status.toString());

    //Request the cost of the query
    const queryCost = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .getCost(client);

    console.log("The cost of query is: " + queryCost);

    //Check the new account's balance
    const getNewBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log("The account balance after the transfer is: " + getNewBalance.hbars.toTinybars() + " tinybar.")


}
// environmentSetup();

const deployContract = async () => {
    //Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;

    // If we weren't able to grab it, we should throw a new error
    if (!myAccountId || !myPrivateKey) {
        throw new Error("Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be present");
    }

    //Create your Hedera Testnet client
    const client = Client.forTestnet();

    //Set your account as the client's operator
    client.setOperator(myAccountId, myPrivateKey);

    //Set the default maximum transaction fee (in Hbar)
    client.setDefaultMaxTransactionFee(new Hbar(100));

    //Set the maximum payment for queries (in Hbar)
    client.setMaxQueryPayment(new Hbar(50));

    //Import the compiled contract from the HelloHedera.json file
    let OpinioNect = require("./OpinioNect.json");
    const bytecode = OpinioNect.bytecode.object;

    //Create the transaction
    const contractCreate = new ContractCreateFlow()
        .setGas(100000)
        .setBytecode(bytecode);

    //Sign the transaction with the client operator key and submit to a Hedera network
    const txResponse = contractCreate.execute(client);

    //Get the receipt of the transaction
    const receipt = (await txResponse).getReceipt(client);

    //Get the new contract ID
    const newContractId = (await receipt).contractId;

    console.log("The new contract ID is " + newContractId);
    //SDK Version: v2.11.0-beta.1
}
deployContract();

const addArticle = async () => {
    const newContractId = '0.0.5789544';

    //Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;

    // If we weren't able to grab it, we should throw a new error
    if (!myAccountId || !myPrivateKey) {
        throw new Error("Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be present");
    }

    //Create your Hedera Testnet client
    const client = Client.forTestnet();

    //Set your account as the client's operator
    client.setOperator(myAccountId, myPrivateKey);

    //Set the default maximum transaction fee (in Hbar)
    client.setDefaultMaxTransactionFee(new Hbar(100));

    //Set the maximum payment for queries (in Hbar)
    client.setMaxQueryPayment(new Hbar(50));

    //Create the transaction to update the contract message
    const contractExecTx = await new ContractExecuteTransaction()
        //Set the ID of the contract
        .setContractId(newContractId)
        //Set the gas for the contract call
        .setGas(100000)
        //Set the contract function to call
        .setFunction("addArticle", new ContractFunctionParameters().addString("Me article hash huu"));

    //Submit the transaction to a Hedera network and store the response
    const submitExecTx = await contractExecTx.execute(client);

    //Get the receipt of the transaction
    const receipt2 = await submitExecTx.getReceipt(client);

    //Confirm the transaction was executed successfully 
    console.log("The transaction status is " + receipt2.status.toString());

    //Query the contract for the contract message
    const contractCallQuery = new ContractCallQuery()
        //Set the ID of the contract to query
        .setContractId(newContractId)
        //Set the gas to execute the contract call
        .setGas(100000)
        //Set the contract function to call
        .setFunction("articleHashLength")
        //Set the query payment for the node returning the request
        //This value must cover the cost of the request otherwise will fail 
        .setQueryPayment(new Hbar(10));

    //Submit the transaction to a Hedera network 
    const contractUpdateResult = await contractCallQuery.execute(client);

    //Get the updated message at index 0
    const message2 = contractUpdateResult.getUint256();

    //Log the updated message to the console
    console.log("The updated contract message: " + message2);

    //v2 Hedera JavaScript SDK
}
// addArticle();

// const get
