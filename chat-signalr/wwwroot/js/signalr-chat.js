export function createSignalRChat(events) {
  if (!window.signalR) {
    events.error('No se pudo cargar SignalR desde el CDN. Revisa la conexión y recarga la página.');
    return {
      async connect() { throw new Error('Falta cargar el cliente SignalR.'); },
      async send() { throw new Error('SignalR no está disponible.'); },
      async disconnect() {},
    };
  }
  // La biblioteca gestiona el protocolo y las conexiones; la reconexión es opcional.
  const connection = new signalR.HubConnectionBuilder()
    .withUrl('/hubs/chat')
    .withAutomaticReconnect()
    .build();

  // El nombre coincide con Clients.All.SendAsync("ReceiveMessage", ...) del Hub.
  connection.on('ReceiveMessage', (message) => events.message(message));
  connection.onreconnecting(() => events.status('reconnecting'));
  connection.onreconnected(() => events.status('connected'));
  connection.onclose(() => events.status('disconnected'));

  // Abre la conexión; solo habilitamos el formulario cuando start termina.
  async function connect() {
    await connection.start();
    events.status('connected');
  }

  async function send(name, text) {
    // Aquí llamamos a un método del Hub; no enviamos JSON manualmente.
    await connection.invoke('SendMessage', name, text);
  }

  // Cierre voluntario: stop no activa la reconexión automática.
  async function disconnect() {
    await connection.stop();
  }

  return { connect, send, disconnect };
}
