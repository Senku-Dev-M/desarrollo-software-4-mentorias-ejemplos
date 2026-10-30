using Games.Application.DTOs;
using Games.Application.Games.Create;
using Games.Application.Games.GetById;
using Games.Domain.Entities;

namespace Games.Application.Mappers;

public static class GameMapper
{
    public static GameDto ToDto(this Game game)
    {
        return new GameDto(
            game.Id,
            game.Name,
            game.Genre,
            game.Developer,
            game.ReleaseYear,
            game.Price,
            game.CreatedAt,
            game.UpdatedAt
        );
    }

    public static CreateGameResponse ToCreateResponse(this Game game)
    {
        return new CreateGameResponse(
            game.Id,
            game.Name,
            game.Genre,
            game.Developer,
            game.ReleaseYear,
            game.Price,
            game.CreatedAt
        );
    }

    public static GetGameByIdResponse ToGetByIdResponse(this Game game)
    {
        return new GetGameByIdResponse(
            game.Id,
            game.Name,
            game.Genre,
            game.Developer,
            game.ReleaseYear,
            game.Price,
            game.CreatedAt,
            game.UpdatedAt
        );
    }
}
