# Chat con SignalR

Ejemplo mínimo de un chat en tiempo real con backend C# y frontend HTML, CSS y JavaScript vanilla. Este proyecto es independiente del otro chat: no comparte archivos ni requiere que esté encendido.

## Ejecutar y probar desde el navegador

Instala .NET SDK 10. Desde esta carpeta ejecuta:

```powershell
dotnet run --urls http://127.0.0.1:4186
```

1. Abre http://127.0.0.1:4186 en dos pestañas.
2. Escribe **Ana** en una y **Luis** en la otra.
3. Pulsa **Conectar** en ambas antes de enviar.
4. Envía un mensaje desde cada pestaña: ambos deben verlo, incluido el emisor.
5. Pulsa **Desconectar** en una; la otra debe seguir funcionando.
6. Vuelve a conectar la pestaña para enviar de nuevo. Los mensajes perdidos no se recuperan.

No abras `index.html` mediante doble clic: ASP.NET Core debe servir la página y la ruta del chat en el mismo origen. No necesitas Node.js, npm, otro servidor frontend ni scripts de instalación.

El HTML carga el cliente oficial de SignalR **10.0.11** desde jsDelivr con versión fija. Necesitas Internet para esa descarga; el backend y la conversación funcionan localmente. Si el CDN no carga, la pantalla muestra un error. Se conserva el aviso de licencia MIT en `THIRD-PARTY-NOTICES.md`.

## Qué hay en cada archivo

| Archivo | Responsabilidad |
| --- | --- |
| `Program.cs` | Arranca el servidor, sirve `wwwroot` y configura el Hub. |
| `Models/ChatMessage.cs` | Datos del mensaje y validación del nombre/texto. |
| `Hubs/ChatHub.cs` | Método que puede invocar el cliente y difusión del evento. |
| `wwwroot/index.html` y `styles.css` | Formulario, lista de mensajes y estilos. |
| `wwwroot/js/chat-page.js` | Acciones de la pantalla y renderizado seguro. |
| `wwwroot/js/signalr-chat.js` | Conectar, enviar y desconectar mediante SignalR. |

## Recorrido de un mensaje

1. `connect()` llama a `connection.start()` para abrir la conexión con `/hubs/chat`.
2. El formulario llama a `send(name, text)`.
3. `connection.invoke('SendMessage', name, text)` ejecuta el método del Hub.
4. `ChatMessage.Create` valida los datos y asigna la hora del servidor.
5. `Clients.All.SendAsync('ReceiveMessage', message)` publica el evento, incluido el emisor.
6. `connection.on('ReceiveMessage', ...)` entrega el mensaje a la vista.

El nombre `ReceiveMessage` debe coincidir entre C# y JavaScript. SignalR define su propio protocolo y administra conexiones; suele usar WebSockets por debajo, con otros transportes disponibles. No debes conectar un `new WebSocket` al Hub esperando nuestro JSON manual.

## Métodos importantes: qué hacen y por qué

| Método | Qué hace / por qué |
| --- | --- |
| `Program.Main` | Registra dependencias y rutas antes de arrancar el servidor. |
| `ChatMessage.Create` | Recorta espacios; limita nombre a 30 y texto a 500 caracteres; genera la hora en el servidor. |
| `ChatHub.SendMessage` | Valida y difunde con `Clients.All`; convierte errores de entrada en `HubException` legible para el cliente. |
| `connect` | Espera a `start()` antes de habilitar el envío. |
| `send` | Invoca el método del Hub sin definir manualmente el protocolo JSON. |
| `disconnect` | Ejecuta `stop()`; un cierre voluntario no activa reconexión. |
| `setStatus` | Actualiza el indicador y habilita/deshabilita los controles. |
| `showMessage` | Crea nodos DOM con `textContent`; no interpreta el texto recibido como HTML. |

`withAutomaticReconnect()` es una opción activada en este ejemplo: intenta recuperar una conexión que se perdió. No reintenta el arranque inicial ni un cierre voluntario. Los eventos `onreconnecting`, `onreconnected` y `onclose` actualizan la pantalla.

## Alcance y errores frecuentes

- Una sala en memoria: sin autenticación, base de datos, historial ni múltiples servidores.
- Los nombres son etiquetas elegidas por el usuario, no identidades verificadas.
- Si no llegan mensajes, comprueba que ambas pestañas estén conectadas al mismo puerto.
- Si el puerto está ocupado, usa otro en `--urls` y abre ese mismo puerto en ambas pestañas.
- Solo demostración en `127.0.0.1`; no expongas este backend en Internet como servicio real.

El ejemplo alternativo está en [../chat-websockets](../chat-websockets). Ambos tienen frontend y backend propios y sus salas no se comunican.

## Referencias

- [SignalR en ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction?view=aspnetcore-10.0)
- [Cliente JavaScript de SignalR](https://learn.microsoft.com/en-us/aspnet/core/signalr/javascript-client?view=aspnetcore-10.0)
