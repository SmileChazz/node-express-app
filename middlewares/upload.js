// middlewares/upload.js
// Configuracion de Multer: donde se guardan los archivos, como se
// nombran, y que validaciones se aplican (tipo y tamano).

const multer = require('multer');
const path = require('path');

// Configuramos DONDE y CON QUE NOMBRE se guarda cada archivo.
const storage = multer.diskStorage({
destination: (req, file, cb) => {
cb(null, path.join(__dirname, '..', 'uploads'));
},
filename: (req, file, cb) => {
// Nombre unico: timestamp + nombre original, para evitar
// que dos archivos con el mismo nombre se pisen entre si.
const nombreUnico = `${Date.now()}-${file.originalname}`;
cb(null, nombreUnico);
},
});

// Filtro de tipo de archivo: solo permitimos imagenes.
function fileFilter(req, file, cb) {
const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];

if (tiposPermitidos.includes(file.mimetype)) {
cb(null, true); // aceptar el archivo
} else {
cb(new Error('Tipo de archivo no permitido. Solo se aceptan JPEG, PNG o WEBP.'));
}
}

const upload = multer({
storage,
fileFilter,
limits: {
fileSize: 2 * 1024 * 1024, // 2 MB maximo
},
});

module.exports = upload;