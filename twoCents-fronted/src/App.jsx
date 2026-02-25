// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// --- 1. IMPORTACIONES DE TU COMPAÑERO ---
import IniciarSesion from './views/IniciarSesion';
import Registro from './views/Registro';

// --- 2. TUS NUEVAS IMPORTACIONES ---
import Sidebar from './componentes/Sidebar';
import Inicio from './views/Inicio';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* La ruta "/" es la principal. Entra directo al Login */}
        <Route path="/" element={<IniciarSesion />} />
        <Route path="/registro" element={<Registro />} />

        {/* Creamos la nueva ruta '/inicio' */}
        <Route
          path="/inicio"
          element={
            // Este div es el "velcro" que junta las dos piezas
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
