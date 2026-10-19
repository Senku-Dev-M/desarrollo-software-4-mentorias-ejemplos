using DotNetEnv;
using SupabaseUsersDemo.Services;

// Carga secretos solo en el backend; las variables del sistema conservan prioridad.
var envPath = Path.Combine(Directory.GetCurrentDirectory(), ".env");
if (File.Exists(envPath)) Env.NoClobber().Load(envPath);

var builder = WebApplication.CreateBuilder(args);

var supabaseUrl = builder.Configuration["SUPABASE_URL"];
var supabaseSecretKey = builder.Configuration["SUPABASE_SECRET_KEY"];

if (string.IsNullOrWhiteSpace(supabaseUrl) || string.IsNullOrWhiteSpace(supabaseSecretKey))
{
    throw new InvalidOperationException(
        "Faltan SUPABASE_URL o SUPABASE_SECRET_KEY. Copia .env.example como .env y completa los valores.");
}

// Una instancia reutilizable del SDK para Data API y Storage; no usa el protocolo PostgreSQL.
var supabase = new Supabase.Client(
    supabaseUrl,
    supabaseSecretKey,
    new Supabase.SupabaseOptions
    {
        AutoConnectRealtime = false,
        AutoRefreshToken = false
    });

await supabase.InitializeAsync();

builder.Services.AddSingleton(supabase);
builder.Services.AddScoped<UserProfileService>();
builder.Services.AddProblemDetails();

var app = builder.Build();

// Traduce fallos a HTTP 400/409/500 sin exponer la clave ni respuestas internas de Supabase.
app.UseExceptionHandler(exceptionHandlerApp =>
{
    exceptionHandlerApp.Run(async context =>
    {
        var exception = context.Features
            .Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>()?
            .Error;

        var (status, title) = exception switch
        {
            ArgumentException => (StatusCodes.Status400BadRequest, exception.Message),
            DuplicateEmailException => (StatusCodes.Status409Conflict, exception.Message),
            _ => (StatusCodes.Status500InternalServerError, "Ocurrió un error al comunicarse con Supabase.")
        };

        context.Response.StatusCode = status;
        await Results.Problem(statusCode: status, title: title).ExecuteAsync(context);
    });
});

app.UseDefaultFiles();
app.UseStaticFiles();

// Health consulta la nube sin escribir; no basta con comprobar que el servidor arrancó.
app.MapGet("/api/health", async (UserProfileService service) =>
{
    await service.CanConnectAsync();
    return Results.Ok(new { status = "ok", database = "supabase-cloud" });
});

// El listado incluye URLs firmadas nuevas para las fotos del bucket privado.
app.MapGet("/api/users", async (UserProfileService service) =>
    Results.Ok(await service.GetAllAsync()));

// El ID viaja en la ruta y un usuario inexistente se representa como HTTP 404.
app.MapGet("/api/users/{id:guid}", async (Guid id, UserProfileService service) =>
{
    var user = await service.GetByIdAsync(id);
    return user is null ? Results.NotFound() : Results.Ok(user);
});

// multipart/form-data permite recibir campos de texto y el archivo en la misma petición.
app.MapPost("/api/users", async (HttpRequest request, UserProfileService service) =>
{
    var form = await request.ReadFormAsync();
    var user = await service.CreateAsync(
        form["name"].ToString(),
        form["email"].ToString(),
        form.Files.GetFile("avatar"));

    return Results.Created($"/api/users/{user.Id}", user);
});

// Si el formulario no trae avatar, el servicio conserva la fotografía anterior.
app.MapPut("/api/users/{id:guid}", async (Guid id, HttpRequest request, UserProfileService service) =>
{
    var form = await request.ReadFormAsync();
    var user = await service.UpdateAsync(
        id,
        form["name"].ToString(),
        form["email"].ToString(),
        form.Files.GetFile("avatar"));

    return user is null ? Results.NotFound() : Results.Ok(user);
});

// El servicio elimina la fila e intenta limpiar el archivo asociado.
app.MapDelete("/api/users/{id:guid}", async (Guid id, UserProfileService service) =>
    await service.DeleteAsync(id) ? Results.NoContent() : Results.NotFound());

app.MapFallbackToFile("index.html");

app.Run();
