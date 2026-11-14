namespace Roles.Application.Products;

public sealed class ListAvailableProducts(IProductRepository products)
{
    public IReadOnlyList<ProductView> Execute() =>
        products.List().Where(x => x.Stock > 0).Select(ProductView.From).ToArray();
}
