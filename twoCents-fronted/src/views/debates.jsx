import React from 'react';
import Sidebar from '../componentes/sidebar';
import './css/chats.css';
// IMPORTANTE: Importamos la imagen de debates correcta
import iconoDebates from '../recursos/imagenes/Debate.png';

const Debates = () => {
  // Lista de chats de ejemplo con temática de debates
  const chatsDebates = [
    {
      id: 1,
      title: 'Tortilla: ¿Con o sin cebolla?',
      lastMsg: 'Yo lo tengo clarísimo, sin cebolla no es tortilla.',
      unread: 0,
      hasUpdate: false,
    },
    {
      id: 2,
      title: 'Teletrabajo vs Oficina 💻',
      lastMsg: 'Creo que un modelo híbrido es lo mejor para la productividad.',
      unread: 0,
      hasUpdate: false,
    },
    {
      id: 3,
      title: 'El futuro de la Inteligencia Artificial',
      lastMsg: '¿Hasta qué punto creéis que nos reemplazarán en el trabajo?',
      unread: 0,
      hasUpdate: false,
    },
    {
      id: 4,
      title: 'Cine clásico vs Plataformas de Streaming',
      lastMsg:
        'La magia de ir a una sala de cine se está perdiendo por completo...',
      unread: 0,
      hasUpdate: false,
    },
  ];

  return (
    <div className="page-layout">
      <Sidebar />

      <main className="chat-container">
        <header className="chat-header">
          <h1>Mis Chats de Debates</h1>
        </header>

        <section className="chat-list">
          {chatsDebates.map((chat) => (
            <div key={chat.id} className="chat-card">
              <div className="chat-icon-wrapper">
                {/* Usamos el icono de Debates */}
                <img src={iconoDebates} alt="Icono Debates" />
                {chat.hasUpdate && <div className="status-dot"></div>}
              </div>

              <div className="chat-info">
                <h3>{chat.title}</h3>
                <p>{chat.lastMsg}</p>
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
          onClick={() =>
            alert('Pronto crearemos el formulario para nuevos debates')
          }
        >
          +
        </button>
      </main>
    </div>
  );
};

export default Debates;
