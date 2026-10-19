namespace SupabaseUsersDemo.Services;

public sealed class DuplicateEmailException(string email)
    : Exception($"Ya existe un usuario con el correo {email}.");
