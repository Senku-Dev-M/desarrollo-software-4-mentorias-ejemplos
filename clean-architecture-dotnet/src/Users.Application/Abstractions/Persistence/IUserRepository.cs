using Users.Domain.Entities;
using Users.Domain.ValueObjects;

namespace Users.Application.Abstractions.Persistence;

public interface IUserRepository
{
    Task<IReadOnlyCollection<User>> GetAllAsync();
    Task<User?> GetByIdAsync(Guid id);
    Task<User?> GetByEmailAsync(Email email);
    Task AddAsync(User user);
    Task UpdateAsync(User user);
    Task DeleteAsync(Guid id);
}
