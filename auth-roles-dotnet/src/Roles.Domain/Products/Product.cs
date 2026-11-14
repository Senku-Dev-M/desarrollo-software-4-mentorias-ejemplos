namespace Roles.Domain.Products;

public sealed record Product
{
    public Guid Id { get; }
    public Guid SellerId { get; }
    public string Name { get; }
    public decimal Price { get; }
    public int Stock { get; }

    private Product(Guid id, Guid sellerId, string name, decimal price, int stock) =>
        (Id, SellerId, Name, Price, Stock) = (id, sellerId, name, price, stock);

    public static Product Create(Guid id, Guid sellerId, string? name, decimal price, int stock)
    {
        name = name?.Trim();
        if (string.IsNullOrEmpty(name) || name.Length > 80)
            throw new ArgumentException("El nombre debe tener entre 1 y 80 caracteres.");
        if (price <= 0 || price > 1_000_000 || decimal.Round(price, 2) != price)
            throw new ArgumentException("El precio debe ser positivo, de hasta 1 000 000 y con máximo dos decimales.");
        if (stock is < 0 or > 100_000)
            throw new ArgumentException("El stock debe estar entre 0 y 100 000.");
        return new Product(id, sellerId, name, price, stock);
    }

    public Product ChangeDetails(string? name, decimal price, int stock) =>
        Create(Id, SellerId, name, price, stock);
}
