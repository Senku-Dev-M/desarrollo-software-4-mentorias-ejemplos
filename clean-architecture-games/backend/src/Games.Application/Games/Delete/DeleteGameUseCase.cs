using Games.Application.Abstractions.Persistence;
using Games.Domain.Entities;
using Games.Domain.Exceptions;

namespace Games.Application.Games.Delete;

public class DeleteGameUseCase
{
    private readonly IGameRepository _gameRepository;

    public DeleteGameUseCase(IGameRepository gameRepository)
    {
        _gameRepository = gameRepository;
    }

    public async Task ExecuteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var game = await _gameRepository.GetByIdAsync(id, cancellationToken);

        if (game is null)
        {
            throw new EntityNotFoundException(nameof(Game), id);
        }

        await _gameRepository.DeleteAsync(game, cancellationToken);
    }
}
