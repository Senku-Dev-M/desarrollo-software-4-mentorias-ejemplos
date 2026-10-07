namespace Users.Domain.ValueObjects;

public sealed record UserName
{
    public string Value { get; }

    private UserName(string value)
    {
        Value = value;
    }

    public static UserName Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Name is required.", nameof(value));
        }

        var normalizedName = value.Trim();

        if (normalizedName.Length > 100)
        {
            throw new ArgumentException(
                "Name cannot contain more than 100 characters.",
                nameof(value));
        }

        return new UserName(normalizedName);
    }

    public override string ToString() => Value;
}
