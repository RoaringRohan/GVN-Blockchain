This is where the code goes for handling various classes that are routed from the app.js
Types of routes needed in this folder will be determined:

- Layer 0 (internal, the only route with access to the MySQL database, requires Admin privileges to access these API endpoints)
    - _createWallet (creates wallet and returns wallet address, thus making genesis block for a user)
    - _sendGVN (creates smart contract and returns true if completed successfully, thus creating a sending block for user)
    - _createTracking (creates smart contract and returns true if completed successfully, thus creating a tracking block for user)
    - _designHash (makes call to _sendGVN once complete, requires _searchLedger to be complete first)
    - _searchLedger (searches for all blocks pertaining to a corresponding ledger owner amongst all blocks in blockchain, and creates a linked list of blocks and returns that list as a string)
    - _smartContract (makes smart contract between two addresses and determines the criteria that needs to be met before funds are released)

    - Making genesis block (only to be used ONCE forever per user that makes an account on a dApp), this endpoint will create the schema for the ledger, and create and store the wallet address in the first block, as its the block owner) --> _createWallet
    - Creating a hash, this endpoint takes in the data from user that user desires to put inside their block

- Layer 1 (to be used by any dApp, makes a call to an API endpoint in Layer 0)
    - Ledger creation (creates and returns your wallet address)
    - Ledger deletion (deletes your wallet address, but in reality just makes it inactive in MySQL, can be made later so that underlying funds in account will be recycled)

- Layer 2 (to be used by any dApp, makes a call to an API endpoint in Layer 0)
    - Ledger borrowing (creates a block in the 'main ledger' table on MySQL, and in that block, requires information about the sender's wallet address, the amount prospective to be sent, and the receiver's wallet address, also the time for the ledger to be borrowed)

- Layer 3 (to be used by any dApp, makes a call to an API endpoint in Layer 0)
    - Ledger smart contracts (can create contracts for GVN to be held up in a contract block, until like let's say a fiat payment was made on the dApp, once the Stripe API (on the dApp) goes through, then the contract will be fulfilled, in this case, the condition for the smart contract to release the funds is that there is a Stripe API confirmation code or something to tell the developer of the dApp that the payment was successful)