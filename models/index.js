// models/index.js
// Punto central de los modelos: los importa y define
// las relaciones (asociaciones) entre ellos.

const Usuario = require('./Usuario');
const Historial = require('./Historial');

// Un Usuario tiene muchos registros de Historial
Usuario.hasMany(Historial, { foreignKey: 'usuario_id' });

// Un Historial pertenece a un Usuario
Historial.belongsTo(Usuario, { foreignKey: 'usuario_id' });

module.exports = { Usuario, Historial };