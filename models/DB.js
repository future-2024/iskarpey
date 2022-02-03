const mariadb = require('mariadb/callback');

const pool = mariadb.createConnection({
	host: process.env.DB_HOST, 
	user: process.env.DB_USER, 
	password: process.env.DB_PASSWORD,
	database: process.env.DB,
	connectionLimit: 5
});

module.exports = pool;