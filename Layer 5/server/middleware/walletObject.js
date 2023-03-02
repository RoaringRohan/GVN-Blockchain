const fs = require('fs');

class Wallet {
    constructor(words = null) {
        if (words === null) {
            // Constructor without parameters
            this.words = this.generateRandomWords('./model/1-1000.txt');
            this.type = 'random';
        } else {
            // Constructor with one parameter of an array of 12 words
            if (words.length !== 12) {
                throw new Error('Invalid number of words provided to create wallet');
            }
            this.words = words;
            this.type = 'fixed';
        }
        this.privateKey = this.generatePrivateKey();
    }
  
    generateRandomWords(filePath) {
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

        // Return the array of random words
        return randomWords;
    }
  
    generatePrivateKey() {
        // Code to generate a private key from the 12 words
        // ******DO EVENTUALLY****

        return 'private key';
    }
}

module.exports = Wallet;
