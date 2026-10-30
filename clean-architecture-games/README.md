# Clean Architecture Games

Solución completa para la gestión de videojuegos que implementa **Clean Architecture** y principios **SOLID** en el backend (.NET 8) y una **Single Page Application (SPA)** con arquitectura **MVVM (Model - View - ViewModel)** en el frontend utilizando exclusivamente **HTML5, CSS3 y JavaScript Vanilla (ES Modules)**.

El backend y el frontend son aplicaciones **100% independientes y desacopladas**, diseñadas para poder ejecutarse de forma manual en terminales o entornos separados, **configuradas exclusivamente por variables de entorno sin valores hardcodeados**.

---

## 🏛️ 1. Arquitectura General del Sistema

```text
 Browser (Usuario)
    │
    ├────────────────────────► Frontend SPA (:8080)
    │                          (Vanilla JS + Hash Router + MVVM)
    │                          Servido de forma manual e independiente
    │                          Configurado por variable de entorno: API_BASE_URL
    │                          Consume directamente la API mediante HTTP Fetch
    │
    └────────────────────────► Backend REST API (:5000)
                               (ASP.NET Core 8 - Clean Architecture)
                               Configurado por variable: ConnectionStrings__DefaultConnection
                                    │
                                    ▼ EF Core / Npgsql
                               PostgreSQL (:5432)
```

> [!IMPORTANT]
> **Sin Hardcoding & Sin NGINX:** El frontend y el backend se configuran mediante variables de entorno (`API_BASE_URL` en el frontend y `ConnectionStrings__DefaultConnection` en el backend). No están unidos por reverse proxies ni reescrituras internas.

---

## 📂 2. Estructura del Proyecto

```text
clean-architecture-games/
├── docker-compose.yml                 # Orquestación de infraestructura (Postgres & API)
├── .env.example                       # Plantilla de variables de entorno global
├── .gitignore
├── README.md
│
├── backend/
│   ├── Dockerfile                     # Multi-stage build para .NET 8
│   ├── Games.sln
│   ├── Games.slnx
│   ├── README.md
│   │
│   ├── src/
│   │   ├── Games.Domain/              # Capa de Dominio (Cero dependencias)
│   │   │   ├── Common/BaseEntity.cs
│   │   │   ├── Entities/Game.cs
│   │   │   └── Exceptions/
│   │   │       ├── DomainException.cs
│   │   │       └── EntityNotFoundException.cs
│   │   │
│   │   ├── Games.Application/         # Capa de Aplicación (Casos de uso SRP)
│   │   │   ├── Abstractions/Persistence/IGameRepository.cs
│   │   │   ├── DTOs/GameDto.cs
│   │   │   ├── Mappers/GameMapper.cs
│   │   │   ├── Games/
│   │   │   │   ├── Create/ (CreateGameRequest, CreateGameResponse, CreateGameUseCase)
│   │   │   │   ├── GetById/ (GetGameByIdResponse, GetGameByIdUseCase)
│   │   │   │   ├── GetAll/ (GetAllGamesResponse, GetAllGamesUseCase)
│   │   │   │   ├── Update/ (UpdateGameRequest, UpdateGameUseCase)
│   │   │   │   └── Delete/ (DeleteGameUseCase)
│   │   │   └── DependencyInjection.cs
│   │   │
│   │   ├── Games.Infrastructure/      # Capa de Infraestructura (EF Core & Npgsql)
│   │   │   ├── Persistence/
│   │   │   │   ├── AppDbContext.cs
│   │   │   │   ├── Configurations/GameConfiguration.cs  # IEntityTypeConfiguration<Game>
│   │   │   │   ├── Repositories/GameRepository.cs
│   │   │   │   └── Migrations/
│   │   │   └── DependencyInjection.cs
│   │   │
│   │   └── Games.Api/                 # Capa de Presentación HTTP & Swagger
│   │       ├── Controllers/GamesController.cs
│   │       ├── Middlewares/GlobalExceptionHandlerMiddleware.cs
│   │       ├── Program.cs
│   │       ├── appsettings.json
│   │       └── appsettings.Development.json
│   │
│   └── tests/
│       └── Games.Application.Tests/   # Pruebas unitarias de casos de uso (xUnit, Moq, FluentAssertions)
│           ├── CreateGameUseCaseTests.cs
│           ├── GetGameByIdUseCaseTests.cs
│           ├── GetAllGamesUseCaseTests.cs
│           ├── UpdateGameUseCaseTests.cs
│           └── DeleteGameUseCaseTests.cs
│
└── frontend/                          # SPA en Vanilla JS con Vite
    ├── index.html                     # Archivo HTML único
    ├── package.json                   # Scripts de Vite (npm run dev)
    ├── vite.config.js                 # Configuración de Vite (puerto 8080)
    ├── .env                           # Configuración activa (VITE_API_BASE_URL)
    ├── .env.example                   # Plantilla de variables de entorno
    ├── README.md
    └── src/
        ├── components/                # Componentes reutilizables
        │   ├── GameCard.js            # Tarjeta con acciones y enlaces SPA
        │   ├── Modal.js               # Diálogo modal reutilizable
        │   ├── Navbar.js              # Header con enlaces y rutas activas
        │   └── Toast.js               # Notificaciones flotantes
        ├── config/
        │   └── config.js              # Lee la variable de entorno API_BASE_URL
        ├── models/
        │   └── Game.js                # Modelo de datos y validaciones
        ├── pages/                     # Páginas SPA gestionadas por el Router
        │   ├── CatalogPage.js         # #/ o #/games
        │   ├── GameDetailPage.js      # #/games/:id
        │   └── GameFormPage.js        # #/games/new y #/games/:id/edit
        ├── router/
        │   └── Router.js              # Router SPA en Vanilla JS (Hash Routing)
        ├── services/
        │   └── GameApiService.js      # Servicio HTTP fetch aislado
        ├── styles/
        │   ├── base.css
        │   ├── components.css
        │   ├── layout.css
        │   └── pages.css
        ├── viewmodels/                # ViewModels MVVM
        │   ├── GameDetailsViewModel.js
        │   ├── GameFormViewModel.js
        │   └── GameListViewModel.js
        └── main.js                    # Bootstrapper del frontend
```

