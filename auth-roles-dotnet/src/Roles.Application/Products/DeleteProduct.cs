namespace Roles.Application.Products;

public sealed class DeleteProduct(IProductRepository products)
{
    public bool Execute(Guid sellerId, Guid id)
    {
        var current = products.Find(id);
        return current is not null && current.SellerId == sellerId && products.Remove(id);
    }
}
