// controllers/authController.js
// Controlador de autenticacion: registro y login de usuarios.

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

/**
 * POST /auth/register
 * Crea un nuevo usuario, guardando la contraseña "hasheada"
 * (nunca en texto plano).
 */
async function register(req, res) {
const { nombre, email, password } = req.body;

if (!nombre || !email || !password) {
return res.status(400).json({
    status: 'error',
    message: 'Los campos "nombre", "email" y "password" son obligatorios',
    data: null,
});
}

try {
// bcrypt.hash "encripta" la contraseña de forma irreversible.
// El segundo parametro (10) es el "costo" del hasheo: mas alto =
// mas seguro, pero mas lento. 10 es un valor estandar razonable.
const passwordHasheado = await bcrypt.hash(password, 10);

const nuevoUsuario = await Usuario.create({
    nombre,
    email,
    password: passwordHasheado,
});

res.status(201).json({
    status: 'ok',
    message: 'Usuario registrado correctamente',
    data: {
    id: nuevoUsuario.id,
    nombre: nuevoUsuario.nombre,
    email: nuevoUsuario.email,
    // OJO: nunca devolvemos el password, ni siquiera el hasheado
    },
});
} catch (error) {
console.error('Error al registrar usuario:', error.message);
res.status(500).json({
    status: 'error',
    message: 'Error al registrar usuario',
    data: null,
});
}
}

/**
 * POST /auth/login
 * Verifica email + password, y si son correctos, devuelve un JWT.
 */
async function login(req, res) {
const { email, password } = req.body;

if (!email || !password) {
return res.status(400).json({
    status: 'error',
    message: 'Los campos "email" y "password" son obligatorios',
    data: null,
});
}

try {
const usuario = await Usuario.findOne({ where: { email } });

// Importante: usamos el MISMO mensaje generico tanto si el email
// no existe como si la contrasena es incorrecta. Esto evita que
// alguien pueda "adivinar" que emails estan registrados probando
// uno por uno (una practica comun de seguridad).
if (!usuario) {
    return res.status(401).json({
    status: 'error',
    message: 'Credenciales inválidas',
    data: null,
    });
}

// bcrypt.compare compara el texto plano contra el hash guardado.
const passwordValido = await bcrypt.compare(password, usuario.password);

if (!passwordValido) {
    return res.status(401).json({
    status: 'error',
    message: 'Credenciales inválidas',
    data: null,
    });
}

// Generamos el token: el "payload" lleva datos minimos y no sensibles.
const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
);

res.status(200).json({
    status: 'ok',
    message: 'Login exitoso',
    data: { token },
});
} catch (error) {
console.error('Error al iniciar sesión:', error.message);
res.status(500).json({
    status: 'error',
    message: 'Error al iniciar sesión',
    data: null,
});
}
}

module.exports = { register, login };