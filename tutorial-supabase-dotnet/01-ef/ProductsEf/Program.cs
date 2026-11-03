using Microsoft.EntityFrameworkCore;
using ProductsEf;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("Supabase");

if (string.IsNullOrWhiteSpace(connectionString))
{
    Console.Error.WriteLine(
        "Falta ConnectionStrings:Supabase. Configura User Secrets o la variable " +
        "ConnectionStrings__Supabase antes de iniciar.");
    Environment.ExitCode = 1;
    return;
}

builder.Services.AddDbContext<ProductsDbContext>(options =>
    options.UseNpgsql(connectionString));

var app = builder.Build();

app.MapGet("/products", async (ProductsDbContext db) =>
    Results.Ok(await db.Products.AsNoTracking().OrderBy(p => p.Id).ToListAsync()));

app.MapPost("/products", async (CreateProductRequest request, ProductsDbContext db) =>
{
    var name = request.Name?.Trim();
    if (string.IsNullOrWhiteSpace(name) || name.Length > 120)
        return Results.BadRequest(new { error = "El nombre requiere entre 1 y 120 caracteres." });

    if (request.Price < 0 || request.Price > 99999999.99m ||
        decimal.Round(request.Price, 2) != request.Price)
        return Results.BadRequest(new { error = "El precio debe estar entre 0 y 99999999.99, con hasta 2 decimales." });

    var product = new Product { Name = name, Price = request.Price };
    db.Products.Add(product);
    await db.SaveChangesAsync();
    return Results.Created($"/products/{product.Id}", product);
});

// El esquema se crea de forma explícita: migración (método 1) o SQL (método 2).
// No llamar a EnsureCreated ni a Migrate al iniciar la aplicación.
app.Run();
