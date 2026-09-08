// routes/authRoutes.js
// Rutas publicas de autenticacion (no requieren estar logueado).

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

module.exports = router;