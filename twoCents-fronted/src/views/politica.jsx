import React from 'react';
import Sidebar from '../componentes/sidebar'; // Ajusta la ruta si Sidebar está en otra carpeta
import './css/chats.css';
// IMPORTANTE: Importamos la imagen de política correcta
import iconoPolitica from '../recursos/imagenes/Politica.png';

const Politica = () => {
  // Lista de chats de ejemplo con temática de política sin notificaciones
  const chatsPolitica = [
    {
      id: 1,
      title: 'Debate Elecciones 2024',
      lastMsg: '¿Quién creéis que ganará los próximos comicios locales?',
      unread: 0,
      hasUpdate: false,
    },
    {
      id: 2,
      title: 'Políticas Medioambientales 🌱',
      lastMsg:
        'La nueva ley de emisiones va a cambiar muchas cosas en la ciudad.',
      unread: 0,
      hasUpdate: false,
    },
    {
      id: 3,
      title: 'Economía y Fiscalidad',
      lastMsg:
        'He estado leyendo sobre la reforma de los tipos de interés. ¿Opiniones?',
      unread: 0,
      hasUpdate: false,
    },
    {
      id: 4,
      title: 'Actualidad Parlamentaria',
      lastMsg: '¿Habéis visto la sesión de control al gobierno de esta mañana?',
      unread: 0,
      hasUpdate: false,
    },
  ];

  return (
    <div className="page-layout">
      <Sidebar />

      <main className="chat-container">
        <header className="chat-header">
          <h1>Mis Chats de Política</h1>
        </header>

        <section className="chat-list">
          {chatsPolitica.map((chat) => (
            <div key={chat.id} className="chat-card">
              <div className="chat-icon-wrapper">
                {/* Usamos el icono de Política */}
                <img src={iconoPolitica} alt="Icono Política" />
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
              'Pronto crearemos el formulario para nuevos debates políticos'
            )
          }
        >
          +
        </button>
      </main>
    </div>
  );
};

export default Politica;
