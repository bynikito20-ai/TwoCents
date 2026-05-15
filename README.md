# TwoCents

Aplicación web de chat en tiempo real con salas temáticas, autenticación segura y feed de noticias integrado.

---

## Indice

- [Descripción](#descripción)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Funcionalidades](#funcionalidades)
- [Rutas del frontend](#rutas-del-frontend)
- [API REST](#api-rest)
- [Eventos Socket.io](#eventos-socketio)
- [Esquema de base de datos](#esquema-de-base-de-datos)
- [Variables de entorno](#variables-de-entorno)
- [Puesta en marcha local](#puesta-en-marcha-local)
- [Scripts disponibles](#scripts-disponibles)
- [Despliegue en producción](#despliegue-en-producción)

---

## Descripción

TwoCents es una plataforma de debate y conversación en tiempo real. Los usuarios se registran, eligen una sala temática y chatean con otros usuarios conectados simultáneamente. Incluye historial de mensajes persistente en MySQL, indicador de escritura, conteo de usuarios en sala y un feed de noticias de actualidad.

---

## Stack tecnológico

### Frontend

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19.2.0 | Librería de UI |
| Vite | 7.3.1 | Bundler y dev server |
| React Router DOM | 7.13.0 | Enrutamiento SPA |
| Socket.io Client | 4.8.3 | Comunicación en tiempo real |
| Serve | 14.2.0 | Servidor de producción del build |

### Backend

| Tecnología | Versión | Uso |
|---|---|---|
| Node.js + Express | 5.2.1 | API REST |
| Socket.io | 4.8.3 | WebSockets |
| MySQL2 | 3.17.4 | Base de datos relacional |
| bcrypt | 6.0.0 | Hash de contraseñas |
| dotenv | 17.3.1 | Gestión de variables de entorno |
| CORS | 2.8.6 | Control de origen cruzado |

---

## Estructura del repositorio

```
TwoCents/
├── twoCents-fronted/               # Frontend React + Vite
│   ├── src/
│   │   ├── main.jsx                # Punto de entrada
│   │   ├── App.jsx                 # Componente raíz
│   │   ├── routes.jsx              # Definición de rutas
│   │   ├── componentes/
│   │   │   ├── Sidebar.jsx         # Barra lateral de navegación
│   │   │   ├── Layout.jsx          # Wrapper con sidebar
│   │   │   ├── aspecto/            # Tema oscuro/claro (toggle, iconos)
│   │   │   └── chat/
│   │   │       └── ChatRoom.jsx    # Sala de chat en tiempo real
│   │   ├── contexto/               # Hooks personalizados
│   │   │   ├── useTemaOscuro.js    # Gestión de tema claro/oscuro
│   │   │   └── useFondoResponsive.js
│   │   ├── servicios/              # Capa de comunicación
│   │   │   ├── peticionesApi.js    # Llamadas HTTP al backend
│   │   │   └── useSocket.js        # Conexión Socket.io global
│   │   ├── views/                  # Páginas de la aplicación
│   │   │   ├── IniciarSesion.jsx
│   │   │   ├── Registro.jsx
│   │   │   ├── Inicio.jsx          # Home con noticias
│   │   │   ├── Perfil.jsx
│   │   │   ├── Deportes.jsx
│   │   │   ├── Debates.jsx
│   │   │   ├── Actualidad.jsx
│   │   │   ├── Diversion.jsx
│   │   │   ├── Politica.jsx
│   │   │   ├── Recuerdos.jsx
│   │   │   └── Reflexivas.jsx
│   │   └── recursos/               # Assets estáticos
│   │       ├── index.css
│   │       └── imagenes/           # Logo, iconos y fondos (desktop + móvil)
│   ├── vite.config.js
│   ├── jsconfig.json               # Alias de rutas (@/*)
│   └── package.json
│
├── twocents-backend/               # Backend Node.js + Express
│   ├── index.js                    # Entrada: HTTP server + Socket.io
│   ├── app.js                      # Configuración de Express
│   ├── config/
│   │   └── db.js                   # Pool de conexiones MySQL
│   ├── routes/
│   │   ├── salaRoutes.js
│   │   ├── mensajeRoutes.js
│   │   └── noticiaRoutes.js
│   ├── controllers/
│   │   ├── salaController.js
│   │   ├── mensajeController.js
│   │   └── noticiaController.js    # Proxy a GNews API
│   ├── sockets/
│   │   ├── index.js                # Registro de handlers
│   │   ├── authHandler.js          # Registro y login
│   │   ├── chatHandler.js          # Mensajes y conexión a salas
│   │   └── typingHandler.js        # Indicador de escritura
│   ├── utils/
│   │   └── helpers.js              # formatearFechaMySQL, deduplicación
│   └── package.json
│
├── .prettierrc
└── README.md
```

---

## Funcionalidades

### Autenticación

- Registro de usuario con validación de nombre único y email único
- Hash de contraseña con bcrypt antes de guardar en base de datos
- Login verificado contra el hash almacenado
- Sesión persistida en `localStorage` como JSON
- Protección de rutas: redirige a login si no hay sesión activa

### Chat en tiempo real

- 7 categorías de salas: Deportes, Debates, Actualidad, Diversión, Política, Recuerdos, Reflexión
- Historial de mensajes cargado al entrar a la sala
- Envío y recepción instantánea de mensajes via Socket.io
- Indicador "escribiendo..." con timeout de 1 segundo
- Contador de usuarios conectados por sala en tiempo real
- Deduplicación de mensajes con `client_msg_id` para evitar envíos dobles
- Auto-scroll al mensaje más reciente

### Feed de noticias

- Proxy seguro a GNews API desde el backend
- 12 noticias en español sobre actualidad
- Mostradas en la vista `/inicio`

### Tema visual

- Toggle claro / oscuro persistido en `localStorage`
- Fondos distintos según tema y dispositivo (desktop y móvil)
- Sincronización del tema entre pestañas del navegador

---

## Rutas del frontend

| Ruta | Vista | Protegida |
|---|---|---|
| `/` | IniciarSesion | No |
| `/registro` | Registro | No |
| `/inicio` | Inicio (noticias) | Si |
| `/sala/:idSala` | ChatRoom | Si |
| `/perfil` | Perfil | Si |
| `/informacion` | Información | Si |
| `/deportes` | Listado salas Deportes | Si |
| `/debates` | Listado salas Debates | Si |
| `/actualidad` | Listado salas Actualidad | Si |
| `/diversion` | Listado salas Diversión | Si |
| `/politica` | Listado salas Política | Si |
| `/recuerdos` | Listado salas Recuerdos | Si |
| `/reflexivas` | Listado salas Reflexión | Si |

---

## API REST

Base URL en desarrollo: `http://localhost:3001`

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/salas` | Crear una nueva sala |
| `GET` | `/api/salas/:tipo` | Listar salas de una categoría |
| `GET` | `/api/sala/:idSala` | Obtener detalles de una sala |
| `GET` | `/api/mensajes/:idSala` | Historial de mensajes de una sala |
| `GET` | `/api/noticias` | Noticias actuales (proxy GNews) |

---

## Eventos Socket.io

### Cliente → Servidor

| Evento | Payload | Descripción |
|---|---|---|
| `registrar_usuario` | `{usuario, email, password}` | Crear cuenta nueva |
| `login_usuario` | `{usuario, password}` | Iniciar sesión |
| `unirse_chat` | `{id_sala, id_usuario, nombre_usuario}` | Entrar a una sala |
| `salir_chat` | `{id_sala}` | Abandonar una sala |
| `enviar_mensaje` | `{id_sala, id_usuario, contenido, nombre_usuario, hora_envio, client_msg_id}` | Enviar un mensaje |
| `escribiendo` | `{id_sala, id_usuario, nombre_usuario}` | Notificar que el usuario escribe |
| `dejo_de_escribir` | `{id_sala, id_usuario}` | Notificar que dejó de escribir |

### Servidor → Cliente

| Evento | Payload | Descripción |
|---|---|---|
| `registro_resultado` | `{success, message}` | Resultado del registro |
| `login_resultado` | `{success, usuario: {id_usuario, nombre, email}}` | Resultado del login |
| `recibir_mensaje` | `{id_mensaje, id_sala, id_usuario, contenido, nombre_usuario, hora_envio}` | Mensaje nuevo en sala |
| `usuarios_sala` | `{id_sala, total}` | Usuarios conectados en sala |
| `alguien_escribiendo` | `{id_sala, id_usuario, nombre_usuario}` | Alguien está escribiendo |
| `alguien_dejo_escribir` | `{id_sala, id_usuario}` | Alguien dejó de escribir |
| `mensaje_nuevo_notificacion` | `{id_sala, id_usuario, hora_envio}` | Notificación de mensaje nuevo |

---

## Esquema de base de datos

Base de datos: `twocents_db` (MySQL)

```sql
CREATE TABLE USUARIO (
  id_usuario       INT AUTO_INCREMENT PRIMARY KEY,
  usuario          VARCHAR(255) UNIQUE NOT NULL,
  email            VARCHAR(255) UNIQUE NOT NULL,
  constrasenia_hash VARCHAR(255) NOT NULL
);

CREATE TABLE SALA (
  id_sala     INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(255) NOT NULL,
  descripcion TEXT,
  tipo        VARCHAR(50) NOT NULL
  -- tipos: deportes | debates | actualidad | diversion | politica | recuerdos | reflexivas
);

CREATE TABLE MENSAJE (
  id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
  id_sala    INT NOT NULL,
  id_usuario INT NOT NULL,
  contenido  LONGTEXT NOT NULL,
  hora_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_sala)    REFERENCES SALA(id_sala),
  FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario)
);
```

---

## Variables de entorno

### Backend (`twocents-backend/.env`)

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=twocents_db
PORT=3001
NEWS_API_KEY=<tu_clave_gnews>
FRONTEND_URL=http://localhost:5173
```

### Frontend (`twoCents-fronted/.env`)

```env
VITE_BACKEND_URL=http://localhost:3001
```

En producción reemplazar con la URL del backend desplegado.

---

## Puesta en marcha local

### Requisitos previos

- Node.js 18+
- MySQL corriendo en `localhost:3306`

### 1. Clonar el repositorio

```bash
git clone https://github.com/bynikito20-ai/TwoCents.git
cd TwoCents
```

### 2. Crear la base de datos

Ejecutar el SQL del apartado [Esquema de base de datos](#esquema-de-base-de-datos) en tu servidor MySQL.

### 3. Configurar y arrancar el backend

```bash
cd twocents-backend
npm install
# Revisar y ajustar el archivo .env
npm run dev
# Servidor en http://localhost:3001
```

### 4. Configurar y arrancar el frontend

```bash
cd ../twoCents-fronted
npm install
# Crear .env con VITE_BACKEND_URL=http://localhost:3001
npm run dev
# App en http://localhost:5173
```

---

## Scripts disponibles

### Frontend

```bash
npm run dev       # Dev server con Vite (HMR)
npm run build     # Build de producción → /dist
npm run preview   # Vista previa del build local
npm start         # Sirve /dist con `serve` (producción)
```

### Backend

```bash
npm start         # node index.js
npm run dev       # nodemon index.js (auto-reload)
```

---

## Despliegue en producción

El proyecto está configurado para Railway:

- **Backend**: Node.js con pool MySQL (`waitForConnections`, `connectionLimit: 10`) para tolerar la latencia de Railway.
- **Frontend**: `npm run build` genera `/dist`, que se sirve con `serve` en el puerto asignado por `$PORT`.
- **CORS**: el backend lee `process.env.FRONTEND_URL` para autorizar el origen del frontend.

Variables de entorno adicionales en Railway:

```env
# Backend
DB_HOST=<host_railway_mysql>
DB_USER=<usuario>
DB_PASS=<contraseña>
DB_NAME=twocents_db
NEWS_API_KEY=<clave_gnews>
FRONTEND_URL=https://<tu-app>.up.railway.app

# Frontend
VITE_BACKEND_URL=https://<tu-backend>.up.railway.app
```
