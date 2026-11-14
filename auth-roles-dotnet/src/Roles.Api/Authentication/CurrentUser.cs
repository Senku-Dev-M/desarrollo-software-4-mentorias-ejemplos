using System.Security.Claims;
using Roles.Domain.Users;

namespace Roles.Api.Authentication;

internal static class CurrentUser
{
    // Estas rutas solo se ejecutan después de autenticar al usuario.
    public static Guid Id(ClaimsPrincipal principal) => Guid.Parse(principal.FindFirstValue(ClaimTypes.NameIdentifier)!);

    public static UserProfile Profile(ClaimsPrincipal principal) =>
        new(Id(principal), principal.Identity!.Name!,
            Enum.Parse<UserRole>(principal.FindFirstValue(ClaimTypes.Role)!));
}
