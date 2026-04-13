// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 1. OJO AQUÍ: Si también pusiste sidebar.jsx en minúscula, déjalo así.
// Si Sidebar.jsx sigue con mayúscula en tu carpeta 'componentes', cámbialo a './componentes/Sidebar'
import Sidebar from './componentes/sidebar';

// 2. AHORA SÍ: Todo en minúsculas coincidiendo con tus archivos
import IniciarSesion from './views/iniciarSesion';
import Registro from './views/registro';
import Inicio from './views/inicio';
import Perfil from './views/Perfil';
import Informacion from './views/informacion';
import Diversion from './views/diversion';
import Deportes from './views/deportes';
import Politica from './views/politica';
import Actualidad from './views/actualidad';
import Debates from './views/debates';
import Recuerdos from './views/recuerdos';
import Reflexivas from './views/reflexivas';
import ChatRoom from './componentes/chat/ChatRoom';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const usuarioLogeado = localStorage.getItem('usuarioLogeado');
  return usuarioLogeado ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas iniciales */}
        <Route path="/" element={<IniciarSesion />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas con contenido protegidas */}
        <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        <Route path="/informacion" element={<ProtectedRoute><Informacion /></ProtectedRoute>} />
        <Route path="/diversion" element={<ProtectedRoute><Diversion /></ProtectedRoute>} />
        <Route path="/deportes" element={<ProtectedRoute><Deportes /></ProtectedRoute>} />
        <Route path="/politica" element={<ProtectedRoute><Politica /></ProtectedRoute>} />
        <Route path="/actualidad" element={<ProtectedRoute><Actualidad /></ProtectedRoute>} />
        <Route path="/debates" element={<ProtectedRoute><Debates /></ProtectedRoute>} />
        <Route path="/recuerdos" element={<ProtectedRoute><Recuerdos /></ProtectedRoute>} />
        <Route path="/reflexivas" element={<ProtectedRoute><Reflexivas /></ProtectedRoute>} />

        {/* Vista Inicio con Sidebar protegida */}
        <Route
          path="/inicio"
          element={
            <ProtectedRoute>
              <div className="flex w-full min-h-screen">
                <Sidebar />
                <Inicio />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Sala de chat protegida */}
        <Route
          path="/sala/:idSala"
          element={
            <ProtectedRoute>
              <ChatRoom />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
