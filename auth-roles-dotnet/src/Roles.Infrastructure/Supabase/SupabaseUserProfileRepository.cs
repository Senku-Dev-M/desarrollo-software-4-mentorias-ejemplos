using Roles.Application.Users;
using Roles.Domain.Users;

namespace Roles.Infrastructure.Supabase;

public sealed class SupabaseUserProfileRepository : IUserProfileRepository
{
    public Task<UserProfile?> FindByAuthIdAsync(Guid verifiedUserId, CancellationToken cancellationToken)
    {
        // TODO 2: Consulta public.users en PostgreSQL del mismo proyecto Supabase:
        // SELECT id, display_name, role FROM public.users WHERE id = @id
        // Vincula @id al UUID confirmado por Auth, nunca a un ID enviado por el cliente.
        // Convierte users.role a UserRole. Si no hay fila o el rol no se reconoce, devuelve null.
        //
        // Ejemplo: agrega async a este método e inyecta un NpgsqlDataSource
        // configurado con la conexión del backend.
        // await using var command = dataSource.CreateCommand(
        //     "SELECT id, display_name, role FROM public.users WHERE id = @id");
        // command.Parameters.AddWithValue("id", verifiedUserId);
        // await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        // if (!await reader.ReadAsync(cancellationToken)) return null;
        // UserRole? role = (reader.IsDBNull(2) ? null : reader.GetString(2)) switch
        // {
        //     "admin" => UserRole.Admin,
        //     "seller" => UserRole.Seller,
        //     "buyer" => UserRole.Buyer,
        //     _ => null
        // };
        // return role is null ? null : new UserProfile(reader.GetGuid(0), reader.GetString(1), role.Value);
        throw new NotImplementedException();
    }
}
