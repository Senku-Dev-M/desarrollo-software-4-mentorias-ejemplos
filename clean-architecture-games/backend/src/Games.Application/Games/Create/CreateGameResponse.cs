namespace Games.Application.Games.Create;

public record CreateGameResponse(
    Guid Id,
    string Name,
    string Genre,
    string Developer,
    int ReleaseYear,
    decimal Price,
    DateTime CreatedAt
);
