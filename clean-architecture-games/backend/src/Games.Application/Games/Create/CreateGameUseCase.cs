using Games.Application.Abstractions.Persistence;
using Games.Application.Mappers;
using Games.Domain.Entities;

namespace Games.Application.Games.Create;

public class CreateGameUseCase
{
    private readonly IGameRepository _gameRepository;

    public CreateGameUseCase(IGameRepository gameRepository)
    {
        _gameRepository = gameRepository;
    }

    public async Task<CreateGameResponse> ExecuteAsync(CreateGameRequest request, CancellationToken cancellationToken = default)
    {
        var game = new Game(
            request.Name,
            request.Genre,
            request.Developer,
            request.ReleaseYear,
            request.Price
        );

        var createdGame = await _gameRepository.AddAsync(game, cancellationToken);

        return createdGame.ToCreateResponse();
    }
}
