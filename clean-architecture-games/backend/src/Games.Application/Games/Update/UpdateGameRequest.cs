namespace Games.Application.Games.Update;

public record UpdateGameRequest(
    string Name,
    string Genre,
    string Developer,
    int ReleaseYear,
    decimal Price
);
