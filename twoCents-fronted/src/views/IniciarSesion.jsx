import logoTwoCents from '../recursos/imagenes/LogoTwoCents.png';
import './IniciarSesion.css'; 
import { Link } from 'react-router-dom';


export default function IniciarSesion() {
  return (
    <div className="contenedor-login">
      
      <div className="tarjeta-login">
        <div className='cabecera-login'>
          <img src={logoTwoCents} alt="logoTwoCents" className='logo'/>
            <h1>Inicio de Sesión</h1>  
        </div>
        
        <p className='linea-divisoria'>_______________________________________________</p>
        
        <form className="formulario">
          <div className="grupo-input">
            <input type="text" placeholder="Nombre de Usuario" />
          </div>

          <div className="grupo-input">
            <input type="password" placeholder="Contraseña..." />
          </div>
          
          <button type="button" className="boton-entrar">
            Iniciar Sesión
          </button>
        </form>
        
        <p style={{ marginTop: '20px', fontSize: '14px', color: 'black' }}>
          ¿No tienes cuenta? <Link className='link' to="/registro">Regístrate</Link>
        </p>
      </div>

    </div>
  )
}