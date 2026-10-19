using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace SupabaseUsersDemo.Models;

[Table("user_profiles")]
public sealed class UserProfile : BaseModel
{
    [PrimaryKey("id", true)]
    public Guid Id { get; set; }

    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [Column("avatar_path")]
    public string? AvatarPath { get; set; }

    [Column("created_at")]
    public DateTimeOffset? CreatedAt { get; set; }
}
