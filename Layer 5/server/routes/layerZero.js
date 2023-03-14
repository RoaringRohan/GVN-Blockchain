require('dotenv').config();
const express = require('express');
const mysql2 = require('mysql2');
const fs = require('fs');
const { Keccak } = require('sha3');
const CryptoJS = require("crypto-js");

const LinkedList = require('../frameworks/linkedList');
const Hash = require('../frameworks/hash');
const Wallet = require('../middleware/walletObject');
const Transaction = require('../middleware/transactionObject');
const Block = require('../middleware/blockObject');

const router = express.Router();

const db = mysql2.createConnection ({
    host: 'localhost',
    user: 'root',
    password: process.env.ROOTPASS,
    database: 'ledger'
})

db.connect((err) => {    
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;


// Checking to see if 'wallet' table exists, if not then create
db.query(`SELECT EXISTS (
    SELECT 
        TABLE_NAME
    FROM 
    information_schema.TABLES 
    WHERE 
    TABLE_SCHEMA LIKE 'ledger' AND 
        TABLE_TYPE LIKE 'BASE TABLE' AND
        TABLE_NAME = 'wallets'
    );`, (err, results) => {
        let check = JSON.stringify(results).slice(-3, -2);
        
        if (check == '0') {
            const WalletSchema = require('../models/walletSchema');
            let makeWalletSchema = new WalletSchema();
        }

        else {
            console.log("Wallet Schema already made.")
        }
});

// Checking to see if 'records' table exists, if not then create
db.query(`SELECT EXISTS (
    SELECT 
        TABLE_NAME
    FROM 
    information_schema.TABLES 
    WHERE 
    TABLE_SCHEMA LIKE 'ledger' AND 
        TABLE_TYPE LIKE 'BASE TABLE' AND
        TABLE_NAME = 'records'
    );`, (err, results) => {
        let check = JSON.stringify(results).slice(-3, -2);
        
        if (check == '0') {
            const RecordSchema = require('../models/recordSchema');
            let makeRecordSchema = new RecordSchema();
        }

        else {
            console.log("Record Schema already made.")
        }
});

// db.query(`INSERT INTO ticket (subject, description, software, dateOpened, state, priorityLevel, userID, issuerID)
//         VALUES ("${req.body.subject}", "${req.body.description}", "${req.body.software}", "${todayDate()}", "open", 1, ${req.body.userID}, ${req.body.issuerID})`, (err, results) => {
//             if (err) return res.status(400).send(err.sqlMessage);
//             return res.send(results)
//         });

// router.post('/', async (req, res) => {
//     console.log('hello');
//      MAKE GENESIS BLOCK FOR EXAMPLE, only ADMIN can do this, and this endpoint just gets used once, whenever you start up.
// });

router.get('/wallet/:data?', async (req, res) => {
    if (req.params.data !== undefined && req.params.data !== null) {
        const hash = await _createWallet(req.params.data);
    }
    else {
        console.log("No data provided.")
        const hash = await _createWallet("////////////");
    }

    console.log('done');
    // Prints wallet object
    await res.sendStatus(200);

    
    // Didn't actually check if this hash works
     //SEARCH FOR SPECIFIC BLOCK, only ADMIN can do this.
});

router.get('/', async (req, res) => {
    const hash = await _createWallet();
    console.log('done');
    await res.sendStatus(200);
});

router.get('/genesis', async (req, res) => {
    db.query(
        'INSERT INTO ledger.records (block_id, hash, prevHash, data) VALUES (?, ?, ?, ?)',
        [0, 'Genesis-block', 'No-previous-hash', '123'],
        (error, results) => {
          if (error) {
            console.error(error);
          } else {
            console.log('Tuple inserted successfully');
          }
        }
      );
    console.log('done');
    await res.sendStatus(200);
});

function _generateHash(ownerAddress, information) {
    // Generate hash given information
    // Base the hash on CryptoNight's hashing algorithm or something, pass to generateAlgo()
    // Bring it back here and hash a custom combo for GVN
    // Make it possible for the information to be encrypted using ownerAddress's private key and to be decrypted by the ownerAddress's public key
    const temp = _generateEncryptionAlgorithm("testing data");
    return temp;
}

function _generateEncryptionAlgorithm(data) {
    // Taken from CryptoNight's hashing algorithm
    // Doesn't use CryptoNight's algorithm I lied**
    // I'm sorry it does use CryptoNight's algorithm hehe*** 2023-02-27
    // So basically it uses a few diff encryptions such as Keccak, AES, and some other algorithms.
    // Returns hash

    const dataString = data.toString();

    // First, we need to calculate the Keccak hash of the data input.
    const keccakHash = CryptoJS.SHA3(dataString, { outputLength: 512 });

    // Next, we take the first 31 bytes of the Keccak hash and use it as the AES encryption key.
    const aesKey = keccakHash.toString().substring(0, 62); // We need 62 characters, since each character is represented by 2 hex digits.
    const aesKeyBytes = CryptoJS.enc.Hex.parse(aesKey); // Converting the key to a byte array
  
    // Encrypting the first 31 bytes of the Keccak hash using AES-256
    const encryptedKey = CryptoJS.AES.encrypt(
        keccakHash.toString(),
        aesKeyBytes,
        { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7, keySize: 256 }
    );
  
    // Encrypting the rest of the Keccak hash using AES-256
    const encryptedHash = CryptoJS.AES.encrypt(
        keccakHash.toString().substring(62),
        aesKeyBytes,
        { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7, keySize: 256 }
    );
  
    // Combining the encrypted key and hash to form the CryptoNight workspace
    const workspace = encryptedKey.toString() + encryptedHash.toString();
  
    // Applying the remaining hash functions (BLAKE-256, Groestl-256, JH-256 and Hank-256) to the workspace
    const finalHash = CryptoJS.SHA3(workspace, {
        outputLength: 256,
        shakeLen: 256,
    })
        .concat(CryptoJS.SHA3(workspace, { outputLength: 256 }))
        .concat(CryptoJS.RIPEMD160(workspace))
        .concat(CryptoJS.SHA256(workspace))
        .toString();
  
    // Return the final hash
    return finalHash;
}

function _createWallet(personalData) {
    // Make a call to wallet object class to make object, return it here
    // add the returned object to the Wallet table in the database
    // const Transaction = require('../middleware/transactionObject');
    const wallet = personalData ? new Wallet(personalData) : new Wallet();
    
    const promise1 = wallet.init().then(() => {
        // const privateKey = wallet.getprivatekey();
        // const publicKey = wallet.getpublickey();
        // const data = wallet.getdata();
        // const balance = wallet.getbalance();
        // const linkedTransactions = wallet.getlinkedtransactions();
        console.log("Wallet created with data being : " + personalData);
        console.log(wallet.getpublickey());
        console.log(wallet.getprivatekey());
        

        return promise1;
    });
}

function _editWallet(walletObject, information) {

    // Make a query to database for that entry in Wallet table for specific wallet
    // Take the old wallet information from database, de-parse that information into variables
    // Make call to _createWallet and make a new wallet object with the old information plus new changed info, return it here
    // Adjust the wallet's information on database with new object (if database coded correctly, Trigger should happen making new transaction and record block at the same time)

    // wallet.init('{"PrivateKey": "my_private_key"}');

    const Wallet = require('../middleware/walletObject');

    if (information.PrivateKey && Array.isArray(information.PrivateKey) && information.PrivateKey.length === 12) {
        makeWalletObject = new Wallet(information);
    }

}

function _createTransaction(type, amtToSend, recipientAddress, senderAddress, transactionInfo) {
    let transaction;
    console.log(transactionInfo);
    if (transactionInfo === null) {
        console.log("attempting")
        transaction = new Transaction(type, amtToSend, recipientAddress, senderAddress, 'not-verified');
    } else {
        console.log("attempting 2")
        console.log(transactionInfo);
        transaction = new Transaction(type, amtToSend, recipientAddress, senderAddress, transactionInfo);
    }

    console.log("got to here")
    const promise = transaction.init().then(() => {
        const accessToDatabase = transaction.getAccessToDatabase();
        const transaction_id = transaction.getTransactionID();
    
        const linkedList = new LinkedList();
        linkedList.add(transaction_id);

        if (accessToDatabase) {
            console.log('true access to database');
            return _createBlock(recipientAddress, linkedList);

        } else {
            console.log('false access to database');
            return false;
        }
    });
    return promise;

    // const accessToDatabase = transaction.getaccessToDatabase();
    //       if (!accessToDatabase) {
    //         console.log('false access to database');
    //       } 
    //       else {
    //         console.log('true access to database');
    //       }
    //       return transaction;
    // });
}

function _createBlock(recipientAddress, listOfTransactions) {
    return new Promise((resolve, reject) => {
        let string;

        if (listOfTransactions.size <= 2) {
            //Make miner reward small
            string = listOfTransactions.toString();
        } 
        else if (listOfTransactions.size === 3) {
            //Make miner reward medium
            string = listOfTransactions.toString();
        } 
        else if (listOfTransactions.size === 4) {
            //Make miner reward large
            string = listOfTransactions.toString();
        } 
        else {
            reject("transactions is missing");
        }

        const hash = _generateHash(recipientAddress, string);

        db.query(
            'SELECT block_id, prevHash FROM ledger.records WHERE block_id = (SELECT MAX(block_id) FROM ledger.records);',
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    // Add 1 to the max block ID to get the next block ID
                    const highestBlockId = results[0].block_id;
                    const prevHash = results[0].prevHash;
        
                    const block = new Block(highestBlockId + 1, hash, prevHash, listOfTransactions);
        
                    const promise = block.init().then(() => {
                        const getblocknum = block.getblocknum();
                        console.log(getblocknum);
                        const getblockhash = block.getblockhash();
                        console.log(getblockhash);
                        const getblockprevhash = block.getprevhash();
                        console.log(getblockprevhash);
        
                        db.query(
                            'INSERT INTO ledger.records (block_id, hash, prevHash, data) VALUES (?, ?, ?, ?)',
                            [getblocknum, getblockhash, getblockprevhash, string],
                            (error, results) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    console.log("successfully added to database of block #: " + getblocknum);
                                    resolve(true);
                                }
                            }
                        );
                    });
                }
            }
        );
    });
  }

