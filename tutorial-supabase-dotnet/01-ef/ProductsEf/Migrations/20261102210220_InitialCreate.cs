using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ProductsEf.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "public");

            migrationBuilder.CreateTable(
                name: "products_ef",
                schema: "public",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_products_ef", x => x.id);
                });

            migrationBuilder.Sql("""
                ALTER TABLE public.products_ef ENABLE ROW LEVEL SECURITY;
                REVOKE ALL ON TABLE public.products_ef FROM anon, authenticated;
                ALTER TABLE public."__EFMigrationsHistory" ENABLE ROW LEVEL SECURITY;
                REVOKE ALL ON TABLE public."__EFMigrationsHistory" FROM anon, authenticated;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "products_ef",
                schema: "public");
        }
    }
}
