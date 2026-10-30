using Games.Domain.Common;
using Games.Domain.Exceptions;

namespace Games.Domain.Entities;

public class Game : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string Genre { get; private set; } = string.Empty;
    public string Developer { get; private set; } = string.Empty;
    public int ReleaseYear { get; private set; }
    public decimal Price { get; private set; }

    // Required by EF Core
    private Game()
    {
    }

    public Game(string name, string genre, string developer, int releaseYear, decimal price)
    {
        Validate(name, genre, developer, releaseYear, price);

        Id = Guid.NewGuid();
        Name = name.Trim();
        Genre = genre.Trim();
        Developer = developer.Trim();
        ReleaseYear = releaseYear;
        Price = price;
        CreatedAt = DateTime.UtcNow;
    }

    public void Update(string name, string genre, string developer, int releaseYear, decimal price)
    {
        Validate(name, genre, developer, releaseYear, price);

        Name = name.Trim();
        Genre = genre.Trim();
        Developer = developer.Trim();
        ReleaseYear = releaseYear;
        Price = price;
        UpdatedAt = DateTime.UtcNow;
    }

    private static void Validate(string name, string genre, string developer, int releaseYear, decimal price)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new DomainException("Game name is required and cannot be empty.");
        }

        if (name.Trim().Length > 200)
        {
            throw new DomainException("Game name cannot exceed 200 characters.");
        }

        if (string.IsNullOrWhiteSpace(genre))
        {
            throw new DomainException("Game genre is required and cannot be empty.");
        }

        if (genre.Trim().Length > 100)
        {
            throw new DomainException("Game genre cannot exceed 100 characters.");
        }

        if (string.IsNullOrWhiteSpace(developer))
        {
            throw new DomainException("Game developer is required and cannot be empty.");
        }

        if (developer.Trim().Length > 150)
        {
            throw new DomainException("Game developer cannot exceed 150 characters.");
        }

        int maxAllowedYear = DateTime.UtcNow.Year + 5;
        if (releaseYear < 1950 || releaseYear > maxAllowedYear)
        {
            throw new DomainException($"Release year must be between 1950 and {maxAllowedYear}.");
        }

        if (price < 0)
        {
            throw new DomainException("Price cannot be negative.");
        }
    }
}
