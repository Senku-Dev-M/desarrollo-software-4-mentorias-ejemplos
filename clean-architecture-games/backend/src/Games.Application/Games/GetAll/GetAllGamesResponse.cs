using Games.Application.DTOs;

namespace Games.Application.Games.GetAll;

public record GetAllGamesResponse(
    IReadOnlyList<GameDto> Games
);
