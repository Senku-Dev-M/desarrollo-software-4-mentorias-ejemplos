namespace ChatSignalR.Models;

public class ChatMessage
{
    public string Name { get; set; } = "";
    public string Text { get; set; } = "";
    public DateTimeOffset SentAt { get; set; }

    // Valida nombre y texto y asigna la hora del servidor; nunca confía en una fecha enviada por el cliente.
    public static ChatMessage Create(string? name, string? text)
    {
        name = name?.Trim() ?? "";
        text = text?.Trim() ?? "";

        if (name.Length < 1 || name.Length > 30)
            throw new ArgumentException("El nombre debe tener entre 1 y 30 caracteres.");
        if (text.Length < 1 || text.Length > 500)
            throw new ArgumentException("El mensaje debe tener entre 1 y 500 caracteres.");

        // La hora la pone el servidor, no confiamos en la que envíe el navegador.
        return new ChatMessage { Name = name, Text = text, SentAt = DateTimeOffset.UtcNow };
    }
}
