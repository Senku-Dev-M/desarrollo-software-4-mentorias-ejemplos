using ProductApi;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins(
                "http://127.0.0.1:5173",
                "http://localhost:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddSingleton<ProductStore>();

var app = builder.Build();

app.UseCors("Frontend");

app.MapGet("/", () => Results.Ok(new
{
    name = "Demo Products API",
    status = "running"
}));

app.MapGet("/api/health", () => Results.Ok(new
{
    status = "ok"
}));

app.MapGet("/api/products", (ProductStore store) =>
{
    return Results.Ok(store.GetAll());
});

app.MapGet("/api/products/{id:int}", (int id, ProductStore store) =>
{
    var product = store.GetById(id);

    return product is null
        ? Results.NotFound(new { message = "Producto no encontrado." })
        : Results.Ok(product);
});

app.MapPost("/api/products", (ProductRequest request, ProductStore store) =>
{
    if (string.IsNullOrWhiteSpace(request.Name))
    {
        return Results.BadRequest(new
        {
            message = "El nombre del producto es obligatorio."
        });
    }

    if (request.Price <= 0)
    {
        return Results.BadRequest(new
        {
            message = "El precio debe ser mayor que cero."
        });
    }

    var product = store.Create(request.Name.Trim(), request.Price);

    return Results.Created($"/api/products/{product.Id}", product);
});

app.MapPut("/api/products/{id:int}", (int id, ProductRequest request, ProductStore store) =>
{
    if (string.IsNullOrWhiteSpace(request.Name))
    {
        return Results.BadRequest(new
        {
            message = "El nombre del producto es obligatorio."
        });
    }

    if (request.Price <= 0)
    {
        return Results.BadRequest(new
        {
            message = "El precio debe ser mayor que cero."
        });
    }

    var updated = store.Update(id, request.Name.Trim(), request.Price);

    return updated is null
        ? Results.NotFound(new { message = "Producto no encontrado." })
        : Results.Ok(updated);
});

app.MapDelete("/api/products/{id:int}", (int id, ProductStore store) =>
{
    var deleted = store.Delete(id);

    return deleted
        ? Results.NoContent()
        : Results.NotFound(new { message = "Producto no encontrado." });
});

app.Run();
