const fs = require('fs');
const LinkedList = require('../frameworks/linkedList');
const Transaction = require('../middleware/transactionObject');
const Block = require('../middleware/blockObject');
const Hash = require('../frameworks/hash');
const { Keccak } = require('sha3');
const CryptoJS = require("crypto-js");

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
            // This code makes the wallet and posts it to database
            // Creating 12-word mnemonic for user to remember and sign in with wallet
            this.setprivatekey('./models/1-1000.txt');
            // Creating a public key the user can use to deposit funds into their wallet with
            this.setpublickey();
            this.lasteditedon();
            this.makeDBquery(1);


            // This block of code makes first transaction and adds it to wallet transactions and updates balance
            this.setlinkedtransactions(["1st transaction"]);
            // Add 100 coins to wallet on initialization
            this.addbalance(100);
            this.lasteditedon();

            console.log(this.getpublickey());
            console.log(this.getprivatekey());

            const transactionPromise = this._createTransaction("make", 100, this.publicKey, process.env.GVN, "creatingwall");

        transactionPromise.then((transaction) => {
            if (transaction === true) {
            console.log("go");
            return new Promise((resolve, reject) => {
                // db.query(
                // 'SELECT MAX(address_id) AS max_id FROM wallets',
                // (error, results) => {
                //     if (error) {
                //     reject(error);
                //     } else {
                //     const lastId = results[0].max_id || 0;
                //     const newId = lastId === 0 ? 1 : lastId + 1;

                //     db.query(
                //         'INSERT INTO wallets (address_id, private_key, public_key, private_user_information, balance, transactions) VALUES (?, ?, ?, ?, ?, ?)',
                //         [
                //         newId,
                //         this.getprivatekey(),
                //         this.getpublickey(),
                //         this.getdata(),
                //         this.getbalance(),
                //         this.getlinkedtransactions(),
                //         ],
                //         (error, results) => {
                //         if (error) {
                //             reject(error);
                //         } else {
                //             console.log(
                //             `New tuple added with address_id ${newId}`
                //             );
                //         }
                //         }
                //     );
                //     }
                // }
                // );

                this.makeDBquery(1)
            });
            } else {
            console.log("redlight to add wallet to database");
            return false;
            }
        });
        });
    }
  
    _createTransaction(type, amtToSend, recipientAddress, senderAddress, transactionInfo) {
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
                return this._createBlock(recipientAddress, linkedList);
    
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

    _createBlock(recipientAddress, listOfTransactions) {
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
    
            const hash = new Hash(string);
            const secondhash = hash._generateHash(recipientAddress, string);
            console.log(secondhash);
            db.query(
                'SELECT block_id, prevHash FROM ledger.records WHERE block_id = (SELECT MAX(block_id) FROM ledger.records);',
                (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        // Add 1 to the max block ID to get the next block ID
                        const highestBlockId = results[0].block_id;
                        const prevHash = results[0].prevHash;
            
                        const block = new Block(highestBlockId + 1, secondhash, prevHash, listOfTransactions);
            
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

    _generateHash(ownerAddress, information) {
        // Generate hash given information
        // Base the hash on CryptoNight's hashing algorithm or something, pass to generateAlgo()
        // Bring it back here and hash a custom combo for GVN
        // Make it possible for the information to be encrypted using ownerAddress's private key and to be decrypted by the ownerAddress's public key
        const temp = this._generateEncryptionAlgorithm("testing data");
        return temp;
    }
    
    _generateEncryptionAlgorithm(data) {
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
        let string = this.linkedtransactions.toString();
        return string;
    }

    setlinkedtransactions(linkedtransactions) {
        this.linkedtransactions = linkedtransactions;
    }

    lasteditedon() {
        const currentDate = new Date();
        this.lastedited = currentDate.toLocaleString();
        return true;
    }

    makeDBquery(input) {
        // Add wallet to database
        if (input === 1) {
            db.query(
                'SELECT MAX(address_id) AS max_id FROM wallets',
                (error, results) => {
                    if (error) {
                    reject(error);
                    } else {
                    const lastId = results[0].max_id || 0;
                    const newId = lastId === 0 ? 1 : lastId + 1;

                    db.query(
                        'INSERT INTO wallets (address_id, private_key, public_key, private_user_information, balance, transactions) VALUES (?, ?, ?, ?, ?, ?)',
                        [
                        newId,
                        this.getprivatekey(),
                        this.getpublickey(),
                        this.getdata(),
                        this.getbalance(),
                        this.getlinkedtransactions(),
                        ],
                        (error, results) => {
                        if (error) {
                            reject(error);
                        } else {
                            console.log(
                            `New tuple added with address_id ${newId}`
                            );
                        }
                        }
                    );
                    }
                }
                );
        }

        // Update transactionlist in database amd balance
        if (input === 2) {
            console.log("changing balances")
        }

        // Edit a wallet (private_user_information)
        if (input === 3) {

        }

        // Delete/Disable a wallet
        if (input == 4) {

        }

        // Find wallet in database and fill this class with object's data from database
        if (input == 10) {

        }
    }
}

module.exports = Wallet;
