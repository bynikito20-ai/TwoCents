import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Sidebar.css';

// IMPORTACIONES DE LOS LOGOS (Asegúrate de que coinciden con los nombres reales en tu carpeta)
import logoTwoCents from '../recursos/imagenes/LogoTwoCents.png';
import iconDeportes from '../recursos/imagenes/deportes.png';
import iconDebates from '../recursos/imagenes/Debate.png';
import iconActualidad from '../recursos/imagenes/Actualidad.png';
import iconDiversion from '../recursos/imagenes/Diversion.png';
import iconPolitica from '../recursos/imagenes/Politica.png';
import iconRecuerdos from '../recursos/imagenes/Recuerdos.png';
import iconReflexion from '../recursos/imagenes/Reflexivas.png';
import iconInfo from '../recursos/imagenes/acerca-de.png';
import iconUsuario from '../recursos/imagenes/avatar.png';

export default function Sidebar() {
  // Leemos el nombre directamente de la memoria.
  const [nombreUsuario] = useState(
    localStorage.getItem('usuarioLogeado') || 'Usuario'
  );

  // 👉 RUTAS ACTUALIZADAS PARA COINCIDIR CON APP.JSX
  const menuOpciones = [
    { id: 1, nombre: 'Deportes', icono: iconDeportes, ruta: '/deportes' },
    { id: 2, nombre: 'Debates', icono: iconDebates, ruta: '/debates' }, // 👈 En plural, como tu archivo debates.jsx
    { id: 3, nombre: 'Actualidad', icono: iconActualidad, ruta: '/actualidad' },
    { id: 4, nombre: 'Diversión', icono: iconDiversion, ruta: '/diversion' },
    { id: 5, nombre: 'Política', icono: iconPolitica, ruta: '/politica' },
    { id: 6, nombre: 'Recuerdos', icono: iconRecuerdos, ruta: '/recuerdos' },
    { id: 7, nombre: 'Reflexión', icono: iconReflexion, ruta: '/reflexivas' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo-caja">
        <Link to="/inicio">
          <img src={logoTwoCents} alt="TwoCents" className="sidebar-logo" />
        </Link> 
      </div>

      <hr className="separador" />

      <nav className="menu-nav">
        {menuOpciones.map((opcion) => (
          <NavLink
            key={opcion.id}
            to={opcion.ruta}
            className={({ isActive }) =>
              `boton-opcion ${isActive ? 'activa' : ''}`
            }
          >
            <div className="icono-caja">
              <img
                src={opcion.icono}
                alt={opcion.nombre}
                className="icono-img"
              />
            </div>
            <span className="texto-opcion">{opcion.nombre}</span>
          </NavLink>
        ))}
      </nav>

      <hr className="separador" />

      <div className="menu-abajo">
        <NavLink
          to="/informacion"
          className={({ isActive }) =>
            `boton-opcion ${isActive ? 'activa' : ''}`
          }
        >
          <div className="icono-caja">
            <img src={iconInfo} alt="Información" className="icono-img" />
          </div>
          <span className="texto-opcion">Información</span>
        </NavLink>

        <NavLink
          to="/perfil"
          className={({ isActive }) =>
            `boton-opcion ${isActive ? 'activa' : ''}`
          }
        >
          <div className="icono-caja">
            <img src={iconUsuario} alt="Usuario" className="icono-img" />
          </div>
          <span className="texto-opcion">{nombreUsuario}</span>
        </NavLink>
      </div>
    </aside>
  );
}
