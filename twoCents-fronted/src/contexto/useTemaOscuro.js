import { useEffect, useState } from 'react';

export function useTemaOscuro() {
  const [modoOscuro, setModoOscuro] = useState(
    localStorage.getItem('temaOscuro') === 'true'
  );

  useEffect(() => {
    const sincronizarTema = () => {
      const estaOscuro =
        document.body.classList.contains('modo-oscuro') ||
        localStorage.getItem('temaOscuro') === 'true';
      setModoOscuro(estaOscuro);
    };

    window.addEventListener('tema-cambiado', sincronizarTema);
    window.addEventListener('storage', sincronizarTema);

    return () => {
      window.removeEventListener('tema-cambiado', sincronizarTema);
      window.removeEventListener('storage', sincronizarTema);
    };
  }, []);

  return modoOscuro;
}