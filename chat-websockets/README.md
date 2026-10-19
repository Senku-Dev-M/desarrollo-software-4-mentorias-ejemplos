# Chat con WebSockets

Ejemplo mínimo de un chat en tiempo real con backend C# y frontend HTML, CSS y JavaScript vanilla. Este proyecto es independiente del otro chat: no comparte archivos ni requiere que esté encendido.

## Ejecutar y probar desde el navegador

Instala .NET SDK 10. Desde esta carpeta ejecuta:

```powershell
dotnet run --urls http://127.0.0.1:4185
```

1. Abre http://127.0.0.1:4185 en dos pestañas.
2. Escribe **Ana** en una y **Luis** en la otra.
3. Pulsa **Conectar** en ambas antes de enviar.
4. Envía un mensaje desde cada pestaña: ambos deben verlo, incluido el emisor.
5. Pulsa **Desconectar** en una; la otra debe seguir funcionando.
6. Vuelve a conectar la pestaña para enviar de nuevo. Los mensajes perdidos no se recuperan.

No abras `index.html` mediante doble clic: ASP.NET Core debe servir la página y la ruta del chat en el mismo origen. No necesitas Node.js, npm, otro servidor frontend ni scripts de instalación.

WebSocket está incluido en el navegador: no hay bibliotecas JavaScript externas.

## Qué hay en cada archivo

| Archivo | Responsabilidad |
| --- | --- |
| `Program.cs` | Arranca el servidor, sirve `wwwroot` y configura WebSockets. |
| `Models/ChatMessage.cs` | Datos del mensaje y validación del nombre/texto. |
| `WebSockets/WebSocketChat.cs` | Aceptar conexiones, recibir JSON y distribuir mensajes. |
| `WebSockets/ChatClient.cs` | Enviar y cerrar cada socket sin escrituras simultáneas. |
| `wwwroot/index.html` y `styles.css` | Formulario, lista de mensajes y estilos. |
| `wwwroot/js/chat-page.js` | Acciones de la pantalla y renderizado seguro. |
| `wwwroot/js/websocket-chat.js` | Conectar, enviar y desconectar mediante WebSockets. |

## Recorrido de un mensaje

1. `connect()` abre `ws://.../ws/chat` (o `wss://` si la página usa HTTPS).
2. `HandleAsync` acepta la conexión y la agrega a la sala en memoria.
3. `send(name, text)` envía JSON: `{ "name": "Ana", "text": "Hola" }`.
4. `ReceiveAsync` junta los fragmentos hasta `EndOfMessage`, interpreta el JSON y valida los datos.
5. `BroadcastAsync` recorre las conexiones y envía `{ "type": "message", "message": { "name": "Ana", "text": "Hola", "sentAt": "..." } }`.
6. `socket.onmessage` interpreta la respuesta y la vista muestra el mensaje.

Los errores de validación vuelven solo al emisor como `{ "type": "error", "error": "..." }`. Una lectura de socket no equivale necesariamente a un mensaje completo; por eso acumulamos bytes antes de interpretar UTF-8.

## Métodos importantes: qué hacen y por qué

| Método | Qué hace / por qué |
| --- | --- |
| `Program.Main` | Registra dependencias y rutas antes de arrancar el servidor. |
| `ChatMessage.Create` | Recorta espacios; limita nombre a 30 y texto a 500 caracteres; genera la hora en el servidor. |
| `HandleAsync` | Rechaza HTTP normal con 400; registra la conexión y siempre la retira al cerrar. |
| `ReceiveAsync` | Espera mensajes completos, rechaza binarios y limita el tamaño a 4096 bytes. |
| `BroadcastAsync` | Serializa el mensaje y lo distribuye; retira conexiones que ya fallaron. |
| `SendErrorAsync` | Devuelve el error a una sola conexión, no a la sala. |
| `ChatClient.SendAsync` | Usa un semáforo porque un socket no admite dos envíos simultáneos. |
| `ChatClient.CloseAsync` | Coordina el cierre con los envíos; el timeout impide esperar indefinidamente. |
| `connect` | Crea el socket y registra eventos de apertura, mensaje, error y cierre. |
| `send` | Comprueba el estado y envía JSON mediante `socket.send`. |
| `disconnect` | Envía un cierre normal con código 1000. |
| `setStatus` | Actualiza el indicador y habilita/deshabilita los controles. |
| `showMessage` | Crea nodos DOM con `textContent`; no interpreta el texto recibido como HTML. |

No hay reconexión automática: pulsa Conectar para volver a entrar. El diccionario de clientes es singleton para compartir una sola sala entre peticiones.

## Alcance y errores frecuentes

- Una sala en memoria: sin autenticación, base de datos, historial ni múltiples servidores.
- Los nombres son etiquetas elegidas por el usuario, no identidades verificadas.
- Si no llegan mensajes, comprueba que ambas pestañas estén conectadas al mismo puerto.
- Si el puerto está ocupado, usa otro en `--urls` y abre ese mismo puerto en ambas pestañas.
- Solo demostración en `127.0.0.1`; no expongas este backend en Internet como servicio real.

El ejemplo alternativo está en [../chat-signalr](../chat-signalr). Ambos tienen frontend y backend propios y sus salas no se comunican.

## Referencias

- [WebSockets en ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/websockets?view=aspnetcore-10.0)
- [WebSocket del navegador](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
