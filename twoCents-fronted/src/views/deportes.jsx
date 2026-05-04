import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../componentes/Sidebar';
import { useTemaOscuro } from '../contexto/useTemaOscuro';
import './css/chats.css';
// IMPORTANTE: Ajusta la ruta de la imagen si tu carpeta se llama distinto
import iconoDeportes from '../recursos/imagenes/deportes.png';
import iconoDeportesGris from '../recursos/imagenes/deportes_Gris.png';
import fondoDesktopClaro from '../recursos/imagenes/fondos_chats_desktop/deportes_desktop_claro.png';
import fondoDesktopOscuro from '../recursos/imagenes/fondos_chats_desktop/deportes_desktop_oscuro.png';
import fondoMovilClaro from '../recursos/imagenes/fondos_chats_movil/deportes_movil_claro.png';
import fondoMovilOscuro from '../recursos/imagenes/fondos_chats_movil/deportes_movil_oscuro.png';

const CLAVE_NO_LEIDOS_SALAS = 'salasMensajesNoLeidos';

const Deportes = () => {
  const navigate = useNavigate();
  const modoOscuro = useTemaOscuro();
  const [esMovil, setEsMovil] = useState(() => window.matchMedia('(max-width: 800px)').matches);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 800px)');
    const handler = (e) => setEsMovil(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const fondoActual = esMovil
    ? (modoOscuro ? fondoMovilOscuro : fondoMovilClaro)
    : (modoOscuro ? fondoDesktopOscuro : fondoDesktopClaro);
  // 1. ESTADO DE LOS CHATS (Iniciamos con algunos de prueba para que no se vea vacío)
  const [chatsDeportes, setChatsDeportes] = useState([]);

  // 2. ESTADOS PARA EL MODAL Y EL FORMULARIO
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nombreSala, setNombreSala] = useState('');
  const [descSala, setDescSala] = useState('');

  useEffect(() => {
    const cargarSalas = async () => {
      try {
        const respuesta = await fetch('http://localhost:3001/api/salas/deportes');
        const salasBD = await respuesta.json();
        const noLeidos = JSON.parse(localStorage.getItem(CLAVE_NO_LEIDOS_SALAS) || '{}');

        const salasFormateadas = salasBD.map(sala => ({
          id: sala.id_sala,
          title: sala.nombre,
          desc: sala.descripcion,
          unread: noLeidos[sala.id_sala] || 0,
          hasUpdate: (noLeidos[sala.id_sala] || 0) > 0,
          tipo: sala.tipo
        }));

        setChatsDeportes(salasFormateadas);
      } catch (error) {
        console.error("❌ Error al cargar las salas:", error);
      }
    };

    cargarSalas();
  }, []);

  useEffect(() => {
    const actualizarNoLeidos = () => {
      const noLeidos = JSON.parse(localStorage.getItem(CLAVE_NO_LEIDOS_SALAS) || '{}');
      setChatsDeportes((salasActuales) =>
        salasActuales.map((sala) => ({
          ...sala,
          unread: noLeidos[sala.id] || 0,
          hasUpdate: (noLeidos[sala.id] || 0) > 0,
        }))
      );
    };

    window.addEventListener('salas-no-leidos-actualizados', actualizarNoLeidos);
    return () => window.removeEventListener('salas-no-leidos-actualizados', actualizarNoLeidos);
  }, []);

  // 3. FUNCIÓN PARA CREAR LA SALA EN LA BASE DE DATOS
  const crearSala = async (e) => {
    e.preventDefault(); // Evita que se recargue la página

    if (nombreSala.trim() === '' || descSala.trim() === '') return;

    try {
      // Hacemos la petición POST a tu backend
      const respuesta = await fetch('http://localhost:3001/api/salas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: nombreSala,
          descripcion: descSala,
          tipo: 'deportes' // Se envía automáticamente según la vista
        })
      });

      const datos = await respuesta.json();

      if (datos.success) {
        // Si el backend responde OK, creamos la tarjeta con el ID REAL de la base de datos
        const nuevaSala = {
          id: datos.id_sala, // El ID que nos devuelve tu MySQL
          title: datos.nombre,
          desc: datos.descripcion,
          unread: 0,
          hasUpdate: false,
          tipo: datos.tipo
        };

        // Añadimos la nueva sala a la vista
        setChatsDeportes([...chatsDeportes, nuevaSala]);

        // Limpiamos el formulario y cerramos el modal
        setNombreSala('');
        setDescSala('');
        setMostrarModal(false);
      } else {
        alert("Hubo un problema al guardar la sala en el servidor.");
      }
    } catch (error) {
      console.error("❌ Error conectando con el backend:", error);
      alert("No se pudo conectar con el servidor. ¿Está encendido?");
    }
  };

  // Función para navegar a la sala de chat
  const entrarASala = (id, nombre) => {
    const noLeidos = JSON.parse(localStorage.getItem(CLAVE_NO_LEIDOS_SALAS) || '{}');
    noLeidos[id] = 0;
    localStorage.setItem(CLAVE_NO_LEIDOS_SALAS, JSON.stringify(noLeidos));

    setChatsDeportes((salasActuales) =>
      salasActuales.map((sala) =>
        sala.id === id
          ? { ...sala, unread: 0, hasUpdate: false }
          : sala
      )
    );

    navigate(`/sala/${id}`, { state: { nombreSala: nombre } });
  };

  return (
    <div className="page-layout">
      <Sidebar />

      <main className="chat-container" style={{
        backgroundImage: `url(${fondoActual})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: esMovil ? 'scroll' : 'fixed',
      }}>
        <header className="chat-header chat-header--deportes">
          <h1>Mis Chats de Deportes</h1>
        </header>

        {/* LISTA DE SALAS */}
        <section className="chat-list">
          {chatsDeportes.map((chat) => (
            <div 
              key={chat.id} 
              className="chat-card chat-card--deportes" 
              onClick={() => entrarASala(chat.id, chat.title)}
              style={{ cursor: 'pointer' }}
            >
              <div className="chat-icon-wrapper">
                <img src={modoOscuro ? iconoDeportesGris : iconoDeportes} alt="Icono Deportes" />
                {chat.hasUpdate && <div className="status-dot"></div>}
              </div>

              <div className="chat-info">
                <h3>{chat.title}</h3>
                <p>{chat.desc}</p>
              </div>

              {chat.unread > 0 && (
                <div className="msg-count">{chat.unread}</div>
              )}
            </div>
          ))}
        </section>

        {/* BOTÓN FLOTANTE PARA ABRIR EL MODAL */}
        <button
          className="btn-add-chat"
          title="Crear nuevo chat"
          onClick={() => setMostrarModal(true)}
        >
          +
        </button>

        {/* =========================================
            MODAL DE CREACIÓN DE SALA
            ========================================= */}
        {mostrarModal && (
          <div className="modal-overlay">
            <div className="modal-contenido">
              <h3>Crear Nueva Sala</h3>
              
              <form onSubmit={crearSala}>
                <div className="campo-form">
                  <label>Nombre de la sala</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Tenis de mesa" 
                    value={nombreSala}
                    onChange={(e) => setNombreSala(e.target.value)}
                    required
                  />
                </div>

                <div className="campo-form">
                  <label>Mini Descripción</label>
                  <textarea 
                    placeholder="¿De qué trata esta sala?" 
                    value={descSala}
                    onChange={(e) => setDescSala(e.target.value)}
                    required
                  ></textarea>
                </div>

                {/* Mostramos el tipo bloqueado para que el usuario sepa dónde se crea */}
                <div className="campo-form">
                  <label>Categoría</label>
                  <input 
                    type="text" 
                    value="Deportes" 
                    disabled 
                    style={{ backgroundColor: '#f0f0f0', color: '#888', cursor: 'not-allowed' }}
                  />
                </div>

                <div className="modal-botones">
                  <button type="button" className="btn-cancelar" onClick={() => setMostrarModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-crear">
                    Crear Sala
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Deportes;