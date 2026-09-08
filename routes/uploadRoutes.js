// routes/uploadRoutes.js
// Ruta para la subida de archivos.

const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { subirArchivo } = require('../controllers/uploadController');

// upload.single('imagen') = esperamos UN archivo, en un campo
// del formulario llamado "imagen".
router.post('/', upload.single('imagen'), subirArchivo);

module.exports = router;