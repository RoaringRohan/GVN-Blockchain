class walletSchema {
    constructor() {
        db.query(`CREATE TABLE wallets (
            address_id VARCHAR(255) PRIMARY KEY,
            datum VARCHAR(1000),
            balance DECIMAL(17, 7),
            linkedList VARCHAR(5000)
          );`, (err, results) => {
            if (err) return console.log("Error making Wallet Schema.");
            return console.log("Wallet Schema created.")
        });
    }
}

module.exports = walletSchema;