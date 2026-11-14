using Roles.Application.Products;
using Roles.Domain.Products;

namespace Roles.Infrastructure.Products;

public sealed class ProductRepository : IProductRepository
{
    // TODO 3 (opcional): Implementa estas operaciones con tu base de datos.
    // Los casos de uso ya reciben el ID del vendedor autenticado y comprueban la propiedad.
    public IReadOnlyList<Product> List() => throw new NotImplementedException();

    // Ejemplo para Find: vincula @id al parámetro y convierte la fila a Product.
    // const string sql = "SELECT id, seller_id, name, price, stock FROM public.products WHERE id = @id";
    public Product? Find(Guid id) => throw new NotImplementedException();
    public void Add(Product product) => throw new NotImplementedException();
    public bool Replace(Product product) => throw new NotImplementedException();
    public bool Remove(Guid id) => throw new NotImplementedException();
}
