using Roles.Domain.Users;

namespace Roles.Application.Users;

public sealed class ResolveAuthenticatedUser(IAccessTokenVerifier tokens, IUserProfileRepository users)
{
    public async Task<AuthenticationResult> ExecuteAsync(string token, CancellationToken cancellationToken)
    {
        var userId = await tokens.VerifyAsync(token, cancellationToken);
        if (userId is null) return new(AuthenticationStatus.InvalidToken, null);

        // El rol sale de users.role, consultando por el ID ya verificado.
        var profile = await users.FindByAuthIdAsync(userId.Value, cancellationToken);
        return profile is null
            ? new(AuthenticationStatus.MissingProfile, null)
            : new(AuthenticationStatus.Authenticated, profile);
    }
}

public enum AuthenticationStatus { InvalidToken, MissingProfile, Authenticated }

public sealed record AuthenticationResult(AuthenticationStatus Status, UserProfile? Profile);
