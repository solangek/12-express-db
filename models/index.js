// models/index.js
const { Sequelize } = require('sequelize');

const DB_NAME = process.env.DB_NAME || 'mydb';
const DB_USER = process.env.DB_USER || 'internet';
const DB_PASS = process.env.DB_PASS || 'internet';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;


// for sqlite database
// const sequelize = new Sequelize({
//     dialect: 'sqlite',
//     storage: './database.sqlite3' // this is the file where the data is stored
// });

// or in the case of a mariadb/mysql database
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: 'mariadb',
    port: DB_PORT,
    logging: false,
});

module.exports = sequelize;
