# Prompt para Claude Code — Reestructuración del Backend TwoCents

## Rol

Actúa como un **arquitecto de software senior con más de 10 años de experiencia** diseñando y refactorizando backends en producción con Node.js, Express y arquitecturas en tiempo real con WebSockets. Tienes experiencia específica en:

- **Reestructuración de monolitos** hacia arquitecturas modulares por capas (layered architecture) y MVC.
- **Aplicaciones de chat en tiempo real** con Socket.IO, incluyendo gestión de rooms, broadcast selectivo y mecanismos de deduplicación de mensajes.
- **Bases de datos relacionales** (MySQL/PostgreSQL) con pools de conexiones, queries parametrizadas y prevención de SQL injection.
- **Despliegues en plataformas PaaS** como Railway, Heroku y Render, conociendo sus limitaciones de red, timeouts y variables de entorno.
- **Buenas prácticas de código limpio**: principio de responsabilidad única (SRP), separación de concerns, inyección de dependencias, naming consistente y código autodocumentado.

Tu objetivo es refactorizar el código que te proporciono aplicando estas prácticas, pero **sin modificar la funcionalidad existente**. Debes actuar como si estuvieras haciendo una revisión de código para un desarrollador junior que necesita entender, defender y mantener este proyecto (es un TFG). Cada decisión arquitectónica debe poder explicarse con claridad.

Prioriza: legibilidad > mantenibilidad > extensibilidad. No sobreingenieres: aplica solo los patrones que aporten valor real al tamaño actual del proyecto.

---

## Contexto del proyecto

Tengo una aplicación web de **chat en tiempo real** llamada **TwoCents**. El stack es:
- **Backend:** Node.js + Express + Socket.IO + MySQL (mysql2) + bcrypt
- **Frontend:** React + Vite
- **Base de datos:** MySQL
- **Despliegue:** Railway

Actualmente **todo el backend está en un único archivo `index.js`** de ~450 líneas. Necesito reestructurarlo siguiendo una **arquitectura por capas (layered architecture)** profesional, manteniendo **exactamente la misma funcionalidad** sin romper nada.

---

## Arquitectura objetivo

Reestructura el backend en la siguiente estructura de carpetas:

```
backend/
├── index.js                  # Solo arranca el servidor (3 líneas)
├── app.js                    # Configura Express (cors, json, rutas)
├── config/
│   └── db.js                 # Pool de MySQL + test de conexión
├── routes/
│   ├── salaRoutes.js         # Rutas: POST /api/salas, GET /api/salas/:tipo, GET /api/sala/:idSala
│   ├── mensajeRoutes.js      # Ruta: GET /api/mensajes/:idSala
│   └── noticiaRoutes.js      # Ruta: GET /api/noticias
├── controllers/
│   ├── salaController.js     # Lógica de las 3 rutas de salas
│   ├── mensajeController.js  # Lógica de obtener historial de mensajes
│   └── noticiaController.js  # Lógica de proxy a GNews API
├── sockets/
│   ├── index.js              # Registra todos los handlers en io.on('connection')
│   ├── authHandler.js        # Eventos: registrar_usuario, login_usuario
│   ├── chatHandler.js        # Eventos: unirse_chat, salir_chat, enviar_mensaje
│   └── typingHandler.js      # Eventos: escribiendo, dejo_de_escribir
├── utils/
│   └── helpers.js            # formatearFechaMySQL() + Sets/Maps de deduplicación
└── .env                      # (no tocar, ya existe)
```

---

## Reglas estrictas que debes seguir

1. **NO cambies ninguna funcionalidad.** El frontend React no se toca. Todos los eventos de Socket.IO, nombres de rutas HTTP, nombres de eventos emitidos, y estructura de datos JSON deben ser idénticos.

2. **Mantén todos los mecanismos de deduplicación de mensajes** tal cual están:
   - `mensajesProcesadosGlobal` (Set global)
   - `huellasMensajesRecientes` (Map global)
   - `mensajesProcesados` (Set por socket)
   - La query SQL de duplicados con `DATE_SUB(NOW(), INTERVAL 2 SECOND)`

3. **Mantén los `console.log` con emojis** exactamente como están (✅, ❌, 💬, 👤, 🔌, 🚀, ⚠️). Son útiles para depuración en Railway.

