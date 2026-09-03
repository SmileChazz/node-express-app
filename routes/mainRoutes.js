// routes/mainRoutes.js
// Router externo (tarea PLUS): agrupa las rutas publicas principales
// y las conecta al controlador correspondiente.

const express = require('express');
const router = express.Router();
const { getHome, getStatus } = require('../controllers/mainController');

// Ruta publica: pagina de inicio (HTML)
router.get('/', getHome);

// Ruta publica: estado del servidor (JSON)
router.get('/status', getStatus);

module.exports = router;
