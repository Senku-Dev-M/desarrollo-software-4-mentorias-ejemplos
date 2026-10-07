# Desarrollo de Software 4 — Mentorías y ejemplos

Repositorio de ejemplos didácticos para las mentorías de Desarrollo de
Software 4. Cada proyecto muestra el mismo caso de uso con una tecnología
diferente para facilitar la comparación de conceptos y decisiones de diseño.

## Ejemplos disponibles

| Proyecto | Tecnología | Descripción |
| --- | --- | --- |
| [`clean-architecture-dotnet`](./clean-architecture-dotnet) | .NET 10 / ASP.NET Core | API CRUD de usuarios organizada con Clean Architecture. |
| [`clean-architecture-node`](./clean-architecture-node) | Node.js / Express 5 | Equivalente JavaScript de la misma API y arquitectura. |

Ambos ejemplos incluyen:

- entidad `User` y objetos de valor para nombre y correo;
- casos de uso para crear, listar, consultar, actualizar y eliminar usuarios;
- validación de reglas de dominio y correos únicos;
- un puerto de persistencia con implementación en memoria;
- una API HTTP con los mismos endpoints y códigos de respuesta.

## Objetivo

El propósito es comparar cómo se expresan las mismas ideas de Clean
Architecture en diferentes ecosistemas, manteniendo ejemplos pequeños,
ejecutables y fáciles de explicar durante una mentoría.

Cada carpeta contiene su propio `README.md` con instrucciones de ejecución y
detalles de la implementación.
