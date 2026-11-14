using System.Security.Claims;
using Roles.Api.Authentication;
using Roles.Application.Products;
using Roles.Domain.Users;

namespace Roles.Api.Endpoints;

internal static class SellerEndpoints
{
    public static void MapSeller(this WebApplication app)
    {
        var group = app.MapGroup("/api/seller/products").RequireAuthorization(nameof(UserRole.Seller));

        group.MapGet("", (ClaimsPrincipal user, ListSellerProducts useCase) =>
            useCase.Execute(CurrentUser.Id(user)));

        group.MapPost("", (ClaimsPrincipal user, ProductInput input, CreateProduct useCase) =>
            WithValidation(() =>
            {
                var product = useCase.Execute(CurrentUser.Id(user), input);
                return Results.Created($"/api/catalog/{product.Id}", product);
            }));

        group.MapPut("/{id:guid}", (Guid id, ClaimsPrincipal user, ProductInput input, UpdateProduct useCase) =>
            WithValidation(() => useCase.Execute(CurrentUser.Id(user), id, input) is { } product
                ? Results.Ok(product) : CatalogEndpoints.ProductNotFound()));

        group.MapDelete("/{id:guid}", (Guid id, ClaimsPrincipal user, DeleteProduct useCase) =>
            useCase.Execute(CurrentUser.Id(user), id)
                ? Results.NoContent() : CatalogEndpoints.ProductNotFound());
    }

    private static IResult WithValidation(Func<IResult> action)
    {
        try { return action(); }
        catch (ArgumentException ex)
        {
            return Results.Problem(title: "Producto inválido", detail: ex.Message, statusCode: 400);
        }
    }
}
