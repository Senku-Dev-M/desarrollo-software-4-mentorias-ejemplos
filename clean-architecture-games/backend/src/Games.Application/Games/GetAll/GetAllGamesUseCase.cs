using Games.Application.Abstractions.Persistence;
using Games.Application.Mappers;

namespace Games.Application.Games.GetAll;

public class GetAllGamesUseCase
{
    private readonly IGameRepository _gameRepository;

    public GetAllGamesUseCase(IGameRepository gameRepository)
    {
        _gameRepository = gameRepository;
    }

    public async Task<GetAllGamesResponse> ExecuteAsync(CancellationToken cancellationToken = default)
    {
        var games = await _gameRepository.GetAllAsync(cancellationToken);
        var dtos = games.Select(g => g.ToDto()).ToList();

        return new GetAllGamesResponse(dtos);
    }
}
