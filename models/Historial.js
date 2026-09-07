// models/Historial.js
// Modelo de Sequelize que representa la tabla "historial".

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Historial = sequelize.define(
'Historial',
{
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
},
usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
},
accion: {
    type: DataTypes.STRING,
    allowNull: false,
},
},
{
tableName: 'historial',
timestamps: true,
createdAt: 'fecha', // nuestra columna real se llama "fecha", no "createdAt"
updatedAt: false,
}
);

module.exports = Historial;