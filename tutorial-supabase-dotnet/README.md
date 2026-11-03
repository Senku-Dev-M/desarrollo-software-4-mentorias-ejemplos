# Supabase + .NET: migraciones y SQL

## Guía principal

La documentación completa, paso a paso y con capturas está en
[`GUIA_COMPLETA_SUPABASE_DOTNET.md`](GUIA_COMPLETA_SUPABASE_DOTNET.md).

Cada proyecto también incluye documentación técnica independiente:

- [`01-ef/ProductsEf/README.md`](01-ef/ProductsEf/README.md): EF Core crea
  `public.products_ef` mediante una migración.
- [`02-sql/ProductsSql/README.md`](02-sql/ProductsSql/README.md): SQL Editor crea
  `public.products_sql` y EF Core utiliza la tabla existente.

**Estado de esta entrega: dos proyectos técnicos independientes, compilados y
documentados.** No se incluyen credenciales ni configuración de un proyecto
Supabase concreto.

## Archivos

- `01-ef/ProductsEf`: API mínima con migración para `public.products_ef`.
- `02-sql/ProductsSql`: API mínima independiente; utiliza `public.products_sql`
  creada desde SQL Editor, sin carpeta de migraciones.
- `sql/products.sql`: creación manual de la segunda tabla.
- `sql/verificar.sql`: consultas de comprobación tras completar ambos métodos.
- [Comandos y configuración](docs/comandos.md).
- `scripts/configurar-conexion.ps1`: entrada oculta para User Secrets.
- `scripts/probar-api.ps1`: insertar, exigir HTTP 201 y comprobar lectura del ID.
- `verification`: comprobaciones locales, sin base de datos remota.

## Requisitos

.NET SDK 10.0.401 o parche compatible, PowerShell, VS Code y una cuenta Supabase
con cupo gratuito. Para las verificaciones locales adicionales y el proceso de
edición: Python 3.12 y FFmpeg. Las aplicaciones no necesitan Docker, PostgreSQL
local, SDK de Supabase ni API keys.

Versiones fijadas: EF Core, Relational y Design 10.0.14; dotnet-ef 10.0.14;
Npgsql y su proveedor EF 10.0.3. Se incluyen los archivos `packages.lock.json`.

## Repetir la práctica en un proyecto remoto

1. Abrir Supabase Dashboard y elegir **Qatu SD4**, plan Free.
2. Pulsar **New project**; nombre `tutorial-supabase-dotnet`.
3. Preparar y guardar la contraseña PostgreSQL fuera de captura.
4. Elegir São Paulo si está disponible; en otro caso Americas.
5. No conectar GitHub. No se necesita Data API para esta práctica. Desactivar
   la exposición automática de tablas y habilitar RLS en las tablas nuevas.
6. Revisar que no implique pagos y pulsar **Create new project**.
7. Esperar a que esté disponible. Si no hay cupo gratuito, detener esta parte:
   no borrar proyectos ni contratar recursos para continuar.

Los nombres se observaron en el formulario real; confirmar su ubicación al
grabar, porque Supabase puede actualizar su Dashboard.

## Encontrar y proteger la conexión

Abrir **Connect** y seleccionar **Session pooler**. Copiar sus valores reales de
host, puerto, base y usuario. No fabricar el host desde la región. El usuario
del pooler incluye el identificador del proyecto. La contraseña es la de
PostgreSQL, no la de la cuenta ni una API key.

En **Database > Settings**, descargar el certificado público y configurar
`SSL Mode=VerifyFull` y `Root Certificate` con su ruta absoluta. No desactivar la
validación TLS para resolver un error. El certificado público puede guardarse
en `certs/`; no es una clave privada. Se omite del paquete porque debe
descargarse del proyecto real que se utilice.

Seguir [comandos.md](docs/comandos.md) para configurar User Secrets, aplicar la
migración del primer método y ejecutar cada aplicación sucesivamente en
`http://localhost:5080`.

## Qué cambia entre los métodos

| Responsabilidad | Método EF | Método SQL |
|---|---|---|
| Crear estructura | Migración de EF Core | Script en SQL Editor |
| Tabla de ejemplo | `products_ef` | `products_sql` |
| Acceso desde .NET | EF Core + Npgsql | EF Core + Npgsql |
| Conexión | Session pooler | Session pooler |
| Historial EF | `__EFMigrationsHistory` | No administra esta tabla |

Flujo de datos: `.NET → EF Core → Npgsql → Session pooler → PostgreSQL`.
El pooler administra conexiones; no crea las tablas. El SDK de Supabase habla
con servicios HTTP y constituye otra forma de acceso.

Supabase recomienda conexión directa para migraciones. El tutorial enseña el
pooler de sesión como alternativa para IPv4 y recuerda comprobarlo antes de
aplicar una migración. No usar el pooler de transacciones para este paso.

## Límites de la práctica

API solo local, sin autenticación de usuarios ni despliegue. La demostración
usaría el usuario administrativo PostgreSQL para mantener el ejemplo pequeño.
Sus privilegios pueden omitir RLS: no equivalen a las políticas de un usuario
final. En producción separar el rol que aplica migraciones del rol con los
privilegios mínimos que utiliza la aplicación. User Secrets es para desarrollo
y su archivo no está cifrado.

La API valida nombre obligatorio de hasta 120 caracteres y precios entre cero
y 99999999.99 con hasta dos decimales. No crea estructuras al iniciar. El POST
devuelve 201 con el producto; el GET devuelve una lista ordenada por ID.

## Fuentes consultadas

- [Conexiones PostgreSQL y poolers](https://supabase.com/docs/guides/database/connecting-to-postgres).
- [Cambios recientes de Supabase](https://supabase.com/changelog).
- [Proveedor Npgsql para EF Core](https://www.npgsql.org/efcore/).
- [Paquete Npgsql EF 10.0.3](https://www.nuget.org/packages/Npgsql.EntityFrameworkCore.PostgreSQL/10.0.3).
- [Migraciones de EF Core](https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/).
- [User Secrets](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets).
- [TLS con Npgsql](https://www.npgsql.org/doc/security.html).
