namespace Roles.Application.Products;

public sealed class UpdateProduct(IProductRepository products)
{
    public ProductView? Execute(Guid sellerId, Guid id, ProductInput input)
    {
        var current = products.Find(id);
        if (current is null || current.SellerId != sellerId) return null;

        var (name, price, stock) = input.RequiredFields();
        var updated = current.ChangeDetails(name, price, stock);
        return products.Replace(updated) ? ProductView.From(updated) : null;
    }
}
