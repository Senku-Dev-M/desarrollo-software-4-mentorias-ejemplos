using System.Collections.Concurrent;
using Users.Application.Abstractions.Persistence;
using Users.Domain.Entities;
using Users.Domain.ValueObjects;

namespace Users.Infrastructure.Persistence;

public sealed class InMemoryUserRepository : IUserRepository
{
    private readonly ConcurrentDictionary<Guid, User> _users = new();

    public Task<IReadOnlyCollection<User>> GetAllAsync()
    {
        IReadOnlyCollection<User> users = _users.Values
            .OrderBy(user => user.CreatedAtUtc)
            .ToArray();

        return Task.FromResult(users);
    }

    public Task<User?> GetByIdAsync(Guid id)
    {
        _users.TryGetValue(id, out var user);
        return Task.FromResult(user);
    }

    public Task<User?> GetByEmailAsync(Email email)
    {
        var user = _users.Values.FirstOrDefault(item => item.Email == email);
        return Task.FromResult(user);
    }

    public Task AddAsync(User user)
    {
        _users[user.Id] = user;
        return Task.CompletedTask;
    }

    public Task UpdateAsync(User user)
    {
        _users[user.Id] = user;
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Guid id)
    {
        _users.TryRemove(id, out _);
        return Task.CompletedTask;
    }
}
