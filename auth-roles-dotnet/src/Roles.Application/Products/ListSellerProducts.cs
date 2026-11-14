namespace Roles.Application.Products;

public sealed class ListSellerProducts(IProductRepository products)
{
    public IReadOnlyList<ProductView> Execute(Guid sellerId) =>
        products.List().Where(x => x.SellerId == sellerId).Select(ProductView.From).ToArray();
}
