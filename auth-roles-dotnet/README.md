# Umbral · Middleware de autenticación en C#

Sigue el recorrido de un token Bearer desde el middleware hasta la política
de cada endpoint. Implementa la validación con Supabase Auth y la consulta
del rol en `public.users`.

## Dónde empezar

| Capa | Revisa |
| --- | --- |
| API | [Middleware](src/Roles.Api/Authentication/BearerAuthenticationMiddleware.cs): lee el encabezado, crea el principal y llama a `next(context)` cuando corresponde. |
| Application | [ResolveAuthenticatedUser](src/Roles.Application/Users/ResolveAuthenticatedUser.cs): coordina las dos operaciones; si el token es inválido, no consulta la tabla. |
| Infrastructure | [Verificador de Supabase](src/Roles.Infrastructure/Supabase/SupabaseAccessTokenVerifier.cs) y [repositorio de perfiles](src/Roles.Infrastructure/Supabase/SupabaseUserProfileRepository.cs): métodos pendientes con comentarios en el lugar donde va el código. |
| Domain | [UserRole](src/Roles.Domain/Users/UserRole.cs) y [UserProfile](src/Roles.Domain/Users/UserProfile.cs): representan los roles y el perfil de la aplicación. |

## Completar la autenticación

1. **Leer el Bearer.** La SPA envía `Authorization: Bearer <access_token>`.
   El middleware extrae el valor y llama a `ResolveAuthenticatedUser`.
2. **Validar la identidad.** Implementa `VerifyAsync` en
   `SupabaseAccessTokenVerifier`. Llama a
   [`GET /auth/v1/user` de Supabase Auth](https://supabase.com/docs/guides/auth/jwts#verifying-a-jwt-from-supabase)
   con el Bearer y la clave publicable del proyecto en `apikey`. Devuelve el
   UUID confirmado por Auth, o `null` si el proveedor rechaza el token.
3. **Cargar el rol.** Implementa `FindByAuthIdAsync` en
   `SupabaseUserProfileRepository`. En la base de datos del mismo proyecto,
   consulta `public.users` por el UUID confirmado. El ejemplo asume que
   `public.users.id` corresponde a `auth.users.id` y lee `display_name` y
   `role` (`admin`, `seller`, `buyer`). Si en tu esquema el vínculo está en
   otra columna, cambia la consulta. El rol de la aplicación viene de la
   tabla, no del cuerpo de la solicitud ni del claim técnico `role` del JWT.
4. **Autorizar la ruta.** El middleware asigna `HttpContext.User` y llama a
   `next(context)`. [Program.cs](src/Roles.Api/Program.cs) registra el
   middleware después de routing y CORS, antes de `UseAuthorization()`.
   Los endpoints aplican su política con `RequireAuthorization(...)`.

Usa el fragmento de C# debajo de cada `TODO`. Registra también el `HttpClient` y la
conexión PostgreSQL que utilices. Si expones la tabla de perfiles por la
Data API, aplica [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
y evita que un usuario pueda cambiar su propio rol.

## Rutas y respuestas

| Ejemplo de ruta | Permiso |
| --- | --- |
| `GET /health` | Público |
| `GET /api/me` y `GET /api/catalog` | Cualquier perfil autenticado |
| `GET /api/admin/analytics` | Administrador |
| `GET, POST /api/seller/products` y `PUT, DELETE /api/seller/products/{id}` | Vendedor |
| `GET /api/buyer/available-products` | Comprador |

[AuthProblems.cs](src/Roles.Api/Authentication/AuthProblems.cs) construye las
respuestas en formato `ProblemDetails`, con `title`, `status` y `detail`:

- **401:** falta el encabezado, es inválido o el emisor rechaza el token.
  Incluye `WWW-Authenticate: Bearer`.
- **403:** el token es válido pero falta un perfil autorizado, o el rol no
  cumple la política de la ruta.
- **501:** se llegó a un método pendiente de implementación.

Para conectar los endpoints de productos, implementa el
[repositorio de productos](src/Roles.Infrastructure/Products/ProductRepository.cs).
Revisa cómo los casos de uso de edición y eliminación comparan el vendedor
del producto con el usuario autenticado.

## Comprobación local

Desde la carpeta del backend, con el SDK de .NET 10:

```powershell
dotnet run --project src/Roles.Api
```

En otra terminal, puedes observar el `200` de la ruta pública y el `401`
del middleware sin configurar Supabase:

```powershell
curl.exe -i http://127.0.0.1:5188/health
curl.exe -i http://127.0.0.1:5188/api/me
```

Con un Bearer bien formado, la solicitud llega al método pendiente y por
ahora devuelve `501`. Para comprobar un `403` por rol necesitas completar
la integración y enviar el token válido de un usuario con un rol distinto
al que exige la ruta.
