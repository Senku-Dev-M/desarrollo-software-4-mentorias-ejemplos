# ProductsEf — Supabase con migraciones de EF Core

API mínima ASP.NET Core que utiliza Entity Framework Core y Npgsql para
conectarse a PostgreSQL alojado en Supabase.

Este proyecto administra su propia tabla mediante migraciones:

```text
Product.cs
   ↓
ProductsDbContext.cs
   ↓
Migrations/InitialCreate
   ↓
public.products_ef en PostgreSQL
```

La API se conecta principalmente mediante **Session pooler**. Para aplicar
migraciones, Supabase recomienda **Direct connection**; si tu red solo dispone
de IPv4, Session pooler es la alternativa. No utilices Transaction pooler para
las migraciones.

## Resultado

El proyecto expone:

| Método | Ruta | Resultado |
|---|---|---|
| `POST` | `/products` | Valida e inserta un producto; devuelve `201 Created` |
| `GET` | `/products` | Devuelve productos ordenados por `id` |

La migración crea:

```text
public.products_ef
├─ id    integer identity, primary key, not null
├─ name  varchar(120), not null
└─ price numeric(10,2), not null
```

También crea `public.__EFMigrationsHistory`, utilizada por EF Core para registrar
qué migraciones fueron aplicadas.

## Tecnologías y versiones

| Componente | Versión |
|---|---:|
| Target Framework | `net10.0` |
| Entity Framework Core | `10.0.14` |
| `dotnet-ef` local | `10.0.14` |
| Npgsql | `10.0.3` |
| Npgsql EF Core Provider | `10.0.3` |

Las versiones están fijadas en `ProductsEf.csproj`, `packages.lock.json` y el
manifest de herramientas ubicado en `../../.config/dotnet-tools.json`.

## Archivos relevantes

| Archivo | Responsabilidad |
|---|---|
| `Product.cs` | Entidad `Product` y contrato del POST |
| `ProductsDbContext.cs` | Mapeo de C# a `public.products_ef` |
| `Program.cs` | Conexión, DI y endpoints HTTP |
| `Migrations/*InitialCreate.cs` | Creación de tabla, RLS y permisos |
| `Migrations/ProductsDbContextModelSnapshot.cs` | Estado del modelo conocido por EF Core |
| `packages.lock.json` | Resolución reproducible de paquetes |

## 1. Preparar el proyecto en Supabase

