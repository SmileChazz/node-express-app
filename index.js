// index.js
require('dotenv').config();
require('./config/db');
const express = require('express');
const path = require('path');

const requestLogger = require('./middlewares/logger');
const mainRoutes = require('./routes/mainRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const uploadRoutes = require('./routes/uploadRoutes'); 
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');

const sequelize = require('./config/sequelize');
sequelize
  .authenticate()
  .then(() => console.log('Sequelize conectado correctamente a PostgreSQL'))
  .catch((error) => console.error('Error al conectar Sequelize:', error.message));

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares globales ---
app.use(express.json());
app.use(requestLogger);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

// --- Rutas ---
app.use('/', mainRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/upload', uploadRoutes); 
app.use('/auth', authRoutes);

// --- Manejo de rutas no encontradas (404) ---
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada',
    data: null,
  });
});
app.use(errorHandler);

// --- Inicio del servidor ---
app.listen(PORT, () => {
  console.log('Servidor iniciado');
  console.log(`Escuchando en http://localhost:${PORT}`);
});