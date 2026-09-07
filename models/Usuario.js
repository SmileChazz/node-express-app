// models/Usuario.js
// Modelo de Sequelize que representa la tabla "usuarios".
// Cada instancia de este modelo = una fila de esa tabla.

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Usuario = sequelize.define(
'Usuario',
{
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
},
nombre: {
    type: DataTypes.STRING,
    allowNull: false,
},
email: {
    type: DataTypes.STRING,
    allowNull: false,
},
},
{
tableName: 'usuarios', // le decimos que use la tabla que YA existe
timestamps: true,
createdAt: 'created_at', // mapeamos al nombre real de la columna
updatedAt: false, // no tenemos columna updated_at, asi que la desactivamos
}
);

module.exports = Usuario;