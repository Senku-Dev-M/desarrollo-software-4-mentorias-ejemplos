namespace Roles.Domain.Users;

public sealed record UserProfile(Guid Id, string DisplayName, UserRole Role);
