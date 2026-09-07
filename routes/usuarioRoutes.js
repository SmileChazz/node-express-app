// routes/usuarioRoutes.js
// Rutas relacionadas a la entidad "usuarios".

const express = require('express');
const router = express.Router();
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
router.post('/con-historial', createUsuarioConHistorial);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);
router.get('/orm', getUsuariosORM);
router.get('/:id/historial', getUsuarioConHistorial);


module.exports = router;