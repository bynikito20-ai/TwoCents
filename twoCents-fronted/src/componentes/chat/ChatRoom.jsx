import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import socket from '../../servicios/useSocket';
import './ChatRoom.css';

export default function ChatRoom() {
  const { idSala } = useParams();
  
  // Estados
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [usuariosEscribiendo, setUsuariosEscribiendo] = useState([]);
  const [estoyEscribiendo, setEstoyEscribiendo] = useState(false);
  
  // Ref para auto-scroll al final de los mensajes
  const messagesEndRef = useRef(null);
  const timeoutEscrituraRef = useRef(null);

  // Al montar el componente: cargar usuario, historial y conectar a socket
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // 1. Obtener usuario del localStorage
        const usuarioJSON = localStorage.getItem('usuarioLogeado');
        if (!usuarioJSON) {
          throw new Error('Usuario no encontrado');
        }
        const usuario = JSON.parse(usuarioJSON);
        setUsuarioActual(usuario);

        // 2. Cargar historial de mensajes
        const respuesta = await fetch(
          `http://localhost:3001/api/mensajes/${idSala}`
        );
        if (!respuesta.ok) {
          throw new Error('Error al cargar los mensajes');
        }
        const mensajesDB = await respuesta.json();
        setMensajes(Array.isArray(mensajesDB) ? mensajesDB : []);
        setCargando(false);

        // 3. Emitir evento de unirse a la sala
        socket.emit('unirse_chat', {
          id_sala: idSala,
          id_usuario: usuario.id_usuario,
          nombre_usuario: usuario.nombre,
        });
      } catch (err) {
        console.error('❌ Error:', err);
        setError(err.message);
        setCargando(false);
      }
    };

    cargarDatos();

    // Limpiar al desmontar
    return () => {
      socket.off('recibir_mensaje');
      socket.off('alguien_escribiendo');
      socket.off('alguien_dejo_escribir');
    };
  }, [idSala]);

  // Escuchar evento de nuevo mensaje
  useEffect(() => {
    const manejarMensaje = (mensaje) => {
      setMensajes((prevMensajes) => [...prevMensajes, mensaje]);
      // Limpiar la lista de "escribiendo" cuando llega un mensaje
      setUsuariosEscribiendo([]);
    };

    socket.on('recibir_mensaje', manejarMensaje);

    return () => socket.off('recibir_mensaje', manejarMensaje);
  }, []);

  // Escuchar evento de alguien escribiendo
  useEffect(() => {
    const manejarEscribiendo = ({ id_usuario, nombre_usuario }) => {
      setUsuariosEscribiendo((prev) => {
        // Evitar duplicados
        if (prev.find((u) => u.id_usuario === id_usuario)) {
          return prev;
        }
        return [...prev, { id_usuario, nombre_usuario }];
      });
    };

    socket.on('alguien_escribiendo', manejarEscribiendo);

    return () => socket.off('alguien_escribiendo', manejarEscribiendo);
  }, []);

  // Escuchar evento de alguien dejó de escribir
  useEffect(() => {
    const manejarDejóDeEscribir = ({ id_usuario }) => {
      setUsuariosEscribiendo((prev) =>
        prev.filter((u) => u.id_usuario !== id_usuario)
      );
    };

    socket.on('alguien_dejo_escribir', manejarDejóDeEscribir);

    return () => socket.off('alguien_dejo_escribir', manejarDejóDeEscribir);
  }, []);

  // Auto-scroll al final cuando llegan nuevos mensajes
  useEffect(() => {
    scrollAlFinal();
  }, [mensajes, usuariosEscribiendo]);

  const scrollAlFinal = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Manejar cambio en el input
  const manejarCambioInput = (e) => {
    const valor = e.target.value;
    setNuevoMensaje(valor);

    // Si empieza a escribir y no estoy escrito aún, emitir evento
    if (valor.length > 0 && !estoyEscribiendo) {
      setEstoyEscribiendo(true);
      if (usuarioActual) {
        socket.emit('escribiendo', {
          id_sala: idSala,
          id_usuario: usuarioActual.id_usuario,
          nombre_usuario: usuarioActual.nombre,
        });
      }
    }

    // Limpiar timeout anterior y crear uno nuevo
    if (timeoutEscrituraRef.current) {
      clearTimeout(timeoutEscrituraRef.current);
    }

    // Si deja de escribir por 1 segundo, emitir evento de "dejó de escribir"
    timeoutEscrituraRef.current = setTimeout(() => {
      if (usuarioActual && estoyEscribiendo) {
        setEstoyEscribiendo(false);
        socket.emit('dejo_de_escribir', {
          id_sala: idSala,
          id_usuario: usuarioActual.id_usuario,
        });
      }
    }, 1000);
  };

  // Enviar mensaje
  const manejarEnvio = (e) => {
    e.preventDefault();

    if (!nuevoMensaje.trim() || !usuarioActual) {
      return;
    }

    // Emitir evento de enviar mensaje
    socket.emit('enviar_mensaje', {
      id_sala: idSala,
      id_usuario: usuarioActual.id_usuario,
      nombre_usuario: usuarioActual.nombre,
      contenido: nuevoMensaje.trim(),
      hora_envio: new Date().toISOString(),
    });

    // Limpiar input
    setNuevoMensaje('');
    setEstoyEscribiendo(false);

    // Emitir evento de dejó de escribir
    socket.emit('dejo_de_escribir', {
      id_sala: idSala,
      id_usuario: usuarioActual.id_usuario,
    });
  };

  // Formatear hora
  const formatearHora = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Loading
  if (cargando) {
    return (
      <div className="chatroom">
        <div className="chatroom__loading">
          <p>Cargando conversación... ⏳</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="chatroom">
        <div className="chatroom__error">
          <p>❌ Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chatroom">
      <div className="chatroom__container">
        {/* Lista de mensajes */}
        <div className="chatroom__messages">
          {mensajes.length === 0 ? (
            <div className="chatroom__empty">
              <p>¡Sé el primero en iniciar la conversación!</p>
            </div>
          ) : (
            mensajes.map((mensaje, index) => {
              const esMio = mensaje.id_usuario === usuarioActual.id_usuario;
              return (
                <div
                  key={mensaje.id_mensaje || index}
                  className={`chatroom__message ${
                    esMio
                      ? 'chatroom__message--propio'
                      : 'chatroom__message--otro'
                  }`}
                >
                  <div className="chatroom__bubble">
                    {!esMio && (
                      <span className="chatroom__username">
                        {mensaje.nombre_usuario}
                      </span>
                    )}
                    <p className="chatroom__content">{mensaje.contenido}</p>
                    <span className="chatroom__timestamp">
                      {formatearHora(mensaje.hora_envio)}
                    </span>
                  </div>
                </div>
              );
            })
          )}

          {/* Indicador de "escribiendo..." */}
          {usuariosEscribiendo.length > 0 && (
            <div className="chatroom__typing-indicator">
              <p>
                {usuariosEscribiendo
                  .map((u) => u.nombre_usuario)
                  .join(' y ')}{' '}
                está{usuariosEscribiendo.length > 1 ? 'n' : ''} escribiendo...
              </p>
            </div>
          )}

          {/* Referencia para scroll */}
          <div ref={messagesEndRef} />
        </div>

        {/* Form de envío */}
        <form className="chatroom__form" onSubmit={manejarEnvio}>
          <div className="chatroom__input-wrapper">
            <input
              type="text"
              className="chatroom__input"
              placeholder="Escribe un mensaje..."
              value={nuevoMensaje}
              onChange={manejarCambioInput}
              disabled={!usuarioActual}
            />
            <button
              type="submit"
              className="chatroom__button"
              disabled={!nuevoMensaje.trim() || !usuarioActual}
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
