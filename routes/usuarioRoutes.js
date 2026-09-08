// routes/usuarioRoutes.js
// Rutas relacionadas a la entidad "usuarios".

const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const {
getUsuarios,
createUsuario,
updateUsuario,
deleteUsuario,
createUsuarioConHistorial,
getUsuariosORM,
getUsuarioConHistorial,
} = require('../controllers/usuarioController');

router.get('/', getUsuarios);
router.post('/', createUsuario);
router.post('/con-historial', verifyToken, createUsuarioConHistorial);
router.put('/:id', updateUsuario);
router.delete('/:id', verifyToken, deleteUsuario);
router.get('/orm', getUsuariosORM);
router.get('/:id/historial', getUsuarioConHistorial);


module.exports = router;