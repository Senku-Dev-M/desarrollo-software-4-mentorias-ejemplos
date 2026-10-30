# Games API - Clean Architecture (.NET 8)

Backend REST API for managing games using **Clean Architecture** and **SOLID** principles.

## Architecture Overview

```text
       ┌───────────────┐
       │   Games.Api   │
       └───────┬───────┘
               │
       ┌───────▼─────────────┐
       │  Games.Application  │◄────────┐
       └───────┬─────────────┘         │
               │               ┌───────┴──────────────┐
       ┌───────▼─────────────┐ │ Games.Infrastructure │
       │    Games.Domain     │ └──────────────────────┘
       └─────────────────────┘
```

- **Games.Domain**: Core enterprise rules, entities, and domain exceptions. No external dependencies.
- **Games.Application**: Use cases (CQRS/Single responsibility style), input/output contracts, and repository abstractions.
- **Games.Infrastructure**: PostgreSQL persistence using Entity Framework Core, Npgsql, entity configurations (`IEntityTypeConfiguration<T>`), and repository implementations.
- **Games.Api**: HTTP Controllers, Dependency Injection wiring, Global Exception Handling middleware, Swagger documentation, and CORS.

## Project Structure

```text
backend/
├── src/
│   ├── Games.Domain/
│   │   ├── Common/BaseEntity.cs
│   │   ├── Entities/Game.cs
│   │   └── Exceptions/
│   │       ├── DomainException.cs
│   │       └── EntityNotFoundException.cs
│   ├── Games.Application/
│   │   ├── Abstractions/Persistence/IGameRepository.cs
│   │   ├── DTOs/GameDto.cs
│   │   ├── Mappers/GameMapper.cs
│   │   ├── Games/
│   │   │   ├── Create/ (CreateGameRequest, CreateGameResponse, CreateGameUseCase)
│   │   │   ├── GetById/ (GetGameByIdResponse, GetGameByIdUseCase)
│   │   │   ├── GetAll/ (GetAllGamesResponse, GetAllGamesUseCase)
│   │   │   ├── Update/ (UpdateGameRequest, UpdateGameUseCase)
│   │   │   └── Delete/ (DeleteGameUseCase)
│   │   └── DependencyInjection.cs
│   ├── Games.Infrastructure/
│   │   ├── Persistence/
│   │   │   ├── AppDbContext.cs
│   │   │   ├── Configurations/GameConfiguration.cs
│   │   │   ├── Repositories/GameRepository.cs
│   │   │   └── Migrations/
│   │   └── DependencyInjection.cs
│   └── Games.Api/
│       ├── Controllers/GamesController.cs
│       ├── Middlewares/GlobalExceptionHandlerMiddleware.cs
│       ├── Program.cs
│       ├── appsettings.json
│       └── appsettings.Development.json
├── tests/
│   └── Games.Application.Tests/
├── Dockerfile
└── README.md
```

## Available Endpoints

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/api/games` | Returns list of all games | `200 OK` |
| `GET` | `/api/games/{id}` | Returns a single game by ID | `200 OK`, `404 Not Found` |
| `POST` | `/api/games` | Creates a new game | `201 Created`, `400 Bad Request` |
| `PUT` | `/api/games/{id}` | Updates an existing game | `204 No Content`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/api/games/{id}` | Deletes a game by ID | `204 No Content`, `404 Not Found` |

## Running Individually

### Prerequisites
- .NET 8 SDK
- PostgreSQL instance running on port 5432 (or Docker container)

### Commands
```bash
# Restore dependencies
dotnet restore Games.sln

# Run unit tests
dotnet test Games.sln

# Apply database migrations
dotnet ef database update --project src/Games.Infrastructure --startup-project src/Games.Api

# Run API
dotnet run --project src/Games.Api
```

Swagger UI will be available at:
`http://localhost:5000/swagger`
