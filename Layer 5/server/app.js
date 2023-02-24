require('dotenv').config();
const mysql2 = require('mysql2');
const express = require('express');


const app = express();

const PORT = 8000;

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

app.use('/api/layerZero/', require ('./routes/layerZero'));
app.use('/api/layerOne/', require ('./routes/layerOne'));
app.use('/api/layerTwo/', require ('./routes/layerTwo'));
app.use('/api/layerThree/', require ('./routes/layerThree'));

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
