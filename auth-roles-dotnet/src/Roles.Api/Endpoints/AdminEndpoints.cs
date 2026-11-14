using Roles.Application.Analytics;
using Roles.Domain.Users;

namespace Roles.Api.Endpoints;

internal static class AdminEndpoints
{
    public static void MapAdmin(this WebApplication app) =>
        app.MapGet("/api/admin/analytics", (GetAnalytics useCase) => useCase.Execute())
            .RequireAuthorization(nameof(UserRole.Admin));
}
