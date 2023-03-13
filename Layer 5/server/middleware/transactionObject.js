// Use this class to make sure that an object is created correctly and conforms to the rules described here, then send the object back to the respective class

let type;
let receipientAddress;
let senderAddress;
let gvnAmount = 0;
let data = "";
let gasFee = 0;
let txID = "";
let accessToDatabase;

const Transaction = class {
    constructor(type, gvnAmount, receipientAddress, senderAddress, optionalData) {
        if (type === "make") {
            this.type = 0;
            this.gvnAmount = gvnAmount;
            this.data = optionalData;
            this.receipientAddress = receipientAddress;
            this.senderAddress = senderAddress;
            this.makewalletTransaction();
        }
        else if (type === "edit"){
            this.type = 0;
            this.gvnAmount = gvnAmount;
            this.data = optionalData;
            this.receipientAddress = receipientAddress;
            this.senderAddress = senderAddress;
            this.editwalletTransaction();
        }
        else if (type === "send"){
            this.type = 0;
            this.gvnAmount = gvnAmount;
            this.data = optionalData;
            this.receipientAddress = receipientAddress;
            this.senderAddress = senderAddress;
            this.sendGVNTransaction();
        }
        else if (type === "borrow"){
            this.type = 1;
            this.gvnAmount = gvnAmount;
            this.data = optionalData;
            this.receipientAddress = receipientAddress;
            this.senderAddress = senderAddress;
            this.borrowGVNTransaction();
        }
        else if (type === "smart"){
            this.type = 2;
            this.gvnAmount = gvnAmount;
            this.data = optionalData;
            this.receipientAddress = receipientAddress;
            this.senderAddress = senderAddress;
            this.smartGVNTransaction();
        }
        else {
            throw new Error("Invalid transaction type");
        }
    }

    init() {
        return new Promise((resolve, reject) => {
            // // Creating 12-word mnemonic for user to remember and sign in with wallet
            // this.setprivatekey('./model/1-1000.txt');

            // // Creating a public key the user can use to deposit funds into their wallet with
            // this.setpublickey();

            // // All new accounts will get 100 GVN coins free (to be used for gas by dApp developers)
            // this.setbalance(100);

            // this.setlinkedtransactions(["1st transaction"]);

            // this.lasteditedon();
            // return gas fee only method
            // return transaction id


            this.verifyGVNTransaction(this.data);
            switch(this.type) {
                case 0:
                    this.makeTransactionID(this.getgassFee(), this.data);
                    break;
                case 1:
                    this.makeTransactionID(this.getgassFee(), this.data);
                    break;
                case 2:
                    this.makeTransactionID(this.getgassFee(), this.data);                    
                    break;
                default:
                    throw new Error("Invalid transaction type");
            }

            resolve();
        });
    }

    makewalletTransaction() {
        this.setgassFee(0);
    }

    editwalletTransaction() {
        this.setgassFee(0);
    }

    sendGVNTransaction() {
        this.setgassFee(0);
    }

    borrowGVNTransaction() {
        this.setgassFee(10);
    }

    smartGVNTransaction() {
        this.setgassFee(20);
    }

    makeTransactionID(gasFee, data) {
        //make something happpen here to create the transaction id
        //probably somehow access the block number of the last transaction in the blockchain, increment it, and then return the transaction id
        this.txID = Math.floor(Math.random() * 10000000);
        return this.txID;
    }

    getTransactionID() {
        return this.txID;
    }

    getgassFee() {
        return this.gasFee;
    }

    setgassFee(gasFee) {
        this.gasFee = gasFee;
    }

    verifyGVNTransaction(data) {
        // Check for layer 1 transactions
        if (data.length == 12) {
            this.accessToDatabase = true;
        }

        // // Check for layer 2 transactions
        // else if (data.length!== 6) {
        //     this.accessToDatabase = true;
        // }

        // // Check for layer 3 transactions
        // else if (data.length!== 4) {
        //     this.accessToDatabase = true;
        // }

        // If none of the above are true, throw an error
        else {
            this.accessToDatabase = false;
        }

        // return true;
    }

    getAccessToDatabase() {
        return this.accessToDatabase;
    }

}

module.exports = Transaction;

// Make this class have a normal no parameter constructor to be used whenever sending GVN
// Make another constructor for the class that requires the type of transaction, based on this type, in the constructor make specific gas fees pre-set here