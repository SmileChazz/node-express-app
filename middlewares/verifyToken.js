// middlewares/verifyToken.js
// Middleware que protege rutas: exige un JWT valido en el header
// "Authorization" antes de dejar continuar la peticion.

const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
// El token viaja en el header, con el formato: "Bearer <token>"
const authHeader = req.headers.authorization;

if (!authHeader || !authHeader.startsWith('Bearer ')) {
return res.status(401).json({
    status: 'error',
    message: 'Acceso denegado: token no proporcionado',
    data: null,
});
}

const token = authHeader.split(' ')[1]; // separamos "Bearer" del token en si

try {
// jwt.verify revisa la firma Y la expiracion en un solo paso.
// Si el token fue alterado, o vencio, o la firma no coincide,
// esto lanza un error automaticamente.
const payload = jwt.verify(token, process.env.JWT_SECRET);

// Guardamos los datos del usuario en req, para que las rutas
// siguientes sepan quien esta haciendo la peticion.
req.usuario = payload;

next(); // todo OK, dejamos continuar hacia la ruta real
} catch (error) {
return res.status(401).json({
    status: 'error',
    message: 'Token inválido o expirado',
    data: null,
});
}
}

module.exports = verifyToken;