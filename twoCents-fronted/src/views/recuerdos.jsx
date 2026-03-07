import React from 'react';
import Sidebar from '../componentes/sidebar';
import './css/chats.css';
// IMPORTANTE: Importamos la imagen de recuerdos correcta
import iconoRecuerdos from '../recursos/imagenes/Recuerdos.png';

const Recuerdos = () => {
  // Lista de chats de ejemplo con temática de nostalgia y recuerdos
  const chatsRecuerdos = [
    {
      id: 1,
      title: 'Compañeros del Instituto 🎓',
      lastMsg: '¿Alguien tiene todavía las fotos del viaje de fin de curso?',
      unread: 0,
      hasUpdate: false,
    },
    {
      id: 2,
      title: 'Cosas de los 90s 📼',
      lastMsg:
        'Ayer encontré mi vieja consola en el trastero, ¡y todavía funciona!',
      unread: 0,
      hasUpdate: false,
    },
    {
      id: 3,
      title: 'Veranos en el pueblo',
      lastMsg:
        'Qué tiempos aquellos cuando estábamos todo el día en la plaza...',
      unread: 0,
      hasUpdate: false,
    },
    {
      id: 4,
      title: 'Música de nuestra época',
      lastMsg:
        'Acabo de hacer una playlist que os va a llevar directos a 2010.',
      unread: 0,
      hasUpdate: false,
    },
  ];

  return (
    <div className="page-layout">
      <Sidebar />

      <main className="chat-container">
        <header className="chat-header">
          <h1>Mis Chats de Recuerdos</h1>
        </header>

        <section className="chat-list">
          {chatsRecuerdos.map((chat) => (
            <div key={chat.id} className="chat-card">
              <div className="chat-icon-wrapper">
                {/* Usamos el icono de Recuerdos */}
                <img src={iconoRecuerdos} alt="Icono Recuerdos" />
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
            alert(
              'Pronto crearemos el formulario para nuevos grupos de recuerdos'
            )
          }
        >
          +
        </button>
      </main>
    </div>
  );
};

export default Recuerdos;
