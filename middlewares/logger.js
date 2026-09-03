// middlewares/logger.js
// Middleware encargado de registrar cada visita del servidor
// en un archivo plano (logs/log.txt) usando el modulo nativo "fs".

const fs = require('fs');
const path = require('path');

// Ruta absoluta del archivo de log, dentro de la carpeta /logs
const LOG_FILE_PATH = path.join(__dirname, '..', 'logs', 'log.txt');

/**
 * Genera una linea de log con estructura: fecha, hora, ruta accedida.
 * Ejemplo: [2026-08-28] [14:32:10] GET /status
 */
function buildLogLine(req) {
  const now = new Date();
  const fecha = now.toISOString().split('T')[0];       // YYYY-MM-DD
  const hora = now.toTimeString().split(' ')[0];        // HH:MM:SS
  return `[${fecha}] [${hora}] ${req.method} ${req.originalUrl}\n`;
}

/**
 * Middleware de Express: se ejecuta en cada request y agrega
 * una linea al archivo log.txt usando fs.appendFile (asincrono,
 * no bloquea el hilo principal).
 */
function requestLogger(req, res, next) {
  const line = buildLogLine(req);

  fs.appendFile(LOG_FILE_PATH, line, (err) => {
    if (err) {
      // Si falla el registro, no se interrumpe la respuesta al cliente,
      // solo se informa el error por consola.
      console.error('Error al escribir en log.txt:', err.message);
    }
  });

  next();
}

module.exports = requestLogger;
