const fs = require('fs');
const LinkedList = require('../frameworks/linkedList');

let privatekey;
let publickey;
let data;
let type;
let lastedited;
let balance = 0;
let linkedtransactions = new LinkedList();

class Wallet {
    constructor(data) {
        if (data === null) {
            // Constructor without any personal user data

            this.type = 'auto-generated';
            this.setdata("");
        }
        
        else {
            // Constructor with personal user data

            this.type = 'edited';
            this.setdata(data);
        }
    }

    init() {
        return new Promise((resolve, reject) => {
            // Add 100 coins to wallet on initialization
            this.addbalance(100);

            // Creating 12-word mnemonic for user to remember and sign in with wallet
            this.setprivatekey('./models/1-1000.txt');

            // Creating a public key the user can use to deposit funds into their wallet with
            this.setpublickey();

            
            this.setlinkedtransactions(["1st transaction"]);

            this.lasteditedon();

            resolve();
        });
    }
  
    setprivatekey(filePath) {
        // Read the file and split it into an array of words
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const words = fileContent.split(/\s+/);

        // Select 12 random words
        const randomWords = [];
        while (randomWords.length < 12) {
            const randomIndex = Math.floor(Math.random() * words.length);
            const randomWord = words[randomIndex];
            if (!randomWords.includes(randomWord)) {
                randomWords.push(randomWord);
            }
        }

        this.privatekey = randomWords.toString();
        
        return privatekey;
    }

    getprivatekey() {
        return this.privatekey;
    }
  
    setpublickey(privatekey) {
        // Code to generate a private key from the 12 words
        // ******DO EVENTUALLY****
        this.publickey = 'public key (0xonweorinvwpnqd....)';

        return publickey;
    }
    
    getpublickey() {
        return this.publickey;
    }

    setdata(data) {
        this.data = data;
    }

    getdata() {
        return this.data;
    }

    addbalance(amtToAdd) {
        this.balance = balance + amtToAdd;
        return true;
    }

    subtractbalance(amtToSubtract) {
        const check = this.checkforsubtractablebalance(amtToSubtract);
        if (check === true) {
            this.balance = balance - amtToSubtract;
            return true;
        }
        else {
            console.log("Not enough balance to subtract");
            return false;
        }
    }

    getbalance() {
        return this.balance;
    }

    checkforsubtractablebalance(amtToSubtract) {
        if (this.balance > amtToSubtract) {
            return true;
        }
        else {
            return false;
        }
    }

    getlinkedtransactions() {
        return this.linkedtransactions;
    }

    setlinkedtransactions(linkedtransactions) {
        this.linkedtransactions = linkedtransactions;
    }

    lasteditedon() {
        const currentDate = new Date();
        this.lastedited = currentDate.toLocaleString();
        return true;
    }
}

module.exports = Wallet;
