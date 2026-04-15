import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Sidebar.css';
import { useTemaOscuro } from '../contexto/useTemaOscuro';

// IMPORTACIONES DE LOS LOGOS (Asegúrate de que coinciden con los nombres reales en tu carpeta)
import logoTwoCents from '../recursos/imagenes/LogoTwoCents.png';
import logoTwoCentsGris from '../recursos/imagenes/LogoTwoCents_ConLetras.png';
import iconDeportes from '../recursos/imagenes/deportes.png';
import iconDeportesGris from '../recursos/imagenes/deportes_Gris.png';
import iconDebates from '../recursos/imagenes/Debate.png';
import iconDebatesGris from '../recursos/imagenes/Debate_Gris.png';
import iconActualidad from '../recursos/imagenes/Actualidad.png';
import iconActualidadGris from '../recursos/imagenes/Actualidad_Gris.png';
import iconDiversion from '../recursos/imagenes/Diversion.png';
import iconDiversionGris from '../recursos/imagenes/Diversion_Gris.png';
import iconPolitica from '../recursos/imagenes/Politica.png';
import iconPoliticaGris from '../recursos/imagenes/Politica_Gris.png';
import iconRecuerdos from '../recursos/imagenes/Recuerdos.png';
import iconRecuerdosGris from '../recursos/imagenes/Recuerdos_Gris.png';
import iconReflexion from '../recursos/imagenes/Reflexivas.png';
import iconReflexionGris from '../recursos/imagenes/Reflexivas_Gris.png';
import iconInfo from '../recursos/imagenes/acerca-de.png';
import iconInfoGris from '../recursos/imagenes/acerca-de_Gris.png';
import iconUsuario from '../recursos/imagenes/avatar.png';
import iconUsuarioGris from '../recursos/imagenes/avatar_Gris.png';

export default function Sidebar() {
  const modoOscuro = useTemaOscuro();
  // Leemos el usuario del localStorage (ahora es JSON)
  const usuarioJSON = localStorage.getItem('usuarioLogeado');
  const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;
  
  const [nombreUsuario] = useState(usuario?.nombre || 'Usuario');

  // 👉 RUTAS ACTUALIZADAS PARA COINCIDIR CON APP.JSX
  const menuOpciones = [
    { id: 1, nombre: 'Deportes', icono: modoOscuro ? iconDeportesGris : iconDeportes, ruta: '/deportes' },
    { id: 2, nombre: 'Debates', icono: modoOscuro ? iconDebatesGris : iconDebates, ruta: '/debates' }, // 👈 En plural, como tu archivo debates.jsx
    { id: 3, nombre: 'Actualidad', icono: modoOscuro ? iconActualidadGris : iconActualidad, ruta: '/actualidad' },
    { id: 4, nombre: 'Diversión', icono: modoOscuro ? iconDiversionGris : iconDiversion, ruta: '/diversion' },
    { id: 5, nombre: 'Política', icono: modoOscuro ? iconPoliticaGris : iconPolitica, ruta: '/politica' },
    { id: 6, nombre: 'Recuerdos', icono: modoOscuro ? iconRecuerdosGris : iconRecuerdos, ruta: '/recuerdos' },
    { id: 7, nombre: 'Reflexión', icono: modoOscuro ? iconReflexionGris : iconReflexion, ruta: '/reflexivas' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo-caja">
        <Link to="/inicio">
          <img src={modoOscuro ? logoTwoCentsGris : logoTwoCents} alt="TwoCents" className="sidebar-logo" />
        </Link> 
      </div>

      <hr className="separador" />

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

      <hr className="separador" />

      <NavLink
        to="/informacion"
        className={({ isActive }) =>
          `boton-opcion ${isActive ? 'activa' : ''}`
        }
      >
        <div className="icono-caja">
          <img src={modoOscuro ? iconInfoGris : iconInfo} alt="Información" className="icono-img" />
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
          <img src={modoOscuro ? iconUsuarioGris : iconUsuario} alt="Usuario" className="icono-img" />
        </div>
        <span className="texto-opcion">{nombreUsuario}</span>
      </NavLink>
    </aside>
  );
}
