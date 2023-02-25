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



// Use this as a template for making any endpoints in this class, but not necessary as this class will only have methods to communicate directly with database
// router.get('/', async (req, res) => {
//     console.log('hello');
// });

module.exports = router;