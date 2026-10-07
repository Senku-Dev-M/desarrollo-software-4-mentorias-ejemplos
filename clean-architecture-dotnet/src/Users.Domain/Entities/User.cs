using Users.Domain.ValueObjects;

namespace Users.Domain.Entities;

public sealed class User
{
    public Guid Id { get; }
    public UserName Name { get; private set; }
    public Email Email { get; private set; }
    public DateTime CreatedAtUtc { get; }

    public User(Guid id, UserName name, Email email, DateTime createdAtUtc)
    {
        if (id == Guid.Empty)
        {
            throw new ArgumentException("User id cannot be empty.", nameof(id));
        }

        Id = id;
        Name = name ?? throw new ArgumentNullException(nameof(name));
        Email = email ?? throw new ArgumentNullException(nameof(email));
        CreatedAtUtc = createdAtUtc;
    }

    public static User Create(string name, string email)
    {
        return new User(
            Guid.NewGuid(),
            UserName.Create(name),
            Email.Create(email),
            DateTime.UtcNow);
    }

    public void Update(UserName name, Email email)
    {
        Name = name ?? throw new ArgumentNullException(nameof(name));
        Email = email ?? throw new ArgumentNullException(nameof(email));
    }
}
