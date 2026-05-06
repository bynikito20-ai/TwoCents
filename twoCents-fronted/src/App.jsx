import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '@/routes';

function App() {
  useEffect(() => {
    const temaOscuroGuardado = localStorage.getItem('temaOscuro') === 'true';
    document.body.classList.toggle('modo-oscuro', temaOscuroGuardado);
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
