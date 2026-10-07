using Users.Application.Abstractions.Persistence;
using Users.Application.Users.Commands;
using Users.Application.Users.Exceptions;
using Users.Application.Users.Mappings;
using Users.Application.Users.Models;
using Users.Domain.ValueObjects;

namespace Users.Application.Users.UseCases;

public sealed class UpdateUserUseCase
{
    private readonly IUserRepository _userRepository;

    public UpdateUserUseCase(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserDto?> ExecuteAsync(Guid id, UpdateUserCommand command)
    {
        var user = await _userRepository.GetByIdAsync(id);

        if (user is null)
        {
            return null;
        }

        var name = UserName.Create(command.Name);
        var email = Email.Create(command.Email);
        var userWithSameEmail = await _userRepository.GetByEmailAsync(email);

        if (userWithSameEmail is not null && userWithSameEmail.Id != id)
        {
            throw new UserEmailAlreadyExistsException(email.Value);
        }

        user.Update(name, email);
        await _userRepository.UpdateAsync(user);

        return UserMapper.ToDto(user);
    }
}
