# Multi-stage Dockerfile for Games.Api (.NET 8)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files for layer caching
COPY ["Games.sln", "./"]
COPY ["src/Games.Domain/Games.Domain.csproj", "src/Games.Domain/"]
COPY ["src/Games.Application/Games.Application.csproj", "src/Games.Application/"]
COPY ["src/Games.Infrastructure/Games.Infrastructure.csproj", "src/Games.Infrastructure/"]
COPY ["src/Games.Api/Games.Api.csproj", "src/Games.Api/"]
COPY ["tests/Games.Application.Tests/Games.Application.Tests.csproj", "tests/Games.Application.Tests/"]

# Restore packages
RUN dotnet restore "Games.sln"

# Copy remaining source code
COPY . .

# Build
WORKDIR "/src/src/Games.Api"
RUN dotnet build "Games.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Games.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Games.Api.dll"]
