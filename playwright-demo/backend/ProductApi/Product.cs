namespace ProductApi;

public sealed record Product(
    int Id,
    string Name,
    decimal Price
);

public sealed record ProductRequest(
    string? Name,
    decimal Price
);
