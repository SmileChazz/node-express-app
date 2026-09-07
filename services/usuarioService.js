// services/usuarioService.js
// Logica de negocio que involucra transacciones:
// agrupa varias operaciones de base de datos como una unidad
// "todo o nada" (BEGIN / COMMIT / ROLLBACK).

const pool = require('../config/db');

/**
 * Crea un usuario y, en la misma transaccion, registra un evento
 * en la tabla "historial". Si algo falla en cualquiera de los dos
 * pasos, se revierte TODO (no queda ni el usuario ni el historial).
 *
 * @param {string} nombre
 * @param {string} email
 * @param {boolean} forzarError - solo para pruebas: fuerza un fallo
 *   despues de crear el usuario, para demostrar el rollback.
 */
async function crearUsuarioConHistorial(nombre, email, forzarError = false) {
// Pedimos UNA conexion fija del pool, para usarla en todos los pasos
const client = await pool.connect();

try {
await client.query('BEGIN'); // arranca la transaccion

// Paso 1: crear el usuario
const usuarioResult = await client.query(
    'INSERT INTO usuarios (nombre, email) VALUES ($1, $2) RETURNING id, nombre, email, created_at',
    [nombre, email]
);
const nuevoUsuario = usuarioResult.rows[0];

// Punto de prueba: si forzarError es true, lanzamos un error
// adrede, ANTES de guardar el historial, para simular una falla.
if (forzarError) {
    throw new Error('Error simulado para probar el rollback');
}

// Paso 2: crear el registro de historial asociado
const historialResult = await client.query(
    'INSERT INTO historial (usuario_id, accion) VALUES ($1, $2) RETURNING id, usuario_id, accion, fecha',
    [nuevoUsuario.id, 'Usuario creado']
);
const nuevoHistorial = historialResult.rows[0];

await client.query('COMMIT'); // ambos pasos salieron bien: confirmamos
console.log(`Transacción exitosa: usuario ${nuevoUsuario.id} + historial ${nuevoHistorial.id}`);

return { usuario: nuevoUsuario, historial: nuevoHistorial };
} catch (error) {
await client.query('ROLLBACK'); // algo fallo: deshacemos todo
console.error('Transacción revertida (rollback):', error.message);
throw error; // se lo pasamos al controller para que responda el error
} finally {
client.release(); // devolvemos la conexion al pool, pase lo que pase
}
}

module.exports = { crearUsuarioConHistorial };