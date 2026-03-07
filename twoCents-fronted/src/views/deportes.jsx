import React from 'react';
import Sidebar from '../componentes/sidebar';
import './css/chats.css';
// IMPORTANTE: Importamos la imagen de deportes correcta
import iconoDeportes from '../recursos/imagenes/deportes.png';

const Deportes = () => {
  // Lista de chats de ejemplo con temática deportiva
  const chatsDeportes = [
    {
      id: 1,
      title: 'Fútbol Sala - Equipo',
      lastMsg:
        '¿A qué hora es el partido de este domingo? Confirmad asistencia.',
      unread: 0,
      hasUpdate: false,
    },
    {
      id: 2,
      title: 'NBA Fans 🏀',
      lastMsg: '¡Vaya barbaridad de triple en el último segundo del cuarto!',
      unread: 0,
      hasUpdate: false,
    },
    {
      id: 3,
      title: 'Gimnasio y Rutinas',
      lastMsg: 'Hoy me toca día de pierna, deseadme suerte por favor...',
      unread: 0,
      hasUpdate: false,
    },
    {
      id: 4,
      title: 'Locos por la Fórmula 1',
      lastMsg: '¿Creéis que este fin de semana hay opciones reales de podio?',
      unread: 0,
      hasUpdate: false,
    },
  ];

  return (
    <div className="page-layout">
      <Sidebar />

      <main className="chat-container">
        <header className="chat-header">
          <h1>Mis Chats de Deportes</h1>
        </header>

        <section className="chat-list">
          {chatsDeportes.map((chat) => (
            <div key={chat.id} className="chat-card">
              <div className="chat-icon-wrapper">
                {/* Usamos el icono de Deportes */}
                <img src={iconoDeportes} alt="Icono Deportes" />
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
              'Pronto crearemos el formulario para nuevos grupos deportivos'
            )
          }
        >
          +
        </button>
      </main>
    </div>
  );
};

export default Deportes;
