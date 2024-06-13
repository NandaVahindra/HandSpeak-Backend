require('dotenv').config();
const mysql = require('mysql2/promise');

async function connectDb() {
    return mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB
    });
}

module.exports = connectDb; 