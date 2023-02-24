# Given Coin Consensus Mechanism

This folder will be used for Layer 4 Consensus Layer
Whenever the blockchain needs to check* a consensus about the validity of a transaction it goes through this folder.

This layer is responsible for inter-node communication, in other words, with the use of Layer 1, Layer 2, and Layer 3, I use a DPOS (Delegated-Proof-Of-Stake) consensus mechanism to validate transactions/blocks.

This layer needs to be used in conjunction with functions from Layer 1, functions from Layer 2 where blocks are created/blocks are added, then some function from Layer 3 after a connection is established with other nodes.