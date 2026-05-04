import { useEffect, useState } from 'react';
import { useTemaOscuro } from './useTemaOscuro';

function useEsMovil(breakpoint = 800) {
  const mediaQuery = `(max-width: ${breakpoint}px)`;
  const [esMovil, setEsMovil] = useState(() => window.matchMedia(mediaQuery).matches);

  useEffect(() => {
    const query = window.matchMedia(mediaQuery);
    const manejarCambio = (event) => setEsMovil(event.matches);
    query.addEventListener('change', manejarCambio);
    return () => query.removeEventListener('change', manejarCambio);
  }, [mediaQuery]);

  return esMovil;
}

export function useFondoResponsive({
  desktopClaro,
  desktopOscuro,
  movilClaro,
  movilOscuro,
  breakpoint = 800,
}) {
  const esMovil = useEsMovil(breakpoint);
  const modoOscuro = useTemaOscuro();

  return esMovil
    ? (modoOscuro ? movilOscuro : movilClaro)
    : (modoOscuro ? desktopOscuro : desktopClaro);
}

export function useFondoBody(opciones) {
  const {
    attachment = 'scroll',
    ...fondoOpciones
  } = opciones;
  const fondoActual = useFondoResponsive(fondoOpciones);

  useEffect(() => {
    const { style } = document.body;
    const fondoAnterior = {
      backgroundImage: style.backgroundImage,
      backgroundSize: style.backgroundSize,
      backgroundPosition: style.backgroundPosition,
      backgroundRepeat: style.backgroundRepeat,
      backgroundAttachment: style.backgroundAttachment,
    };

    style.backgroundImage = `url(${fondoActual})`;
    style.backgroundSize = 'cover';
    style.backgroundPosition = 'center';
    style.backgroundRepeat = 'no-repeat';
    style.backgroundAttachment = attachment;

    return () => {
      style.backgroundImage = fondoAnterior.backgroundImage;
      style.backgroundSize = fondoAnterior.backgroundSize;
      style.backgroundPosition = fondoAnterior.backgroundPosition;
      style.backgroundRepeat = fondoAnterior.backgroundRepeat;
      style.backgroundAttachment = fondoAnterior.backgroundAttachment;
    };
  }, [fondoActual, attachment]);

  return fondoActual;
}