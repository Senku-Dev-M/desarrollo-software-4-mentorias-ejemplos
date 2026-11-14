using System.Net.Http.Headers;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Roles.Application.Users;

namespace Roles.Api.Authentication;

public sealed class BearerAuthenticationMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, ResolveAuthenticatedUser resolveUser)
    {
        var endpoint = context.GetEndpoint();
        if (endpoint is null || endpoint.Metadata.GetMetadata<IAllowAnonymous>() is not null)
        {
            await next(context);
            return;
        }

        var values = context.Request.Headers.Authorization;
        if (values.Count != 1 ||
            !AuthenticationHeaderValue.TryParse(values[0], out var header) ||
            !header.Scheme.Equals("Bearer", StringComparison.OrdinalIgnoreCase) ||
            header.Parameter is not { Length: > 0 } token ||
            token.Any(c => char.IsWhiteSpace(c) || c == ','))
        {
            await AuthProblems.Unauthenticated(context, "Envía Authorization: Bearer <token>.")
                .ExecuteAsync(context);
            return;
        }

        // Primero autentica con el emisor. Después busca users.role por la identidad verificada.
        var result = await resolveUser.ExecuteAsync(token, context.RequestAborted);
        if (result.Status == AuthenticationStatus.InvalidToken)
        {
            await AuthProblems.Unauthenticated(context, "El token no es válido o ha expirado.")
                .ExecuteAsync(context);
            return;
        }

        if (result.Profile is not { } profile)
        {
            await AuthProblems.Forbidden("El usuario no tiene un perfil con acceso.").ExecuteAsync(context);
            return;
        }

        context.User = new ClaimsPrincipal(new ClaimsIdentity(
        [
            new(ClaimTypes.NameIdentifier, profile.Id.ToString()),
            new(ClaimTypes.Name, profile.DisplayName),
            new(ClaimTypes.Role, profile.Role.ToString())
        ], "Bearer"));

        // Las políticas de ASP.NET autorizan la ruta a continuación.
        await next(context);
    }
}
