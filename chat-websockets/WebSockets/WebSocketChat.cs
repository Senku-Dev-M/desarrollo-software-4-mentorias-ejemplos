using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text.Json;
using ChatWebSockets.Models;

namespace ChatWebSockets.WebSockets;

public class WebSocketChat
{
    private readonly ConcurrentDictionary<Guid, ChatClient> _clients = new ConcurrentDictionary<Guid, ChatClient>();
    private readonly JsonSerializerOptions _json = new JsonSerializerOptions(JsonSerializerDefaults.Web);

    // Acepta una petición WebSocket, registra al cliente y lo retira al terminar, incluso si ocurre un error.
    public async Task HandleAsync(HttpContext context)
    {
        if (!context.WebSockets.IsWebSocketRequest)
        {
            context.Response.StatusCode = 400;
            await context.Response.WriteAsync("Esta ruta requiere una conexión WebSocket.");
            return;
        }

        using var socket = await context.WebSockets.AcceptWebSocketAsync();
        var client = new ChatClient(socket);
        var id = Guid.NewGuid();
        _clients[id] = client;

        try
        {
            await ReceiveAsync(client, context.RequestAborted);
        }
        catch (WebSocketException) { /* Una pestaña cerrada puede cortar la conexión de golpe. */ }
        catch (OperationCanceledException) { /* La petición terminó o venció el tiempo de envío. */ }
        finally
        {
            _clients.TryRemove(id, out _);
            try { await client.CloseAsync(WebSocketCloseStatus.NormalClosure, "Chat cerrado"); }
            catch (WebSocketException) { socket.Abort(); }
            catch (OperationCanceledException) { socket.Abort(); }
        }
    }

    // Espera mensajes completos, limita su tamaño, valida el JSON y solicita su difusión a la sala.
    private async Task ReceiveAsync(ChatClient client, CancellationToken cancellationToken)
    {
        var buffer = new byte[1024];
        while (client.Socket.State == WebSocketState.Open)
        {
            using var content = new MemoryStream();
            WebSocketReceiveResult part;

            // Un mensaje puede llegar en varios fragmentos. Primero juntamos sus bytes.
            do
            {
                part = await client.Socket.ReceiveAsync(new ArraySegment<byte>(buffer), cancellationToken);
                if (part.MessageType == WebSocketMessageType.Close) return;
                if (part.MessageType != WebSocketMessageType.Text)
                {
                    await client.CloseAsync(WebSocketCloseStatus.InvalidMessageType, "Solo texto JSON");
                    return;
                }
                if (content.Length + part.Count > 4096)
                {
                    await client.CloseAsync(WebSocketCloseStatus.MessageTooBig, "Máximo 4096 bytes");
                    return;
                }
                content.Write(buffer, 0, part.Count);
            }
            while (!part.EndOfMessage);

            try
            {
                var input = JsonSerializer.Deserialize<ChatMessage>(content.ToArray(), _json);
                var message = ChatMessage.Create(input?.Name, input?.Text);
                await BroadcastAsync(message);
            }
            catch (JsonException)
            {
                await SendErrorAsync(client, "Envía un JSON válido con name y text.");
            }
            catch (ArgumentException error)
            {
                await SendErrorAsync(client, error.Message);
            }
        }
    }

    // Serializa una vez el mensaje y lo envía a cada conexión; una conexión caída no debe detener a las demás.
    private async Task BroadcastAsync(ChatMessage message)
    {
        var bytes = JsonSerializer.SerializeToUtf8Bytes(new { type = "message", message }, _json);
        // Aquí hacemos a mano lo que Clients.All hace por nosotros en SignalR.
        foreach (var entry in _clients)
        {
            try { await entry.Value.SendAsync(bytes); }
            catch (WebSocketException) { entry.Value.Socket.Abort(); _clients.TryRemove(entry.Key, out _); }
            catch (OperationCanceledException) { entry.Value.Socket.Abort(); _clients.TryRemove(entry.Key, out _); }
        }
    }

    // Envía el error solo al emisor: un mensaje inválido no se publica en la sala.
    private Task SendErrorAsync(ChatClient client, string error)
    {
        var bytes = JsonSerializer.SerializeToUtf8Bytes(new { type = "error", error }, _json);
        return client.SendAsync(bytes);
    }
}
