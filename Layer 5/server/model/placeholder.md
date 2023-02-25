This is the place where the SQL model schema files will be held for each table within the database.

Since the point is to create a decentralized ledger, I will be creating some temporary tables that will hold user variables.

Ultimate goal is for the database to only hold one table (called the main ledger) which will just hold tuples. Each of these tuples will contain
only two attributes, the block number and the hash.

Types of models required for this project are:
- Main ledger (going to be decentralized) (for this table, we only need two attributes: block# PK (created based on increment of previous highest block number), hash PK (created based on the information inside the block, including its previous hash), previousHash FK (taken from previous block number's hash), data (custom data, usually in a CHAR(10000)))
- User variables (based on designated dApp) (for this table, we only need two attributes: wallet address PK, userInformation(encrypted into a string))
- 


Transaction table in MySQL
- Has attribute for type of transaction, there are specific types:
    - Wallet creation (generating genesis block for particular user)
    - Money Transfer
    - Create a tracked block (for borrowing)
    - Create a smart contract (locking funds until conditions are met)