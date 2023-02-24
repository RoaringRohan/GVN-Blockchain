# Given Coin Blocks Containing Transaction Data

This folder will be used for Layer 2 Data Layer
Whenever the blockchain needs to create a block, it will be going through this layer.
Whenever the blockchain needs to create a transaction, it will be going through this layer.

This layer is responsible for taking the user information, hashing it, creating Merkle Tree through the hashed information, then making a digital signature (wallet address). Transactions need to go to Layer 3 to check for consensus. This is block creation.

This layer is also responsible for taking the information about a transaction, and adding it to the appropriate chains (transaction block gets added to two normal blocks, these two normal blocks are determined by both ends of the smart contract). Transactions need to go to Layer 3 to check for consensus. This is block addition.

