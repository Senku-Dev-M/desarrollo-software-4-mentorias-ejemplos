using Microsoft.EntityFrameworkCore;

namespace ProductsEf;

public class ProductsDbContext(DbContextOptions<ProductsDbContext> options)
    : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var product = modelBuilder.Entity<Product>();
        product.ToTable("products_ef", "public");
        product.HasKey(p => p.Id);
        product.Property(p => p.Id).HasColumnName("id")
            .UseIdentityByDefaultColumn();
        product.Property(p => p.Name).HasColumnName("name")
            .HasMaxLength(120).IsRequired();
        product.Property(p => p.Price).HasColumnName("price")
            .HasPrecision(10, 2).IsRequired();
    }
}
