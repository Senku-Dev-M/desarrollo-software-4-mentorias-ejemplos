# Clean Architecture — Node.js + Express

Ejemplo didáctico equivalente a la API de usuarios en .NET incluida en este
repositorio. Conserva las mismas responsabilidades, reglas de dominio,
operaciones CRUD y respuestas HTTP, pero usa JavaScript, Node.js y Express 5.

## Capas

- `src/domain`: entidad `User`, objetos de valor `UserName` y `Email`, y reglas
  que no dependen de Express ni de la persistencia.
- `src/application`: casos de uso, comandos, DTO mapper y el puerto
  `UserRepository`.
- `src/infrastructure`: adaptador `InMemoryUserRepository` y un esqueleto del
  adaptador SQL, igual que en el ejemplo .NET.
- `src/api`: contratos HTTP, controller, rutas y traducción de errores a
  respuestas HTTP.
- `src/config`: Composition Root; aquí se conectan las implementaciones con los
  casos de uso.

La dirección principal de las dependencias es:

```text
API / Infrastructure -> Application -> Domain
```

## Equivalencias con .NET

| .NET | Node.js + Express |
| --- | --- |
| `User`, `UserName`, `Email` | Clases de dominio con las mismas reglas |
| `IUserRepository` | Clase abstracta `UserRepository` usada como puerto |
| Casos de uso registrados con DI | Casos de uso construidos en `createContainer` |
| `UsersController` y atributos de rutas | `UsersController` y `express.Router` |
| `Program.cs` | `src/app.js`, `src/config/createContainer.js` y `src/server.js` |
| `ArgumentException` | `DomainValidationError` |
| `UserEmailAlreadyExistsException` | `UserEmailAlreadyExistsError` |

## Reglas conservadas

- El nombre es obligatorio, se recorta y admite hasta 100 caracteres.
- El correo es obligatorio, se normaliza a minúsculas y debe tener formato
  válido.
- No se admiten dos usuarios con el mismo correo normalizado.
- Cada usuario recibe un UUID y una fecha UTC de creación.
- La persistencia activa es en memoria; los datos desaparecen al reiniciar.

## Ejecutar

Requiere Node.js 18 o superior.

```bash
npm install
npm start
```

La API queda disponible en `http://localhost:5000`. El archivo
`requests.http` contiene ejemplos para probar todos los endpoints.

## Probar

```bash
npm test
```

Las pruebas cubren las reglas de dominio, la unicidad del correo y el ciclo HTTP
completo de crear, consultar, actualizar, listar y eliminar un usuario.
