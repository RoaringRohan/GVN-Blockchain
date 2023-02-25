require('dotenv').config();
const express = require('express');
const mysql2 = require('mysql2');
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
            const WalletSchema = require('../model/walletSchema');
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
            const RecordSchema = require('../model/recordSchema');
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

// router.get('/', async (req, res) => {
//     console.log('hello');
//      SEARCH FOR SPECIFIC BLOCK, only ADMIN can do this.
// });

function _generateHash(ownerAddress, information) {
    // Generate hash given information
    // Base the hash on CryptoNight's hashing algorithm or something
    // Make it possible for the information to be encrypted using ownerAddress's private key and to be decrypted by the ownerAddress's public key
}

function _createWallet(information) {
    // Make a call to wallet object class to make object, return it here
    // add the returned object to the Wallet table in the database
}

function _editWallet(walletObject, information) {
    // Make a query to database for that entry in Wallet table for specific wallet
    // Take the old wallet information from database, de-parse that information into variables
    // Make call to _createWallet and make a new wallet object with the old information plus new changed info, return it here
    // Adjust the wallet's information on database with new object (if database coded correctly, Trigger should happen making new transaction and record block at the same time)
}

function _sendGVN(sendersAddress, amt) {
    // Make a call to transaction object class to make object, return it here
    // Take transaction object and use it as a parameter for calling to another function called _createBlock to make the block, take that return object
    // add the block (returned object) to the record table (on the database)
}

function _smartRecordContract(recipientAddress, senderAddress, condition) {
    // Make call to transaction object class to make object, return it here
    // Make a block object based on transactions information, return block here
    // Create tuple in records table with new block added
}

function _borrowRecordContract(recipientAddress, senderAddress, condition) {
    // Make smartRecordContract method call here with special condition
}

function _searchBlocks(address_id) {
    // Search records table for any tuples where 'address_id' was used, create a linked list and return
}

module.exports = router;