// config/db.js
// Configura y exporta el "pool" de conexiones hacia PostgreSQL.
// Un pool mantiene varias conexiones abiertas y las reutiliza,
// en vez de abrir/cerrar una conexion nueva por cada consulta.

const { Pool } = require('pg');

const pool = new Pool({
user: process.env.DB_USER,
host: process.env.DB_HOST,
database: process.env.DB_NAME,
password: process.env.DB_PASSWORD,
port: process.env.DB_PORT,
});

// Verificamos la conexion apenas arranca el servidor.
pool.connect((err, client, release) => {
if (err) {
console.error('Error al conectar con la base de datos:', err.message);
return;
}
console.log('Conexión a PostgreSQL establecida correctamente');
release(); // devolvemos esta conexion de prueba al pool
});

module.exports = pool;