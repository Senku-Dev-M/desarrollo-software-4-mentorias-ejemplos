# Desarrollo de Software 4 — Mentorías y ejemplos

Repositorio de ejemplos didácticos para las mentorías de Desarrollo de
Software 4. Cada proyecto presenta un concepto de arquitectura o desarrollo de
interfaces mediante una implementación pequeña, ejecutable y fácil de explicar.

## Ejemplos disponibles

| Proyecto | Tecnología | Descripción |
| --- | --- | --- |
| [`clean-architecture-dotnet`](./clean-architecture-dotnet) | .NET 10 / ASP.NET Core | API CRUD de usuarios organizada con Clean Architecture. |
| [`clean-architecture-node`](./clean-architecture-node) | Node.js / Express 5 | Equivalente JavaScript de la misma API y arquitectura. |
| [`mvvm-rick-and-morty`](./mvvm-rick-and-morty) | Vanilla JavaScript / Vite | Explorador de personajes que demuestra el patrón MVVM. |
| [`ui-components-vanilla`](./ui-components-vanilla) | HTML / CSS / Vanilla JavaScript | Catálogo de juegos para aprender componentes, páginas y reutilización. |
| [`chat-websockets`](./chat-websockets) | C# / WebSockets / Vanilla JavaScript | Chat independiente con gestión manual de conexiones y mensajes JSON. |
| [`chat-signalr`](./chat-signalr) | C# / SignalR / Vanilla JavaScript | Chat independiente con Hub, eventos y reconexión configurada. |
| [`poc-postgres-crud`](./poc-postgres-crud) | C# / Npgsql / PostgreSQL en Supabase | CRUD tradicional con SQL parametrizado, sin SDK Supabase. |
| [`poc-storage-upload`](./poc-storage-upload) | C# / HttpClient / Supabase Storage | Subida de imagen a un bucket público y devolución de su URL, sin SDK. |
| [`supabase-users-dotnet`](./supabase-users-dotnet) | C# / SDK Supabase / Database + Storage | CRUD de usuarios con avatar en bucket privado y URL firmada temporal. |

Los ejemplos de Clean Architecture incluyen:

- entidad `User` y objetos de valor para nombre y correo;
- casos de uso para crear, listar, consultar, actualizar y eliminar usuarios;
- validación de reglas de dominio y correos únicos;
- un puerto de persistencia con implementación en memoria;
- una API HTTP con los mismos endpoints y códigos de respuesta.

## Objetivo

El propósito es estudiar conceptos de diseño de software mediante ejemplos
pequeños y ejecutables. Los proyectos de Clean Architecture permiten comparar
la misma solución en .NET y Node.js; los proyectos de interfaz muestran MVVM y
composición de componentes con JavaScript vanilla.

Cada carpeta contiene su propio `README.md` con instrucciones de ejecución y
detalles de la implementación.

## Ruta sugerida para los nuevos ejemplos

Estas carpetas son proyectos independientes dentro del monorepo, no submódulos Git.
No necesitas ejecutar todo a la vez. Cada backend sirve su propio frontend desde
`wwwroot`; abre su URL, no el HTML por doble clic.

| Para aprender | Empieza por | Ejecución desde su carpeta |
| --- | --- | --- |
| WebSockets desde cero | `chat-websockets/Program.cs` y `WebSockets/WebSocketChat.cs` | `dotnet run --urls http://127.0.0.1:4185` |
| La misma idea con SignalR | `chat-signalr/Program.cs` y `Hubs/ChatHub.cs` | `dotnet run --urls http://127.0.0.1:4186` |
| SQL tradicional contra una DB en la nube | `poc-postgres-crud/README.md` | Configura `.env` y tabla; `dotnet run --urls http://127.0.0.1:4182` |
| Subir una imagen y obtener un enlace público | `poc-storage-upload/README.md` | Configura `.env` y bucket; `dotnet run --urls http://127.0.0.1:4183` |
| Combinar datos e imágenes con el SDK | `supabase-users-dotnet/README.md` | Configura `.env`, tabla y bucket; `dotnet run --urls http://127.0.0.1:4180` |

Requieren .NET SDK 10. Los chats no requieren Node.js ni npm; SignalR descarga
su cliente JavaScript desde un CDN con versión fija, por lo que necesita Internet.
Para probarlos abre **dos pestañas del mismo chat**, conecta ambas y envía mensajes.
Los README de cada ejemplo explican los métodos, el recorrido de los datos,
la configuración y una prueba manual desde su frontend.

Los dos POCs separan `Models`, `Controllers`, `Services` y `Repositories`:
el controlador recibe HTTP, el servicio valida y coordina, y el repositorio
se comunica con PostgreSQL o Storage. El ejemplo SDK conserva su estructura
anterior más compacta para comparar enfoques.

## Configuración y seguridad

- Los ejemplos Supabase pueden usar un mismo proyecto Cloud gratuito; cada uno
  explica qué tabla o bucket necesita y dónde obtener sus variables.
- Copia `.env.example` a `.env` solo si todavía no existe; completa tus propias
  credenciales. No se publican archivos `.env` reales, contraseñas ni secret keys.
- Las claves administrativas permanecen en C#, nunca en `wwwroot` ni en el navegador.
- El POC de Storage devuelve una URL pública; el ejemplo SDK usa bucket privado
  y URLs firmadas que caducan. No son equivalentes en privacidad.
- `poc-postgres-crud/certs` contiene un certificado **público**, no una clave privada.
- Revisa Usage y las condiciones actuales del plan; no actives add-ons de pago
  para seguir la práctica. Las guías de Supabase enlazan sus fuentes oficiales.
- Son ejercicios locales sin login, no servicios listos para exponer en Internet.

Se conservan únicamente los archivos necesarios para ejecutar y entender cada
ejemplo, sus guías y las capturas didácticas. Los archivos generados (`bin`, `obj`,
`node_modules`) y la configuración privada quedan fuera de Git. Los cinco ejemplos
anteriores no incluyen herramientas auxiliares de pruebas o scripts de copia.
