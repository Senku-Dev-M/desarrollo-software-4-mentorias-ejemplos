using ChatWebSockets.WebSockets;

namespace ChatWebSockets;

public class Program
{
    // Punto de entrada: prepara la configuración y arranca el servidor de este ejemplo.
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        // Singleton: todos los clientes comparten una sala en memoria.
        builder.Services.AddSingleton<WebSocketChat>();
        var app = builder.Build();
        // Este proyecto sirve su propio frontend desde wwwroot.
        app.UseDefaultFiles();
        app.UseStaticFiles();
        // Permite convertir una petición HTTP en una conexión WebSocket.
        app.UseWebSockets();
        app.Map("/ws/chat", async (HttpContext context, WebSocketChat chat) =>
        {
            // Hay que esperar toda la vida de la conexión.
            await chat.HandleAsync(context);
        });
        app.Run();
    }
}
