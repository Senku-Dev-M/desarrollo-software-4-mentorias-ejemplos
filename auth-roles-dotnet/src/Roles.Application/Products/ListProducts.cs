namespace Roles.Application.Products;

public sealed class ListProducts(IProductRepository products)
{
    public IReadOnlyList<ProductView> Execute() => products.List().Select(ProductView.From).ToArray();
}
