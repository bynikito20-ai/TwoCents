import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../componentes/sidebar.jsx';
import { ThemeToggle } from '../componentes/aspecto/ThemeToggle.jsx';
import { useFondoBody } from '../contexto/useFondoResponsive';
import './css/Perfil.css';
import fondoDesktopClaro from '../recursos/imagenes/fondos_chats_desktop/usuario_desktop_claro.png';
import fondoDesktopOscuro from '../recursos/imagenes/fondos_chats_desktop/usuario_desktop_oscuro.png';
import fondoMovilClaro from '../recursos/imagenes/fondos_chats_movil/usuario_movil_claro.png';
import fondoMovilOscuro from '../recursos/imagenes/fondos_chats_movil/usuario_movil_oscuro.png';

export default function Perfil() {
  const navigate = useNavigate();
  useFondoBody({
    desktopClaro: fondoDesktopClaro,
    desktopOscuro: fondoDesktopOscuro,
    movilClaro: fondoMovilClaro,
    movilOscuro: fondoMovilOscuro,
  });
  
  // Recuperamos el usuario del localStorage (ahora es JSON)
  const usuarioJSON = localStorage.getItem('usuarioLogeado');
  const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;
  
  const [nombreUsuario] = useState(usuario?.nombre || 'Usuario');
  const [correoUsuario] = useState(usuario?.email || '');
  const [modoOscuro, setModoOscuro] = useState(false);

  // 1. Al cargar la página, comprobamos si el usuario ya tenía el modo oscuro activado
  useEffect(() => {
    const temaGuardado = localStorage.getItem('temaOscuro');
    if (temaGuardado === 'true') {
      setModoOscuro(true);
      document.body.classList.add('modo-oscuro'); // Le ponemos una clase al <body>
    }
  }, []);

  useEffect(() => {
    // Si no hay usuario en el localStorage, lo mandamos al login inmediatamente
    if (!usuarioJSON) {
      navigate('/', { replace: true }); 
    }
  }, [navigate, usuarioJSON]);

  // 2. Función para alternar entre claro y oscuro
  const cambiarTema = () => {
    const nuevoEstado = !modoOscuro;
    setModoOscuro(nuevoEstado);
    localStorage.setItem('temaOscuro', nuevoEstado); // Lo guardamos para que no se borre al recargar

    if (nuevoEstado) {
      document.body.classList.add('modo-oscuro');
    } else {
      document.body.classList.remove('modo-oscuro');
    }

    window.dispatchEvent(new CustomEvent('tema-cambiado', { detail: nuevoEstado }));
  };

  // 3. Función para cerrar sesión (la hemos movido aquí)
  const cerrarSesion = () => {
    localStorage.removeItem('usuarioLogeado');
    localStorage.removeItem('correoLogeado');
    navigate('/', { replace: true }); // Reemplaza la entrada en el historial para evitar volver atrás
  };

  return (
    <div className="perfil-layout">
      <Sidebar />
      <main className="pagina-perfil">
        <header className="vista-header vista-header--perfil">
          <h1 className="vista-header__title">MI PERFIL</h1>
        </header>
        <div className="tarjeta-perfil">
          <h2>Información de la cuenta</h2>
          <p className="info-texto">
          <strong>Usuario:</strong> {nombreUsuario}
          </p>
          <p className="info-texto">
          <strong>Correo:</strong> {correoUsuario}
          </p>

          <hr className="separador-perfil" />

          <h2>Apariencia</h2>
          <ThemeToggle modoOscuro={modoOscuro} cambiarTema={cambiarTema} />

          <hr className="separador-perfil" />

          <h2>Sesión</h2>
          <button onClick={cerrarSesion} className="btn-accion btn-cerrar-sesion">
            Cerrar Sesión
          </button>
        </div>
      </main>
    </div>
  );
}
