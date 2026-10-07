using Users.Application.Abstractions.Persistence;

namespace Users.Application.Users.UseCases;

public sealed class DeleteUserUseCase
{
    private readonly IUserRepository _userRepository;

    public DeleteUserUseCase(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<bool> ExecuteAsync(Guid id)
    {
        var user = await _userRepository.GetByIdAsync(id);

        if (user is null)
        {
            return false;
        }

        await _userRepository.DeleteAsync(id);
        return true;
    }
}
