# ChatRoom.jsx - Documentación de Uso

## 📋 Descripción General
El componente `ChatRoom.jsx` es una sala de chat en tiempo real totalmente funcional que utiliza **Socket.IO** para comunicación bidireccional. Está diseñado para integrarse perfectamente con tu arquitectura de rutas protegidas y gestión de sesiones.

## 📦 Características Principales

✅ **Conexión en Tiempo Real**: Usa Socket.IO para mensajería instantánea  
✅ **Historial de Mensajes**: Carga automáticamente mensajes previos del backend  
✅ **Indicador "Escribiendo..."**: Muestra cuando otros usuarios están escribiendo  
✅ **Diseño Responsive**: Funciona perfectamente en desktop, tablet y móvil  
✅ **Estilos BEM**: CSS limpio, mantenible y escalable  
✅ **Protección de Autenticación**: Solo usuarios logueados pueden acceder  
✅ **Auto-scroll**: Se desplaza automáticamente al último mensaje  

## 🛠️ Instalación y Configuración

### 1. El componente ya está creado en:
```
src/componentes/chat/ChatRoom.jsx
src/componentes/chat/ChatRoom.css
```

### 2. Ya está integrado en App.jsx:
La ruta `/sala/:idSala` está disponible y protegida:
```javascript
<Route
  path="/sala/:idSala"
  element={
    <ProtectedRoute>
      <ChatRoom />
    </ProtectedRoute>
  }
/>
```

## 📡 Eventos de Socket.IO

### Eventos que Emites (Cliente → Servidor)
```javascript
// Al entrar en la sala
socket.emit('unirse_chat', {
  id_sala: idSala,
  id_usuario: usuario.id_usuario,
  nombre_usuario: usuario.nombre
});

// Al enviar un mensaje
socket.emit('enviar_mensaje', {
  id_sala: idSala,
  id_usuario: usuarioActual.id_usuario,
  nombre_usuario: usuarioActual.nombre,
  contenido: nuevoMensaje,
  hora_envio: new Date().toISOString()
});

// Mientras el usuario escribe
socket.emit('escribiendo', {
  id_sala: idSala,
  id_usuario: usuarioActual.id_usuario,
  nombre_usuario: usuarioActual.nombre
});

// Cuando el usuario deixa de escribir
socket.emit('dejo_de_escribir', {
  id_sala: idSala,
  id_usuario: usuarioActual.id_usuario
});
```

### Eventos que Escuchas (Servidor → Cliente)
```javascript
// Nuevo mensaje recibido
socket.on('recibir_mensaje', (mensaje) => {
  // mensaje contiene: id_mensaje, id_usuario, id_sala, contenido, hora_envio, nombre_usuario
});

// Alguien está escribiendo
socket.on('alguien_escribiendo', ({ id_usuario, nombre_usuario }) => {
  // Mostrar indicador de "X está escribiendo..."
});

// Alguien dejó de escribir
socket.on('alguien_dejo_escribir', ({ id_usuario }) => {
  // Eliminar indicador de escritura
});
```

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────────┐
│  1. Usuario entra en /sala/:idSala                   │
├─────────────────────────────────────────────────────┤
│  ↓                                                   │
│ 2. Se carga usuario del localStorage                │
│ 3. Se carga historial: GET /api/mensajes/:idSala    │
│ 4. Se emite: socket.emit('unirse_chat')             │
├─────────────────────────────────────────────────────┤
│  ↓                                                   │
│ 5. Usuario escribe → socket.emit('escribiendo')     │
│ 6. Timeout de 1s → socket.emit('dejo_de_escribir')  │
├─────────────────────────────────────────────────────┤
│  ↓                                                   │
│ 7. Usuario envía → socket.emit('enviar_mensaje')    │
│ 8. Backend procesa y emite 'recibir_mensaje'        │
│ 9. Componente actualiza estado de mensajes          │
└─────────────────────────────────────────────────────┘
```

## 🎨 Estructura de Datos Esperada

### Usuario en localStorage
```javascript
// Se almacena como JSON
{
  id_usuario: 1,
  nombre: "Juan Pérez",
  // ... otros campos
}
```
⚠️ **Importante**: Asume que `localStorage.getItem('usuarioLogeado')` es una cadena JSON que incluye `id_usuario` y `nombre`.

### Mensaje en Base de Datos / Socket
```javascript
{
  id_mensaje: 1,
  id_usuario: 1,
  id_sala: 5,
  contenido: "Hola, ¿cómo estás?",
  hora_envio: "2026-04-13T14:30:00.000Z",
  nombre_usuario: "Juan Pérez"
}
```

## 🖇️ Integración en tus Vistas

### Ejemplo: Desde `actualidad.jsx`, abrir una sala de chat

```javascript
import { useNavigate } from 'react-router-dom';

