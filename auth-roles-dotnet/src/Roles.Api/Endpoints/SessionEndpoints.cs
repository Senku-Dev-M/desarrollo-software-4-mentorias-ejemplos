using System.Security.Claims;
using Roles.Api.Authentication;

namespace Roles.Api.Endpoints;

internal static class SessionEndpoints
{
    public static void MapSession(this WebApplication app)
    {
        app.MapGet("/health", () => Results.Ok(new { status = "ok" })).AllowAnonymous();
        app.MapGet("/api/me", (ClaimsPrincipal user) => CurrentUser.Profile(user)).RequireAuthorization();
    }
}