En [Supabase Dashboard](https://supabase.com/dashboard):

1. Crea o abre un proyecto de práctica.
2. Conserva la contraseña PostgreSQL creada con el proyecto.
3. Espera hasta que la base aparezca disponible.
4. Pulsa **Connect**.
5. Para ejecutar la API, selecciona **Session pooler**.
6. Expande **Connection parameters** y copia:
   - host;
   - port;
   - database;
   - user.

Para Session pooler los valores deben tener esta forma:

```text
Host:     aws-<INDICE>-<REGION>.pooler.supabase.com
Port:     5432
Database: postgres
Username: postgres.<PROJECT_REF>
```

No construyas el host a partir de la región. Cópialo del Dashboard.

### Direct connection frente a Session pooler

| Operación | Conexión recomendada |
|---|---|
| `dotnet ef database update` | Direct connection |
| API persistente en una red IPv4 | Session pooler |
| API persistente con acceso IPv6 | Direct connection o Session pooler |

La conexión directa normalmente usa:

```text
Host:     db.<PROJECT_REF>.supabase.co
Port:     5432
Database: postgres
Username: postgres
```

En el plan Free, la conexión directa suele requerir IPv6. Si tu red no puede
resolver o alcanzar el host directo, utiliza Session pooler para esta práctica.

## 2. Descargar el certificado SSL

En el Dashboard:

1. Abre **Database**.
2. Abre **Settings**.
3. Busca **SSL configuration**.
4. En **SSL Certificate**, pulsa **Download certificate**.
5. Guarda el archivo en una ruta estable, por ejemplo:

```text
C:\Users\TU_USUARIO\.certs\supabase-prod-ca.crt
```

Comprueba la ruta:

```powershell
Test-Path "$env:USERPROFILE\.certs\supabase-prod-ca.crt"
```

Debe devolver `True`.

La cadena Npgsql debe incluir:

```text
SSL Mode=VerifyFull;Root Certificate=C:\Users\TU_USUARIO\.certs\supabase-prod-ca.crt
```

Descargar el certificado sin agregar `Root Certificate` a la conexión no cambia
el comportamiento de Npgsql.

## 3. Configurar la conexión

La aplicación lee exclusivamente:

```text
ConnectionStrings:Supabase
```

No guardes la contraseña en `Program.cs` ni `appsettings.json`.

Desde la raíz `tutorial-supabase-dotnet`, ejecuta el script incluido:

```powershell
.\scripts\configurar-conexion.ps1 -Metodo ef
```

El script solicita la cadena con entrada oculta y la guarda en User Secrets.

Si estás dentro de esta carpeta (`01-ef/ProductsEf`), el comando equivalente es:

```powershell
..\..\scripts\configurar-conexion.ps1 -Metodo ef
```

Pega una cadena completa de una sola línea:

```text
Host=<HOST>;Port=5432;Database=postgres;Username=postgres.<PROJECT_REF>;Password=<CONTRASEÑA>;SSL Mode=VerifyFull;Root Certificate=C:\Users\TU_USUARIO\.certs\supabase-prod-ca.crt
```

Reemplaza todos los marcadores. Para Direct connection, utiliza el host directo
y `Username=postgres`.

User Secrets almacena el valor fuera del repositorio, pero no lo cifra. En un
entorno desplegado utiliza un gestor de secretos o la variable:

```text
ConnectionStrings__Supabase
```

Para comprobar únicamente que la clave existe:

```powershell
dotnet user-secrets list
```

No compartas esa salida: muestra la conexión completa.

## 4. Restaurar y compilar

Ejecuta desde esta carpeta:

```powershell
dotnet tool restore
dotnet restore --locked-mode
dotnet build --no-restore
```

`dotnet tool restore` encuentra el manifest local subiendo hasta la raíz del
tutorial.

El resultado esperado es:

```text
Compilación correcta.
0 Advertencia(s)
0 Errores
```

## 5. Cómo fue creado este proyecto

Estos son los comandos equivalentes ejecutados al preparar el ejemplo:

```powershell
dotnet new web -n ProductsEf -f net10.0
cd ProductsEf

dotnet add package Microsoft.EntityFrameworkCore --version 10.0.14
dotnet add package Microsoft.EntityFrameworkCore.Relational --version 10.0.14
dotnet add package Microsoft.EntityFrameworkCore.Design --version 10.0.14
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version 10.0.3
dotnet add package Npgsql --version 10.0.3
```

En la raíz del tutorial se creó la herramienta local:

```powershell
dotnet new tool-manifest
dotnet tool install dotnet-ef --version 10.0.14
```

La migración ya está incluida. El comando que la generó fue:

```powershell
dotnet ef migrations add InitialCreate
```

**No ejecutes nuevamente ese comando con el mismo nombre.** Para utilizar el
proyecto actual solo debes aplicar la migración existente.

## 6. Qué hace el mapeo

`ProductsDbContext.cs` define:

```csharp
product.ToTable("products_ef", "public");
```

Y mapea:

```csharp
product.Property(p => p.Id)
    .HasColumnName("id")
    .UseIdentityByDefaultColumn();

product.Property(p => p.Name)
    .HasColumnName("name")
    .HasMaxLength(120)
    .IsRequired();

product.Property(p => p.Price)
    .HasColumnName("price")
    .HasPrecision(10, 2)
    .IsRequired();
```

`Program.cs` registra Npgsql:

```csharp
builder.Services.AddDbContext<ProductsDbContext>(options =>
    options.UseNpgsql(connectionString));
```

La aplicación no llama `EnsureCreated()` ni `Database.Migrate()` al arrancar.
El esquema cambia únicamente cuando el desarrollador aplica una migración.

## 7. Revisar y aplicar la migración

Lista las migraciones conocidas:

```powershell
dotnet ef migrations list
```

Debes ver `InitialCreate`.

Revisa `Migrations/*InitialCreate.cs` antes de aplicar. Su método `Up`:

1. crea `public.products_ef`;
2. crea la clave primaria;
3. habilita RLS;
4. revoca permisos de `anon` y `authenticated`;
5. protege `__EFMigrationsHistory` de esos roles.

Aplica la migración:

```powershell
dotnet ef database update
```

EF Core conectará a la base indicada por `ConnectionStrings:Supabase`.

Ejecuta otra vez el comando:

```powershell
dotnet ef database update
```

No debe volver a crear la tabla. EF Core consulta
`public.__EFMigrationsHistory` y aplica únicamente migraciones pendientes.

### Importante sobre RLS

La API se conecta como usuario PostgreSQL administrativo (`postgres` o
`postgres.<PROJECT_REF>` mediante pooler). Ese rol puede omitir RLS.

RLS y `REVOKE` protegen la exposición mediante roles de la Data API, pero no
convierten el usuario administrador en un rol de aplicación con privilegios
mínimos. En producción, separa el rol que ejecuta migraciones del rol utilizado
por la API.

## 8. Verificar la tabla en Supabase

En el Dashboard:

1. Abre **Table Editor** o **Database → Tables**.
2. Selecciona `public.products_ef`.
3. Comprueba las tres columnas, la identidad y la clave primaria.
4. Abre `public.__EFMigrationsHistory`.
5. Comprueba que aparece `InitialCreate`.

En SQL Editor también puedes ejecutar:

```sql
select column_name, data_type, character_maximum_length,
       numeric_precision, numeric_scale, is_nullable,
       is_identity, identity_generation
from information_schema.columns
where table_schema = 'public'
  and table_name = 'products_ef'
order by ordinal_position;
```

Verifica RLS:

```sql
select relname, relrowsecurity
from pg_class
where oid = 'public.products_ef'::regclass;
```

`relrowsecurity` debe ser `true`.

## 9. Ejecutar la API

Antes de iniciar, vuelve a configurar la conexión de **Session pooler** si
habías usado Direct connection para la migración.

Ejecuta:

```powershell
dotnet run --urls http://localhost:5080
```

La API queda disponible en:

```text
http://localhost:5080
```

## 10. Probar inserción y lectura

Mantén la API ejecutándose y abre otra terminal en la raíz del tutorial:

```powershell
.\scripts\probar-api.ps1
```

Desde esta carpeta:

```powershell
..\..\scripts\probar-api.ps1
```

El script:

1. envía `POST /products` con `Cuaderno` y `12.50`;
2. exige HTTP `201`;
3. ejecuta `GET /products`;
4. comprueba que el mismo ID fue leído.

Prueba manual equivalente:

```powershell
$body = @{
    name = "Cuaderno"
    price = 12.50
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri http://localhost:5080/products `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

Invoke-RestMethod -Uri http://localhost:5080/products
```

Refresca `products_ef` en Table Editor y compara el ID. Detén la API, vuelve a
iniciarla y repite el GET para confirmar persistencia.

## 11. Crear una migración futura

Ejemplo: después de modificar el modelo para agregar una propiedad `Stock`,
genera una migración descriptiva:

```powershell
dotnet ef migrations add AddProductStock
```

Revisa el archivo generado. Después aplica:

```powershell
dotnet ef database update
```

No edites manualmente `products_ef` desde Table Editor si EF Core es la fuente
de verdad del esquema.

## 12. Errores comunes

### `Falta ConnectionStrings:Supabase`

La clave no existe para este proyecto. Ejecuta nuevamente:

```powershell
..\..\scripts\configurar-conexion.ps1 -Metodo ef
```

### `Tenant or user not found`

Usaste host o usuario incorrecto para el pooler. En Session pooler el usuario es
`postgres.<PROJECT_REF>`. Copia ambos valores desde **Connect**.

### No se puede alcanzar el host directo

Probablemente tu red es IPv4 y el endpoint directo del plan Free es IPv6.
Configura Session pooler con puerto `5432`.

### Error de certificado

Comprueba:

```powershell
Test-Path "$env:USERPROFILE\.certs\supabase-prod-ca.crt"
```

Además, usa el host exacto del Dashboard y no desactives la validación TLS.

### `relation "products_ef" does not exist`

La migración no fue aplicada a la base indicada por la conexión. Ejecuta:

```powershell
dotnet ef migrations list
dotnet ef database update
```

### El puerto 5080 está ocupado

Detén la otra API con `Ctrl+C` o usa otro puerto:

```powershell
dotnet run --urls http://localhost:5081
```

## Checklist

- [ ] Descargaste el certificado correcto.
- [ ] `Test-Path` devuelve `True`.
- [ ] Configuraste `ConnectionStrings:Supabase` en User Secrets.
- [ ] Restauración bloqueada completada.
- [ ] Compilación con cero errores.
- [ ] `dotnet ef migrations list` muestra `InitialCreate`.
- [ ] `dotnet ef database update` termina correctamente.
- [ ] `products_ef` aparece en Supabase.
- [ ] RLS está habilitado.
- [ ] POST devuelve `201`.
- [ ] GET devuelve el mismo producto.
- [ ] La fila persiste después de reiniciar la API.

## Referencias

- [Supabase: conexión a PostgreSQL](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Supabase: SSL](https://supabase.com/docs/guides/platform/ssl-enforcement)
- [EF Core: migraciones](https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/)
- [Npgsql: seguridad y cifrado](https://www.npgsql.org/doc/security.html)
- [ASP.NET Core: User Secrets](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-10.0)

