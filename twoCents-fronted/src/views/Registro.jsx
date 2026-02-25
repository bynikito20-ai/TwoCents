import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

// Ajusta estas rutas si tus carpetas de imágenes o CSS están en otro sitio
import logoTwoCents from '../recursos/imagenes/LogoTwoCents.png';
import './IniciarSesion.css'; 

// Conectamos con el backend de Node
const socket = io('http://localhost:3001');

export default function Registro() {
  // 1. Guardamos lo que el usuario escribe
  const [email, setEmail] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [terminosAceptados, setTerminosAceptados] = useState(false);
  
  const navigate = useNavigate();

  // 2. Escuchamos si el servidor nos dice que todo ha ido bien
  useEffect(() => {
    socket.on('registro_resultado', (respuesta) => {
      if (respuesta.success) {
        alert('¡Registro exitoso! Ya puedes iniciar sesión.');
        navigate('/'); // Te manda al login
      } else {
        alert('Error: ' + respuesta.message);
      }
    });

    return () => socket.off('registro_resultado');
  }, [navigate]);

  // 3. Al darle al botón rojo, enviamos los datos
  const manejarRegistro = (e) => {
    e.preventDefault(); 
    if (!terminosAceptados) return;
    socket.emit('registrar_usuario', { usuario, email, password });
  };

  return (
    // EL FONDO (La habitación)
    <div className="contenedor-login">
      
      {/* LA CAJA ROSA (El mueble) */}
      <div className="tarjeta-login">
        <div className='cabecera-registro'>
          <img src={logoTwoCents} alt="logoTwoCents" className='logo'/>
          <h1>Registrarse</h1>  
        </div>
        
        <p className='linea-divisoria'>_______________________________________________</p>
        
        <form className="formulario" onSubmit={manejarRegistro}>
          <div className="grupo-input">
            <input 
              type="email" 
              placeholder="Correo electrónico..." 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grupo-input">
            <input 
              type="text" 
              placeholder="Nombre de Usuario..." 
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>

          <div className="grupo-input">
            <input 
              type="password" 
              placeholder="Contraseña..." 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {/* CHECKBOX PERSONALIZADO */}
          <label className="checkbox-contenedor">
            <input
              type="checkbox"
              checked={terminosAceptados}
              onChange={(e) => setTerminosAceptados(e.target.checked)}
              className="checkbox-oculto"
            />
            <div className={`checkbox-visual ${terminosAceptados ? 'marcado' : ''}`}>
              {terminosAceptados}
            </div>
            <span className="checkbox-texto">He leído y Acepto los términos y condiciones</span>
          </label>

          <button type="submit" className="boton-entrar" disabled={!terminosAceptados}>
            Registrarse
          </button>
        </form>
        
        <p style={{ marginTop: '20px', fontSize: '14px', color: 'black' }}>
          ¿Ya tienes cuenta?,  <Link className='link' to="/">Iniciar Sesion</Link>
        </p>
      </div>

    </div>
  );
}