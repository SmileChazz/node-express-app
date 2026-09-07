// config/sequelize.js
// Configura la instancia de Sequelize (el ORM) para conectarse
// a la MISMA base de datos PostgreSQL que ya usamos con "pg".

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
process.env.DB_NAME,
process.env.DB_USER,
process.env.DB_PASSWORD,
{
host: process.env.DB_HOST,
port: process.env.DB_PORT,
dialect: 'postgres',
logging: (sql) => console.log(`[Sequelize SQL] ${sql}`),
}
);

module.exports = sequelize;