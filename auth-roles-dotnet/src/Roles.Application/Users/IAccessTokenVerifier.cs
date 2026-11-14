namespace Roles.Application.Users;

public interface IAccessTokenVerifier
{
    // Devuelve la identidad confirmada por el emisor, o null si rechaza el token.
    Task<Guid?> VerifyAsync(string token, CancellationToken cancellationToken);
}
