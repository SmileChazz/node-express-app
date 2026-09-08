// middlewares/errorHandler.js
// Middleware global de manejo de errores. Express lo reconoce
// automaticamente por tener 4 parametros (err, req, res, next).
// Se ejecuta cuando cualquier ruta o middleware anterior llama a next(err).

const multer = require('multer');

function errorHandler(err, req, res, next) {
console.error('Error capturado:', err.message);

// Errores propios de Multer (por ejemplo, archivo demasiado pesado)
if (err instanceof multer.MulterError) {
return res.status(400).json({
    status: 'error',
    message: `Error al subir archivo: ${err.message}`,
    data: null,
});
}

// Error de tipo de archivo, generado por nuestro fileFilter
if (err.message && err.message.includes('Tipo de archivo no permitido')) {
return res.status(400).json({
    status: 'error',
    message: err.message,
    data: null,
});
}

// Cualquier otro error no controlado (fallback generico)
res.status(500).json({
status: 'error',
message: 'Error interno del servidor',
data: null,
});
}

module.exports = errorHandler;