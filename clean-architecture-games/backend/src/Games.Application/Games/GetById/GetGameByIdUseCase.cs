using Games.Application.Abstractions.Persistence;
using Games.Application.Mappers;
using Games.Domain.Entities;
using Games.Domain.Exceptions;

namespace Games.Application.Games.GetById;

public class GetGameByIdUseCase
{
    private readonly IGameRepository _gameRepository;

    public GetGameByIdUseCase(IGameRepository gameRepository)
    {
        _gameRepository = gameRepository;
    }

    public async Task<GetGameByIdResponse> ExecuteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var game = await _gameRepository.GetByIdAsync(id, cancellationToken);

        if (game is null)
        {
            throw new EntityNotFoundException(nameof(Game), id);
        }

        return game.ToGetByIdResponse();
    }
}