---

## 🧭 3. Rutas de la SPA Frontend

El frontend implementa navegación instantánea mediante **Hash Routing** (`window.location.hash`), lo que permite que funcione en cualquier servidor web sin requerir reescrituras de URL:

| Ruta | Pantalla | Descripción |
|---|---|---|
| `#/` o `#/games` | `CatalogPage` | Catálogo de juegos, búsqueda, filtro por género, contador y eliminación |
| `#/games/new` | `GameFormPage` | Formulario de creación con validación reactiva en tiempo real |
| `#/games/:id` | `GameDetailPage` | Ficha técnica completa del juego (precio, año, desarrollador, UUID) |
| `#/games/:id/edit` | `GameFormPage` | Formulario de edición precargado con datos del juego |

---

## 🚀 4. Guía de Ejecución

### 1. Iniciar Base de Datos PostgreSQL
```bash
docker run -d --name games_postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=gamesdb -p 5432:5432 postgres:16-alpine
```

### 2. Iniciar el Backend (.NET 8)
En una terminal:
```bash
cd clean-architecture-games/backend

# Compilar y correr pruebas
dotnet test Games.sln

# Aplicar migraciones en PostgreSQL
dotnet ef database update --project src/Games.Infrastructure --startup-project src/Games.Api

# Iniciar la API
dotnet run --project src/Games.Api --launch-profile http
```
El backend estará disponible en:
- API: [http://localhost:5000/api/games](http://localhost:5000/api/games)
- Swagger: [http://localhost:5000/swagger](http://localhost:5000/swagger)

### 3. Iniciar el Frontend SPA (Vite)
En otra terminal separada:
```bash
cd clean-architecture-games/frontend
npm run dev
```
*(Vite carga automáticamente el archivo `frontend/.env` e inyecta `VITE_API_BASE_URL`)*

Abre en tu navegador:
👉 [http://localhost:8080](http://localhost:8080)

---

## 🌐 5. Endpoints de la API REST

| Método | Ruta | Status Code | Descripción |
|---|---|---|---|
| `GET` | `/api/games` | `200 OK` | Obtiene la lista completa de videojuegos |
| `GET` | `/api/games/{id}` | `200 OK`, `404 Not Found` | Obtiene un videojuego por su UUID |
| `POST` | `/api/games` | `201 Created`, `400 Bad Request` | Crea un nuevo videojuego |
| `PUT` | `/api/games/{id}` | `204 No Content`, `400 Bad Request`, `404 Not Found` | Actualiza un videojuego existente |
| `DELETE` | `/api/games/{id}` | `204 No Content`, `404 Not Found` | Elimina un videojuego por su UUID |

---

## 🧪 6. Pruebas Unitarias del Backend

```bash
cd clean-architecture-games/backend
dotnet test Games.sln
```

Las 15 pruebas unitarias verifican los 5 casos de uso de la capa de aplicación con aserciones rigurosas y mocks de persistencia.
