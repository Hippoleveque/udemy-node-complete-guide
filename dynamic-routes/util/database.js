const sql = require("mysql2");

const pool = sql.createPool({
    host: "localhost",
    user: "root",
    database: "node-udemy",
    password: "eragon123"
});

module.exports = pool.promise();