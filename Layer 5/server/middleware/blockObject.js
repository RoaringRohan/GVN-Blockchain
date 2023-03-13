const LinkedList = require('../frameworks/linkedList');

let currenttime;
let blocknum;
let blockhash;
let prevblockhash;
let transactions = new LinkedList();

class Block {
    // requires blockNum(int), hash(string), prevHash(string), listOfTransactions(linkedList of transactions array object)
    constructor(blockNum, hash, prevHash, listOfTransactions) {
        // find length of list of transactions
        if (listOfTransactions.size <= 2) {
            // Constructor for creating a new block with only one transaction
            this.setblocknum(blockNum);
            this.setblockhash(hash);
            this.setprevhash(prevHash);
            this.settransactions(listOfTransactions);
        }
        
        if (listOfTransactions.size > 2) {
            // Constructor for creating new block with complex number of transactions
            this.setblocknum(blockNum);
            this.setblockhash(hash);
            this.setprevhash(prevHash);
            this.settransactions(listOfTransactions);
        }
    }

    init() {
        return new Promise((resolve, reject) => {
            // // Creating 12-word mnemonic for user to remember and sign in with wallet
            // this.setprivatekey('./model/1-1000.txt');

            // // Creating a public key the user can use to deposit funds into their wallet with
            // this.setpublickey();

            // this.setlinkedtransactions(["1st transaction"]);

            this.blockcreatedon();

            resolve();
        });
    }

    blockcreatedon() {
        const currentDate = new Date();
        this.currenttime = currentDate.toLocaleString();
        return this.currenttime;
    }

    setblocknum(blockNum) {
        this.blocknum = blockNum;
    }

    setblockhash(hash) {
        this.blockhash = hash;
    }

    setprevhash(prevHash) {
        this.prevblockhash = prevHash;
    }

    settransactions(listOfTransactions) {
        this.transactions = listOfTransactions;
    }

    getblocknum() {
        return this.blocknum;
    }

    getblockhash() {
        return this.blockhash;
    }

    getprevhash() {
        return this.prevblockhash;
    }

    gettransactions() {
        return this.transactions;
    }
}

module.exports = Block;
