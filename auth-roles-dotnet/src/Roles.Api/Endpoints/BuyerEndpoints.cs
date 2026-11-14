using Roles.Application.Products;
using Roles.Domain.Users;

namespace Roles.Api.Endpoints;

internal static class BuyerEndpoints
{
    public static void MapBuyer(this WebApplication app) =>
        app.MapGet("/api/buyer/available-products", (ListAvailableProducts useCase) => useCase.Execute())
            .RequireAuthorization(nameof(UserRole.Buyer));
}
