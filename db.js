// db.js
const mysql = require('mysql2');
require('dotenv').config(); // Charge les variables du fichier .env

// On crée un "Pool" de connexions
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// On exporte "promise()" pour pouvoir utiliser async/await plus tard (plus moderne)
module.exports = pool.promise();