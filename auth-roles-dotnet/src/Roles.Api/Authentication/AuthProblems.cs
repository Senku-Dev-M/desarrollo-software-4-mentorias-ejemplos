using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;

namespace Roles.Api.Authentication;

internal static class AuthProblems
{
    public static IResult Unauthenticated(HttpContext context, string detail)
    {
        context.Response.Headers.WWWAuthenticate = "Bearer";
        return Results.Problem(title: "No autenticado", detail: detail, statusCode: 401);
    }

    public static IResult Forbidden(string detail) =>
        Results.Problem(title: "Acceso denegado", detail: detail, statusCode: 403);
}

// El middleware crea el principal; este manejador traduce las decisiones de la política a HTTP.
public sealed class ApiAuthorizationResultHandler : IAuthorizationMiddlewareResultHandler
{
    public Task HandleAsync(RequestDelegate next, HttpContext context, AuthorizationPolicy policy,
        PolicyAuthorizationResult result) =>
        result.Succeeded ? next(context) :
        result.Forbidden ? AuthProblems.Forbidden("Tu rol no permite esta operación.").ExecuteAsync(context) :
        AuthProblems.Unauthenticated(context, "Inicia sesión para continuar.").ExecuteAsync(context);
}
