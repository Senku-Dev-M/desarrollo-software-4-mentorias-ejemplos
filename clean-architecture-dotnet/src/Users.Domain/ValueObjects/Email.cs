using System.Net.Mail;

namespace Users.Domain.ValueObjects;

public sealed record Email
{
    public string Value { get; }

    private Email(string value)
    {
        Value = value;
    }

    public static Email Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Email is required.", nameof(value));
        }

        var normalizedEmail = value.Trim().ToLowerInvariant();

        try
        {
            var mailAddress = new MailAddress(normalizedEmail);

            if (!string.Equals(
                    mailAddress.Address,
                    normalizedEmail,
                    StringComparison.OrdinalIgnoreCase))
            {
                throw new ArgumentException(
                    "Email format is invalid.",
                    nameof(value));
            }
        }
        catch (FormatException)
        {
            throw new ArgumentException(
                "Email format is invalid.",
                nameof(value));
        }

        return new Email(normalizedEmail);
    }

    public override string ToString() => Value;
}
