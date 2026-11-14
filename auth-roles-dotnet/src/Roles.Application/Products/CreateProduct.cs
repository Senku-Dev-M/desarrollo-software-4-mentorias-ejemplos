using Roles.Domain.Products;

namespace Roles.Application.Products;

public sealed class CreateProduct(IProductRepository products)
{
    public ProductView Execute(Guid sellerId, ProductInput input)
    {
        var (name, price, stock) = input.RequiredFields();
        var product = Product.Create(Guid.NewGuid(), sellerId, name, price, stock);
        products.Add(product);
        return ProductView.From(product);
    }
}
