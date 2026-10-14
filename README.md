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
