# Clean Architecture — .NET

Ejemplo didáctico de una API de usuarios en .NET 10 organizada con Clean Architecture.

## Capas

- `Users.Domain`: Entity `User` y Value Objects `UserName` y `Email`.
- `Users.Application`: casos de uso, DTOs, mapper e interfaz `IUserRepository`.
- `Users.Infrastructure`: implementación `InMemoryUserRepository`.
- `Users.Api`: contratos HTTP, controller y Composition Root.

## Ejecutar

```bash
dotnet restore
dotnet build UsersApi.sln
dotnet run --project src/Users.Api --urls http://localhost:5000
```

Luego puede utilizarse `src/Users.Api/Users.Api.http` para probar los endpoints.

> Nota: la persistencia es únicamente en memoria. Los datos desaparecen al reiniciar la API.
