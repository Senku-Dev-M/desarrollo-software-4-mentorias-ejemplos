using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

// Solo metadata del modelo: no abre conexiones, no crea tablas y no usa credenciales.
const string dummy = "Host=localhost;Database=metadata_only;Username=unused;Password=unused";
using var ef = new ProductsEf.ProductsDbContext(
    new DbContextOptionsBuilder<ProductsEf.ProductsDbContext>().UseNpgsql(dummy).Options);
using var sql = new ProductsSql.ProductsDbContext(
    new DbContextOptionsBuilder<ProductsSql.ProductsDbContext>().UseNpgsql(dummy).Options);

Check(ef, typeof(ProductsEf.Product), "products_ef");
Check(sql, typeof(ProductsSql.Product), "products_sql");
Console.WriteLine("PASS: ambos modelos coinciden en columnas, tipos, nulabilidad, identidad y clave primaria.");
Console.WriteLine("ALCANCE: metadata local; no es una prueba contra Supabase.");

static void Check(DbContext db, Type type, string tableName)
{
    var entity = db.Model.FindEntityType(type) ?? throw new Exception("Falta la entidad Product.");
    Assert(entity.GetSchema() == "public" && entity.GetTableName() == tableName, "Tabla/esquema incorrectos.");
    var store = StoreObjectIdentifier.Table(tableName, "public");
    Assert(entity.FindPrimaryKey()!.Properties.Single().Name == "Id", "PK incorrecta.");
    var expectations = new[] { ("Id", "id", "integer"), ("Name", "name", "character varying(120)"), ("Price", "price", "numeric(10,2)") };
    foreach (var (propertyName, columnName, columnType) in expectations)
    {
        var property = entity.FindProperty(propertyName)!;
        Assert(property.GetColumnName(store) == columnName, $"Columna incorrecta: {propertyName}.");
        Assert(property.GetColumnType() == columnType, $"Tipo incorrecto: {propertyName}: {property.GetColumnType()}.");
        Assert(!property.IsNullable, $"Nulabilidad incorrecta: {propertyName}.");
    }
    Assert(entity.FindProperty("Id")!.ValueGenerated == ValueGenerated.OnAdd, "Id debe generarse al insertar.");
    Assert(entity.FindProperty("Id")!.GetValueGenerationStrategy().ToString() == "IdentityByDefaultColumn", "Identidad incorrecta.");
    Console.WriteLine($"PASS: public.{tableName}");
}

static void Assert(bool condition, string message)
{
    if (!condition) throw new Exception(message);
}
