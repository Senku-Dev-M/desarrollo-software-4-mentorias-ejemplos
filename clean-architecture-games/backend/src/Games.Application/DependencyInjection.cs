using Games.Application.Games.Create;
using Games.Application.Games.Delete;
using Games.Application.Games.GetAll;
using Games.Application.Games.GetById;
using Games.Application.Games.Update;
using Microsoft.Extensions.DependencyInjection;

namespace Games.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<CreateGameUseCase>();
        services.AddScoped<GetGameByIdUseCase>();
        services.AddScoped<GetAllGamesUseCase>();
        services.AddScoped<UpdateGameUseCase>();
        services.AddScoped<DeleteGameUseCase>();

        return services;
    }
}
