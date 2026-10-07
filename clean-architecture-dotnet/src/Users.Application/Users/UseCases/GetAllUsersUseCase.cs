using Users.Application.Abstractions.Persistence;
using Users.Application.Users.Mappings;
using Users.Application.Users.Models;

namespace Users.Application.Users.UseCases;

public sealed class GetAllUsersUseCase
{
    private readonly IUserRepository _userRepository;

    public GetAllUsersUseCase(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<IReadOnlyCollection<UserDto>> ExecuteAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return users.Select(UserMapper.ToDto).ToArray();
    }
}
