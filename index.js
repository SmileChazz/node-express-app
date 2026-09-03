// index.js
// Archivo principal de la aplicacion.
// Se eligio "index.js" (en lugar de "app.js") como archivo de entrada
// porque es el nombre por defecto que Node.js busca automaticamente
// al ejecutar "node ." y coincide con el "main" declarado en package.json,
// haciendo mas simple y estandar la ejecucion del proyecto.

require('dotenv').config();
const express = require('express');
const path = require('path');

const requestLogger = require('./middlewares/logger');
const mainRoutes = require('./routes/mainRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares globales ---

// Permite parsear JSON en el body de las requests (util desde ya para futuras rutas)
app.use(express.json());

// Registra cada visita en logs/log.txt (persistencia en archivo plano)
app.use(requestLogger);

// Sirve contenido estatico (CSS, imagenes, etc.) desde la carpeta /public
app.use(express.static(path.join(__dirname, 'public')));

// --- Rutas ---
app.use('/', mainRoutes);

// --- Manejo de rutas no encontradas (404) ---
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada',
    data: null,
  });
});

// --- Inicio del servidor ---
app.listen(PORT, () => {
  console.log('Servidor iniciado');
  console.log(`Escuchando en http://localhost:${PORT}`);
});
