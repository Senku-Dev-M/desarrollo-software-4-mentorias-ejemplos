using Users.Application.Users.Models;
using Users.Domain.Entities;

namespace Users.Application.Users.Mappings;

internal static class UserMapper
{
    public static UserDto ToDto(User user)
    {
        return new UserDto(
            user.Id,
            user.Name.Value,
            user.Email.Value,
            user.CreatedAtUtc);
    }
}
