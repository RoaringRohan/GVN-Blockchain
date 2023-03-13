class walletSchema {
    constructor() {
        db.query(`CREATE TABLE ledger.wallets (
            address_id INTEGER PRIMARY KEY,
            private_key VARCHAR(1000),
            public_key VARCHAR(1000),
            private_user_information VARCHAR(1000),
            balance DECIMAL(17, 7),
            linkedList VARCHAR(5000)
          );`, (err, results) => {
            if (err) return console.log("Error making Wallet Schema.");
            return console.log("Wallet Schema created.")
        });
    }
}

module.exports = walletSchema;