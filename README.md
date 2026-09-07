# Node & Express Web App

Aplicación web para gestión de usuarios y datos, desarrollada de forma progresiva
en tres etapas (Módulos 6, 7 y 8). Este README documenta el estado de la
**Parte 1 – Módulo 6**: estructura inicial del servidor, rutas y persistencia básica.

## 🧱 Stack técnico

- Node.js (v18 o superior)
- Express.js
- dotenv
- nodemon (entorno de desarrollo)
- *(Próximamente, Módulo 7)*: PostgreSQL + Sequelize
- *(Próximamente, Módulo 8)*: JSON Web Tokens (JWT), Multer para subida de archivos

## 📁 Estructura del proyecto

```
node-express-app/
├── config/          # Configuración (se usará para la conexión a DB en Módulo 7)
├── controllers/      # Lógica de negocio de cada ruta
├── middlewares/      # Middlewares propios (ej: logger de accesos)
├── public/            # Archivos estáticos (CSS, imágenes)
│   └── css/
├── routes/            # Definición de rutas, conectadas vía app.use()
├── logs/               # Persistencia en archivo plano (log.txt)
├── .env                # Variables de entorno (no se sube a git)
├── .env.example       # Plantilla de variables de entorno
├── index.js            # Archivo principal del servidor
└── package.json
```

> Se incluyó además la carpeta `/config`, no exigida como mínimo, anticipando
> la configuración de la conexión a base de datos que se implementará en el
> Módulo 7 (Sequelize).

## ⚙️ Instalación

**Requisitos previos:** tener instalado Node.js v18 o superior.

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd node-express-app

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env si se desea cambiar el puerto (por defecto 3000)
```

## ▶️ Ejecución

```bash
# Modo desarrollo (con recarga automática vía nodemon)
npm run dev

# Modo producción
npm start
```

El servidor quedará disponible en `http://localhost:3000`.

## 🧪 Ejemplos de uso

| Método | Ruta        | Respuesta | Descripción                              |
|--------|-------------|-----------|-------------------------------------------|
| GET    | `/`         | HTML      | Página de bienvenida                      |
| GET    | `/status`   | JSON      | Estado del servidor (uptime, timestamp)   |
| GET    | `/css/style.css` | CSS  | Archivo estático servido desde `/public`  |

Ejemplo de respuesta de `GET /status`:

```json
{
  "status": "ok",
  "message": "Servidor funcionando correctamente",
  "data": {
    "uptime": 12.5,
    "timestamp": "2026-08-28T14:00:00.000Z",
    "environment": "development"
  }
}
```

Cada visita al servidor queda registrada automáticamente en `logs/log.txt`
con el formato `[fecha] [hora] MÉTODO /ruta`.

## 🧭 Decisiones técnicas y justificaciones

- **Nombre del archivo principal (`index.js`):** se eligió sobre `app.js`
  porque es el nombre por defecto que Node.js reconoce automáticamente
  (`node .`) y coincide con el campo `main` de `package.json`, simplificando
  la ejecución del proyecto.
- **Uso de `/public` en lugar de motor de plantillas:** para esta primera
  etapa se optó por contenido estático + una respuesta HTML simple generada
  desde el controlador, en lugar de un motor de plantillas como EJS, dado que
  el objetivo del Módulo 6 es validar el servido de contenido básico. Se
  evaluará incorporar EJS como tarea PLUS en una iteración posterior.
- **Router externo (`routes/mainRoutes.js`):** se implementó como tarea PLUS,
  desacoplando las rutas del archivo principal y conectándolas mediante
  `app.use('/', mainRoutes)`, lo cual facilita escalar el proyecto cuando se
  agreguen nuevas entidades en el Módulo 7.
- **Formato de respuesta `{ status, message, data }`:** se adoptó desde esta
  primera entrega en la ruta `/status`, anticipando el formato consistente
  que exigirá la API RESTful del Módulo 8.
