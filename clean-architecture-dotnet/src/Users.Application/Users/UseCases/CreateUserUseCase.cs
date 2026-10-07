using Users.Application.Abstractions.Persistence;
using Users.Application.Users.Commands;
using Users.Application.Users.Exceptions;
using Users.Application.Users.Mappings;
using Users.Application.Users.Models;
using Users.Domain.Entities;

namespace Users.Application.Users.UseCases;

public sealed class CreateUserUseCase
{
    private readonly IUserRepository _userRepository;

    public CreateUserUseCase(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserDto> ExecuteAsync(CreateUserCommand command)
    {
        var user = User.Create(command.Name, command.Email);
        var existingUser = await _userRepository.GetByEmailAsync(user.Email);

        if (existingUser is not null)
        {
            throw new UserEmailAlreadyExistsException(user.Email.Value);
        }

        await _userRepository.AddAsync(user);
        
        return UserMapper.ToDto(user);
    }
}
