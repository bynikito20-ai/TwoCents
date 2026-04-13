import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../componentes/sidebar';
import './css/chats.css';
// IMPORTANTE: Importamos la imagen de debates correcta
import iconoDebates from '../recursos/imagenes/Debate.png';

const Debates = () => {
  const navigate = useNavigate();
  // Lista de chats de ejemplo con temática de debates
  const [chatsDebates, setChatsDebates] = useState([]);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nombreSala, setNombreSala] = useState('');
  const [descSala, setDescSala] = useState('');

  useEffect(() => {
      const cargarSalas = async () => {
        try {
          const respuesta = await fetch('http://localhost:3001/api/salas/debates');
          const salasBD = await respuesta.json();
  
          const salasFormateadas = salasBD.map(sala => ({
            id: sala.id_sala,
            title: sala.nombre,
            desc: sala.descripcion,
            unread: 0,
            hasUpdate: false,
            tipo: sala.tipo
          }));
  
          setChatsDebates(salasFormateadas);
        } catch (error) {
          console.error("❌ Error al cargar las salas:", error);
        }
      };
  
      cargarSalas();
    }, []);


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
          tipo: 'debates' // Se envía automáticamente según la vista
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
        setChatsDebates([...chatsDebates, nuevaSala]);

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
  const entrarASala = (id) => {
    navigate(`/sala/${id}`);
  };

  return (
    <div className="page-layout">
      <Sidebar />

      <main className="chat-container">
        <header className="chat-header">
          <h1>Mis Chats de Debates</h1>
        </header>

        <section className="chat-list">
          {chatsDebates.map((chat) => (
            <div 
              key={chat.id} 
              className="chat-card"
              onClick={() => entrarASala(chat.id)}
              style={{ cursor: 'pointer' }}
            >
              
              <div className="chat-icon-wrapper">
                {/* Usamos el icono de Debates */}
                <img src={iconoDebates} alt="Icono Debates" />
                {chat.hasUpdate && <div className="status-dot"></div>}
              </div>

              <div className="chat-info">
                <h3>{chat.title}</h3>
                <p>{chat.desc}</p>
              </div>

              {/* Si hay mensajes sin leer, mostramos el contador (ahora oculto) */}
              {chat.unread > 0 && (
                <div className="msg-count">{chat.unread}</div>
              )}
            </div>
          ))}
        </section>

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
                  <label>Mini descripción</label>
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
                    value="Debates" 
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

export default Debates;
