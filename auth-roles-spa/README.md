# Umbral · Rutas por rol en JavaScript

## Arranque

En esta carpeta, ejecuta:

```powershell
npm ci
npm run dev
```

Abre [http://127.0.0.1:5178](http://127.0.0.1:5178). La API usa el puerto
5188. Para cambiar su dirección, copia [`.env.example`](.env.example) a
`.env` y ajusta `VITE_API_URL`.

## Inicio de sesión y permisos

1. Agrega `@supabase/supabase-js` y configura `VITE_SUPABASE_URL` y
   `VITE_SUPABASE_PUBLISHABLE_KEY` en `.env`. En
   [`auth.js`](src/services/auth.js), implementa los tres
   métodos de sesión siguiendo los fragmentos bajo cada `TODO`:
   [iniciar sesión](https://supabase.com/docs/reference/javascript/auth-signinwithpassword),
   [leer la sesión](https://supabase.com/docs/reference/javascript/auth-getsession)
   y [cerrarla](https://supabase.com/docs/reference/javascript/auth-signout).
2. Envía el token de acceso como `Authorization: Bearer <access_token>`.
   Revisa cómo lo adjunta [`api.js`](src/services/api.js) y cómo
   `auth.profile` consulta `GET /api/me` para obtener el rol de la API.
3. Revisa [`routes.js`](src/routes/routes.js) para ver quién puede abrir
   cada ruta y [`router.js`](src/routes/router.js) para ver cuándo se
   verifica la sesión. Las comprobaciones del navegador controlan la
   navegación; las políticas del backend controlan el acceso a los datos.

| Vista | Ruta | Acceso |
| --- | --- | --- |
| Inicio de sesión | `#/login` | Público |
| Catálogo general | `#/catalogo` | Cualquier perfil autenticado |
| Analytics | `#/analytics` | Administrador |
| Mis productos | `#/inventario` | Vendedor |
| Disponibles | `#/disponibles` | Comprador |

## Comprobaciones

- Abre `/#/analytics` sin sesión y comprueba que te lleve al login.
- Tras conectar [la API](../auth-roles-dotnet/README.md), comprueba que un
  administrador puede abrir Analytics y un comprador ve **Acceso denegado**
  al entrar con el mismo enlace.
- Cierra sesión e intenta volver a una vista protegida. Comprueba que el
  navegador vuelve al login.
