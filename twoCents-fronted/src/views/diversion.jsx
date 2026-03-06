import React, { useState } from 'react';
import Sidebar from '../componentes/Sidebar.jsx'; // Navegación lateral principal
import './css/chats.css';          // Hoja de estilos de la vista

/**
 * Componente Diversion
 * Vista principal que renderiza la lista de salas de chat disponibles.
 * Implementa una arquitectura layout con Sidebar a la izquierda y contenido a la derecha.
 */
const Diversion = () => {
  // TODO: Reemplazar mockChats con llamada a la API (fetch/axios) conectada al backend
  
  const [mockChats, setMockChats] = useState([
    { id: 1, title: 'Debate de Fórmula 1', desc: 'Comenta la última carrera de la temporada' },
    { id: 2, title: 'Cine y Series', desc: 'Recomendaciones, críticas y cero spoilers' },
    { id: 3, title: 'Política Actual', desc: 'Debate abierto sobre las últimas noticias' },
    { id: 4, title: 'Tecnología e IA', desc: 'Novedades sobre desarrollo y gadgets' },
  ]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevaDesc, setNuevaDesc] = useState('');
  
  
  const crearNuevaSala = (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // Si los campos están vacíos, no hacemos nada
    if (nuevoTitulo.trim() === '' || nuevaDesc.trim() === '') return;

    // Creamos el nuevo objeto sala
    const nuevaSala = {
      id: Date.now(), // Usamos la fecha actual en milisegundos para generar un ID único
      title: nuevoTitulo,
      desc: nuevaDesc
    };

    
    setMockChats([...mockChats, nuevaSala]);

    // Vaciamos los inputs y cerramos el modal
    setNuevoTitulo('');
    setNuevaDesc('');
    setMostrarModal(false);
  };

  /**
   * Manejador de evento para la creación de nuevas salas
   */
  const handleAddChat = () => {
    // Lógica futura para renderizar un Modal de creación o redirigir al formulario
    setMostrarModal(true);
  };

  

return (
    <div className="page-layout">
      {/* Navegación Global */}
      <Sidebar />

      {/* Contenedor Principal de la Vista */}
      <main className="chat-container">
        
        {/* Cabecera y Controles */}
        <header className="chat-header">
          <h1>Salas de Diversión</h1>
          <button 
            className="btn-add-chat" 
            onClick={handleAddChat} 
            aria-label="Crear nueva sala de chat" 
            title="Crear nueva sala de chat"
          >
            +
          </button>
        </header>

        {/* Renderizado dinámico del Grid de salas */}
        <div className="chat-list">
          {mockChats.map((chat) => (
            <div key={chat.id} className="chat-card">
              <h3>{chat.title}</h3>
              <p>{chat.desc}</p>
            </div>
          ))}
        </div>

        {/* =========================================
            EL MODAL PARA CREAR UNA SALA NUEVA
            ========================================= */}
        {mostrarModal && (
          <div className="modal-overlay">
            <div className="modal-contenido">
              <h3>Crear nueva sala</h3>
              
              <form onSubmit={crearNuevaSala}>
                <div className="campo-form">
                  <label>Título de la sala</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Videojuegos Retro" 
                    value={nuevoTitulo}
                    onChange={(e) => setNuevoTitulo(e.target.value)}
                    required
                  />
                </div>

                <div className="campo-form">
                  <label>Descripción</label>
                  <textarea 
                    placeholder="¿De qué trata esta sala?" 
                    value={nuevaDesc}
                    onChange={(e) => setNuevaDesc(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="modal-botones">
                  <button 
                    type="button" 
                    className="btn-cancelar" 
                    onClick={() => setMostrarModal(false)}
                  >
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
}

export default Diversion;