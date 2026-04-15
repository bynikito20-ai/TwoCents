import io from 'socket.io-client';

// Creamos la conexión UNA SOLA VEZ
const socket = io('http://localhost:3001');

const CLAVE_NO_LEIDOS_SALAS = 'salasMensajesNoLeidos';
const CLAVE_SALA_ACTUAL = 'salaChatActual';
const eventosProcesados = new Set();

socket.off('mensaje_nuevo_notificacion');
socket.on('mensaje_nuevo_notificacion', ({ id_sala, id_usuario, hora_envio }) => {
	const salaNotificada = Number(id_sala);
	const salaActual = Number(localStorage.getItem(CLAVE_SALA_ACTUAL));

	if (salaActual && salaNotificada === salaActual) {
		return;
	}

	const claveEvento = `${salaNotificada}-${id_usuario}-${hora_envio}`;
	if (eventosProcesados.has(claveEvento)) {
		return;
	}
	eventosProcesados.add(claveEvento);

	if (eventosProcesados.size > 500) {
		const primeraClave = eventosProcesados.values().next().value;
		eventosProcesados.delete(primeraClave);
	}

	const noLeidos = JSON.parse(localStorage.getItem(CLAVE_NO_LEIDOS_SALAS) || '{}');
	noLeidos[salaNotificada] = (noLeidos[salaNotificada] || 0) + 1;
	localStorage.setItem(CLAVE_NO_LEIDOS_SALAS, JSON.stringify(noLeidos));
	window.dispatchEvent(new CustomEvent('salas-no-leidos-actualizados'));
});

// Exportamos esta misma conexión para usarla en toda la app
export default socket;