using Games.Application.Abstractions.Persistence;
using Games.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Games.Infrastructure.Persistence.Repositories;

public class GameRepository : IGameRepository
{
    private readonly AppDbContext _dbContext;

    public GameRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<Game>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Games
            .AsNoTracking()
            .OrderByDescending(g => g.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<Game?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Games
            .FirstOrDefaultAsync(g => g.Id == id, cancellationToken);
    }

    public async Task<Game> AddAsync(Game game, CancellationToken cancellationToken = default)
    {
        await _dbContext.Games.AddAsync(game, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return game;
    }

    public async Task UpdateAsync(Game game, CancellationToken cancellationToken = default)
    {
        _dbContext.Games.Update(game);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Game game, CancellationToken cancellationToken = default)
    {
        _dbContext.Games.Remove(game);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Games
            .AnyAsync(g => g.Id == id, cancellationToken);
    }
}
