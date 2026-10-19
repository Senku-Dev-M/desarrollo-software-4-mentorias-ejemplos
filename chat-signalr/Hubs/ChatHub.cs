using ChatSignalR.Models;
using Microsoft.AspNetCore.SignalR;

namespace ChatSignalR.Hubs;

public class ChatHub : Hub
{
    // Método invocable desde JavaScript: valida los datos y publica ReceiveMessage a todos los clientes del Hub.
    public async Task SendMessage(string name, string text)
    {
        ChatMessage message;
        try
        {
            message = ChatMessage.Create(name, text);
        }
        catch (ArgumentException error)
        {
            // HubException permite devolver al cliente un error comprensible.
            throw new HubException(error.Message);
        }

        // SignalR conoce las conexiones: no guardamos una lista de sockets.
        // All incluye también a quien envió el mensaje.
        await Clients.All.SendAsync("ReceiveMessage", message);
    }
}
