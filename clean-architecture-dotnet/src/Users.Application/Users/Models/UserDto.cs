namespace Users.Application.Users.Models;

public sealed record UserDto(
    Guid Id,
    string Name,
    string Email,
    DateTime CreatedAtUtc);
