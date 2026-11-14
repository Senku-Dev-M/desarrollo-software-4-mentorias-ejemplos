using Roles.Domain.Products;

namespace Roles.Application.Products;

public sealed record ProductInput(string? Name, decimal? Price, int? Stock)
{
    public (string? Name, decimal Price, int Stock) RequiredFields() =>
        (Name, Price ?? throw new ArgumentException("Indica el precio."),
               Stock ?? throw new ArgumentException("Indica el stock."));
}

public sealed record ProductView(Guid Id, string Name, decimal Price, int Stock)
{
    public static ProductView From(Product product) =>
        new(product.Id, product.Name, product.Price, product.Stock);
}