const Actualidad = () => {
  const navigate = useNavigate();

  const abrirSalaChat = (idSala) => {
    navigate(`/sala/${idSala}`);
  };

  return (
    <div>
      {/* Tus salas */}
      {salasActualidad.map((sala) => (
        <div key={sala.id_sala}>
          <h3>{sala.nombre}</h3>
          <button onClick={() => abrirSalaChat(sala.id_sala)}>
            Abrir chat
          </button>
        </div>
      ))}
    </div>
  );
};
```

## 🔧 Backend - Rutas Necesarias

### GET /api/mensajes/:idSala
Debe retornar un array de mensajes:
```javascript
[
  {
    id_mensaje: 1,
    id_usuario: 1,
    id_sala: 5,
    contenido: "Primer mensaje",
    hora_envio: "2026-04-13T14:00:00.000Z",
    nombre_usuario: "Usuario1"
  },
  // ... más mensajes
]
```

## 🎯 Personalización

### Cambiar colores del gradiente
En `ChatRoom.css`, busca:
```css
.chatroom__message--propio .chatroom__bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Cambiar tamaño máximo de mensaje
```css
.chatroom__bubble {
  max-width: 70%; /* Ajusta este valor */
}
```

### Cambiar tiempo de detección de "dejó de escribir"
En `ChatRoom.jsx`, búsca el número `1000` en la función `manejarCambioInput`:
```javascript
// Si deja de escribir por 1000 ms (1 segundo), emitir evento
timeoutEscrituraRef.current = setTimeout(() => {
  // ...
}, 1000); // ← Ajusta aquí (en milisegundos)
```

## 📱 Estados y Manejo de Errores

### Estados Principales
- **Cargando**: Muestra "Cargando conversación... ⏳"
- **Error**: Muestra "❌ Error: [mensaje]"
- **Vacío**: Muestra "¡Sé el primero en iniciar la conversación!"
- **Normal**: Renderiza la lista de mensajes

## ✨ Mejoras Futuras Sugeridas

1. **Editar mensajes**: Agregar funcionalidad para editar mensajes propios
2. **Eliminar mensajes**: Permitir eliminar mensajes propios
3. **Reacciones emoji**: Agregar reacciones a mensajes
4. **Mencionas @usuario**: Sistema de menciones
5. **Búsqueda de mensajes**: Filtrar por contenido
6. **Adjuntos de archivos**: Soporte para imágenes y archivos
7. **Presencia de usuarios**: Mostrar quién está conectado
8. **Pinear mensajes**: Mensajes importantes fijados

## 🐛 Debugging

Si tienes problemas, abre la consola del navegador y verifica:

### Socket conectado
```javascript
// En la consola del navegador
socket.connected // Debe ser true
```

### Escuchar todos los eventos
```javascript
socket.onAny((event, ...args) => {
  console.log('Evento:', event, args);
});
```

### Ver estado del componente
```javascript
// Agrega logs en ChatRoom.jsx línea ~30
console.log('Usuario:', usuarioActual);
console.log('Mensajes:', mensajes);
```

## 📞 Soporte Backend Requerido

Tu servidor Express debe manejar:

1. ✅ **Ruta GET /api/mensajes/:idSala** - Historial
2. ✅ **Socket: unirse_chat** - Usuario se une
3. ✅ **Socket: enviar_mensaje** - Guardar y broadcast
4. ✅ **Socket: escribiendo** - Notificar que escribe
5. ✅ **Socket: dejo_de_escribir** - Notificar que dejó de escribir

---

**Última actualización**: 13 de Abril, 2026  
**Versión del Componente**: 1.0.0
