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

// router.get('/', async (req, res) => {
//     console.log('hello');
//      MAKE GENESIS BLOCK FOR EXAMPLE, only ADMIN can do this, and this endpoint just gets used once, whenever you start up.
// });

module.exports = router;