namespace Games.Application.Games.GetById;

public record GetGameByIdResponse(
    Guid Id,
    string Name,
    string Genre,
    string Developer,
    int ReleaseYear,
    decimal Price,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
