import React from 'react';
import Sidebar from './Sidebar'; // Navegación lateral principal
import './chats.css';          // Hoja de estilos de la vista

/**
 * Componente Diversion
 * Vista principal que renderiza la lista de salas de chat disponibles.
 * Implementa una arquitectura layout con Sidebar a la izquierda y contenido a la derecha.
 */
const Diversion = () => {
  // TODO: Reemplazar mockChats con llamada a la API (fetch/axios) conectada al backend
  const mockChats = [
    { id: 1, title: 'Debate de Fórmula 1', desc: 'Comenta la última carrera de la temporada' },
    { id: 2, title: 'Cine y Series', desc: 'Recomendaciones, críticas y cero spoilers' },
    { id: 3, title: 'Política Actual', desc: 'Debate abierto sobre las últimas noticias' },
    { id: 4, title: 'Tecnología e IA', desc: 'Novedades sobre desarrollo y gadgets' },
  ];

  /**
   * Manejador de evento para la creación de nuevas salas
   */
  const handleAddChat = () => {
    // Lógica futura para renderizar un Modal de creación o redirigir al formulario
    alert('Funcionalidad en desarrollo: Abrir formulario de nueva sala');
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
            aria-label="Crear nueva sala de chat" // Accesibilidad (Riesgo 4 mitigado)
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

      </main>
    </div>
  );
};

export default Diversion;