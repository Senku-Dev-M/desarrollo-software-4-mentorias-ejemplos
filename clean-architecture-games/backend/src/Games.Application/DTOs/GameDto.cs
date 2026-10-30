namespace Games.Application.DTOs;

public record GameDto(
    Guid Id,
    string Name,
    string Genre,
    string Developer,
    int ReleaseYear,
    decimal Price,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
