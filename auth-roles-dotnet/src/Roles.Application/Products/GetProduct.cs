namespace Roles.Application.Products;

public sealed class GetProduct(IProductRepository products)
{
    public ProductView? Execute(Guid id) =>
        products.Find(id) is { } product ? ProductView.From(product) : null;
}
