const { Keccak } = require('sha3');
const CryptoJS = require("crypto-js");

class Hash {
    constructor(data) {
      this.data = data;
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
}

module.exports = Hash;