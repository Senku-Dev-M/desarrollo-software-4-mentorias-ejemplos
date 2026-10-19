using ChatSignalR.Hubs;

namespace ChatSignalR;

public class Program
{
    // Punto de entrada: prepara la configuración y arranca el servidor de este ejemplo.
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        // SignalR administra las conexiones y las llamadas al Hub.
        builder.Services.AddSignalR();
        var app = builder.Build();
        // Este proyecto sirve su propio frontend desde wwwroot.
        app.UseDefaultFiles();
        app.UseStaticFiles();
        // El cliente invoca los métodos del Hub mediante esta ruta.
        app.MapHub<ChatHub>("/hubs/chat");
        app.Run();
    }
}
