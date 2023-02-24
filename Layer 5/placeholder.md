# Given Coin Applications

This folder will be used for Layer 5 Application Layer
Whenever the blockchain needs to create a block, it will be going through this layer.
Whenever the blockchain needs to create a transaction, it will be going through this layer.

This layer is responsible for taking the user information, hashing it, creating Merkle Tree through the hashed information, then making a digital signature (wallet address). Transactions need to go to Layer 3 to check for consensus. This is block creation. Through a method

This layer is also responsible for taking the information about a transaction, and adding it to the appropriate chains (transaction block gets added to two normal blocks, these two normal blocks are determined by both ends of the smart contract). Transactions need to go to Layer 3 to check for consensus. This is block addition. Through a method


Layer 5 consists of:
For now, since Layers 1,2,3,4 are very difficult to make, it will be done over time. Layer 5 will be mostly communicated with for the purposes of now, because I just want to get a blockchain up and running, even if it is centralized for now. It is for use in dApps that I would like to create.

The idea is that, I can host this entire repo on AWS, run the express server from app.js and whenever I need to make an API call to my blockchain, I just enter the AWS link, port, and then the endpoint that I want to use, and then it will communicate with this Layer 5 folder to manipulate the blockchain.

As I said that this is going to centralized for the time being, it will be using a MySQL server to store all the distributed and private information.
So in other words, each API endpoint must communicate with the MySQL server, making this layer sort of act as a backend but in reality the GVM (layer 1) should handle all requests from this layer 5. 

When this project is done, the Layer 5 API calls shouldnt need to make a calls/queries to MySQL anymore, it should be sent directly to the distributed ledger technology all the way down to Layer 1.

API Endpoints that need to be created here are:
- Layer 0

- Layer 1 (routed in a file inside the routes folder) (handles creation and addition of blocks to the blockchain)
- Layer 2 (routed in a file inside the routes folder) (handles borrowing of blocks)