- **Registro en `log.txt`:** se decidió registrar **todas** las requests
  entrantes (no solo un subconjunto), ya que aporta trazabilidad completa del
  uso del servidor y sienta la base para un futuro middleware de auditoría.

## 🗄️ Parte 2 — Módulo 7: Acceso a datos

### Conexión a la base de datos
Se utilizó **PostgreSQL** como base de datos relacional, junto al cliente `pg`
para las consultas SQL manuales y **Sequelize** como ORM (ver más abajo).
Se eligió `pg` porque es el cliente oficial y más liviano para PostgreSQL,
sin la sobrecarga de un ORM cuando se necesita control total sobre el SQL
(útil especialmente para las transacciones). Las credenciales de conexión
(usuario, contraseña, host, puerto) se almacenan en variables de entorno
(`.env`), nunca hardcodeadas en el código ni subidas al repositorio.

### CRUD completo sobre la entidad `usuarios`
Se implementaron las 4 operaciones (`GET`, `POST`, `PUT`, `DELETE`) sobre
`/usuarios`. En las operaciones de `PUT` y `DELETE` se valida primero que
el `id` exista antes de modificar/eliminar, devolviendo un error 404 claro
en caso contrario. En `PUT`, se utilizó `COALESCE` en el SQL para permitir
actualizar solo los campos enviados en el body, sin sobrescribir con `NULL`
los campos que el usuario no quiso modificar.

### Transaccionalidad
Se implementó una transacción (`BEGIN` / `COMMIT` / `ROLLBACK`) en
`services/usuarioService.js`, que agrupa la creación de un usuario junto
con su registro en la tabla `historial` como una única operación atómica.
Se verificó manualmente que, al forzar un error luego de crear el usuario
pero antes de crear el historial, el `ROLLBACK` revierte ambas operaciones
—el usuario no queda guardado— confirmando la consistencia de los datos.

### ORM (Sequelize)
Se incorporó Sequelize como capa adicional sobre la misma base de datos,
definiendo el modelo `Usuario` (mapeado a la tabla `usuarios` ya existente).
Se comparó el resultado de `GET /usuarios` (SQL manual) contra
`GET /usuarios/orm` (Sequelize), confirmando que ambos devuelven los
mismos datos. La principal ventaja observada de Sequelize es la reducción
de código repetitivo: en vez de escribir el SQL a mano, se describe la
consulta como un objeto JavaScript, y Sequelize genera el SQL equivalente
(verificable en consola gracias al logging habilitado).

### Relaciones entre modelos
Se modeló una relación **1:N** entre `Usuario` y `Historial`
(`Usuario.hasMany(Historial)` / `Historial.belongsTo(Usuario)`), reflejando
la clave foránea `usuario_id` ya existente en la base de datos. La ruta
`GET /usuarios/:id/historial` utiliza `include` para traer el usuario junto
a todos sus registros de historial en una sola consulta (generando un
`LEFT OUTER JOIN` por detrás).

### Endpoints de esta parte
| Método | Ruta                        | Descripción                                   |
|--------|-----------------------------|-----------------------------------------------|
| GET    | `/usuarios`                 | Lista todos los usuarios (SQL manual)         |
| GET    | `/usuarios/orm`             | Lista todos los usuarios (vía Sequelize)      |
| GET    | `/usuarios/:id/historial`   | Usuario + su historial (relación 1:N)         |
| POST   | `/usuarios`                 | Crea un usuario                               |
| POST   | `/usuarios/con-historial`   | Crea usuario + historial (transacción)        |
| PUT    | `/usuarios/:id`             | Actualiza campos de un usuario                |
| DELETE | `/usuarios/:id`             | Elimina un usuario                            |

## 🗺️ Módulo 8

## Autor

Desarrollado por Silvia Rojas como parte del bootcamp de Alkemy — Módulo 6, 7 y 8: Node & Express Web App
