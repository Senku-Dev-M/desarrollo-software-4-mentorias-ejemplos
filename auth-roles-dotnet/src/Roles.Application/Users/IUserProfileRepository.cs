using Roles.Domain.Users;

namespace Roles.Application.Users;

public interface IUserProfileRepository
{
    Task<UserProfile?> FindByAuthIdAsync(Guid verifiedUserId, CancellationToken cancellationToken);
}
