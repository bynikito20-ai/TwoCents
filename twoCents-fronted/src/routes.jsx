import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '@/componentes/Sidebar';

import IniciarSesion from '@/views/IniciarSesion';
import Registro from '@/views/Registro';
import Inicio from '@/views/Inicio';
import Perfil from '@/views/Perfil';
import Informacion from '@/views/Informacion';
import Diversion from '@/views/Diversion';
import Deportes from '@/views/Deportes';
import Politica from '@/views/Politica';
import Actualidad from '@/views/Actualidad';
import Debates from '@/views/Debates';
import Recuerdos from '@/views/Recuerdos';
import Reflexivas from '@/views/Reflexivas';
import ChatRoom from '@/componentes/chat/ChatRoom';

const ProtectedRoute = ({ children }) => {
  const usuarioLogeado = localStorage.getItem('usuarioLogeado');
  return usuarioLogeado ? children : <Navigate to="/" replace />;
};

export default function AppRoutes() {
  return (
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
  );
}
