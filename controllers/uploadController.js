// controllers/uploadController.js
// Controlador para la subida de archivos.

/**
 * POST /upload
 * Recibe un archivo (campo "imagen") y confirma que se guardo.
 */
function subirArchivo(req, res) {
// Si Multer no encontro ningun archivo en la peticion
if (!req.file) {
return res.status(400).json({
    status: 'error',
    message: 'No se recibió ningún archivo. Enviá el campo "imagen".',
    data: null,
});
}

res.status(201).json({
status: 'ok',
message: 'Archivo subido correctamente',
data: {
    nombreOriginal: req.file.originalname,
    nombreGuardado: req.file.filename,
    tipo: req.file.mimetype,
    tamañoBytes: req.file.size,
    url: `/uploads/${req.file.filename}`,
},
});
}

module.exports = { subirArchivo };