function _sendGVN(sendersAddress, amt) {
    // Make a call to transaction object class to make object, return it here, make transition object type to be money transfer
    // Make call to transaction object class to make object, return it here, make transition object type to be smart contract with TRON network for binding coins from fiat to TRON, like ETH
    // [use _smartRecordContract()] And the contract is linked to GVN currency as part of smart contract, and the smart contract's conditions will include the ability for when the user of a specific wallet address wishes to withdraw their wallet balance
    // Take transaction object and use it as a parameter for calling to another function called _createBlock to make the block, take that return object
    // add the block (returned object) to the record table (on the database)
}

function _sendTRON(sendersAddress, amt) {
    // Same as sendGVN but on ERC network
    // After making the block to database, then make a call to Tron for a smart contract
}

function _smartRecordContract(recipientAddress, senderAddress, condition) {
    // Make call to transaction object class to make object, return it here
    // Make a block object based on transactions information, return block here
    // Create tuple in records table with new block added
    

}

function _borrowRecordContract(recipientAddress, senderAddress, condition) {
    // Make smartRecordContract method call here with special condition
    // USE THIS METHOD TO MAKE SMART RECORD CONTRACT, for purchasing Tron tokens as GVN tokens are sent successfully to a wallet
}

function _searchBlocksbyID() {
    // Search records table for any tuples where 'address_id' was used, create a linked list and return

}

function _searchBlocksbyTransactionID() {

}

module.exports = router;


//*-----------------------------------------------------------------------------*NOTES*----------------------------------------------------------------
    // const promise2 = promise1.then(() => {

    //   if (personalData === null) {
    //     const publicKey = wallet.getpublickey();
    //     console.log("trying to do this")
    //     const transaction = _createTransaction("make", 100, publicKey, process.env.GVN, "////////////");
  
    //   } else {
    //     const publicKey = wallet.getpublickey();
    //     const transaction = new Transaction("make", 100, publicKey, process.env.GVN, "personalData");
  
    //     // // transaction object's init is successful, it will return true
    //     // if (transaction) {
    //     //     // Make a call to record table in database, take the transaction object and add it to record table
    //     //     _createBlock();
    //     // }
    //     // else {
    //     //     return console.log('transaction object could not be created, try again');
    //     // }
    //   }
    // });
  
    // return Promise.all([promise1, promise2]).then(() => true);