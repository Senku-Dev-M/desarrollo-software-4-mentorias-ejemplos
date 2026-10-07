namespace Users.Application.Users.Exceptions;

public sealed class UserEmailAlreadyExistsException : Exception
{
    public UserEmailAlreadyExistsException(string email)
        : base($"A user with email '{email}' already exists.")
    {
    }
}
