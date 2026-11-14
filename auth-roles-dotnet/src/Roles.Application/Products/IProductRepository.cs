using Roles.Domain.Products;

namespace Roles.Application.Products;

public interface IProductRepository
{
    IReadOnlyList<Product> List();
    Product? Find(Guid id);
    void Add(Product product);
    bool Replace(Product product);
    bool Remove(Guid id);
}
