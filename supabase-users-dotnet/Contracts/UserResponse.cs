namespace SupabaseUsersDemo.Contracts;

public sealed record UserResponse(
    Guid Id,
    string Name,
    string Email,
    string? AvatarUrl,
    DateTimeOffset? CreatedAt);