4. **Mantén las mismas variables de entorno** (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`, `FRONTEND_URL`, `NEWS_API_KEY`, `PORT`).

5. **Mantén la configuración exacta de Socket.IO**: `pingTimeout: 60000`, `pingInterval: 25000`.

6. **Mantén la configuración del pool MySQL**: `connectionLimit: 10`, `waitForConnections: true`, `queueLimit: 0`.

7. **Usa `require` (CommonJS)**, no ES Modules. El proyecto usa `require`.

8. **No añadas dependencias nuevas.** Usa solo: express, http, socket.io, mysql2, bcrypt, cors, dotenv.

---

## Detalle de cada archivo

### `index.js` (raíz)
- Importa `app.js`, crea el servidor HTTP, configura Socket.IO con las opciones de CORS y ping.
- Importa y ejecuta la función de registro de sockets desde `sockets/index.js`.
- Llama a `server.listen()`.

### `app.js`
- Crea la instancia de Express.
- Configura `cors` con `process.env.FRONTEND_URL || 'http://localhost:5173'` y `credentials: true`.
- Configura `express.json()`.
- Monta las rutas:
  - `app.use('/api', salaRoutes)`
  - `app.use('/api', mensajeRoutes)`
  - `app.use('/api', noticiaRoutes)`
- Exporta `app`.

### `config/db.js`
- Crea el pool con `mysql2.createPool(...)` usando las variables de entorno.
- Hace el `db.getConnection(...)` para verificar conexión al iniciar.
- Exporta `db`.

### `routes/salaRoutes.js`
- Define 3 rutas:
  - `POST /salas` → `salaController.crearSala`
  - `GET /salas/:tipo` → `salaController.obtenerSalasPorTipo`
  - `GET /sala/:idSala` → `salaController.obtenerSalaPorId`

### `routes/mensajeRoutes.js`
- Define 1 ruta:
  - `GET /mensajes/:idSala` → `mensajeController.obtenerMensajes`

### `routes/noticiaRoutes.js`
- Define 1 ruta:
  - `GET /noticias` → `noticiaController.obtenerNoticias`

### `controllers/salaController.js`
- Importa `db` de `../config/db`.
- Exporta 3 funciones: `crearSala`, `obtenerSalasPorTipo`, `obtenerSalaPorId`.
- Cada función contiene la lógica exacta que hay ahora en las rutas del index.js original.

### `controllers/mensajeController.js`
- Importa `db` de `../config/db`.
- Exporta `obtenerMensajes` con la query JOIN exacta del original.

### `controllers/noticiaController.js`
- Exporta `obtenerNoticias` con la llamada a `fetch` a GNews API usando `process.env.NEWS_API_KEY`.

### `sockets/index.js`
- Exporta una función `registrarSockets(io)`.
- Dentro hace `io.on('connection', (socket) => { ... })`.
- Crea el `mensajesProcesados` Set por socket.
- Llama a los 3 handlers pasándoles `io`, `socket`, y lo que necesiten.

### `sockets/authHandler.js`
- Exporta una función `(io, socket)`.
- Registra `socket.on('registrar_usuario', ...)` y `socket.on('login_usuario', ...)`.
- Importa `db` y `bcrypt`.

### `sockets/chatHandler.js`
- Exporta una función `(io, socket, mensajesProcesados)`.
- Registra `socket.on('unirse_chat', ...)`, `socket.on('salir_chat', ...)`, `socket.on('enviar_mensaje', ...)`.
- Importa `db` y los helpers de deduplicación desde `../utils/helpers.js`.
- Contiene toda la lógica de deduplicación y el `io.to(id_sala).emit(...)`.
- Registra también `socket.on('disconnect', ...)` para emitir `usuarios_sala` al desconectarse.

### `sockets/typingHandler.js`
- Exporta una función `(io, socket)`.
- Registra `socket.on('escribiendo', ...)` y `socket.on('dejo_de_escribir', ...)`.

### `utils/helpers.js`
- Exporta `formatearFechaMySQL`.
- Exporta las instancias `mensajesProcesadosGlobal` (Set) y `huellasMensajesRecientes` (Map).

---

## Verificación final

Después de reestructurar, asegúrate de que:
1. `node index.js` arranca sin errores.
2. Todos los `require` resuelven correctamente (rutas relativas bien puestas).
3. No hay imports circulares.
4. El pool de MySQL se exporta e importa como singleton (una sola instancia compartida).
5. Los eventos de Socket.IO siguen emitiendo y escuchando exactamente con los mismos nombres.
6. Las rutas HTTP responden en las mismas URLs.
