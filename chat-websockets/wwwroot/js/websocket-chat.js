export function createWebSocketChat(events) {
  let socket;

  // Abre la conexión persistente; usa wss si la página se sirve por HTTPS.
  function connect() {
    return new Promise((resolve, reject) => {
      const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
      socket = new WebSocket(`${protocol}//${location.host}/ws/chat`);

      socket.onopen = () => { events.status('connected'); resolve(); };
      socket.onclose = () => events.status('disconnected');
      socket.onerror = () => reject(new Error('No se pudo abrir el WebSocket.'));
      // Nuestro protocolo distingue los errores de los mensajes de la sala.
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'error') events.error(data.error);
        else events.message(data.message);
      };
    });
  }

  function send(name, text) {
    if (socket?.readyState !== WebSocket.OPEN) throw new Error('Primero conecta el chat.');
    // Definimos nosotros el formato del mensaje que entiende nuestro servidor.
    socket.send(JSON.stringify({ name, text }));
  }

  // El código 1000 indica un cierre normal, no un fallo de la conexión.
  function disconnect() {
    socket?.close(1000, 'Salir del chat');
  }

  return { connect, send, disconnect };
}
