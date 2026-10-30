namespace Games.Application.Games.Create;

public record CreateGameRequest(
    string Name,
    string Genre,
    string Developer,
    int ReleaseYear,
    decimal Price
);
