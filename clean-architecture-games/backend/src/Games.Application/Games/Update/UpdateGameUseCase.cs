using Games.Application.Abstractions.Persistence;
using Games.Domain.Entities;
using Games.Domain.Exceptions;

namespace Games.Application.Games.Update;

public class UpdateGameUseCase
{
    private readonly IGameRepository _gameRepository;

    public UpdateGameUseCase(IGameRepository gameRepository)
    {
        _gameRepository = gameRepository;
    }

    public async Task ExecuteAsync(Guid id, UpdateGameRequest request, CancellationToken cancellationToken = default)
    {
        var game = await _gameRepository.GetByIdAsync(id, cancellationToken);

        if (game is null)
        {
            throw new EntityNotFoundException(nameof(Game), id);
        }

        game.Update(
            request.Name,
            request.Genre,
            request.Developer,
            request.ReleaseYear,
            request.Price
        );

        await _gameRepository.UpdateAsync(game, cancellationToken);
    }
}
