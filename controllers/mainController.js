// controllers/mainController.js
// Controladores para las rutas publicas basicas del servidor.

/**
 * GET /
 * Devuelve una respuesta en HTML: pagina de bienvenida.
 */
function getHome(req, res) {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>Node & Express Web App</title>
        <link rel="stylesheet" href="/css/style.css" />
      </head>
      <body>
        <h1>Servidor iniciado correctamente 🚀</h1>
        <p>Bienvenido a la aplicacion Node.js + Express (Modulo 6).</p>
        <p>Prueba la ruta <code>/status</code> para ver una respuesta en JSON.</p>
      </body>
    </html>
  `);
}

/**
 * GET /status
 * Devuelve una respuesta en JSON con el estado del servidor,
 * siguiendo el formato { status, message, data } pedido para
 * la futura API RESTful (Modulo 8), aplicado desde ya como buena practica.
 */
function getStatus(req, res) {
  res.status(200).json({
    status: 'ok',
    message: 'Servidor funcionando correctamente',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    },
  });
}

module.exports = {
  getHome,
  getStatus,
};
