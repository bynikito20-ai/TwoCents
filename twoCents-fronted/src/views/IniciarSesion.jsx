import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

// Ajusta esta ruta si tu carpeta de imágenes está en otro sitio
import logoTwoCents from '../recursos/imagenes/LogoTwoCents.png';
import './IniciarSesion.css'; 

const socket = io('http://localhost:3001');

export default function IniciarSesion() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [alerta, setAlerta] = useState({visible: false, mensaje: '', tipo: ''});
  
  const navigate = useNavigate();

  // 2. Escuchamos la respuesta del servidor al intentar entrar
  useEffect(() => {
    socket.on('login_resultado', (respuesta) => {
      if (respuesta.success) {
        
        // AQUÍ ES DONDE PONEMOS EL MENSAJE DE BIENVENIDA CON SU NOMBRE
        setAlerta({ 
            visible: true, 
            mensaje: `¡Bienvenido ${respuesta.usuario.nombre}!`, 
            tipo: 'exito' 
        });
        
        // Retrasamos el teletransporte 1.5 segundos
        setTimeout(() => {
          navigate('/inicio'); 
        }, 1500);

      } else {
        
        // ESTA ES LA LÍNEA QUE TÚ ESTABAS MIRANDO (LA DEL ERROR)
        setAlerta({ 
            visible: true, 
            mensaje: respuesta.message, 
            tipo: 'error' 
        });
        
      }
    });

    // Limpiamos el evento al salir de la pantalla
    return () => socket.off('login_resultado');
  }, [navigate]);

  const manejarLogin = (e) => {
    e.preventDefault();
    socket.emit('login_usuario', { usuario, password });
  };

  return (
    <div className="contenedor-login">
      
      <div className="tarjeta-login">
        
        {/* --- LA TARJETA EMERGENTE (MODAL) DENTRO DE LA CAJA --- */}
        {alerta.visible && (
          <div className="alerta-overlay">
            <div className="alerta-tarjeta">
              <h2 style={{ color: alerta.tipo === 'exito' ? '#a83250' : '#a83250' }}>
                {alerta.tipo === 'exito' ? '¡Genial!' : 'Ups...'}
              </h2>
              <p className="linea-divisoria">________________________</p>
              <p style={{ margin: '20px 0', fontSize: '18px', color: 'black' }}>{alerta.mensaje}</p>
              
              {alerta.tipo === 'error' && (
                <button 
                  className="boton-entrar" 
                  onClick={() => setAlerta({ visible: false, mensaje: '', tipo: '' })}
                >
                  Reintentar
                </button>
              )}
            </div>
          </div>
        )}
        {/* ----------------------------------------------------- */}

        <div className='cabecera-registro'>
          <img src={logoTwoCents} alt="logoTwoCents" className='logo'/>
          <h1>Inicio de Sesión</h1>  
        </div>
        
        <p className='linea-divisoria'>_______________________________________________</p>
        
        <form className="formulario" onSubmit={manejarLogin}>
          <div className="grupo-input">
            <input 
              type="text" 
              placeholder="Nombre de Usuario" 
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
          
          <button type="submit" className="boton-entrar">
            Iniciar Sesión
          </button>
        </form>
        
        <p style={{ marginTop: '20px', fontSize: '14px', color: 'black' }}>
          ¿No tienes cuenta? <Link className='link' to="/registro">Regístrate</Link>
        </p>
      </div>

    </div>
  );
}