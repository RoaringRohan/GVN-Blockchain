class recordSchema {
    constructor() {
        db.query(`CREATE TABLE records (
            block_id INT PRIMARY KEY,
            hash VARCHAR(1000),
            prevHash VARCHAR(1000),
            data VARCHAR(5000)
          );`, (err, results) => {
            if (err) return console.log("Error making Record Schema.");
            return console.log("Record Schema created.")
        });
    }
}

module.exports = recordSchema;