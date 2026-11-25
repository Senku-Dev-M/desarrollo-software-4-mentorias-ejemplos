namespace ProductApi;

public sealed class ProductStore
{
    private readonly object _sync = new();

    private readonly List<Product> _products = new()
    {
        new Product(1, "Laptop", 2500m),
        new Product(2, "Mouse", 150m)
    };

    private int _nextId = 3;

    public List<Product> GetAll()
    {
        lock (_sync)
        {
            return _products.ToList();
        }
    }

    public Product? GetById(int id)
    {
        lock (_sync)
        {
            return _products.FirstOrDefault(product => product.Id == id);
        }
    }

    public Product Create(string name, decimal price)
    {
        lock (_sync)
        {
            var product = new Product(_nextId++, name, price);
            _products.Add(product);
            return product;
        }
    }

    public Product? Update(int id, string name, decimal price)
    {
        lock (_sync)
        {
            var index = _products.FindIndex(product => product.Id == id);

            if (index < 0)
            {
                return null;
            }

            var updated = new Product(id, name, price);
            _products[index] = updated;

            return updated;
        }
    }

    public bool Delete(int id)
    {
        lock (_sync)
        {
            var product = _products.FirstOrDefault(item => item.Id == id);

            if (product is null)
            {
                return false;
            }

            _products.Remove(product);
            return true;
        }
    }
}
