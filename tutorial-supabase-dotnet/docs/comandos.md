# Comandos para repetir el tutorial

Estos pasos son para un proyecto nuevo de práctica. Los comandos de nube y las
operaciones con datos todavía no se han ejecutado en esta entrega parcial.

## A. Crear desde cero el método EF

```powershell
dotnet new web -n ProductsEf -f net10.0
cd ProductsEf
dotnet add package Microsoft.EntityFrameworkCore --version 10.0.14
dotnet add package Microsoft.EntityFrameworkCore.Relational --version 10.0.14
dotnet add package Microsoft.EntityFrameworkCore.Design --version 10.0.14
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version 10.0.3
dotnet add package Npgsql --version 10.0.3
dotnet new tool-manifest
dotnet tool install dotnet-ef --version 10.0.14
dotnet user-secrets init
```

Crear `Product.cs`, `ProductsDbContext.cs` y `Program.cs` utilizando los archivos
del ejemplo. Antes de aplicar la migración, añadir RLS y revocar el acceso de
`anon` y `authenticated`, como muestra `InitialCreate` en el material.

## B. Partir del material ya preparado

Desde la raíz `tutorial-supabase-dotnet`:

```powershell
dotnet tool restore
dotnet restore 01-ef/ProductsEf --locked-mode
dotnet restore 02-sql/ProductsSql --locked-mode
```

Las migraciones ya están incluidas. No ejecutar `migrations add InitialCreate`
de nuevo si se parte de estos archivos.

## C. Guardar la conexión sin mostrarla

Ejemplo de formato, con valores que deben reemplazarse:

```text
Host=<HOST_DEL_SESSION_POOLER>;Port=5432;Database=postgres;Username=postgres.<PROJECT_REF>;Password=<PASSWORD>;SSL Mode=VerifyFull;Root Certificate=<RUTA_ABSOLUTA_CERTIFICADO>
```

Forma didáctica del comando, solo con marcadores:

```powershell
dotnet user-secrets set "ConnectionStrings:Supabase" "<CADENA_NPGSQL>" --project 01-ef/ProductsEf
```

Para cargar el valor real sin dejarlo escrito en el comando ni en pantalla:

```powershell
./scripts/configurar-conexion.ps1 -Metodo ef
./scripts/configurar-conexion.ps1 -Metodo sql
```

El script pide la cadena completa en una entrada oculta y la envía al Secret
Manager por entrada estándar. Se debe introducir el valor para cada proyecto.
Si la contraseña incluye `;` o comillas, usar el formato de escape de Npgsql
con un generador de cadenas; no pegar una URI PostgreSQL como si fuera una
cadena de parámetros Npgsql.

Variable alternativa: `ConnectionStrings__Supabase`. No imprimirla ni escribir
su valor real en scripts o historial. User Secrets se carga por defecto en el
entorno Development; los perfiles incluidos ya lo seleccionan.

## D. Migraciones del método 1

Si se comienza desde cero, desde la carpeta del primer proyecto:

```powershell
dotnet ef migrations add InitialCreate
# Revisar el código generado y añadir RLS antes del siguiente comando.
dotnet ef database update
dotnet run --urls http://localhost:5080
```

Si se utiliza el material preparado, desde su raíz:

```powershell
dotnet ef database update --project 01-ef/ProductsEf -- --environment Development
dotnet run --project 01-ef/ProductsEf --urls http://localhost:5080
```

`database update` cambia la base indicada por User Secrets. Solo utilizarlo con
el proyecto nuevo de práctica. No ejecutar `database update 0`: eliminaría la
tabla creada por la migración y sus filas.

## E. Probar con datos y comprobar visualmente

En otra terminal desde la raíz del material:

```powershell
./scripts/probar-api.ps1
```

El script inserta un producto nuevo en cada ejecución. No borra datos.
Comprobar `201`, leer el mismo ID con GET y refrescar Table Editor.
Detener y reiniciar la API; GET debe seguir mostrando la fila.

## F. Método 2

1. En SQL Editor ejecutar `sql/products.sql` una sola vez.
2. Comprobar `products_sql` en Table Editor.
3. Detener la primera API con Ctrl+C.
4. Configurar los secretos del segundo ejemplo.
5. Ejecutar:

```powershell
dotnet run --project 02-sql/ProductsSql --urls http://localhost:5080
./scripts/probar-api.ps1
```

No ejecutar migraciones ni `EnsureCreated` para esta tabla. El contexto ya la
mapea; no es necesario generar modelos con scaffold para tres columnas
conocidas. Ambos proyectos están separados para no mezclar historiales.

## G. Verificaciones locales sin Supabase

```powershell
dotnet build 01-ef/ProductsEf
dotnet build 02-sql/ProductsSql
python verification/check_local.py
```

Estas verificaciones no prueban la conexión remota ni crean recursos en la nube.
