// controllers/usuarioController.js
// Controlador para las operaciones CRUD sobre la entidad "usuarios".

const pool = require('../config/db');

/**
 * GET /usuarios
 * Devuelve todos los usuarios almacenados en la base de datos.
 */
async function getUsuarios(req, res) {
try {
const result = await pool.query(
    'SELECT id, nombre, email, created_at FROM usuarios ORDER BY id ASC'
);

res.status(200).json({
    status: 'ok',
    message: 'Usuarios obtenidos correctamente',
    data: result.rows,
});
} catch (error) {
console.error('Error al obtener usuarios:', error.message);
res.status(500).json({
    status: 'error',
    message: 'Error al obtener usuarios',
    data: null,
});
}
}

/**
 * POST /usuarios
 * Crea un nuevo usuario. Espera { nombre, email } en el body.
 */
async function createUsuario(req, res) {
const { nombre, email } = req.body;

// Validacion basica: ambos campos son obligatorios
if (!nombre || !email) {
return res.status(400).json({
    status: 'error',
    message: 'Los campos "nombre" y "email" son obligatorios',
    data: null,
});
}

try {
const result = await pool.query(
    'INSERT INTO usuarios (nombre, email) VALUES ($1, $2) RETURNING id, nombre, email, created_at',
    [nombre, email]
);

res.status(201).json({
    status: 'ok',
    message: 'Usuario creado correctamente',
    data: result.rows[0],
});
} catch (error) {
console.error('Error al crear usuario:', error.message);
res.status(500).json({
    status: 'error',
    message: 'Error al crear usuario',
    data: null,
});
}
}

/**
 * PUT /usuarios/:id
 * Actualiza nombre y/o email de un usuario existente.
 */
async function updateUsuario(req, res) {
const { id } = req.params;
const { nombre, email } = req.body;

if (!nombre && !email) {
return res.status(400).json({
    status: 'error',
    message: 'Debes enviar al menos "nombre" o "email" para actualizar',
    data: null,
});
}

try {
// 1. Verificar que el usuario existe antes de intentar actualizar
const existe = await pool.query('SELECT id FROM usuarios WHERE id = $1', [id]);

if (existe.rows.length === 0) {
    return res.status(404).json({
    status: 'error',
    message: `No existe un usuario con id ${id}`,
    data: null,
    });
}

// 2. Actualizar solo los campos enviados (COALESCE mantiene el valor
//    actual si el nuevo dato es NULL/undefined)
const result = await pool.query(
    `UPDATE usuarios
    SET nombre = COALESCE($1, nombre),
        email = COALESCE($2, email)
    WHERE id = $3
    RETURNING id, nombre, email, created_at`,
    [nombre, email, id]
);

res.status(200).json({
    status: 'ok',
    message: 'Usuario actualizado correctamente',
    data: result.rows[0],
});
} catch (error) {
console.error('Error al actualizar usuario:', error.message);
res.status(500).json({
    status: 'error',
    message: 'Error al actualizar usuario',
    data: null,
});
}
}

/**
 * DELETE /usuarios/:id
 * Elimina un usuario existente.
 */
async function deleteUsuario(req, res) {
const { id } = req.params;

try {
// 1. Verificar que el usuario existe antes de borrar
const existe = await pool.query('SELECT id FROM usuarios WHERE id = $1', [id]);

if (existe.rows.length === 0) {
    return res.status(404).json({
    status: 'error',
    message: `No existe un usuario con id ${id}`,
    data: null,
    });
}

// 2. Borrar
await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);

res.status(200).json({
    status: 'ok',
    message: `Usuario ${id} eliminado correctamente`,
    data: null,
});
} catch (error) {
console.error('Error al eliminar usuario:', error.message);
res.status(500).json({
    status: 'error',
    message: 'Error al eliminar usuario',
    data: null,
});
}
}

const { crearUsuarioConHistorial } = require('../services/usuarioService');

/**
 * POST /usuarios/con-historial
 * Crea un usuario junto con su registro de historial, en una transaccion.
 * Body: { nombre, email, forzarError (opcional, boolean) }
 */
async function createUsuarioConHistorial(req, res) {
const { nombre, email, forzarError } = req.body;

if (!nombre || !email) {
return res.status(400).json({
    status: 'error',
    message: 'Los campos "nombre" y "email" son obligatorios',
    data: null,
});
}

try {
const resultado = await crearUsuarioConHistorial(nombre, email, forzarError);
res.status(201).json({
    status: 'ok',
    message: 'Usuario e historial creados correctamente (transacción exitosa)',
    data: resultado,
});
} catch (error) {
res.status(500).json({
    status: 'error',
    message: 'La transacción falló y se revirtió (rollback)',
    data: null,
});
}
}
/**
 * GET /usuarios/:id/historial
 * Devuelve un usuario junto con todos sus registros de historial,
 * en una sola consulta (usando "include").
 */
async function getUsuarioConHistorial(req, res) {
const { id } = req.params;

try {
const usuario = await Usuario.findByPk(id, {
    attributes: ['id', 'nombre', 'email', 'created_at'],
    include: [
    {
        model: Historial,
        attributes: ['id', 'accion', 'fecha'],
    },
    ],
});

if (!usuario) {
    return res.status(404).json({
    status: 'error',
    message: `No existe un usuario con id ${id}`,
    data: null,
    });
}

res.status(200).json({
    status: 'ok',
    message: 'Usuario con su historial obtenido correctamente',
    data: usuario,
});
} catch (error) {
console.error('Error al obtener usuario con historial:', error.message);
res.status(500).json({
    status: 'error',
    message: 'Error al obtener usuario con historial',
    data: null,
});
}
}
const { Usuario, Historial } = require('../models');

/**
 * GET /usuarios/orm
 * Igual que GET /usuarios, pero usando Sequelize en vez de SQL manual.
 * Sirve para comparar ambos enfoques con el mismo resultado esperado.
 */
async function getUsuariosORM(req, res) {
try {
const usuarios = await Usuario.findAll({
    attributes: ['id', 'nombre', 'email', 'created_at'],
    order: [['id', 'ASC']],
});

res.status(200).json({
    status: 'ok',
    message: 'Usuarios obtenidos correctamente (via Sequelize)',
    data: usuarios,
});
} catch (error) {
console.error('Error al obtener usuarios con ORM:', error.message);
res.status(500).json({
    status: 'error',
    message: 'Error al obtener usuarios (ORM)',
    data: null,
});
}
}

module.exports = { getUsuarios, createUsuario, updateUsuario, deleteUsuario, createUsuarioConHistorial, getUsuariosORM, getUsuarioConHistorial };

