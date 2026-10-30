using Games.Api.Middlewares;
using Games.Application;
using Games.Infrastructure;
using Games.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Clean Architecture Layers
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// 2. Controllers & JSON serialization
builder.Services.AddControllers();

// 3. CORS Configuration from settings
const string corsPolicyName = "FrontendPolicy";
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:8080", "http://127.0.0.1:8080" };

builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicyName, policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 4. Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Games API - Clean Architecture",
        Version = "v1",
        Description = "RESTful API for managing games, designed with Clean Architecture and SOLID principles."
    });
});

var app = builder.Build();

// 5. Global Exception Handling
app.UseMiddleware<GlobalExceptionHandlerMiddleware>();

// 6. Swagger in Development and Docker
if (app.Environment.IsDevelopment() || app.Configuration.GetValue<bool>("Swagger:Enable", true))
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Games API v1");
        options.RoutePrefix = "swagger";
    });
}

// 7. CORS
app.UseCors(corsPolicyName);

// 8. Controllers
app.MapControllers();

// 9. Automatic migration on startup (if enabled)
if (app.Configuration.GetValue<bool>("Database:ApplyMigrationsOnStartup", true))
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        logger.LogInformation("Applying database migrations...");
        await dbContext.Database.MigrateAsync();
        logger.LogInformation("Database migrations applied successfully.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Could not apply database migrations at startup.");
    }
}

app.Run();
