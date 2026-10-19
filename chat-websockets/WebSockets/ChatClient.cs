using System.Net.WebSockets;

namespace ChatWebSockets.WebSockets;

// Pequeño ayudante: un WebSocket solo permite un envío a la vez.
public class ChatClient
{
    private readonly SemaphoreSlim _sendLock = new SemaphoreSlim(1, 1);
    public WebSocket Socket { get; }

    public ChatClient(WebSocket socket)
    {
        Socket = socket;
    }

    // Espera su turno antes de escribir al socket y libera el bloqueo en finally; el timeout evita esperar indefinidamente.
    public async Task SendAsync(byte[] bytes)
    {
        using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(5));
        await _sendLock.WaitAsync(timeout.Token);
        try
        {
            if (Socket.State == WebSocketState.Open)
                await Socket.SendAsync(bytes.AsMemory(), WebSocketMessageType.Text, true, timeout.Token);
        }
        finally
        {
            _sendLock.Release();
        }
    }

    // Envía el cierre normal usando el mismo bloqueo que los mensajes para no solapar escrituras.
    public async Task CloseAsync(WebSocketCloseStatus status, string reason)
    {
        using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(5));
        await _sendLock.WaitAsync(timeout.Token);
        try
        {
            if (Socket.State == WebSocketState.Open || Socket.State == WebSocketState.CloseReceived)
                await Socket.CloseOutputAsync(status, reason, timeout.Token);
        }
        finally
        {
            _sendLock.Release();
        }
    }
}
