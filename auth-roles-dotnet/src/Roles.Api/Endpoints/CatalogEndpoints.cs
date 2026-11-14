using Roles.Application.Products;

namespace Roles.Api.Endpoints;

internal static class CatalogEndpoints
{
    public static void MapCatalog(this WebApplication app)
    {
        var group = app.MapGroup("/api/catalog").RequireAuthorization();
        group.MapGet("", (ListProducts useCase) => useCase.Execute());
        group.MapGet("/{id:guid}", (Guid id, GetProduct useCase) =>
            useCase.Execute(id) is { } product ? Results.Ok(product) : ProductNotFound());
    }

    public static IResult ProductNotFound() => Results.Problem(
        title: "Producto no encontrado", statusCode: 404);
}
