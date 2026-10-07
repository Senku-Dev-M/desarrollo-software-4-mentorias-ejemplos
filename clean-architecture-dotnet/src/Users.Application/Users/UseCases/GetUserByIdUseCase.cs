using Users.Application.Abstractions.Persistence;
using Users.Application.Users.Mappings;
using Users.Application.Users.Models;

namespace Users.Application.Users.UseCases;

public sealed class GetUserByIdUseCase
{
    private readonly IUserRepository _userRepository;

    public GetUserByIdUseCase(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserDto?> ExecuteAsync(Guid id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        return user is null ? null : UserMapper.ToDto(user);
    }
}
