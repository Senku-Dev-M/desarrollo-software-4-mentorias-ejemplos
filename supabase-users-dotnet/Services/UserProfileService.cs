using SupabaseUsersDemo.Contracts;
using SupabaseUsersDemo.Models;

namespace SupabaseUsersDemo.Services;

public sealed class UserProfileService(
    Supabase.Client supabase,
    IConfiguration configuration,
    ILogger<UserProfileService> logger)
{
    private const long MaxAvatarBytes = 2 * 1024 * 1024;
    private static readonly HashSet<string> AllowedContentTypes =
    [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    private readonly string _bucket = configuration["SUPABASE_BUCKET"] ?? "user-avatars";

    // Consulta usuarios mediante el SDK y transforma cada fila para incluir la URL temporal de su avatar.
    public async Task<IReadOnlyList<UserResponse>> GetAllAsync()
    {
        var result = await supabase
            .From<UserProfile>()
            .Order(x => x.CreatedAt!, Supabase.Postgrest.Constants.Ordering.Descending)
            .Get();

        var users = new List<UserResponse>();
        foreach (var profile in result.Models)
        {
            users.Add(await ToResponseAsync(profile));
        }

        return users;
    }

    // Busca una fila y genera su respuesta; null permite que el endpoint devuelva 404.
    public async Task<UserResponse?> GetByIdAsync(Guid id)
    {
        var profile = await FindAsync(id);
        return profile is null ? null : await ToResponseAsync(profile);
    }

    // Valida, sube el avatar opcional e inserta la fila; si falla la DB intenta eliminar la imagen recién subida.
    public async Task<UserResponse> CreateAsync(string name, string email, IFormFile? avatar)
    {
        name = NormalizeRequired(name, "El nombre es obligatorio.");
        email = NormalizeEmail(email);
        await EnsureEmailIsAvailableAsync(email);

        var profile = new UserProfile
        {
            Id = Guid.NewGuid(),
            Name = name,
            Email = email,
            CreatedAt = DateTimeOffset.UtcNow
        };

        if (avatar is not null)
        {
            profile.AvatarPath = await UploadAvatarAsync(profile.Id, avatar);
        }

        UserProfile saved;
        try
        {
            var result = await supabase.From<UserProfile>().Insert(profile);
            saved = result.Models.Single();
        }
        catch
        {
            await TryRemoveAvatarAsync(profile.AvatarPath);
            throw;
        }

        return await ToResponseAsync(saved);
    }

    // Guarda una foto nueva y actualiza la fila antes de retirar la anterior; si falla la DB limpia la nueva.
    public async Task<UserResponse?> UpdateAsync(
        Guid id,
        string name,
        string email,
        IFormFile? avatar)
    {
        var profile = await FindAsync(id);
        if (profile is null) return null;

        name = NormalizeRequired(name, "El nombre es obligatorio.");
        email = NormalizeEmail(email);
        await EnsureEmailIsAvailableAsync(email, id);

        var previousAvatarPath = profile.AvatarPath;
        string? newAvatarPath = null;

        if (avatar is not null)
        {
            newAvatarPath = await UploadAvatarAsync(id, avatar);
            profile.AvatarPath = newAvatarPath;
        }

        profile.Name = name;
        profile.Email = email;

        UserProfile saved;
        try
        {
            var result = await supabase.From<UserProfile>().Update(profile);
            saved = result.Models.Single();
        }
        catch
        {
            await TryRemoveAvatarAsync(newAvatarPath);
            throw;
        }

        if (newAvatarPath is not null)
        {
            await TryRemoveAvatarAsync(previousAvatarPath);
        }

        return await ToResponseAsync(saved);
    }

    // Elimina primero la fila y luego intenta borrar la foto; DB y Storage no comparten transacción.
    public async Task<bool> DeleteAsync(Guid id)
    {
        var profile = await FindAsync(id);
        if (profile is null) return false;

        await supabase.From<UserProfile>().Delete(profile);
        await TryRemoveAvatarAsync(profile.AvatarPath);
        return true;
    }

    // Hace una consulta pequeña para comprobar acceso real a la Data API, sin crear registros.
    public async Task<bool> CanConnectAsync()
    {
        await supabase.From<UserProfile>().Limit(1).Get();
        return true;
    }

    // Busca por UUID y devuelve null si no hay fila; evita repetir la consulta en editar, borrar y consultar.
    private async Task<UserProfile?> FindAsync(Guid id)
    {
        var result = await supabase
            .From<UserProfile>()
            .Where(profile => profile.Id == id)
            .Limit(1)
            .Get();

        return result.Models.FirstOrDefault();
    }

    // Comprueba el correo antes de guardar y excluye al usuario editado; el índice único sigue siendo la garantía final.
    private async Task EnsureEmailIsAvailableAsync(string email, Guid? currentId = null)
    {
        var result = await supabase
            .From<UserProfile>()
            .Where(profile => profile.Email == email)
            .Get();

        if (result.Models.Any(profile => profile.Id != currentId))
        {
            throw new DuplicateEmailException(email);
        }
    }

    // Valida y sube la foto a una ruta nueva por usuario; no sobrescribe la anterior antes de guardar la fila.
    private async Task<string> UploadAvatarAsync(Guid userId, IFormFile avatar)
    {
        ValidateAvatar(avatar);

        var extension = Path.GetExtension(avatar.FileName).ToLowerInvariant();
        var path = $"{userId}/{Guid.NewGuid():N}{extension}";

        await using var stream = avatar.OpenReadStream();
        using var memory = new MemoryStream();
        await stream.CopyToAsync(memory);

        await supabase.Storage.From(_bucket).Upload(
            memory.ToArray(),
            path,
            new Supabase.Storage.FileOptions
            {
                ContentType = avatar.ContentType,
                Upsert = false
            });

        return path;
    }

    // Mapea la fila a la respuesta del frontend y genera una URL firmada de una hora para el bucket privado.
    private async Task<UserResponse> ToResponseAsync(UserProfile profile)
    {
        string? avatarUrl = null;
        if (!string.IsNullOrWhiteSpace(profile.AvatarPath))
        {
            avatarUrl = await supabase.Storage
                .From(_bucket)
                .CreateSignedUrl(profile.AvatarPath, 60 * 60);
        }

        return new UserResponse(
            profile.Id,
            profile.Name,
            profile.Email,
            avatarUrl,
            profile.CreatedAt);
    }

    // Intenta limpiar un archivo sin ocultar la operación principal; si Storage falla registra la limpieza pendiente.
    private async Task TryRemoveAvatarAsync(string? path)
    {
        if (string.IsNullOrWhiteSpace(path)) return;

        try
        {
            await supabase.Storage.From(_bucket).Remove([path]);
        }
        catch (Exception exception)
        {
            // DB y Storage no comparten una transacción: registramos la limpieza pendiente.
            logger.LogWarning(exception, "No se pudo limpiar la imagen {AvatarPath} en Storage.", path);
        }
    }

    // Recorta espacios y rechaza un nombre vacío o demasiado largo antes de llegar a Supabase.
    private static string NormalizeRequired(string value, string message)
    {
        var normalized = value.Trim();
        if (string.IsNullOrWhiteSpace(normalized)) throw new ArgumentException(message);
        if (normalized.Length > 120) throw new ArgumentException("El nombre admite hasta 120 caracteres.");
        return normalized;
    }

    // Normaliza el correo y aplica una validación básica para la práctica; no verifica que la cuenta exista.
    private static string NormalizeEmail(string value)
    {
        var normalized = value.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(normalized) || !normalized.Contains('@'))
        {
            throw new ArgumentException("Ingresa un correo válido.");
        }

        if (normalized.Length > 200) throw new ArgumentException("El correo admite hasta 200 caracteres.");
        return normalized;
    }

    // Rechaza archivos vacíos, mayores de 2 MB o con MIME no permitido; en producción también hay que verificar los bytes.
    private static void ValidateAvatar(IFormFile avatar)
    {
        if (avatar.Length == 0) throw new ArgumentException("La fotografía está vacía.");
        if (avatar.Length > MaxAvatarBytes) throw new ArgumentException("La fotografía no puede superar 2 MB.");
        if (!AllowedContentTypes.Contains(avatar.ContentType))
        {
            throw new ArgumentException("La fotografía debe ser JPG, PNG o WebP.");
        }
    }
}
