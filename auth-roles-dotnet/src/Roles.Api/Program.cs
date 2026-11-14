using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.AspNetCore.Diagnostics;
using Roles.Api.Authentication;
using Roles.Api.Endpoints;
using Roles.Application.Analytics;
using Roles.Application.Products;
using Roles.Application.Users;
using Roles.Domain.Users;
using Roles.Infrastructure.Products;
using Roles.Infrastructure.Supabase;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddProblemDetails();
builder.Services.ConfigureHttpJsonOptions(options => options.SerializerOptions.Converters.Add(
    new JsonStringEnumConverter(JsonNamingPolicy.CamelCase, allowIntegerValues: false)));

builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy
    .WithOrigins("http://127.0.0.1:5178", "http://localhost:5178")
    .WithHeaders("Authorization", "Content-Type")
    .WithMethods("GET", "POST", "PUT", "DELETE")));

builder.Services.AddAuthorizationBuilder()
    .SetFallbackPolicy(new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build())
    .AddPolicy(nameof(UserRole.Admin), policy => policy.RequireAuthenticatedUser().RequireRole(nameof(UserRole.Admin)))
    .AddPolicy(nameof(UserRole.Seller), policy => policy.RequireAuthenticatedUser().RequireRole(nameof(UserRole.Seller)))
    .AddPolicy(nameof(UserRole.Buyer), policy => policy.RequireAuthenticatedUser().RequireRole(nameof(UserRole.Buyer)));
builder.Services.AddSingleton<IAuthorizationMiddlewareResultHandler, ApiAuthorizationResultHandler>();

// Adaptadores con TODO: completar la verificación, la consulta de roles y la persistencia.
builder.Services.AddScoped<IAccessTokenVerifier, SupabaseAccessTokenVerifier>();
builder.Services.AddScoped<IUserProfileRepository, SupabaseUserProfileRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ResolveAuthenticatedUser>();
builder.Services.AddScoped<ListProducts>();
builder.Services.AddScoped<GetProduct>();
builder.Services.AddScoped<ListSellerProducts>();
builder.Services.AddScoped<ListAvailableProducts>();
builder.Services.AddScoped<CreateProduct>();
builder.Services.AddScoped<UpdateProduct>();
builder.Services.AddScoped<DeleteProduct>();
builder.Services.AddScoped<GetAnalytics>();

var app = builder.Build();

app.UseExceptionHandler(new ExceptionHandlerOptions
{
    StatusCodeSelector = exception => exception is NotImplementedException
        ? StatusCodes.Status501NotImplemented
        : StatusCodes.Status500InternalServerError
});
app.UseStatusCodePages();
app.UseRouting();
app.UseCors(); // Permite la preflight antes de exigir un token.
app.UseMiddleware<BearerAuthenticationMiddleware>();
app.UseAuthorization();

app.MapSession();
app.MapCatalog();
app.MapAdmin();
app.MapSeller();
app.MapBuyer();

app.Run();
