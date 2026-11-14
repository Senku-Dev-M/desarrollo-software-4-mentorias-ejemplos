using Roles.Application.Users;

namespace Roles.Infrastructure.Supabase;

public sealed class SupabaseAccessTokenVerifier : IAccessTokenVerifier
{
    public Task<Guid?> VerifyAsync(string token, CancellationToken cancellationToken)
    {
        // TODO 1: Usa un HttpClient configurado con la URL de tu proyecto Supabase.
        // Envía GET /auth/v1/user con el Bearer recibido y la clave publicable en apikey.
        // Si Auth rechaza el token, devuelve null. Si lo acepta, extrae el UUID de la respuesta.
        // Un fallo de red o del proveedor es un error de integración, no un token inválido.
        //
        // Ejemplo: agrega async a este método, inyecta HttpClient con BaseAddress
        // y obtén publishableKey de la configuración.
        // using var request = new HttpRequestMessage(HttpMethod.Get, "/auth/v1/user");
        // request.Headers.Add("apikey", publishableKey);
        // request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        // using var response = await http.SendAsync(request, cancellationToken);
        // if (response.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.Forbidden)
        //     return null;
        // response.EnsureSuccessStatusCode();
        // var payload = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken);
        // if (payload.TryGetProperty("id", out var id) && id.ValueKind == JsonValueKind.String
        //     && Guid.TryParse(id.GetString(), out var userId))
        //     return userId;
        // throw new InvalidOperationException("Supabase Auth devolvió una identidad inesperada.");
        throw new NotImplementedException();
    }
}
