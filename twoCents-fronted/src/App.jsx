// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. OJO AQUÍ: Si también pusiste sidebar.jsx en minúscula, déjalo así.
// Si Sidebar.jsx sigue con mayúscula en tu carpeta 'componentes', cámbialo a './componentes/Sidebar'
import Sidebar from './componentes/sidebar';

// 2. AHORA SÍ: Todo en minúsculas coincidiendo con tus archivos
import IniciarSesion from './views/iniciarSesion';
import Registro from './views/registro';
import Inicio from './views/inicio';
import Perfil from './views/perfil';
import Informacion from './views/informacion';
import Diversion from './views/diversion';
import Deportes from './views/deportes';
import Politica from './views/politica';
import Actualidad from './views/actualidad';
import Debates from './views/debates';
import Recuerdos from './views/recuerdos';
import Reflexivas from './views/reflexivas';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas iniciales */}
        <Route path="/" element={<IniciarSesion />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas con contenido */}
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/informacion" element={<Informacion />} />
        <Route path="/diversion" element={<Diversion />} />
        <Route path="/deportes" element={<Deportes />} />
        <Route path="/politica" element={<Politica />} />
        <Route path="/actualidad" element={<Actualidad />} />
        <Route path="/debates" element={<Debates />} />
        <Route path="/recuerdos" element={<Recuerdos />} />
        <Route path="/reflexivas" element={<Reflexivas />} />

        {/* Vista Inicio con Sidebar */}
        <Route
          path="/inicio"
          element={
            <div className="flex w-full min-h-screen">
              <Sidebar />
              <Inicio />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
